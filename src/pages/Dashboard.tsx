
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calculator, LogOut, Crown, Users, Zap } from "lucide-react";
import MeetingCalculator from "@/components/MeetingCalculator";
import { useEffect } from "react";

const Dashboard = () => {
  const { user, subscription, signOut, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Calculator className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const getSubscriptionBadge = () => {
    switch (subscription.tier) {
      case 'enterprise':
        return <Badge className="bg-purple-100 text-purple-800"><Crown className="h-3 w-3 mr-1" />Enterprise</Badge>;
      case 'premium':
        return <Badge className="bg-blue-100 text-blue-800"><Zap className="h-3 w-3 mr-1" />Premium</Badge>;
      default:
        return <Badge variant="outline">Free</Badge>;
    }
  };

  const hasAccess = (feature: string) => {
    switch (feature) {
      case 'team':
        return subscription.tier === 'enterprise';
      case 'ai':
      case 'analytics':
        return subscription.tier === 'premium' || subscription.tier === 'enterprise';
      case 'calculator':
      case 'calendar':
        return true;
      default:
        return false;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Calculator className="h-8 w-8 text-blue-600" />
              <span className="text-2xl font-bold text-gray-900">MeetingROI Pro</span>
            </div>
            {getSubscriptionBadge()}
          </div>
          
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">Welcome, {user.email}</span>
            <Button variant="outline" onClick={signOut}>
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Google Ads placeholder for free users */}
        {subscription.tier === 'free' && (
          <div className="mb-8">
            <Card className="bg-yellow-50 border-yellow-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="bg-yellow-100 p-2 rounded-lg">
                      <Zap className="h-5 w-5 text-yellow-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-yellow-900">Advertisement</h4>
                      <p className="text-sm text-yellow-700">
                        [Google Ads Placeholder - Upgrade to Premium to remove ads]
                      </p>
                    </div>
                  </div>
                  <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                    Upgrade Now
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Feature Access Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card className={!hasAccess('analytics') ? 'opacity-60' : ''}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Analytics</span>
                {!hasAccess('analytics') && <Badge variant="outline">Premium</Badge>}
              </CardTitle>
              <CardDescription>
                Advanced meeting cost analytics and insights
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                className="w-full" 
                disabled={!hasAccess('analytics')}
                variant={hasAccess('analytics') ? 'default' : 'outline'}
              >
                {hasAccess('analytics') ? 'View Analytics' : 'Upgrade Required'}
              </Button>
            </CardContent>
          </Card>

          <Card className={!hasAccess('ai') ? 'opacity-60' : ''}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>AI Insights</span>
                {!hasAccess('ai') && <Badge variant="outline">Premium</Badge>}
              </CardTitle>
              <CardDescription>
                AI-powered meeting optimization recommendations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                className="w-full" 
                disabled={!hasAccess('ai')}
                variant={hasAccess('ai') ? 'default' : 'outline'}
              >
                {hasAccess('ai') ? 'View Insights' : 'Upgrade Required'}
              </Button>
            </CardContent>
          </Card>

          <Card className={!hasAccess('team') ? 'opacity-60' : ''}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Team Management</span>
                {!hasAccess('team') && <Badge variant="outline">Enterprise</Badge>}
              </CardTitle>
              <CardDescription>
                Manage team members and collaboration
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                className="w-full" 
                disabled={!hasAccess('team')}
                variant={hasAccess('team') ? 'default' : 'outline'}
              >
                <Users className="h-4 w-4 mr-2" />
                {hasAccess('team') ? 'Manage Team' : 'Enterprise Only'}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Main Calculator */}
        <MeetingCalculator />
      </div>
    </div>
  );
};

export default Dashboard;
