
import { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  subscription: {
    tier: 'free' | 'premium' | 'enterprise';
    subscribed: boolean;
    subscription_end?: string;
  };
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string, fullName?: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  loading: boolean;
  refreshSubscription: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [subscription, setSubscription] = useState({
    tier: 'free' as 'free' | 'premium' | 'enterprise',
    subscribed: false,
    subscription_end: undefined as string | undefined,
  });
  const { toast } = useToast();

  const refreshSubscription = async () => {
    if (user) {
      try {
        console.log('Refreshing subscription for user:', user.email);
        const { data, error } = await supabase.functions.invoke('check-subscription');
        
        console.log('Subscription check response:', { data, error });
        
        if (data && !error) {
          const newSubscription = {
            tier: data.subscription_tier || 'free',
            subscribed: data.subscribed || false,
            subscription_end: data.subscription_end,
          };
          console.log('Setting subscription:', newSubscription);
          setSubscription(newSubscription);
        } else {
          console.error('Error fetching subscription:', error);
          // Set default free tier on error
          setSubscription({
            tier: 'free',
            subscribed: false,
            subscription_end: undefined,
          });
        }
      } catch (error) {
        console.error('Error fetching subscription:', error);
        // Set default free tier on error
        setSubscription({
          tier: 'free',
          subscribed: false,
          subscription_end: undefined,
        });
      }
    }
  };

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email);
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);

        if (session?.user) {
          // Delay subscription check to avoid auth state conflicts
          setTimeout(() => {
            refreshSubscription();
          }, 100);
        } else {
          setSubscription({
            tier: 'free',
            subscribed: false,
            subscription_end: undefined,
          });
        }
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('Initial session check:', session?.user?.email);
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);

      if (session?.user) {
        setTimeout(() => {
          refreshSubscription();
        }, 100);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      toast({
        title: "Error signing in",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Welcome back!",
        description: "You have successfully signed in.",
      });
    }

    return { error };
  };

  const signUp = async (email: string, password: string, fullName?: string) => {
    const redirectUrl = `${window.location.origin}/`;
    
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
        data: {
          full_name: fullName,
        },
      },
    });

    if (error) {
      toast({
        title: "Error signing up",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Account created!",
        description: "Please check your email to verify your account.",
      });
    }

    return { error };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    toast({
      title: "Signed out",
      description: "You have been successfully signed out.",
    });
  };

  const value = {
    user,
    session,
    subscription,
    signIn,
    signUp,
    signOut,
    loading,
    refreshSubscription,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
