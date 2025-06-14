
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calculator, LogOut, Crown, Users, Zap, TrendingUp, Lock } from "lucide-react";
import MeetingCalculator from "@/components/MeetingCalculator";
import GoogleAds from "@/components/GoogleAds";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const Dashboard = () => {
  const { user, subscription, signOut, loading, refreshSubscription } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isUpgrading, setIsUpgrading] = useState(false);

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
    } else if (urlParams.get('canceled') === 'true') {
      toast({
        title: "Payment Canceled",
        description: "Your subscription was not activated.",
        variant: "destructive",
      });
    }
  }, [toast, refreshSubscription]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Calculator className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const getSubscriptionBadge = () => {
    switch (subscription.tier) {
      case 'enterprise':
        return <Badge className="bg-purple-100 text-purple-800"><Crown className="h-3 w-3 mr-1" />Enterprise</Badge>;
      case 'premium':
        return <Badge className="bg-blue-100 text-blue-800"><Zap className="h-3 w-3 mr-1" />Premium</Badge>;
      default:
        return <Badge variant="outline">Free</Badge>;
    }
  };

  const hasAccess = (feature: string) => {
    switch (feature) {
      case 'team':
        return subscription.tier === 'enterprise';
      case 'ai':
      case 'analytics':
        return subscription.tier === 'premium' || subscription.tier === 'enterprise';
      case 'calculator':
      case 'calendar':
        return true;
      default:
        return false;
    }
  };

  const handleUpgrade = async (plan: 'premium' | 'enterprise') => {
    if (isUpgrading) return;
    
    setIsUpgrading(true);
    try {
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: { plan }
      });

      if (error) throw error;

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Calculator className="h-8 w-8 text-blue-600" />
              <span className="text-2xl font-bold text-gray-900">MeetingROI Pro</span>
            </div>
            {getSubscriptionBadge()}
          </div>
          
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">Welcome, {user.email}</span>
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
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Google Ads for free users */}
        {subscription.tier === 'free' && (
          <div className="mb-8">
            <GoogleAds />
          </div>
        )}

        {/* Feature Access Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card className={!hasAccess('analytics') ? 'opacity-60' : ''}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Analytics</span>
                {!hasAccess('analytics') && <Lock className="h-4 w-4 text-gray-400" />}
              </CardTitle>
              <CardDescription>
                Advanced meeting cost analytics and insights
              </CardDescription>
            </CardHeader>
            <CardContent>
              {hasAccess('analytics') ? (
                <Button className="w-full">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  View Analytics
                </Button>
              ) : (
                <div className="space-y-2">
                  <p className="text-sm text-gray-500">Requires Premium or Enterprise</p>
                  <Button 
                    className="w-full" 
                    onClick={() => handleUpgrade('premium')}
                    disabled={isUpgrading}
                  >
                    {isUpgrading ? 'Processing...' : 'Upgrade to Premium'}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className={!hasAccess('ai') ? 'opacity-60' : ''}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>AI Insights</span>
                {!hasAccess('ai') && <Lock className="h-4 w-4 text-gray-400" />}
              </CardTitle>
              <CardDescription>
                AI-powered meeting optimization recommendations
              </CardDescription>
            </CardHeader>
            <CardContent>
              {hasAccess('ai') ? (
                <Button className="w-full">
                  <Zap className="h-4 w-4 mr-2" />
                  View AI Insights
                </Button>
              ) : (
                <div className="space-y-2">
                  <p className="text-sm text-gray-500">Requires Premium or Enterprise</p>
                  <Button 
                    className="w-full" 
                    onClick={() => handleUpgrade('premium')}
                    disabled={isUpgrading}
                  >
                    {isUpgrading ? 'Processing...' : 'Upgrade to Premium'}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className={!hasAccess('team') ? 'opacity-60' : ''}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Team Management</span>
                {!hasAccess('team') && <Lock className="h-4 w-4 text-gray-400" />}
              </CardTitle>
              <CardDescription>
                Manage team members and collaboration (Enterprise only)
              </CardDescription>
            </CardHeader>
            <CardContent>
              {hasAccess('team') ? (
                <Button className="w-full">
                  <Users className="h-4 w-4 mr-2" />
                  Manage Team
                </Button>
              ) : (
                <div className="space-y-2">
                  <p className="text-sm text-gray-500">Enterprise Only Feature</p>
                  <p className="text-xs text-gray-400">$99/month - charged per team member</p>
                  <Button 
                    className="w-full bg-purple-600 hover:bg-purple-700" 
                    onClick={() => handleUpgrade('enterprise')}
                    disabled={isUpgrading}
                  >
                    <Crown className="h-4 w-4 mr-2" />
                    {isUpgrading ? 'Processing...' : 'Upgrade to Enterprise'}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Subscription Status Card for Premium/Enterprise users */}
        {subscription.tier !== 'free' && (
          <Card className="mb-8 border-green-200 bg-green-50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-green-900">
                    {subscription.tier === 'enterprise' ? 'Enterprise' : 'Premium'} Plan Active
                  </h4>
                  <p className="text-sm text-green-700">
                    {subscription.subscription_end && (
                      <>Next billing: {new Date(subscription.subscription_end).toLocaleDateString()}</>
                    )}
                  </p>
                </div>
                <Button variant="outline" onClick={handleManageSubscription}>
                  Manage Subscription
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Main Calculator */}
        <MeetingCalculator />
      </div>
    </div>
  );
};

export default Dashboard;
