
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calculator, TrendingUp, Users, Clock, CheckCircle, Star } from "lucide-react";
import MeetingCalculator from "@/components/MeetingCalculator";
import HeroSection from "@/components/HeroSection";
import FeaturesSection from "@/components/FeaturesSection";
import PricingSection from "@/components/PricingSection";

const Index = () => {
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
            <Button variant="ghost">Login</Button>
            <Button className="bg-blue-600 hover:bg-blue-700">Get Started Free</Button>
          </div>
        </div>
      </nav>

      <HeroSection />
      
      {/* Meeting Calculator Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Calculate Your Meeting Costs in Real-Time
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              See exactly how much your meetings cost and get instant insights on optimization
            </p>
          </div>
          <MeetingCalculator />
        </div>
      </section>

      <FeaturesSection />
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
          <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
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
