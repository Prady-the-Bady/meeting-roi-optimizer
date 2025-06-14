
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DatePickerWithRange } from "@/components/ui/date-range-picker";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts";
import { Download, FileText, Mail, Calendar, TrendingUp, DollarSign, Clock, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { DateRange } from "react-day-picker";

const AdvancedReporting = () => {
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [reportType, setReportType] = useState("cost-analysis");
  const [exportFormat, setExportFormat] = useState("pdf");
  const { toast } = useToast();

  // Mock data for demonstration
  const costTrendData = [
    { month: 'Jan', cost: 2400, meetings: 12 },
    { month: 'Feb', cost: 1398, meetings: 8 },
    { month: 'Mar', cost: 9800, meetings: 24 },
    { month: 'Apr', cost: 3908, meetings: 18 },
    { month: 'May', cost: 4800, meetings: 22 },
    { month: 'Jun', cost: 3800, meetings: 16 },
  ];

  const departmentData = [
    { name: 'Engineering', cost: 15400, color: '#3B82F6' },
    { name: 'Marketing', cost: 8200, color: '#10B981' },
    { name: 'Sales', cost: 12300, color: '#F59E0B' },
    { name: 'HR', cost: 4500, color: '#EF4444' },
    { name: 'Operations', cost: 6800, color: '#8B5CF6' },
  ];

  const meetingTypeData = [
    { type: 'Team Standup', count: 45, avgCost: 120 },
    { type: 'Project Review', count: 23, avgCost: 340 },
    { type: 'Client Meeting', count: 18, avgCost: 580 },
    { type: 'Brainstorming', count: 32, avgCost: 280 },
    { type: 'Training', count: 12, avgCost: 450 },
  ];

  const generateReport = () => {
    toast({
      title: "Report Generated",
      description: `${reportType.replace('-', ' ')} report has been generated successfully.`,
    });
  };

  const exportReport = () => {
    toast({
      title: "Export Started",
      description: `Exporting report as ${exportFormat.toUpperCase()}. You'll receive an email when it's ready.`,
    });
  };

  const scheduleReport = () => {
    toast({
      title: "Report Scheduled",
      description: "Weekly report has been scheduled. You'll receive it every Monday at 9 AM.",
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Advanced Reporting</h2>
        <p className="text-gray-600">Generate detailed reports and insights about your meeting costs.</p>
      </div>

      {/* Report Configuration */}
      <Card>
        <CardHeader>
          <CardTitle>Report Configuration</CardTitle>
          <CardDescription>Configure your report parameters</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Date Range</label>
              <DatePickerWithRange date={dateRange} setDate={setDateRange} />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Report Type</label>
              <Select value={reportType} onValueChange={setReportType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cost-analysis">Cost Analysis</SelectItem>
                  <SelectItem value="efficiency-report">Efficiency Report</SelectItem>
                  <SelectItem value="department-breakdown">Department Breakdown</SelectItem>
                  <SelectItem value="meeting-trends">Meeting Trends</SelectItem>
                  <SelectItem value="roi-analysis">ROI Analysis</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Export Format</label>
              <Select value={exportFormat} onValueChange={setExportFormat}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pdf">PDF</SelectItem>
                  <SelectItem value="excel">Excel</SelectItem>
                  <SelectItem value="csv">CSV</SelectItem>
                  <SelectItem value="powerpoint">PowerPoint</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-end">
              <Button onClick={generateReport} className="w-full">
                <FileText className="h-4 w-4 mr-2" />
                Generate Report
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Cost (6M)</p>
                <p className="text-2xl font-bold">$47,200</p>
                <p className="text-sm text-green-600">↑ 12% vs last period</p>
              </div>
              <DollarSign className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Meetings</p>
                <p className="text-2xl font-bold">248</p>
                <p className="text-sm text-red-600">↓ 5% vs last period</p>
              </div>
              <Calendar className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Avg Duration</p>
                <p className="text-2xl font-bold">42min</p>
                <p className="text-sm text-green-600">↓ 3min vs last period</p>
              </div>
              <Clock className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Participants</p>
                <p className="text-2xl font-bold">6.2</p>
                <p className="text-sm text-gray-600">avg per meeting</p>
              </div>
              <Users className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Cost Trend */}
        <Card>
          <CardHeader>
            <CardTitle>Cost Trend Over Time</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={costTrendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value, name) => [
                  name === 'cost' ? `$${value}` : value,
                  name === 'cost' ? 'Cost' : 'Meetings'
                ]} />
                <Line type="monotone" dataKey="cost" stroke="#3B82F6" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Department Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Cost by Department</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={departmentData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: $${value}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="cost"
                >
                  {departmentData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`$${value}`, "Cost"]} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Meeting Types Analysis */}
      <Card>
        <CardHeader>
          <CardTitle>Meeting Types Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={meetingTypeData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="type" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Bar yAxisId="left" dataKey="count" fill="#3B82F6" name="Count" />
              <Bar yAxisId="right" dataKey="avgCost" fill="#10B981" name="Avg Cost" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Export Options */}
      <Card>
        <CardHeader>
          <CardTitle>Export & Scheduling</CardTitle>
          <CardDescription>Export reports or schedule automatic delivery</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <Button onClick={exportReport} variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export Report
            </Button>
            
            <Button onClick={scheduleReport} variant="outline">
              <Mail className="h-4 w-4 mr-2" />
              Schedule Weekly
            </Button>
            
            <Button variant="outline">
              <TrendingUp className="h-4 w-4 mr-2" />
              Create Dashboard
            </Button>
            
            <Button variant="outline">
              <FileText className="h-4 w-4 mr-2" />
              Executive Summary
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdvancedReporting;
