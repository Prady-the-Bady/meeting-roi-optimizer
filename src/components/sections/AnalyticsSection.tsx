
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Lock, TrendingUp, BarChart3, PieChart, Calendar } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

interface AnalyticsSectionProps {
  onUpgrade: (plan: 'premium' | 'enterprise') => void;
  isUpgrading: boolean;
}

export function AnalyticsSection({ onUpgrade, isUpgrading }: AnalyticsSectionProps) {
  const { subscription } = useAuth();

  if (subscription.tier === 'free') {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
          <p className="text-gray-600 mt-2">Advanced meeting cost analytics and insights</p>
        </div>

        <Card className="border-yellow-200">
          <CardContent className="p-8">
            <div className="text-center">
              <Lock className="h-16 w-16 mx-auto text-gray-400 mb-4" />
              <h3 className="text-xl font-semibold mb-4">Premium Feature</h3>
              <p className="text-gray-600 mb-6">
                Get detailed analytics and insights about your meeting costs and efficiency patterns.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <BarChart3 className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <h4 className="font-medium mb-2">Cost Trend Analysis</h4>
                  <p className="text-sm text-gray-600">Track meeting costs over time</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <PieChart className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <h4 className="font-medium mb-2">Efficiency Scoring</h4>
                  <p className="text-sm text-gray-600">ROI analysis for meetings</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <TrendingUp className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <h4 className="font-medium mb-2">Optimization Tips</h4>
                  <p className="text-sm text-gray-600">Recommendations to reduce costs</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <Calendar className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <h4 className="font-medium mb-2">Custom Date Ranges</h4>
                  <p className="text-sm text-gray-600">Flexible time period analysis</p>
                </div>
              </div>

              <Button 
                onClick={() => onUpgrade('premium')}
                disabled={isUpgrading}
                className="bg-blue-600 hover:bg-blue-700"
                size="lg"
              >
                {isUpgrading ? 'Processing...' : 'Upgrade to Premium - $29/month'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
        <p className="text-gray-600 mt-2">Advanced meeting cost analytics and insights</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="h-5 w-5 mr-2" />
              Cost Trends
            </CardTitle>
            <CardDescription>Meeting costs over time</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$2,450</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart3 className="h-5 w-5 mr-2" />
              Efficiency Score
            </CardTitle>
            <CardDescription>Meeting productivity rating</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">78%</div>
            <p className="text-xs text-muted-foreground">Above average</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <PieChart className="h-5 w-5 mr-2" />
              ROI Analysis
            </CardTitle>
            <CardDescription>Return on meeting investment</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2.3x</div>
            <p className="text-xs text-muted-foreground">Cost to value ratio</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Detailed Analytics</CardTitle>
          <CardDescription>Your meeting analytics dashboard is now available</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">
            This is where your detailed analytics charts and insights would be displayed.
            The analytics feature is now unlocked with your {subscription.tier} subscription.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
