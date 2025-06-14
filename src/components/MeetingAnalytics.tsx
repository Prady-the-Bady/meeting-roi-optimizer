
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from "recharts";
import { TrendingUp, TrendingDown, Clock, DollarSign } from "lucide-react";

interface MeetingAnalyticsProps {
  duration: number;
  totalCost: number;
  participants: number;
  meetingType: string;
}

const MeetingAnalytics = ({ duration, totalCost, participants, meetingType }: MeetingAnalyticsProps) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    return `${minutes} min`;
  };

  // Mock data for demonstration
  const costBreakdown = [
    { name: 'Personnel', value: totalCost * 0.8, color: '#3B82F6' },
    { name: 'Overhead', value: totalCost * 0.15, color: '#10B981' },
    { name: 'Resources', value: totalCost * 0.05, color: '#F59E0B' },
  ];

  const timeDistribution = [
    { name: 'Discussion', minutes: Math.floor(duration / 60) * 0.4 },
    { name: 'Planning', minutes: Math.floor(duration / 60) * 0.3 },
    { name: 'Decision Making', minutes: Math.floor(duration / 60) * 0.2 },
    { name: 'Other', minutes: Math.floor(duration / 60) * 0.1 },
  ];

  const efficiencyTrend = [
    { time: '0min', efficiency: 100 },
    { time: '15min', efficiency: 95 },
    { time: '30min', efficiency: 88 },
    { time: '45min', efficiency: 82 },
    { time: '60min', efficiency: 75 },
    { time: '75min', efficiency: 68 },
    { time: '90min', efficiency: 60 },
  ];

  const costPerMinute = duration > 0 ? totalCost / (duration / 60) : 0;
  const averageEfficiency = duration > 0 ? Math.max(100 - Math.floor(totalCost / 10), 10) : 100;

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Cost/Minute</p>
                <p className="text-2xl font-bold">{formatCurrency(costPerMinute)}</p>
              </div>
              <DollarSign className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Efficiency Score</p>
                <p className="text-2xl font-bold text-green-600">{averageEfficiency}%</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Cost/Person</p>
                <p className="text-2xl font-bold">{formatCurrency(totalCost / Math.max(participants, 1))}</p>
              </div>
              <DollarSign className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Duration</p>
                <p className="text-2xl font-bold">{formatTime(duration)}</p>
              </div>
              <Clock className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Cost Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Cost Breakdown</CardTitle>
            <CardDescription>Distribution of meeting costs</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={costBreakdown}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {costBreakdown.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => formatCurrency(Number(value))} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Time Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Time Distribution</CardTitle>
            <CardDescription>How meeting time is typically allocated</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={timeDistribution}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value) => [`${value} min`, "Time"]} />
                <Bar dataKey="minutes" fill="#3B82F6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Efficiency Trend */}
      <Card>
        <CardHeader>
          <CardTitle>Meeting Efficiency Over Time</CardTitle>
          <CardDescription>Typical efficiency decline in extended meetings</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={efficiencyTrend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip formatter={(value) => [`${value}%`, "Efficiency"]} />
              <Line type="monotone" dataKey="efficiency" stroke="#10B981" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Insights */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-blue-900">Meeting Insights</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="space-y-2">
              <h4 className="font-semibold text-blue-900">Cost Analysis</h4>
              <ul className="space-y-1 text-blue-800">
                <li>• Current cost rate: {formatCurrency(costPerMinute)}/minute</li>
                <li>• {participants} participants at {formatCurrency(totalCost / Math.max(participants, 1))} each</li>
                <li>• Meeting type: {meetingType.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold text-blue-900">Optimization Opportunities</h4>
              <ul className="space-y-1 text-blue-800">
                {duration > 1800 && <li>• Consider shorter 30-minute focused sessions</li>}
                {participants > 6 && <li>• Evaluate if all attendees are necessary</li>}
                {totalCost > 300 && <li>• High-value meeting - ensure clear agenda</li>}
                <li>• Current efficiency score: {averageEfficiency}%</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MeetingAnalytics;
