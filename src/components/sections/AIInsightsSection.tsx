
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Lock, Zap, Brain, Target, Lightbulb, Cpu } from "lucide-react";
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

        <Card className="border-yellow-200">
          <CardContent className="p-8">
            <div className="text-center">
              <Lock className="h-16 w-16 mx-auto text-gray-400 mb-4" />
              <h3 className="text-xl font-semibold mb-4">Premium Feature</h3>
              <p className="text-gray-600 mb-6">
                Get AI-powered recommendations to optimize your meetings and reduce costs.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <Brain className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <h4 className="font-medium mb-2">Smart Cost Optimization</h4>
                  <p className="text-sm text-gray-600">AI-driven cost reduction strategies</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <Target className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <h4 className="font-medium mb-2">Meeting Efficiency Analysis</h4>
                  <p className="text-sm text-gray-600">Identify productivity bottlenecks</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <Lightbulb className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <h4 className="font-medium mb-2">Personalized Recommendations</h4>
                  <p className="text-sm text-gray-600">Tailored optimization suggestions</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <Cpu className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <h4 className="font-medium mb-2">Predictive Cost Modeling</h4>
                  <p className="text-sm text-gray-600">Forecast future meeting costs</p>
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
            <CardDescription>AI-generated optimization tips</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="p-3 bg-blue-50 rounded-lg">
                <p className="text-sm font-medium">Reduce meeting duration by 15%</p>
                <p className="text-xs text-gray-600">Based on your meeting patterns</p>
              </div>
              <div className="p-3 bg-green-50 rounded-lg">
                <p className="text-sm font-medium">Optimize attendee list</p>
                <p className="text-xs text-gray-600">Save $340/month on unnecessary participants</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Brain className="h-5 w-5 mr-2" />
              Efficiency Score
            </CardTitle>
            <CardDescription>AI-calculated meeting effectiveness</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">85%</div>
            <p className="text-sm text-gray-600">Your meetings are performing well</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>AI Analysis Dashboard</CardTitle>
          <CardDescription>Your AI insights are now available</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">
            This is where your AI-powered insights and recommendations would be displayed.
            The AI insights feature is now unlocked with your {subscription.tier} subscription.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
