
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle, Clock } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import GoogleAds from "@/components/GoogleAds";

interface OverviewSectionProps {
  onUpgrade: (plan: 'premium' | 'enterprise') => void;
  onManageSubscription: () => void;
  isUpgrading: boolean;
}

export function OverviewSection({ onUpgrade, onManageSubscription, isUpgrading }: OverviewSectionProps) {
  const { subscription } = useAuth();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
        <p className="text-gray-600 mt-2">Welcome to your MeetingROI Pro dashboard</p>
      </div>

      {/* Google Ads for free users */}
      {subscription.tier === 'free' && (
        <GoogleAds showUpgradePrompt={true} onUpgradeClick={() => onUpgrade('premium')} />
      )}

      {/* Subscription Status for Premium/Enterprise users */}
      {subscription.tier !== 'free' && (
        <Card className="border-green-200 bg-green-50">
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
              <Button variant="outline" onClick={onManageSubscription}>
                Manage Subscription
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Plan Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold capitalize">{subscription.tier}</div>
            <p className="text-xs text-muted-foreground">Current subscription</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Features Available</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {subscription.tier === 'free' ? '2' : subscription.tier === 'premium' ? '6' : '8'}
            </div>
            <p className="text-xs text-muted-foreground">Active features</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Account Type</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {subscription.tier === 'enterprise' ? 'Team' : 'Individual'}
            </div>
            <p className="text-xs text-muted-foreground">Collaboration level</p>
          </CardContent>
        </Card>
      </div>

      {/* Upgrade prompt for free users */}
      {subscription.tier === 'free' && (
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="p-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-2">Unlock More Features</h3>
              <p className="text-gray-600 mb-4">
                Upgrade to Premium to access advanced analytics, AI insights, and more.
              </p>
              <div className="flex gap-4 justify-center">
                <Button 
                  onClick={() => onUpgrade('premium')}
                  disabled={isUpgrading}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {isUpgrading ? 'Processing...' : 'Upgrade to Premium - $29/month'}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
