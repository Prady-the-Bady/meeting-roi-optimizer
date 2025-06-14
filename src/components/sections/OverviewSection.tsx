
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Calculator, 
  TrendingUp, 
  Users, 
  Clock, 
  DollarSign, 
  BarChart3, 
  Zap,
  Crown,
  Star,
  ArrowRight,
  Target,
  Sparkles,
  Eye,
  FileText,
  TrendingDown
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import GoogleAds from "@/components/GoogleAds";

interface OverviewSectionProps {
  onUpgrade: (plan: 'premium' | 'enterprise') => void;
  onManageSubscription: () => void;
  isUpgrading: boolean;
  onNavigate?: (section: string) => void;
}

export function OverviewSection({ onUpgrade, onManageSubscription, isUpgrading, onNavigate }: OverviewSectionProps) {
  const { subscription, user } = useAuth();
  const { toast } = useToast();

  const { data: userMetrics, isLoading } = useQuery({
    queryKey: ['user-metrics', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase.functions.invoke('get-user-metrics');
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const getSubscriptionBadge = () => {
    switch (subscription.tier) {
      case 'premium':
        return <Badge className="bg-blue-100 text-blue-800 border-blue-200"><Crown className="h-3 w-3 mr-1" />Premium</Badge>;
      case 'enterprise':
        return <Badge className="bg-purple-100 text-purple-800 border-purple-200"><Star className="h-3 w-3 mr-1" />Enterprise</Badge>;
      default:
        return <Badge variant="secondary">Free Plan</Badge>;
    }
  };

  const handleCalculatorClick = () => {
    if (onNavigate) {
      onNavigate('calculator');
    }
  };

  const handleAnalyticsClick = () => {
    if (onNavigate) {
      onNavigate('analytics');
    }
  };

  const handleMeetingClick = (meetingName: string) => {
    toast({
      title: "📊 Meeting Details",
      description: `Viewing details for "${meetingName}". This feature will show comprehensive meeting analytics.`,
    });
    
    if (onNavigate) {
      onNavigate('history');
    }
  };

  const handleViewAllMeetings = () => {
    if (onNavigate) {
      onNavigate('history');
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatTime = (hours: number) => {
    return `${Math.round(hours)} hours`;
  };

  const formatChange = (change: number) => {
    const isPositive = change > 0;
    const Icon = isPositive ? TrendingUp : TrendingDown;
    const color = isPositive ? "text-green-600" : "text-red-600";
    
    return (
      <p className={`text-xs ${color} flex items-center mt-1`}>
        <Icon className="h-3 w-3 mr-1" />
        {Math.abs(change).toFixed(1)}% from last month
      </p>
    );
  };

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="animate-pulse bg-gray-200 h-32 rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }

  const metrics = userMetrics?.thisMonth || {
    cost: 0,
    costChange: 0,
    meetings: 0,
    meetingChange: 0,
    totalHours: 0,
    efficiency: 0,
    potentialSavings: 0
  };

  const recentMeetings = userMetrics?.recentMeetings || [];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
            Dashboard Overview
          </h1>
          <p className="text-lg text-gray-600 mt-2">
            Monitor your meeting costs and optimize team efficiency
          </p>
        </div>
        {getSubscriptionBadge()}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-0 shadow-sm bg-gradient-to-r from-blue-50 to-blue-100 hover:shadow-md transition-shadow duration-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-700">This Month</p>
                <p className="text-2xl font-bold text-blue-900">{formatCurrency(metrics.cost)}</p>
                {formatChange(metrics.costChange)}
              </div>
              <div className="h-12 w-12 bg-blue-200 rounded-full flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-blue-700" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm bg-gradient-to-r from-green-50 to-green-100 hover:shadow-md transition-shadow duration-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-700">Meetings</p>
                <p className="text-2xl font-bold text-green-900">{metrics.meetings}</p>
                <p className="text-xs text-green-600 flex items-center mt-1">
                  <Clock className="h-3 w-3 mr-1" />
                  {formatTime(metrics.totalHours)} total
                </p>
              </div>
              <div className="h-12 w-12 bg-green-200 rounded-full flex items-center justify-center">
                <Calculator className="h-6 w-6 text-green-700" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm bg-gradient-to-r from-purple-50 to-purple-100 hover:shadow-md transition-shadow duration-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-700">Efficiency</p>
                <p className="text-2xl font-bold text-purple-900">{metrics.efficiency}%</p>
                <p className="text-xs text-purple-600 flex items-center mt-1">
                  <Target className="h-3 w-3 mr-1" />
                  {metrics.efficiency >= 70 ? 'Above average' : 'Room for improvement'}
                </p>
              </div>
              <div className="h-12 w-12 bg-purple-200 rounded-full flex items-center justify-center">
                <BarChart3 className="h-6 w-6 text-purple-700" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm bg-gradient-to-r from-orange-50 to-orange-100 hover:shadow-md transition-shadow duration-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-700">Savings</p>
                <p className="text-2xl font-bold text-orange-900">{formatCurrency(metrics.potentialSavings)}</p>
                <p className="text-xs text-orange-600 flex items-center mt-1">
                  <Sparkles className="h-3 w-3 mr-1" />
                  Potential this month
                </p>
              </div>
              <div className="h-12 w-12 bg-orange-200 rounded-full flex items-center justify-center">
                <Zap className="h-6 w-6 text-orange-700" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Quick Actions */}
        <Card className="border-0 shadow-lg bg-white hover:shadow-xl transition-shadow duration-300">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center text-xl">
              <Zap className="h-5 w-5 mr-2 text-blue-600" />
              Quick Actions
            </CardTitle>
            <CardDescription>Start tracking or analyze your meetings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button 
              className="w-full justify-start bg-blue-600 hover:bg-blue-700 text-left h-14 text-base shadow-sm"
              onClick={handleCalculatorClick}
            >
              <Calculator className="h-5 w-5 mr-3" />
              <div className="flex flex-col items-start">
                <span>Start Meeting Calculator</span>
                <span className="text-xs opacity-80">Track costs in real-time</span>
              </div>
              <ArrowRight className="h-4 w-4 ml-auto" />
            </Button>
            
            <Button 
              variant="outline" 
              className="w-full justify-start h-14 text-base border-gray-200 hover:bg-gray-50"
              onClick={handleAnalyticsClick}
            >
              <BarChart3 className="h-5 w-5 mr-3" />
              <div className="flex flex-col items-start">
                <span>View Analytics</span>
                <span className="text-xs text-gray-500">Detailed insights and trends</span>
              </div>
              <ArrowRight className="h-4 w-4 ml-auto" />
            </Button>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="border-0 shadow-lg bg-white hover:shadow-xl transition-shadow duration-300">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center justify-between text-xl">
              <div className="flex items-center">
                <Clock className="h-5 w-5 mr-2 text-green-600" />
                Recent Activity
              </div>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={handleViewAllMeetings}
                className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
              >
                View All
                <ArrowRight className="h-3 w-3 ml-1" />
              </Button>
            </CardTitle>
            <CardDescription>Your latest meeting calculations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentMeetings.length > 0 ? (
                recentMeetings.map((meeting) => (
                  <div 
                    key={meeting.id} 
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-blue-50 transition-colors cursor-pointer group"
                    onClick={() => handleMeetingClick(meeting.title)}
                  >
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 group-hover:text-blue-900">{meeting.title}</p>
                      <p className="text-sm text-gray-500">
                        {new Date(meeting.created_at).toLocaleDateString()} • {meeting.participants} participants
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">{formatCurrency(Number(meeting.total_cost))}</p>
                      </div>
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                        <Eye className="h-4 w-4 text-blue-600" />
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Calculator className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>No meetings recorded yet</p>
                  <p className="text-sm">Start your first meeting calculation!</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* AdSense Integration for Free Users */}
      {subscription.tier === 'free' && (
        <GoogleAds
          showUpgradePrompt={true}
          onUpgradeClick={() => onUpgrade('premium')}
          className="my-6"
        />
      )}

      {/* Upgrade Section for Free Users */}
      {subscription.tier === 'free' && (
        <Card className="border-2 border-blue-200 bg-gradient-to-r from-blue-50 to-purple-50 shadow-lg">
          <CardContent className="p-8">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                <Crown className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Unlock Premium Features</h3>
              <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                Get advanced analytics, AI insights, team collaboration tools, and more to maximize your meeting efficiency.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  onClick={() => onUpgrade('premium')}
                  disabled={isUpgrading}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg shadow-md hover:shadow-lg transition-all duration-200"
                  size="lg"
                >
                  {isUpgrading ? 'Processing...' : 'Upgrade to Premium'}
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => onUpgrade('enterprise')}
                  disabled={isUpgrading}
                  className="border-purple-200 text-purple-700 hover:bg-purple-50 px-8 py-3 text-lg"
                  size="lg"
                >
                  View Enterprise
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
