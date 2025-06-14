
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, DollarSign, Clock, Users, Download, Filter, Crown } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

interface AnalyticsSectionProps {
  onUpgrade: (plan: 'premium' | 'enterprise') => void;
  isUpgrading: boolean;
}

const AnalyticsSection = ({ onUpgrade, isUpgrading }: AnalyticsSectionProps) => {
  const { subscription } = useAuth();
  const { toast } = useToast();
  const [timeRange, setTimeRange] = useState("30");
  const [exportFormat, setExportFormat] = useState("csv");
  
  const isPremium = subscription.tier === 'premium' || subscription.tier === 'enterprise';

  const handleExportData = () => {
    if (!isPremium) {
      toast({
        title: "Premium Feature",
        description: "Data export requires a premium subscription.",
        variant: "destructive",
      });
      return;
    }

    const data = {
      timeRange: `${timeRange} days`,
      totalMeetings: 147,
      totalCost: 15420,
      averageCost: 105,
      exportDate: new Date().toISOString(),
      meetings: [
        { date: "2024-01-01", cost: 120, duration: 60, participants: 4 },
        { date: "2024-01-02", cost: 90, duration: 45, participants: 3 },
        // Add more sample data
      ]
    };

    let content: string;
    let filename: string;
    let mimeType: string;

    if (exportFormat === "csv") {
      content = "Date,Cost,Duration,Participants\n" + 
                data.meetings.map(m => `${m.date},${m.cost},${m.duration},${m.participants}`).join("\n");
      filename = "meeting-analytics.csv";
      mimeType = "text/csv";
    } else if (exportFormat === "json") {
      content = JSON.stringify(data, null, 2);
      filename = "meeting-analytics.json";
      mimeType = "application/json";
    } else {
      // PDF would require a library, for now we'll export as text
      content = `Meeting Analytics Report\n\nTime Range: ${data.timeRange}\nTotal Meetings: ${data.totalMeetings}\nTotal Cost: $${data.totalCost}\nAverage Cost: $${data.averageCost}`;
      filename = "meeting-analytics.txt";
      mimeType = "text/plain";
    }

    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Export Complete",
      description: `Analytics data exported as ${exportFormat.toUpperCase()}.`,
    });
  };

  const handleRefreshData = () => {
    toast({
      title: "Refreshing Data",
      description: "Updating analytics with latest meeting information...",
    });
    
    // Simulate data refresh
    setTimeout(() => {
      toast({
        title: "Data Refreshed",
        description: "Analytics have been updated with the latest data.",
      });
    }, 1500);
  };

  const handleGenerateReport = () => {
    if (!isPremium) {
      toast({
        title: "Premium Feature",
        description: "Custom reports require a premium subscription.",
        variant: "destructive",
      });
      return;
    }
    
    toast({
      title: "Generating Report",
      description: "Creating your custom analytics report...",
    });
    
    setTimeout(() => {
      toast({
        title: "Report Ready",
        description: "Your custom analytics report has been generated.",
      });
    }, 2000);
  };

  // Sample data
  const costTrendData = [
    { month: 'Jan', cost: 12400, meetings: 45 },
    { month: 'Feb', cost: 13200, meetings: 52 },
    { month: 'Mar', cost: 14800, meetings: 48 },
    { month: 'Apr', cost: 15420, meetings: 55 },
    { month: 'May', cost: 13900, meetings: 43 },
    { month: 'Jun', cost: 16200, meetings: 58 }
  ];

  const departmentData = [
    { name: 'Engineering', cost: 5200, color: '#3B82F6' },
    { name: 'Sales', cost: 3800, color: '#10B981' },
    { name: 'Marketing', cost: 2900, color: '#F59E0B' },
    { name: 'HR', cost: 1800, color: '#EF4444' },
    { name: 'Operations', cost: 1720, color: '#8B5CF6' }
  ];

  const meetingTypeData = [
    { type: 'Daily Standup', count: 85, avgCost: 45 },
    { type: 'Project Review', count: 32, avgCost: 180 },
    { type: 'Client Meeting', count: 18, avgCost: 320 },
    { type: 'All Hands', count: 8, avgCost: 850 },
    { type: 'Training', count: 12, avgCost: 220 }
  ];

  if (!isPremium) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 gradient-text">Advanced Analytics</h1>
            <p className="text-gray-600 mt-2">Detailed insights and reporting capabilities</p>
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
                <TrendingUp className="h-8 w-8 text-yellow-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Unlock Advanced Analytics
              </h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                Get detailed insights, custom reports, and advanced data visualization tools
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
          <h1 className="text-3xl font-bold text-gray-900 gradient-text">Advanced Analytics</h1>
          <p className="text-gray-600 mt-2">Comprehensive meeting cost analysis and insights</p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={handleRefreshData}
            className="border-blue-200 text-blue-700 hover:bg-blue-50"
          >
            <TrendingUp className="h-4 w-4 mr-2" />
            Refresh Data
          </Button>
          <Button 
            onClick={handleGenerateReport}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
          >
            Generate Report
          </Button>
        </div>
      </div>

      {/* Controls */}
      <Card className="shadow-sm border-blue-100">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4 items-end">
            <div className="flex-1">
              <label className="text-sm font-medium text-gray-700 mb-2 block">Time Range</label>
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Select time range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7">Last 7 days</SelectItem>
                  <SelectItem value="30">Last 30 days</SelectItem>
                  <SelectItem value="90">Last 90 days</SelectItem>
                  <SelectItem value="365">Last year</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1">
              <label className="text-sm font-medium text-gray-700 mb-2 block">Export Format</label>
              <Select value={exportFormat} onValueChange={setExportFormat}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Select format" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="csv">CSV</SelectItem>
                  <SelectItem value="json">JSON</SelectItem>
                  <SelectItem value="pdf">PDF</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button 
              onClick={handleExportData}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              <Download className="h-4 w-4 mr-2" />
              Export Data
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">Total Cost</p>
                <p className="text-2xl font-bold text-blue-900">$15,420</p>
                <p className="text-xs text-blue-600">+12% from last month</p>
              </div>
              <DollarSign className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600">Total Meetings</p>
                <p className="text-2xl font-bold text-green-900">147</p>
                <p className="text-xs text-green-600">+8% from last month</p>
              </div>
              <Users className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600">Average Cost</p>
                <p className="text-2xl font-bold text-purple-900">$105</p>
                <p className="text-xs text-purple-600">-3% from last month</p>
              </div>
              <TrendingUp className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-600">Total Hours</p>
                <p className="text-2xl font-bold text-orange-900">183</p>
                <p className="text-xs text-orange-600">+5% from last month</p>
              </div>
              <Clock className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Cost Trend Over Time</CardTitle>
            <CardDescription>Monthly meeting costs and frequency</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={costTrendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" stroke="#666" />
                <YAxis stroke="#666" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }} 
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="cost" 
                  stroke="#3B82F6" 
                  strokeWidth={3}
                  dot={{ fill: '#3B82F6', strokeWidth: 2, r: 6 }}
                  name="Cost ($)"
                />
                <Line 
                  type="monotone" 
                  dataKey="meetings" 
                  stroke="#10B981" 
                  strokeWidth={3}
                  dot={{ fill: '#10B981', strokeWidth: 2, r: 6 }}
                  name="Meetings"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Cost by Department</CardTitle>
            <CardDescription>Meeting costs breakdown by department</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={departmentData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="cost"
                >
                  {departmentData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value) => [`$${value}`, 'Cost']}
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }} 
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Meeting Types Analysis</CardTitle>
          <CardDescription>Cost and frequency breakdown by meeting type</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={meetingTypeData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="type" stroke="#666" />
              <YAxis stroke="#666" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }} 
              />
              <Legend />
              <Bar dataKey="count" fill="#3B82F6" name="Count" radius={[4, 4, 0, 0]} />
              <Bar dataKey="avgCost" fill="#10B981" name="Avg Cost ($)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default AnalyticsSection;
