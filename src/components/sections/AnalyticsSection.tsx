
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Lock, TrendingUp, BarChart3, PieChart, Calendar, Crown, Target, Zap } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

interface AnalyticsSectionProps {
  onUpgrade: (plan: 'premium' | 'enterprise') => void;
  isUpgrading: boolean;
}

export function AnalyticsSection({ onUpgrade, isUpgrading }: AnalyticsSectionProps) {
  const { subscription } = useAuth();

  if (subscription.tier === 'free') {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
            Analytics Dashboard
          </h1>
          <p className="text-lg text-gray-600 mt-2">Advanced meeting cost analytics and insights</p>
        </div>

        <Card className="border-2 border-blue-200 bg-gradient-to-br from-blue-50 via-white to-purple-50 shadow-xl">
          <CardContent className="p-10">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-100 rounded-full mb-6">
                <Lock className="h-10 w-10 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold mb-4 flex items-center justify-center">
                <Crown className="h-6 w-6 mr-2 text-blue-600" />
                Premium Analytics Required
              </h3>
              <p className="text-gray-600 mb-8 text-lg max-w-2xl mx-auto">
                Unlock powerful analytics and detailed insights about your meeting costs and efficiency patterns with Premium.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-white p-6 rounded-xl border border-blue-200 shadow-sm hover:shadow-md transition-shadow">
                  <BarChart3 className="h-10 w-10 text-blue-600 mx-auto mb-3" />
                  <h4 className="font-semibold mb-3 text-lg">Cost Trend Analysis</h4>
                  <p className="text-gray-600">Track meeting costs over time with interactive charts and forecasting</p>
                </div>
                <div className="bg-white p-6 rounded-xl border border-blue-200 shadow-sm hover:shadow-md transition-shadow">
                  <PieChart className="h-10 w-10 text-blue-600 mx-auto mb-3" />
                  <h4 className="font-semibold mb-3 text-lg">Efficiency Scoring</h4>
                  <p className="text-gray-600">AI-powered ROI analysis and productivity metrics</p>
                </div>
                <div className="bg-white p-6 rounded-xl border border-blue-200 shadow-sm hover:shadow-md transition-shadow">
                  <TrendingUp className="h-10 w-10 text-blue-600 mx-auto mb-3" />
                  <h4 className="font-semibold mb-3 text-lg">Optimization Insights</h4>
                  <p className="text-gray-600">Smart recommendations to reduce costs and improve efficiency</p>
                </div>
                <div className="bg-white p-6 rounded-xl border border-blue-200 shadow-sm hover:shadow-md transition-shadow">
                  <Calendar className="h-10 w-10 text-blue-600 mx-auto mb-3" />
                  <h4 className="font-semibold mb-3 text-lg">Custom Reporting</h4>
                  <p className="text-gray-600">Flexible date ranges, filters, and export options</p>
                </div>
              </div>

              <Button 
                onClick={() => onUpgrade('premium')}
                disabled={isUpgrading}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg shadow-lg hover:shadow-xl transition-all duration-200"
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
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
          Analytics Dashboard
        </h1>
        <p className="text-lg text-gray-600 mt-2">Advanced meeting cost analytics and insights</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-green-100 hover:shadow-xl transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center text-green-800">
              <TrendingUp className="h-5 w-5 mr-2" />
              Cost Trends
            </CardTitle>
            <CardDescription className="text-green-600">Meeting costs over time</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-700">$2,450</div>
            <p className="text-sm text-green-600 mt-1">This month (+12% from last month)</p>
            <div className="mt-3 h-2 bg-green-200 rounded-full">
              <div className="h-2 bg-green-600 rounded-full animate-pulse" style={{ width: '68%' }}></div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-blue-100 hover:shadow-xl transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center text-blue-800">
              <Target className="h-5 w-5 mr-2" />
              Efficiency Score
            </CardTitle>
            <CardDescription className="text-blue-600">Meeting productivity rating</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-700">78%</div>
            <p className="text-sm text-blue-600 mt-1">Above average performance</p>
            <div className="mt-3 h-2 bg-blue-200 rounded-full">
              <div className="h-2 bg-blue-600 rounded-full animate-pulse" style={{ width: '78%' }}></div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-purple-100 hover:shadow-xl transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center text-purple-800">
              <Zap className="h-5 w-5 mr-2" />
              ROI Analysis
            </CardTitle>
            <CardDescription className="text-purple-600">Return on meeting investment</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-700">2.3x</div>
            <p className="text-sm text-purple-600 mt-1">Cost to value ratio</p>
            <div className="mt-2 text-sm text-green-600 font-medium">+15% improvement</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="border-0 shadow-lg bg-white hover:shadow-xl transition-shadow">
          <CardHeader>
            <CardTitle className="text-xl">Meeting Cost Breakdown</CardTitle>
            <CardDescription>Analyze costs by department and meeting type</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="font-medium">Engineering Team</span>
                <span className="font-bold text-blue-600">$1,240 (51%)</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full animate-pulse" style={{ width: '51%' }}></div>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="font-medium">Product Team</span>
                <span className="font-bold text-green-600">$780 (32%)</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div className="bg-gradient-to-r from-green-500 to-green-600 h-3 rounded-full animate-pulse" style={{ width: '32%' }}></div>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="font-medium">Marketing Team</span>
                <span className="font-bold text-purple-600">$430 (17%)</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div className="bg-gradient-to-r from-purple-500 to-purple-600 h-3 rounded-full animate-pulse" style={{ width: '17%' }}></div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-white hover:shadow-xl transition-shadow">
          <CardHeader>
            <CardTitle className="text-xl">Optimization Opportunities</CardTitle>
            <CardDescription>AI-powered cost reduction suggestions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-xl border border-green-200">
                <h4 className="font-semibold text-green-800 mb-1">Reduce Meeting Duration</h4>
                <p className="text-sm text-green-700 mb-1">Potential savings: $340/month</p>
                <p className="text-xs text-green-600">Average meetings could be 15 minutes shorter</p>
              </div>
              
              <div className="p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl border border-blue-200">
                <h4 className="font-semibold text-blue-800 mb-1">Optimize Attendee Lists</h4>
                <p className="text-sm text-blue-700 mb-1">Potential savings: $280/month</p>
                <p className="text-xs text-blue-600">Remove unnecessary participants from recurring meetings</p>
              </div>
              
              <div className="p-4 bg-gradient-to-r from-yellow-50 to-yellow-100 rounded-xl border border-yellow-200">
                <h4 className="font-semibold text-yellow-800 mb-1">Schedule Efficiency</h4>
                <p className="text-sm text-yellow-700 mb-1">Potential savings: $150/month</p>
                <p className="text-xs text-yellow-600">Batch similar meetings to reduce context switching</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
