
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calculator, TrendingUp, Users, Clock, CheckCircle, Star } from "lucide-react";
import HeroSection from "@/components/HeroSection";
import FeaturesSection from "@/components/FeaturesSection";
import PricingSection from "@/components/PricingSection";
import GoogleAds from "@/components/GoogleAds";

const Index = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user) {
      navigate("/dashboard");
    }
  }, [user, loading, navigate]);

  const handleStartFreeTrial = () => {
    navigate("/auth");
  };

  const handleWatchDemo = () => {
    // You can replace this with actual demo video URL or modal
    window.open("https://www.youtube.com/watch?v=demo-video", "_blank");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Calculator className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Calculator className="h-8 w-8 text-blue-600" />
            <span className="text-2xl font-bold text-gray-900">MeetingROI Pro</span>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="ghost" onClick={() => navigate("/auth")}>
              Login
            </Button>
            <Button 
              className="bg-blue-600 hover:bg-blue-700"
              onClick={handleStartFreeTrial}
            >
              Get Started Free
            </Button>
          </div>
        </div>
      </nav>

      <HeroSection onStartFreeTrial={handleStartFreeTrial} onWatchDemo={handleWatchDemo} />
      
      {/* Google Ads for advertisement section */}
      <section className="py-8 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Sponsored</h3>
          </div>
          <GoogleAds 
            className="max-w-4xl mx-auto" 
            showUpgradePrompt={false}
            publisherId="ca-pub-1234567890123456"
          />
        </div>
      </section>

      {/* Meeting Calculator Preview Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              See Your Meeting Costs in Real-Time
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
              Get instant insights on meeting expenses and optimization opportunities
            </p>
            <Button 
              size="lg" 
              className="bg-blue-600 hover:bg-blue-700"
              onClick={handleStartFreeTrial}
            >
              Start Free Trial
            </Button>
          </div>
          
          {/* Calculator Preview */}
          <div className="max-w-4xl mx-auto">
            <Card className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10 rounded-lg"></div>
              <CardHeader className="relative">
                <CardTitle className="text-center">Meeting Cost Calculator</CardTitle>
                <CardDescription className="text-center">
                  Track costs automatically with our advanced calculator
                </CardDescription>
              </CardHeader>
              <CardContent className="relative">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                  <div>
                    <div className="bg-blue-100 p-4 rounded-lg mb-3">
                      <Clock className="h-8 w-8 text-blue-600 mx-auto" />
                    </div>
                    <h4 className="font-semibold">Real-time Tracking</h4>
                    <p className="text-sm text-gray-600">Monitor costs as meetings progress</p>
                  </div>
                  <div>
                    <div className="bg-green-100 p-4 rounded-lg mb-3">
                      <TrendingUp className="h-8 w-8 text-green-600 mx-auto" />
                    </div>
                    <h4 className="font-semibold">Advanced Analytics</h4>
                    <p className="text-sm text-gray-600">Detailed insights and trends</p>
                  </div>
                  <div>
                    <div className="bg-purple-100 p-4 rounded-lg mb-3">
                      <Users className="h-8 w-8 text-purple-600 mx-auto" />
                    </div>
                    <h4 className="font-semibold">Team Collaboration</h4>
                    <p className="text-sm text-gray-600">Enterprise team management</p>
                  </div>
                </div>
                
                <div className="mt-8 text-center">
                  <Button 
                    size="lg" 
                    className="bg-blue-600 hover:bg-blue-700"
                    onClick={handleStartFreeTrial}
                  >
                    Access Full Calculator
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <FeaturesSection onStartFreeTrial={handleStartFreeTrial} />
      <PricingSection />

      {/* CTA Section */}
      <section className="py-16 bg-blue-600">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Optimize Your Meeting Costs?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of companies saving millions on unproductive meetings
          </p>
          <Button 
            size="lg" 
            className="bg-white text-blue-600 hover:bg-gray-100"
            onClick={handleStartFreeTrial}
          >
            Start Free Trial
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Calculator className="h-6 w-6" />
                <span className="text-xl font-bold">MeetingROI Pro</span>
              </div>
              <p className="text-gray-400">
                The AI-powered meeting cost calculator and optimization platform.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-3">Product</h3>
              <ul className="space-y-2 text-gray-400">
                <li>Features</li>
                <li>Pricing</li>
                <li>API</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-3">Company</h3>
              <ul className="space-y-2 text-gray-400">
                <li>About</li>
                <li>Blog</li>
                <li>Contact</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-3">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li>Help Center</li>
                <li>Documentation</li>
                <li>Status</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 MeetingROI Pro. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
