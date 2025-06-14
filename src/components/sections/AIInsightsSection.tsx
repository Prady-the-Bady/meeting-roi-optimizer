
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Brain, TrendingUp, Users, Clock, AlertTriangle, Lightbulb, Crown, Lock } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

interface AIInsightsSectionProps {
  onUpgrade: (plan: 'premium' | 'enterprise') => void;
  isUpgrading: boolean;
}

const AIInsightsSection = ({ onUpgrade, isUpgrading }: AIInsightsSectionProps) => {
  const { subscription } = useAuth();
  const { toast } = useToast();
  const isPremium = subscription.tier === 'premium' || subscription.tier === 'enterprise';

  const handleGenerateInsights = () => {
    if (!isPremium) {
      toast({
        title: "Premium Feature",
        description: "AI insights require a premium subscription.",
        variant: "destructive",
      });
      return;
    }
    
    toast({
      title: "Generating Insights",
      description: "AI is analyzing your meeting patterns...",
    });
    
    // Simulate AI processing
    setTimeout(() => {
      toast({
        title: "Insights Ready!",
        description: "New AI recommendations have been generated.",
      });
    }, 2000);
  };

  const handleOptimizeSchedule = () => {
    if (!isPremium) {
      toast({
        title: "Premium Feature",
        description: "Schedule optimization requires a premium subscription.",
        variant: "destructive",
      });
      return;
    }
    
    toast({
      title: "Optimizing Schedule",
      description: "AI is analyzing your calendar for optimization opportunities...",
    });
  };

  const handleExportReport = () => {
    if (!isPremium) {
      toast({
        title: "Premium Feature",
        description: "Report export requires a premium subscription.",
        variant: "destructive",
      });
      return;
    }
    
    // Create a simple report
    const reportData = {
      timestamp: new Date().toISOString(),
      insights: [
        "Your average meeting cost is 15% above industry standard",
        "Consider reducing meeting duration by 10 minutes to save $2,400/month",
        "Tuesday mornings show highest productivity scores"
      ]
    };
    
    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'ai-insights-report.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Report Exported",
      description: "AI insights report has been downloaded.",
    });
  };

  const insights = [
    {
      id: 1,
      title: "Meeting Efficiency Score",
      value: "72%",
      trend: "+5%",
      description: "Your meetings are becoming more efficient over time",
      icon: <TrendingUp className="h-5 w-5" />,
      color: "text-green-600"
    },
    {
      id: 2,
      title: "Optimal Meeting Duration",
      value: "23 min",
      trend: "-3 min",
      description: "AI suggests shorter meetings for better engagement",
      icon: <Clock className="h-5 w-5" />,
      color: "text-blue-600"
    },
    {
      id: 3,
      title: "Team Collaboration Index",
      value: "8.4/10",
      trend: "+0.7",
      description: "Strong collaboration patterns detected",
      icon: <Users className="h-5 w-5" />,
      color: "text-purple-600"
    }
  ];

  const recommendations = [
    {
      id: 1,
      title: "Reduce Daily Standups",
      impact: "Save $1,200/month",
      description: "Consider switching to async updates 2 days per week",
      priority: "High",
      icon: <AlertTriangle className="h-4 w-4" />
    },
    {
      id: 2,
      title: "Optimize Meeting Times",
      impact: "15% efficiency boost",
      description: "Schedule important meetings between 10-11 AM",
      priority: "Medium",
      icon: <Lightbulb className="h-4 w-4" />
    },
    {
      id: 3,
      title: "Implement No-Meeting Fridays",
      impact: "Save $3,400/month",
      description: "Protect focused work time for better productivity",
      priority: "High",
      icon: <Brain className="h-4 w-4" />
    }
  ];

  if (!isPremium) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 gradient-text">AI Insights</h1>
            <p className="text-gray-600 mt-2">Get intelligent recommendations powered by AI</p>
          </div>
          <Badge className="bg-yellow-100 text-yellow-800 border-yellow-300">
            <Crown className="h-3 w-3 mr-1" />
            Premium Feature
          </Badge>
        </div>

        <div className="grid gap-6">
          <Card className="border-2 border-dashed border-yellow-200 bg-gradient-to-br from-yellow-50 to-orange-50">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Brain className="h-8 w-8 text-yellow-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Unlock AI-Powered Insights
              </h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                Get intelligent recommendations, predictive analytics, and automated optimization suggestions
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button 
                  onClick={() => onUpgrade('premium')}
                  disabled={isUpgrading}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg"
                >
                  {isUpgrading ? "Processing..." : "Upgrade to Premium"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 gradient-text">AI Insights</h1>
          <p className="text-gray-600 mt-2">Intelligent recommendations for meeting optimization</p>
        </div>
        <div className="flex gap-2">
          <Button 
            onClick={handleGenerateInsights}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
          >
            <Brain className="h-4 w-4 mr-2" />
            Generate Insights
          </Button>
          <Button 
            variant="outline" 
            onClick={handleExportReport}
            className="border-blue-200 text-blue-700 hover:bg-blue-50"
          >
            Export Report
          </Button>
        </div>
      </div>

      {/* AI Insights Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {insights.map((insight) => (
          <Card key={insight.id} className="hover:shadow-lg transition-all duration-200 border-l-4 border-l-blue-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-3">
                <div className={`p-2 rounded-lg bg-gray-50 ${insight.color}`}>
                  {insight.icon}
                </div>
                <Badge variant="outline" className="text-green-600 border-green-200">
                  {insight.trend}
                </Badge>
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">{insight.title}</h3>
              <div className="text-2xl font-bold text-gray-900 mb-2">{insight.value}</div>
              <p className="text-sm text-gray-600">{insight.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* AI Recommendations */}
      <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-blue-50">
        <CardHeader>
          <CardTitle className="flex items-center text-xl">
            <Lightbulb className="h-5 w-5 mr-2 text-yellow-500" />
            AI Recommendations
          </CardTitle>
          <CardDescription>
            Personalized suggestions to optimize your meeting costs and efficiency
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recommendations.map((rec) => (
              <div key={rec.id} className="flex items-start space-x-4 p-4 rounded-lg bg-white shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className={`p-2 rounded-lg ${rec.priority === 'High' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'}`}>
                  {rec.icon}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-gray-900">{rec.title}</h4>
                    <Badge 
                      variant={rec.priority === 'High' ? 'destructive' : 'secondary'}
                      className="text-xs"
                    >
                      {rec.priority}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{rec.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-green-600">{rec.impact}</span>
                    <Button size="sm" variant="outline" className="text-xs">
                      Apply Suggestion
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-gray-900">Schedule Optimization</h4>
                <p className="text-sm text-gray-600">Let AI optimize your meeting schedule automatically</p>
              </div>
              <Button 
                onClick={handleOptimizeSchedule}
                className="bg-purple-600 hover:bg-purple-700 text-white"
              >
                <Brain className="h-4 w-4 mr-2" />
                Optimize Schedule
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AIInsightsSection;
