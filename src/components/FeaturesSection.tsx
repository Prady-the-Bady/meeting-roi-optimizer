
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calculator, BarChart3, Users, Brain, Zap, Target } from "lucide-react";

interface FeaturesSectionProps {
  onStartFreeTrial: () => void;
}

const FeaturesSection = ({ onStartFreeTrial }: FeaturesSectionProps) => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Everything You Need to Optimize Meeting ROI
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            From real-time cost tracking to AI-powered insights, we provide the tools 
            to transform your meeting culture.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <Calculator className="h-6 w-6 text-blue-600" />
              </div>
              <CardTitle>Real-time Cost Calculator</CardTitle>
              <CardDescription>
                Track meeting expenses as they happen with automatic salary calculations and time tracking.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <BarChart3 className="h-6 w-6 text-green-600" />
              </div>
              <CardTitle>Advanced Analytics</CardTitle>
              <CardDescription>
                Comprehensive dashboards showing meeting trends, cost patterns, and ROI metrics across your organization.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <Brain className="h-6 w-6 text-purple-600" />
              </div>
              <CardTitle>AI-Powered Insights</CardTitle>
              <CardDescription>
                Get intelligent recommendations for meeting optimization, agenda improvements, and cost reduction strategies.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                <Users className="h-6 w-6 text-orange-600" />
              </div>
              <CardTitle>Team Collaboration</CardTitle>
              <CardDescription>
                Collaborative tools for team leads to manage meeting costs and share insights across departments.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader>
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                <Zap className="h-6 w-6 text-red-600" />
              </div>
              <CardTitle>Calendar Integration</CardTitle>
              <CardDescription>
                Seamlessly integrate with Google Calendar, Outlook, and other popular calendar applications.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader>
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mb-4">
                <Target className="h-6 w-6 text-yellow-600" />
              </div>
              <CardTitle>Goal Tracking</CardTitle>
              <CardDescription>
                Set meeting efficiency goals and track progress with automated reporting and milestone tracking.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        <div className="text-center">
          <Button 
            size="lg" 
            className="bg-blue-600 hover:bg-blue-700 px-8"
            onClick={onStartFreeTrial}
          >
            Start Your Free Trial Today
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
