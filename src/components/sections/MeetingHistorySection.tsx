
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { History, Search, Filter, Download, Calendar, Users, DollarSign, Clock, Crown } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

interface MeetingHistorySectionProps {
  onUpgrade: (plan: 'premium' | 'enterprise') => void;
  isUpgrading: boolean;
}

const MeetingHistorySection = ({ onUpgrade, isUpgrading }: MeetingHistorySectionProps) => {
  const { subscription } = useAuth();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [sortBy, setSortBy] = useState("date");
  
  const isPremium = subscription.tier === 'premium' || subscription.tier === 'enterprise';

  const handleExportHistory = () => {
    if (!isPremium) {
      toast({
        title: "Premium Feature",
        description: "Meeting history export requires a premium subscription.",
        variant: "destructive",
      });
      return;
    }

    const historyData = meetings.map(meeting => ({
      title: meeting.title,
      date: meeting.date,
      duration: meeting.duration,
      participants: meeting.participants,
      cost: meeting.cost,
      status: meeting.status
    }));

    const csvContent = [
      "Title,Date,Duration,Participants,Cost,Status",
      ...historyData.map(m => `"${m.title}","${m.date}","${m.duration}","${m.participants}","$${m.cost}","${m.status}"`)
    ].join("\n");

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'meeting-history.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "History Exported",
      description: "Meeting history has been exported to CSV.",
    });
  };

  const handleViewDetails = (meetingId: number) => {
    toast({
      title: "Meeting Details",
      description: `Viewing details for meeting #${meetingId}`,
    });
  };

  const handleArchiveMeeting = (meetingTitle: string) => {
    if (!isPremium) {
      toast({
        title: "Premium Feature",
        description: "Meeting archiving requires a premium subscription.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Meeting Archived",
      description: `"${meetingTitle}" has been archived.`,
    });
  };

  // Sample meeting history data
  const meetings = [
    {
      id: 1,
      title: "Weekly Team Standup",
      date: "2024-01-15",
      duration: "30 min",
      participants: 8,
      cost: 120,
      status: "completed",
      type: "recurring"
    },
    {
      id: 2,
      title: "Project Kickoff Meeting",
      date: "2024-01-14",
      duration: "90 min",
      participants: 12,
      cost: 540,
      status: "completed",
      type: "one-time"
    },
    {
      id: 3,
      title: "Client Presentation",
      date: "2024-01-12",
      duration: "60 min",
      participants: 6,
      cost: 360,
      status: "completed",
      type: "client"
    },
    {
      id: 4,
      title: "Budget Review",
      date: "2024-01-10",
      duration: "45 min",
      participants: 5,
      cost: 225,
      status: "completed",
      type: "internal"
    },
    {
      id: 5,
      title: "Product Planning",
      date: "2024-01-08",
      duration: "120 min",
      participants: 10,
      cost: 600,
      status: "cancelled",
      type: "planning"
    }
  ];

  const filteredMeetings = meetings.filter(meeting => {
    const matchesSearch = meeting.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === "all" || meeting.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const sortedMeetings = [...filteredMeetings].sort((a, b) => {
    switch (sortBy) {
      case "date":
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      case "cost":
        return b.cost - a.cost;
      case "duration":
        return parseInt(b.duration) - parseInt(a.duration);
      case "participants":
        return b.participants - a.participants;
      default:
        return 0;
    }
  });

  if (!isPremium) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 gradient-text">Meeting History</h1>
            <p className="text-gray-600 mt-2">View and analyze your past meetings</p>
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
                <History className="h-8 w-8 text-yellow-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Unlock Meeting History
              </h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                Access detailed meeting history, search and filter past meetings, and export data for analysis
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
          <h1 className="text-3xl font-bold text-gray-900 gradient-text">Meeting History</h1>
          <p className="text-gray-600 mt-2">Track and analyze your meeting patterns</p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={handleExportHistory}
            className="border-blue-200 text-blue-700 hover:bg-blue-50"
          >
            <Download className="h-4 w-4 mr-2" />
            Export History
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <Card className="shadow-sm border-blue-100">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search meetings..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="w-full sm:w-48">
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger>
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Meetings</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="w-full sm:w-48">
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger>
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="date">Date</SelectItem>
                  <SelectItem value="cost">Cost</SelectItem>
                  <SelectItem value="duration">Duration</SelectItem>
                  <SelectItem value="participants">Participants</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">Total Meetings</p>
                <p className="text-2xl font-bold text-blue-900">{meetings.length}</p>
              </div>
              <Calendar className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600">Total Cost</p>
                <p className="text-2xl font-bold text-green-900">${meetings.reduce((sum, m) => sum + m.cost, 0)}</p>
              </div>
              <DollarSign className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600">Avg Participants</p>
                <p className="text-2xl font-bold text-purple-900">
                  {Math.round(meetings.reduce((sum, m) => sum + m.participants, 0) / meetings.length)}
                </p>
              </div>
              <Users className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-600">Avg Duration</p>
                <p className="text-2xl font-bold text-orange-900">
                  {Math.round(meetings.reduce((sum, m) => sum + parseInt(m.duration), 0) / meetings.length)} min
                </p>
              </div>
              <Clock className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Meeting History Table */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center">
            <History className="h-5 w-5 mr-2" />
            Meeting History ({filteredMeetings.length} results)
          </CardTitle>
          <CardDescription>
            Detailed view of your past meetings
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {sortedMeetings.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No meetings found matching your criteria.
              </div>
            ) : (
              sortedMeetings.map((meeting) => (
                <div key={meeting.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h4 className="font-semibold text-gray-900">{meeting.title}</h4>
                      <Badge 
                        variant={meeting.status === 'completed' ? 'default' : 'destructive'}
                        className={meeting.status === 'completed' ? 'bg-green-100 text-green-800' : ''}
                      >
                        {meeting.status}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {meeting.type}
                      </Badge>
                    </div>
                    <div className="flex items-center space-x-6 text-sm text-gray-600">
                      <span className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        {new Date(meeting.date).toLocaleDateString()}
                      </span>
                      <span className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        {meeting.duration}
                      </span>
                      <span className="flex items-center">
                        <Users className="h-4 w-4 mr-1" />
                        {meeting.participants} people
                      </span>
                      <span className="flex items-center">
                        <DollarSign className="h-4 w-4 mr-1" />
                        ${meeting.cost}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleViewDetails(meeting.id)}
                    >
                      View Details
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleArchiveMeeting(meeting.title)}
                      className="text-gray-600 hover:text-gray-700"
                    >
                      Archive
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MeetingHistorySection;
