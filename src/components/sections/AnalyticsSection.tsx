
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Lock, TrendingUp, BarChart3, PieChart, Calendar, Crown } from "lucide-react";
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

        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="p-8">
            <div className="text-center">
              <Lock className="h-16 w-16 mx-auto text-blue-400 mb-4" />
              <h3 className="text-xl font-semibold mb-4 flex items-center justify-center">
                <Crown className="h-5 w-5 mr-2 text-blue-600" />
                Premium Feature Required
              </h3>
              <p className="text-gray-600 mb-6">
                Unlock advanced analytics and detailed insights about your meeting costs and efficiency patterns with Premium.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="bg-white p-4 rounded-lg border border-blue-200">
                  <BarChart3 className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                  <h4 className="font-medium mb-2">Cost Trend Analysis</h4>
                  <p className="text-sm text-gray-600">Track meeting costs over time with detailed charts</p>
                </div>
                <div className="bg-white p-4 rounded-lg border border-blue-200">
                  <PieChart className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                  <h4 className="font-medium mb-2">Efficiency Scoring</h4>
                  <p className="text-sm text-gray-600">ROI analysis and productivity metrics</p>
                </div>
                <div className="bg-white p-4 rounded-lg border border-blue-200">
                  <TrendingUp className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                  <h4 className="font-medium mb-2">Optimization Insights</h4>
                  <p className="text-sm text-gray-600">AI-powered recommendations to reduce costs</p>
                </div>
                <div className="bg-white p-4 rounded-lg border border-blue-200">
                  <Calendar className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                  <h4 className="font-medium mb-2">Custom Reporting</h4>
                  <p className="text-sm text-gray-600">Flexible date ranges and export options</p>
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

  // Premium and Enterprise users get full access
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
            <div className="text-2xl font-bold text-green-600">$2,450</div>
            <p className="text-xs text-muted-foreground">This month (+12% from last month)</p>
            <div className="mt-2 h-2 bg-gray-200 rounded-full">
              <div className="h-2 bg-green-600 rounded-full" style={{ width: '68%' }}></div>
            </div>
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
            <div className="text-2xl font-bold text-blue-600">78%</div>
            <p className="text-xs text-muted-foreground">Above average performance</p>
            <div className="mt-2 h-2 bg-gray-200 rounded-full">
              <div className="h-2 bg-blue-600 rounded-full" style={{ width: '78%' }}></div>
            </div>
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
            <div className="text-2xl font-bold text-purple-600">2.3x</div>
            <p className="text-xs text-muted-foreground">Cost to value ratio</p>
            <div className="mt-2 text-sm text-green-600">+15% improvement</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Meeting Cost Breakdown</CardTitle>
            <CardDescription>Analyze costs by department and meeting type</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm">Engineering Team</span>
                <span className="font-medium">$1,240 (51%)</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full" style={{ width: '51%' }}></div>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm">Product Team</span>
                <span className="font-medium">$780 (32%)</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-600 h-2 rounded-full" style={{ width: '32%' }}></div>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm">Marketing Team</span>
                <span className="font-medium">$430 (17%)</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-purple-600 h-2 rounded-full" style={{ width: '17%' }}></div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Optimization Opportunities</CardTitle>
            <CardDescription>AI-powered cost reduction suggestions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                <h4 className="font-medium text-green-800">Reduce Meeting Duration</h4>
                <p className="text-sm text-green-700">Potential savings: $340/month</p>
                <p className="text-xs text-green-600">Average meetings could be 15 minutes shorter</p>
              </div>
              
              <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                <h4 className="font-medium text-blue-800">Optimize Attendee Lists</h4>
                <p className="text-sm text-blue-700">Potential savings: $280/month</p>
                <p className="text-xs text-blue-600">Remove unnecessary participants from recurring meetings</p>
              </div>
              
              <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                <h4 className="font-medium text-yellow-800">Schedule Efficiency</h4>
                <p className="text-sm text-yellow-700">Potential savings: $150/month</p>
                <p className="text-xs text-yellow-600">Batch similar meetings to reduce context switching</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
