
import { Button } from "@/components/ui/button";
import { TrendingUp, Users, Clock } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="py-20 px-4">
      <div className="container mx-auto text-center">
        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
          Stop Wasting Money on
          <span className="text-blue-600"> Unproductive Meetings</span>
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
          Calculate real-time meeting costs, track productivity metrics, and get AI-powered 
          suggestions to optimize your meeting efficiency. Save your company from the 
          $37 billion lost annually on ineffective meetings.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Button size="lg" className="bg-blue-600 hover:bg-blue-700 px-8">
            Start Free Trial
          </Button>
          <Button size="lg" variant="outline" className="px-8">
            Watch Demo
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="text-center">
            <div className="bg-blue-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <TrendingUp className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900">$37B</h3>
            <p className="text-gray-600">Lost annually on unproductive meetings</p>
          </div>
          <div className="text-center">
            <div className="bg-blue-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <Clock className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900">23 Hours</h3>
            <p className="text-gray-600">Average weekly meeting time per employee</p>
          </div>
          <div className="text-center">
            <div className="bg-blue-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <Users className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900">67%</h3>
            <p className="text-gray-600">Of meetings are considered unnecessary</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
