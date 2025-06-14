
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Brain, TrendingUp, Users, Clock, AlertTriangle, CheckCircle, Lightbulb } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface MeetingData {
  title: string;
  type: string;
  duration: number;
  participants: number;
  totalCost: number;
  costMethod: string;
  timestamp: Date;
}

interface AIOptimizationProps {
  meetingData: MeetingData;
}

interface OptimizationInsight {
  type: 'warning' | 'suggestion' | 'success';
  category: string;
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  potentialSavings?: number;
}

const AIOptimization = ({ meetingData }: AIOptimizationProps) => {
  const [insights, setInsights] = useState<OptimizationInsight[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const { toast } = useToast();

  const generateAIInsights = () => {
    if (meetingData.duration === 0) return [];

    const insights: OptimizationInsight[] = [];
    const costPerMinute = meetingData.totalCost / (meetingData.duration / 60);
    const costPerParticipant = meetingData.totalCost / meetingData.participants;

    // High cost analysis
    if (meetingData.totalCost > 500) {
      insights.push({
        type: 'warning',
        category: 'Cost Optimization',
        title: 'High-Cost Meeting Detected',
        description: `This meeting costs $${meetingData.totalCost.toFixed(2)}. Consider reducing participants or duration.`,
        impact: 'high',
        potentialSavings: meetingData.totalCost * 0.3
      });
    }

    // Duration optimization
    if (meetingData.duration > 3600) {
      insights.push({
        type: 'suggestion',
        category: 'Time Management',
        title: 'Long Meeting Duration',
        description: 'Meetings over 1 hour tend to lose effectiveness. Consider breaking into smaller sessions.',
        impact: 'medium',
        potentialSavings: (meetingData.duration - 3600) / 60 * costPerMinute
      });
    }

    // Participant optimization
    if (meetingData.participants > 8) {
      insights.push({
        type: 'warning',
        category: 'Participant Management',
        title: 'Large Meeting Size',
        description: 'Meetings with 8+ participants can reduce decision-making efficiency. Consider splitting into focused groups.',
        impact: 'high',
        potentialSavings: (meetingData.participants - 6) * costPerParticipant
      });
    }

    // Meeting type optimization
    if (meetingData.type === 'status-update' && meetingData.duration > 1800) {
      insights.push({
        type: 'suggestion',
        category: 'Meeting Type',
        title: 'Status Update Too Long',
        description: 'Status updates should typically be 15-20 minutes. Consider async updates for detailed information.',
        impact: 'medium'
      });
    }

    // Positive reinforcement
    if (meetingData.totalCost <= 200 && meetingData.duration <= 1800 && meetingData.participants <= 6) {
      insights.push({
        type: 'success',
        category: 'Optimization',
        title: 'Well-Optimized Meeting',
        description: 'This meeting follows best practices for cost, duration, and participant count.',
        impact: 'low'
      });
    }

    // AI-specific recommendations
    insights.push({
      type: 'suggestion',
      category: 'AI Recommendation',
      title: 'Agenda Optimization',
      description: 'AI suggests creating a structured agenda with time boxes for each topic to improve efficiency.',
      impact: 'medium',
      potentialSavings: meetingData.totalCost * 0.15
    });

    return insights;
  };

  const runAIAnalysis = async () => {
    setIsAnalyzing(true);
    
    // Simulate AI processing time
    setTimeout(() => {
      const newInsights = generateAIInsights();
      setInsights(newInsights);
      setIsAnalyzing(false);
      
      toast({
        title: "AI Analysis Complete",
        description: `Generated ${newInsights.length} optimization insights for your meeting.`,
      });
    }, 2000);
  };

  useEffect(() => {
    if (meetingData.duration > 0) {
      runAIAnalysis();
    }
  }, [meetingData.totalCost, meetingData.duration, meetingData.participants]);

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'warning': return <AlertTriangle className="h-5 w-5 text-orange-500" />;
      case 'success': return <CheckCircle className="h-5 w-5 text-green-500" />;
      default: return <Lightbulb className="h-5 w-5 text-blue-500" />;
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'text-red-600 bg-red-50';
      case 'medium': return 'text-yellow-600 bg-yellow-50';
      default: return 'text-green-600 bg-green-50';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Brain className="h-5 w-5 mr-2 text-purple-600" />
          AI-Powered Optimization
        </CardTitle>
        <CardDescription>
          Get intelligent recommendations to optimize your meeting costs and effectiveness
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-600">
              {insights.length > 0 ? `${insights.length} insights generated` : 'No analysis available'}
            </div>
            <Button 
              onClick={runAIAnalysis} 
              disabled={isAnalyzing || meetingData.duration === 0}
              size="sm"
              variant="outline"
            >
              {isAnalyzing ? 'Analyzing...' : 'Refresh Analysis'}
            </Button>
          </div>

          {isAnalyzing && (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
              <span className="ml-2 text-purple-600">AI analyzing your meeting...</span>
            </div>
          )}

          <div className="space-y-3">
            {insights.map((insight, index) => (
              <div key={index} className="p-4 border rounded-lg">
                <div className="flex items-start space-x-3">
                  {getInsightIcon(insight.type)}
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-medium text-gray-900">{insight.title}</h4>
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getImpactColor(insight.impact)}`}>
                          {insight.impact.toUpperCase()} IMPACT
                        </span>
                        <span className="text-xs text-gray-500">{insight.category}</span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600">{insight.description}</p>
                    {insight.potentialSavings && (
                      <p className="text-sm text-green-600 mt-1">
                        Potential savings: ${insight.potentialSavings.toFixed(2)}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {insights.length === 0 && !isAnalyzing && meetingData.duration > 0 && (
            <div className="text-center py-8 text-gray-500">
              <Brain className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>AI analysis will appear here once meeting data is available</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default AIOptimization;
