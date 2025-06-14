
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calculator, TrendingUp, Users, Clock, Brain, Calendar } from "lucide-react";

const FeaturesSection = () => {
  const features = [
    {
      icon: Calculator,
      title: "Real-Time Cost Tracking",
      description: "Calculate meeting costs in real-time with customizable hourly rates and automatic duration tracking."
    },
    {
      icon: Brain,
      title: "AI-Powered Optimization",
      description: "Get intelligent suggestions to reduce costs and improve meeting efficiency based on your data."
    },
    {
      icon: TrendingUp,
      title: "Analytics Dashboard",
      description: "Comprehensive analytics showing cost trends, productivity metrics, and ROI insights."
    },
    {
      icon: Calendar,
      title: "Calendar Integration",
      description: "Seamlessly integrate with Google Calendar and Outlook for automatic cost calculations."
    },
    {
      icon: Users,
      title: "Team Collaboration",
      description: "Multi-user access with role permissions and team-wide cost sharing capabilities."
    },
    {
      icon: Clock,
      title: "Meeting Efficiency Scoring",
      description: "Track and score meeting productivity with industry benchmarks and improvement suggestions."
    }
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Everything You Need to Optimize Meeting ROI
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Powerful features designed to help you understand, track, and optimize your meeting costs
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="bg-blue-100 rounded-full p-3 w-12 h-12 flex items-center justify-center mb-4">
                  <feature.icon className="h-6 w-6 text-blue-600" />
                </div>
                <CardTitle className="text-xl">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-600">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
