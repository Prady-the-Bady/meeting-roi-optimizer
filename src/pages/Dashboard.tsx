import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import MeetingCalculator from "@/components/MeetingCalculator";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { OverviewSection } from "@/components/sections/OverviewSection";
import { AnalyticsSection } from "@/components/sections/AnalyticsSection";
import { AIInsightsSection } from "@/components/sections/AIInsightsSection";
import { IntegrationsSection } from "@/components/sections/IntegrationsSection";
import { MeetingHistorySection } from "@/components/sections/MeetingHistorySection";
import { TeamManagementSection } from "@/components/sections/TeamManagementSection";
import PremiumFeatures from "@/components/PremiumFeatures";
import CalendarIntegration from "@/components/CalendarIntegration";

const Dashboard = () => {
  const { user, subscription, signOut, loading, refreshSubscription } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isUpgrading, setIsUpgrading] = useState(false);
  const [activeSection, setActiveSection] = useState("overview");

  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    // Check for success/cancel parameters
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('success') === 'true') {
      toast({
        title: "Payment Successful!",
        description: "Your subscription has been activated. Please refresh to see your new features.",
      });
      // Refresh subscription status
      refreshSubscription();
      // Clean up URL
      window.history.replaceState({}, document.title, "/dashboard");
    } else if (urlParams.get('canceled') === 'true') {
      toast({
        title: "Payment Canceled",
        description: "Your subscription was not activated.",
        variant: "destructive",
      });
      // Clean up URL
      window.history.replaceState({}, document.title, "/dashboard");
    }
  }, [toast, refreshSubscription]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const handleUpgrade = async (plan: 'premium' | 'enterprise') => {
    if (isUpgrading) return;
    
    setIsUpgrading(true);
    try {
      console.log('Creating checkout session for plan:', plan);
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: { plan }
      });

      console.log('Checkout response:', { data, error });

      if (error) {
        console.error('Checkout error details:', error);
        
        // Handle specific Stripe setup errors
        if (data?.stripeSetupRequired) {
          toast({
            title: "Stripe Setup Required",
            description: "Please complete your Stripe account setup first. Check the business name in your Stripe dashboard.",
            variant: "destructive",
          });
          return;
        }
        
        throw error;
      }

      if (!data?.url) {
        throw new Error('No checkout URL received');
      }

      // Open Stripe checkout in a new tab
      window.open(data.url, '_blank');
    } catch (error) {
      console.error('Error creating checkout session:', error);
      toast({
        title: "Error",
        description: "Failed to create checkout session. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUpgrading(false);
    }
  };

  const handleManageSubscription = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('customer-portal');
      
      if (error) throw error;
      
      window.open(data.url, '_blank');
    } catch (error) {
      console.error('Error opening customer portal:', error);
      toast({
        title: "Error",
        description: "Failed to open subscription management. Please try again.",
        variant: "destructive",
      });
    }
  };

  const renderSection = () => {
    switch (activeSection) {
      case "overview":
        return (
          <OverviewSection 
            onUpgrade={handleUpgrade}
            onManageSubscription={handleManageSubscription}
            isUpgrading={isUpgrading}
          />
        );
      case "calculator":
        return (
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Meeting Calculator</h1>
              <p className="text-gray-600 mt-2">Calculate meeting costs and track efficiency</p>
            </div>
            <MeetingCalculator />
          </div>
        );
      case "analytics":
        return (
          <AnalyticsSection 
            onUpgrade={handleUpgrade}
            isUpgrading={isUpgrading}
          />
        );
      case "ai-insights":
        return (
          <AIInsightsSection 
            onUpgrade={handleUpgrade}
            isUpgrading={isUpgrading}
          />
        );
      case "team":
        return (
          <TeamManagementSection 
            onUpgrade={handleUpgrade}
            isUpgrading={isUpgrading}
          />
        );
      case "calendar":
        return (
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Calendar Integration</h1>
              <p className="text-gray-600 mt-2">Sync with Google Calendar, Outlook, and more</p>
            </div>
            <CalendarIntegration onMeetingImport={() => { /* Placeholder for future use */ }} />
          </div>
        );
      case "integrations":
        return (
          <IntegrationsSection 
            onUpgrade={handleUpgrade}
            isUpgrading={isUpgrading}
            onNavigate={setActiveSection}
          />
        );
      case "reports":
        return (
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Advanced Reports</h1>
              <p className="text-gray-600 mt-2">Detailed reporting and data exports</p>
            </div>
            {subscription.tier !== 'free' ? (
              <div className="text-center py-12">
                <p className="text-gray-600">Advanced reporting features coming soon!</p>
              </div>
            ) : (
              <PremiumFeatures />
            )}
          </div>
        );
      case "history":
        return (
          <MeetingHistorySection 
            onUpgrade={handleUpgrade}
            isUpgrading={isUpgrading}
          />
        );
      default:
        return (
          <OverviewSection 
            onUpgrade={handleUpgrade}
            onManageSubscription={handleManageSubscription}
            isUpgrading={isUpgrading}
          />
        );
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar 
          activeSection={activeSection}
          onSectionChange={setActiveSection}
        />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center justify-between border-b px-6">
            <div className="flex items-center gap-2">
              <SidebarTrigger />
              <div className="text-sm text-gray-600">Welcome, {user.email}</div>
            </div>
            <div className="flex items-center space-x-4">
              {subscription.tier !== 'free' && (
                <Button variant="outline" onClick={handleManageSubscription}>
                  Manage Subscription
                </Button>
              )}
              <Button variant="outline" onClick={signOut}>
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </header>
          <main className="flex-1 p-6">
            {renderSection()}
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default Dashboard;
