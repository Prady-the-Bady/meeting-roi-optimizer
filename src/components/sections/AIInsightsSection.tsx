
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Lock, Zap, Brain, Target, Lightbulb, Cpu, Crown, TrendingUp } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

interface AIInsightsSectionProps {
  onUpgrade: (plan: 'premium' | 'enterprise') => void;
  isUpgrading: boolean;
}

export function AIInsightsSection({ onUpgrade, isUpgrading }: AIInsightsSectionProps) {
  const { subscription } = useAuth();

  if (subscription.tier === 'free') {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">AI Insights</h1>
          <p className="text-gray-600 mt-2">AI-powered meeting optimization recommendations</p>
        </div>

        <Card className="border-purple-200 bg-purple-50">
          <CardContent className="p-8">
            <div className="text-center">
              <Lock className="h-16 w-16 mx-auto text-purple-400 mb-4" />
              <h3 className="text-xl font-semibold mb-4 flex items-center justify-center">
                <Crown className="h-5 w-5 mr-2 text-purple-600" />
                Premium AI Features
              </h3>
              <p className="text-gray-600 mb-6">
                Unlock AI-powered insights and optimization recommendations to maximize your meeting efficiency and reduce costs.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="bg-white p-4 rounded-lg border border-purple-200">
                  <Brain className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                  <h4 className="font-medium mb-2">Smart Cost Optimization</h4>
                  <p className="text-sm text-gray-600">AI-driven cost reduction strategies tailored to your team</p>
                </div>
                <div className="bg-white p-4 rounded-lg border border-purple-200">
                  <Target className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                  <h4 className="font-medium mb-2">Meeting Efficiency Analysis</h4>
                  <p className="text-sm text-gray-600">Identify productivity bottlenecks and improvement areas</p>
                </div>
                <div className="bg-white p-4 rounded-lg border border-purple-200">
                  <Lightbulb className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                  <h4 className="font-medium mb-2">Personalized Recommendations</h4>
                  <p className="text-sm text-gray-600">Custom suggestions based on your meeting patterns</p>
                </div>
                <div className="bg-white p-4 rounded-lg border border-purple-200">
                  <Cpu className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                  <h4 className="font-medium mb-2">Predictive Cost Modeling</h4>
                  <p className="text-sm text-gray-600">Forecast future meeting costs and budget planning</p>
                </div>
              </div>

              <Button 
                onClick={() => onUpgrade('premium')}
                disabled={isUpgrading}
                className="bg-purple-600 hover:bg-purple-700"
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
        <h1 className="text-3xl font-bold text-gray-900">AI Insights</h1>
        <p className="text-gray-600 mt-2">AI-powered meeting optimization recommendations</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Zap className="h-5 w-5 mr-2" />
              Smart Recommendations
            </CardTitle>
            <CardDescription>AI-generated optimization tips based on your data</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-sm font-medium text-blue-800">Reduce meeting duration by 15%</p>
                  <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">High Impact</span>
                </div>
                <p className="text-xs text-blue-600">Based on analysis of 47 meetings this month</p>
                <p className="text-xs text-green-600 mt-1">Potential savings: $340/month</p>
              </div>
              <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-sm font-medium text-green-800">Optimize attendee list</p>
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">Medium Impact</span>
                </div>
                <p className="text-xs text-green-600">Remove 2-3 unnecessary participants per meeting</p>
                <p className="text-xs text-green-600 mt-1">Potential savings: $280/month</p>
              </div>
              <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-sm font-medium text-purple-800">Schedule consolidation</p>
                  <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded">Quick Win</span>
                </div>
                <p className="text-xs text-purple-600">Combine similar meetings to reduce overhead</p>
                <p className="text-xs text-green-600 mt-1">Potential savings: $150/month</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Brain className="h-5 w-5 mr-2" />
              AI Efficiency Score
            </CardTitle>
            <CardDescription>AI-calculated meeting effectiveness metrics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <div className="text-4xl font-bold text-green-600 mb-2">85%</div>
              <p className="text-sm text-gray-600 mb-4">Your meetings are performing well</p>
              
              <div className="space-y-3 text-left">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Meeting Duration Efficiency</span>
                  <div className="flex items-center">
                    <div className="w-16 h-2 bg-gray-200 rounded-full mr-2">
                      <div className="h-2 bg-green-600 rounded-full" style={{ width: '90%' }}></div>
                    </div>
                    <span className="text-sm font-medium">90%</span>
                  </div>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm">Attendee Relevance</span>
                  <div className="flex items-center">
                    <div className="w-16 h-2 bg-gray-200 rounded-full mr-2">
                      <div className="h-2 bg-yellow-500 rounded-full" style={{ width: '75%' }}></div>
                    </div>
                    <span className="text-sm font-medium">75%</span>
                  </div>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm">Cost Optimization</span>
                  <div className="flex items-center">
                    <div className="w-16 h-2 bg-gray-200 rounded-full mr-2">
                      <div className="h-2 bg-blue-600 rounded-full" style={{ width: '82%' }}></div>
                    </div>
                    <span className="text-sm font-medium">82%</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Target className="h-5 w-5 mr-2" />
              Cost Predictions
            </CardTitle>
            <CardDescription>Next month forecast</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600 mb-2">$2,680</div>
            <div className="flex items-center text-sm">
              <TrendingUp className="h-4 w-4 text-red-500 mr-1" />
              <span className="text-red-600">+9% from this month</span>
            </div>
            <p className="text-xs text-gray-600 mt-2">Based on scheduled meetings and hiring plans</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Lightbulb className="h-5 w-5 mr-2" />
              Quick Wins
            </CardTitle>
            <CardDescription>Immediate optimizations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600 mb-2">3</div>
            <p className="text-sm text-gray-600">Actionable recommendations</p>
            <p className="text-xs text-green-600 mt-1">Est. savings: $770/month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Cpu className="h-5 w-5 mr-2" />
              AI Confidence
            </CardTitle>
            <CardDescription>Model accuracy</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600 mb-2">94%</div>
            <p className="text-sm text-gray-600">High confidence predictions</p>
            <p className="text-xs text-gray-600 mt-1">Based on 180+ data points</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
