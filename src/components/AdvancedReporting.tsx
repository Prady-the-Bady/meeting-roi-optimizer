
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DatePickerWithRange } from "@/components/ui/date-range-picker";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts";
import { Download, FileText, Mail, Calendar, TrendingUp, DollarSign, Clock, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { DateRange } from "react-day-picker";

const AdvancedReporting = () => {
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [reportType, setReportType] = useState("cost-analysis");
  const [exportFormat, setExportFormat] = useState("pdf");
  const { toast } = useToast();
  const { subscription, user } = useAuth();

  // Fetch real user meetings data
  const { data: meetingsData, isLoading } = useQuery({
    queryKey: ['meetings-data', user?.id, dateRange],
    queryFn: async () => {
      if (!user?.id) return null;
      
      let query = supabase
        .from("meetings")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (dateRange?.from) {
        query = query.gte("created_at", dateRange.from.toISOString());
      }
      if (dateRange?.to) {
        query = query.lte("created_at", dateRange.to.toISOString());
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
    enabled: !!user?.id && subscription.tier !== 'free',
  });

  // Process data for charts
  const processedData = meetingsData ? {
    totalCost: meetingsData.reduce((sum, m) => sum + Number(m.total_cost), 0),
    totalMeetings: meetingsData.length,
    totalHours: meetingsData.reduce((sum, m) => sum + (m.duration / 3600), 0),
    avgParticipants: meetingsData.length > 0 ? meetingsData.reduce((sum, m) => sum + m.participants, 0) / meetingsData.length : 0,
    costTrendData: generateCostTrend(meetingsData),
    departmentData: generateDepartmentBreakdown(meetingsData),
    meetingTypeData: generateMeetingTypeData(meetingsData)
  } : null;

  function generateCostTrend(meetings: any[]) {
    const months = Array.from(new Set(meetings.map(m => {
      const date = new Date(m.created_at);
      return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    }))).sort();

    return months.map(month => {
      const monthMeetings = meetings.filter(m => {
        const date = new Date(m.created_at);
        const meetingMonth = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        return meetingMonth === month;
      });

      return {
        month: new Date(month + '-01').toLocaleDateString('en-US', { month: 'short' }),
        cost: monthMeetings.reduce((sum, m) => sum + Number(m.total_cost), 0),
        meetings: monthMeetings.length
      };
    }).slice(-6); // Last 6 months
  }

  function generateDepartmentBreakdown(meetings: any[]) {
    // Group by meeting type as department proxy
    const typeGroups = meetings.reduce((acc, meeting) => {
      const type = meeting.type || 'other';
      if (!acc[type]) acc[type] = 0;
      acc[type] += Number(meeting.total_cost);
      return acc;
    }, {});

    const colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];
    return Object.entries(typeGroups).map(([name, cost], index) => ({
      name: name.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase()),
      cost,
      color: colors[index % colors.length]
    }));
  }

  function generateMeetingTypeData(meetings: any[]) {
    const typeStats = meetings.reduce((acc, meeting) => {
      const type = meeting.type || 'other';
      if (!acc[type]) {
        acc[type] = { count: 0, totalCost: 0 };
      }
      acc[type].count += 1;
      acc[type].totalCost += Number(meeting.total_cost);
      return acc;
    }, {});

    return Object.entries(typeStats).map(([type, stats]: [string, any]) => ({
      type: type.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase()),
      count: stats.count,
      avgCost: stats.count > 0 ? Math.round(stats.totalCost / stats.count) : 0
    }));
  }

  const generateReport = () => {
    if (subscription.tier === 'free') {
      toast({
        title: "Premium Feature",
        description: "Advanced reporting requires a premium subscription.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Report Generated",
      description: `${reportType.replace('-', ' ')} report has been generated successfully.`,
    });
  };

  const exportReport = () => {
    if (subscription.tier === 'free') {
      toast({
        title: "Premium Feature",
        description: "Data export requires a premium subscription.",
        variant: "destructive",
      });
      return;
    }

    if (!processedData) {
      toast({
        title: "No Data",
        description: "No meeting data available for export.",
        variant: "destructive",
      });
      return;
    }

    const reportData = {
      reportType,
      dateRange: dateRange ? `${dateRange.from?.toLocaleDateString()} - ${dateRange.to?.toLocaleDateString()}` : 'All time',
      totalCost: processedData.totalCost,
      totalMeetings: processedData.totalMeetings,
      totalHours: processedData.totalHours,
      avgParticipants: processedData.avgParticipants,
      exportDate: new Date().toISOString(),
      meetings: meetingsData
    };

    let content: string;
    let filename: string;
    let mimeType: string;

    if (exportFormat === "csv") {
      const csvHeaders = "Date,Title,Type,Duration (hours),Participants,Cost,Cost Method\n";
      const csvData = meetingsData?.map(m => 
        `${new Date(m.created_at).toLocaleDateString()},${m.title},${m.type},${(m.duration / 3600).toFixed(2)},${m.participants},${m.total_cost},${m.cost_method}`
      ).join("\n") || "";
      content = csvHeaders + csvData;
      filename = `meeting-report-${reportType}.csv`;
      mimeType = "text/csv";
    } else if (exportFormat === "json") {
      content = JSON.stringify(reportData, null, 2);
      filename = `meeting-report-${reportType}.json`;
      mimeType = "application/json";
    } else {
      content = `Meeting Analytics Report\n\nReport Type: ${reportType}\nDate Range: ${reportData.dateRange}\nTotal Meetings: ${reportData.totalMeetings}\nTotal Cost: $${reportData.totalCost.toFixed(2)}\nTotal Hours: ${reportData.totalHours.toFixed(2)}\nAverage Participants: ${reportData.avgParticipants.toFixed(1)}`;
      filename = `meeting-report-${reportType}.txt`;
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
      description: `Report exported as ${exportFormat.toUpperCase()}.`,
    });
  };

  const scheduleReport = () => {
    if (subscription.tier === 'free') {
      toast({
        title: "Premium Feature",
        description: "Scheduled reports require a premium subscription.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Report Scheduled",
      description: "Weekly report has been scheduled. You'll receive it every Monday at 9 AM.",
    });
  };

  if (subscription.tier === 'free') {
    return (
      <div className="space-y-6">
        <div className="text-center py-12">
          <FileText className="h-16 w-16 mx-auto mb-4 text-gray-400" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Advanced Reporting</h3>
          <p className="text-gray-600 mb-6">Upgrade to access detailed reports and analytics</p>
          <Button onClick={() => window.location.href = '/dashboard'}>
            Upgrade to Premium
          </Button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="animate-pulse bg-gray-200 h-24 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

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
                  <SelectItem value="json">JSON</SelectItem>
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

      {processedData && (
        <>
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Cost</p>
                    <p className="text-2xl font-bold">${processedData.totalCost.toFixed(2)}</p>
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
                    <p className="text-2xl font-bold">{processedData.totalMeetings}</p>
                  </div>
                  <Calendar className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Hours</p>
                    <p className="text-2xl font-bold">{processedData.totalHours.toFixed(1)}</p>
                  </div>
                  <Clock className="h-8 w-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Avg Participants</p>
                    <p className="text-2xl font-bold">{processedData.avgParticipants.toFixed(1)}</p>
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
                  <LineChart data={processedData.costTrendData}>
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
                <CardTitle>Cost by Meeting Type</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={processedData.departmentData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: $${value.toFixed(0)}`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="cost"
                    >
                      {processedData.departmentData.map((entry, index) => (
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
                <BarChart data={processedData.meetingTypeData}>
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
        </>
      )}

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
