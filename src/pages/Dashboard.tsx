
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calculator, LogOut, Crown, Users, Zap, TrendingUp, Lock, CheckCircle } from "lucide-react";
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

  const openPricingPage = () => {
    navigate("/?section=pricing");
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
        {/* Google Ads for free users only */}
        {subscription.tier === 'free' && (
          <div className="mb-8">
            <GoogleAds showUpgradePrompt={true} onUpgradeClick={openPricingPage} />
          </div>
        )}

        {/* Subscription Status Card for Premium/Enterprise users */}
        {subscription.tier !== 'free' && (
          <Card className="mb-8 border-green-200 bg-green-50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-green-900 flex items-center">
                    <CheckCircle className="h-4 w-4 mr-2" />
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

        {/* Feature Access Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* Calculator - Always available */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Meeting Calculator</span>
                <CheckCircle className="h-4 w-4 text-green-500" />
              </CardTitle>
              <CardDescription>
                Calculate meeting costs and track efficiency
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full" onClick={() => document.getElementById('calculator')?.scrollIntoView()}>
                <Calculator className="h-4 w-4 mr-2" />
                Use Calculator
              </Button>
            </CardContent>
          </Card>

          {/* Analytics - Premium/Enterprise only */}
          <Card className={subscription.tier === 'free' ? 'opacity-60 border-yellow-200' : 'border-green-200'}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Analytics</span>
                {subscription.tier !== 'free' ? (
                  <CheckCircle className="h-4 w-4 text-green-500" />
                ) : (
                  <Lock className="h-4 w-4 text-yellow-500" />
                )}
              </CardTitle>
              <CardDescription>
                Advanced meeting cost analytics and insights
              </CardDescription>
            </CardHeader>
            <CardContent>
              {subscription.tier !== 'free' ? (
                <Button className="w-full">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  View Analytics
                </Button>
              ) : (
                <div className="space-y-3">
                  <div className="text-center p-4 bg-gray-50 rounded-lg border border-dashed">
                    <Lock className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                    <p className="text-sm text-gray-600 mb-3">
                      Get detailed analytics and insights about your meeting costs and efficiency patterns.
                    </p>
                    <ul className="text-xs text-gray-500 space-y-1 mb-3">
                      <li>• Cost trend analysis</li>
                      <li>• Efficiency scoring</li>
                      <li>• Meeting optimization tips</li>
                      <li>• ROI tracking and reporting</li>
                      <li>• Custom date range analysis</li>
                      <li>• Meeting pattern insights</li>
                    </ul>
                  </div>
                  <Button 
                    className="w-full bg-blue-600 hover:bg-blue-700" 
                    onClick={() => handleUpgrade('premium')}
                    disabled={isUpgrading}
                  >
                    {isUpgrading ? 'Processing...' : 'Upgrade to Premium - $29/month'}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* AI Insights - Premium/Enterprise only */}
          <Card className={subscription.tier === 'free' ? 'opacity-60 border-yellow-200' : 'border-green-200'}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>AI Insights</span>
                {subscription.tier !== 'free' ? (
                  <CheckCircle className="h-4 w-4 text-green-500" />
                ) : (
                  <Lock className="h-4 w-4 text-yellow-500" />
                )}
              </CardTitle>
              <CardDescription>
                AI-powered meeting optimization recommendations
              </CardDescription>
            </CardHeader>
            <CardContent>
              {subscription.tier !== 'free' ? (
                <Button className="w-full">
                  <Zap className="h-4 w-4 mr-2" />
                  View AI Insights
                </Button>
              ) : (
                <div className="space-y-3">
                  <div className="text-center p-4 bg-gray-50 rounded-lg border border-dashed">
                    <Lock className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                    <p className="text-sm text-gray-600 mb-3">
                      Get AI-powered recommendations to optimize your meetings and reduce costs.
                    </p>
                    <ul className="text-xs text-gray-500 space-y-1 mb-3">
                      <li>• Smart cost optimization</li>
                      <li>• Meeting efficiency analysis</li>
                      <li>• Personalized recommendations</li>
                      <li>• Automated meeting scoring</li>
                      <li>• AI-driven insights dashboard</li>
                      <li>• Predictive cost modeling</li>
                    </ul>
                  </div>
                  <Button 
                    className="w-full bg-blue-600 hover:bg-blue-700" 
                    onClick={() => handleUpgrade('premium')}
                    disabled={isUpgrading}
                  >
                    {isUpgrading ? 'Processing...' : 'Upgrade to Premium - $29/month'}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Team Management - Enterprise only */}
          <Card className={subscription.tier !== 'enterprise' ? 'opacity-60 border-purple-200' : 'border-green-200'}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Team Management</span>
                {subscription.tier === 'enterprise' ? (
                  <CheckCircle className="h-4 w-4 text-green-500" />
                ) : (
                  <Lock className="h-4 w-4 text-purple-500" />
                )}
              </CardTitle>
              <CardDescription>
                Manage team members and collaboration (Enterprise only)
              </CardDescription>
            </CardHeader>
            <CardContent>
              {subscription.tier === 'enterprise' ? (
                <Button className="w-full">
                  <Users className="h-4 w-4 mr-2" />
                  Manage Team
                </Button>
              ) : (
                <div className="space-y-3">
                  <div className="text-center p-4 bg-gray-50 rounded-lg border border-dashed">
                    <Lock className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                    <p className="text-sm text-gray-600 mb-3">
                      Collaborate with your team, share insights, and manage group meeting costs.
                    </p>
                    <ul className="text-xs text-gray-500 space-y-1 mb-3">
                      <li>• Team member management</li>
                      <li>• Shared meeting insights</li>
                      <li>• Collaborative cost tracking</li>
                      <li>• Advanced team analytics</li>
                      <li>• Role-based permissions</li>
                      <li>• Multi-department reporting</li>
                      <li>• Enterprise-grade security</li>
                    </ul>
                  </div>
                  <Button 
                    className="w-full bg-purple-600 hover:bg-purple-700" 
                    onClick={() => handleUpgrade('enterprise')}
                    disabled={isUpgrading}
                  >
                    <Crown className="h-4 w-4 mr-2" />
                    {isUpgrading ? 'Processing...' : 'Upgrade to Enterprise - $99/month'}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Calendar Integration - Premium/Enterprise */}
          <Card className={subscription.tier === 'free' ? 'opacity-60 border-yellow-200' : 'border-green-200'}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Calendar Integration</span>
                {subscription.tier !== 'free' ? (
                  <CheckCircle className="h-4 w-4 text-green-500" />
                ) : (
                  <Lock className="h-4 w-4 text-yellow-500" />
                )}
              </CardTitle>
              <CardDescription>
                Sync with Google Calendar, Outlook, and more
              </CardDescription>
            </CardHeader>
            <CardContent>
              {subscription.tier !== 'free' ? (
                <Button className="w-full">
                  <Clock className="h-4 w-4 mr-2" />
                  Connect Calendar
                </Button>
              ) : (
                <div className="space-y-3">
                  <div className="text-center p-4 bg-gray-50 rounded-lg border border-dashed">
                    <Lock className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                    <p className="text-sm text-gray-600 mb-3">
                      Automatically import meeting data from your calendar apps.
                    </p>
                    <ul className="text-xs text-gray-500 space-y-1 mb-3">
                      <li>• Google Calendar sync</li>
                      <li>• Outlook integration</li>
                      <li>• Automatic cost calculation</li>
                      <li>• Meeting reminders</li>
                    </ul>
                  </div>
                  <Button 
                    className="w-full bg-blue-600 hover:bg-blue-700" 
                    onClick={() => handleUpgrade('premium')}
                    disabled={isUpgrading}
                  >
                    {isUpgrading ? 'Processing...' : 'Upgrade to Premium - $29/month'}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Integrations - Premium/Enterprise */}
          <Card className={subscription.tier === 'free' ? 'opacity-60 border-yellow-200' : 'border-green-200'}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Integrations</span>
                {subscription.tier !== 'free' ? (
                  <CheckCircle className="h-4 w-4 text-green-500" />
                ) : (
                  <Lock className="h-4 w-4 text-yellow-500" />
                )}
              </CardTitle>
              <CardDescription>
                Connect with Slack, Teams, and other tools
              </CardDescription>
            </CardHeader>
            <CardContent>
              {subscription.tier !== 'free' ? (
                <Button className="w-full">
                  <Zap className="h-4 w-4 mr-2" />
                  View Integrations
                </Button>
              ) : (
                <div className="space-y-3">
                  <div className="text-center p-4 bg-gray-50 rounded-lg border border-dashed">
                    <Lock className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                    <p className="text-sm text-gray-600 mb-3">
                      Integrate with your favorite productivity tools.
                    </p>
                    <ul className="text-xs text-gray-500 space-y-1 mb-3">
                      <li>• Slack notifications</li>
                      <li>• Microsoft Teams</li>
                      <li>• Zoom integration</li>
                      <li>• API access</li>
                    </ul>
                  </div>
                  <Button 
                    className="w-full bg-blue-600 hover:bg-blue-700" 
                    onClick={() => handleUpgrade('premium')}
                    disabled={isUpgrading}
                  >
                    {isUpgrading ? 'Processing...' : 'Upgrade to Premium - $29/month'}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Reports - Premium/Enterprise */}
          <Card className={subscription.tier === 'free' ? 'opacity-60 border-yellow-200' : 'border-green-200'}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Advanced Reports</span>
                {subscription.tier !== 'free' ? (
                  <CheckCircle className="h-4 w-4 text-green-500" />
                ) : (
                  <Lock className="h-4 w-4 text-yellow-500" />
                )}
              </CardTitle>
              <CardDescription>
                Detailed reporting and data exports
              </CardDescription>
            </CardHeader>
            <CardContent>
              {subscription.tier !== 'free' ? (
                <Button className="w-full">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Generate Reports
                </Button>
              ) : (
                <div className="space-y-3">
                  <div className="text-center p-4 bg-gray-50 rounded-lg border border-dashed">
                    <Lock className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                    <p className="text-sm text-gray-600 mb-3">
                      Generate comprehensive reports for stakeholders.
                    </p>
                    <ul className="text-xs text-gray-500 space-y-1 mb-3">
                      <li>• Executive summaries</li>
                      <li>• Cost breakdown reports</li>
                      <li>• Custom date ranges</li>
                      <li>• PDF/Excel exports</li>
                    </ul>
                  </div>
                  <Button 
                    className="w-full bg-blue-600 hover:bg-blue-700" 
                    onClick={() => handleUpgrade('premium')}
                    disabled={isUpgrading}
                  >
                    {isUpgrading ? 'Processing...' : 'Upgrade to Premium - $29/month'}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Main Calculator */}
        <div id="calculator">
          <MeetingCalculator />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
