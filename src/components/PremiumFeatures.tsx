
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Crown, Zap, TrendingUp, Database, Shield, Headphones, Lock, Star, CheckCircle, ExternalLink } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const PremiumFeatures = () => {
  const { subscription } = useAuth();
  const { toast } = useToast();
  const [isUpgrading, setIsUpgrading] = useState(false);
  const [isManaging, setIsManaging] = useState(false);

  const isPremiumOrBetter = subscription.tier === 'premium' || subscription.tier === 'enterprise';

  const premiumFeatures = [
    {
      icon: <Database className="h-5 w-5" />,
      title: "Advanced Analytics Suite",
      description: "Deep dive into meeting patterns, team productivity metrics, and ROI trends",
    },
    {
      icon: <TrendingUp className="h-5 w-5" />,
      title: "Predictive Cost Modeling",
      description: "AI-powered forecasting for meeting budgets and resource allocation",
    },
    {
      icon: <Shield className="h-5 w-5" />,
      title: "Enterprise Security",
      description: "Advanced encryption, SSO integration, and compliance reporting",
    },
    {
      icon: <Headphones className="h-5 w-5" />,
      title: "Priority Support",
      description: "24/7 dedicated support with 1-hour response time guarantee",
    },
    {
      icon: <Zap className="h-5 w-5" />,
      title: "API Access",
      description: "Full REST API access for custom integrations and automation",
    },
    {
      icon: <Star className="h-5 w-5" />,
      title: "Custom Integrations",
      description: "Connect with your existing tools: Slack, Microsoft Teams, Salesforce",
    }
  ];

  const handleUpgrade = async () => {
    setIsUpgrading(true);
    try {
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: { plan: 'premium' }
      });

      if (error) throw error;
      if (!data?.url) throw new Error('No checkout URL received');
      
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
    setIsManaging(true);
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
    } finally {
      setIsManaging(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Crown className="h-5 w-5 mr-2 text-yellow-500" />
          Premium Features
        </CardTitle>
        <CardDescription>
          Unlock advanced capabilities for enterprise-grade meeting optimization
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Current Plan Status */}
          {isPremiumOrBetter ? (
            <div className="p-4 border-2 border-dashed border-green-200 rounded-lg bg-green-50">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-green-900 capitalize">{subscription.tier} Plan Active</h4>
                  <p className="text-sm text-green-700">
                    You have access to all premium features.
                  </p>
                </div>
                <Button 
                  onClick={handleManageSubscription}
                  variant="outline"
                  disabled={isManaging}
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  {isManaging ? 'Loading...' : 'Manage Subscription'}
                </Button>
              </div>
            </div>
          ) : (
            <div className="p-4 border-2 border-dashed border-yellow-200 rounded-lg bg-yellow-50">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-yellow-900">Free Plan Active</h4>
                  <p className="text-sm text-yellow-700">
                    You're using the free version with basic features
                  </p>
                </div>
                <Button 
                  onClick={handleUpgrade}
                  disabled={isUpgrading}
                  className="bg-yellow-600 hover:bg-yellow-700"
                >
                  <Crown className="h-4 w-4 mr-2" />
                  {isUpgrading ? 'Processing...' : 'Upgrade Now'}
                </Button>
              </div>
            </div>
          )}

          {/* Premium Features List */}
          <div>
            <h4 className="font-medium mb-4">Premium Features</h4>
            <div className="space-y-3">
              {premiumFeatures.map((feature, index) => (
                <div key={index} className="flex items-start space-x-3 p-3 border rounded-lg bg-gray-50">
                  <div className={`${isPremiumOrBetter ? 'text-green-500' : 'text-gray-400'} mt-1`}>
                    {feature.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <h5 className={`font-medium ${isPremiumOrBetter ? 'text-gray-800' : 'text-gray-600'}`}>{feature.title}</h5>
                      {isPremiumOrBetter ? (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      ) : (
                        <Lock className="h-3 w-3 text-gray-400" />
                      )}
                    </div>
                    <p className="text-sm text-gray-500 mt-1">{feature.description}</p>
                  </div>
                  <div className={`${isPremiumOrBetter ? 'text-green-500' : 'text-yellow-500'}`}>
                    <Crown className="h-4 w-4" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Upgrade CTA */}
          {!isPremiumOrBetter && (
            <div className="p-6 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg text-white">
              <div className="text-center">
                <Crown className="h-8 w-8 mx-auto mb-3 text-yellow-300" />
                <h3 className="text-lg font-semibold mb-2">Ready to Unlock Premium?</h3>
                <p className="text-blue-100 mb-4">
                  Get advanced analytics, AI insights, and enterprise features
                </p>
                <div className="flex items-center justify-center space-x-4 mb-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold">$29</div>
                    <div className="text-xs text-blue-200">per month</div>
                  </div>
                  <div className="text-blue-200">•</div>
                  <div className="text-center">
                    <div className="text-sm font-medium">7-day</div>
                    <div className="text-xs text-blue-200">free trial</div>
                  </div>
                </div>
                <Button 
                  onClick={handleUpgrade}
                  disabled={isUpgrading}
                  className="bg-white text-blue-600 hover:bg-gray-100"
                >
                  {isUpgrading ? 'Processing...' : 'Start Free Trial'}
                </Button>
              </div>
            </div>
          )}

          {/* Feature Comparison */}
          <div className="border rounded-lg overflow-hidden">
            <div className="bg-gray-50 px-4 py-2 border-b">
              <h4 className="font-medium">Feature Comparison</h4>
            </div>
            <div className="p-4 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm">Monthly meeting limit</span>
                <div className="flex space-x-8">
                  <span className="text-sm text-gray-600">5 (Free)</span>
                  <span className="text-sm text-green-600 font-medium">Unlimited (Premium)</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Basic analytics</span>
                <div className="flex space-x-8">
                  <span className="text-sm text-green-600">✓</span>
                  <span className="text-sm text-green-600">✓</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Advanced AI insights</span>
                <div className="flex space-x-8">
                  <span className="text-sm text-gray-400">✗</span>
                  <span className="text-sm text-green-600">✓</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Team collaboration</span>
                <div className="flex space-x-8">
                  <span className="text-sm text-gray-400">✗</span>
                  <span className="text-sm text-green-600">✓</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PremiumFeatures;
