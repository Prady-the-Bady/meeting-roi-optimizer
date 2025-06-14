
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, Clock, Users, DollarSign, Search, Filter, Download, TrendingUp } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";

interface Meeting {
  id: string;
  title: string;
  date: string;
  duration: number;
  participants: number;
  cost: number;
  type: 'internal' | 'client' | 'vendor' | 'team';
  status: 'completed' | 'scheduled' | 'cancelled';
}

interface MeetingHistorySectionProps {
  onUpgrade: (plan: 'premium' | 'enterprise') => void;
  isUpgrading: boolean;
}

export function MeetingHistorySection({ onUpgrade, isUpgrading }: MeetingHistorySectionProps) {
  const { subscription } = useAuth();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [sortBy, setSortBy] = useState("date");

  // Mock data - in real app this would come from API
  const [meetings] = useState<Meeting[]>([
    {
      id: '1',
      title: 'Quarterly Planning Meeting',
      date: '2024-06-10',
      duration: 120,
      participants: 8,
      cost: 1200,
      type: 'internal',
      status: 'completed'
    },
    {
      id: '2',
      title: 'Client Presentation - Project Alpha',
      date: '2024-06-08',
      duration: 60,
      participants: 5,
      cost: 450,
      type: 'client',
      status: 'completed'
    },
    {
      id: '3',
      title: 'Team Standup',
      date: '2024-06-07',
      duration: 30,
      participants: 6,
      cost: 180,
      type: 'team',
      status: 'completed'
    },
    {
      id: '4',
      title: 'Vendor Contract Review',
      date: '2024-06-05',
      duration: 90,
      participants: 4,
      cost: 540,
      type: 'vendor',
      status: 'completed'
    }
  ]);

  const filteredMeetings = meetings
    .filter(meeting => 
      meeting.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (filterType === 'all' || meeting.type === filterType)
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'cost':
          return b.cost - a.cost;
        case 'duration':
          return b.duration - a.duration;
        case 'participants':
          return b.participants - a.participants;
        default:
          return new Date(b.date).getTime() - new Date(a.date).getTime();
      }
    });

  const totalCost = filteredMeetings.reduce((sum, meeting) => sum + meeting.cost, 0);
  const totalTime = filteredMeetings.reduce((sum, meeting) => sum + meeting.duration, 0);
  const avgCostPerHour = totalTime > 0 ? (totalCost / (totalTime / 60)) : 0;

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'client': return 'bg-green-100 text-green-800';
      case 'internal': return 'bg-blue-100 text-blue-800';
      case 'vendor': return 'bg-purple-100 text-purple-800';
      case 'team': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  if (subscription.tier === 'free') {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Meeting History</h1>
          <p className="text-gray-600 mt-2">Track and analyze your past meetings</p>
        </div>

        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="p-6">
            <div className="text-center">
              <TrendingUp className="h-12 w-12 mx-auto mb-4 text-blue-600" />
              <h3 className="text-lg font-semibold mb-2">Unlock Meeting History</h3>
              <p className="text-gray-600 mb-4">
                Upgrade to Premium to track meeting history, analyze trends, and export detailed reports.
              </p>
              <Button 
                onClick={() => onUpgrade('premium')}
                disabled={isUpgrading}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {isUpgrading ? 'Processing...' : 'Upgrade to Premium'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Meeting History</h1>
        <p className="text-gray-600 mt-2">Track and analyze your past meetings</p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Meetings</p>
                <p className="text-2xl font-bold">{filteredMeetings.length}</p>
              </div>
              <Calendar className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Cost</p>
                <p className="text-2xl font-bold">${totalCost.toLocaleString()}</p>
              </div>
              <DollarSign className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Time</p>
                <p className="text-2xl font-bold">{formatDuration(totalTime)}</p>
              </div>
              <Clock className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Avg Cost/Hour</p>
                <p className="text-2xl font-bold">${avgCostPerHour.toFixed(0)}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle>Meeting History</CardTitle>
          <CardDescription>View and analyze your past meetings</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search meetings..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="client">Client</SelectItem>
                <SelectItem value="internal">Internal</SelectItem>
                <SelectItem value="vendor">Vendor</SelectItem>
                <SelectItem value="team">Team</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date">Date</SelectItem>
                <SelectItem value="cost">Cost</SelectItem>
                <SelectItem value="duration">Duration</SelectItem>
                <SelectItem value="participants">Participants</SelectItem>
              </SelectContent>
            </Select>
            
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>

          {/* Meeting List */}
          <div className="space-y-4">
            {filteredMeetings.map((meeting) => (
              <div key={meeting.id} className="border rounded-lg p-4 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="font-medium">{meeting.title}</h4>
                      <Badge className={getTypeColor(meeting.type)}>
                        {meeting.type}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-6 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {new Date(meeting.date).toLocaleDateString()}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {formatDuration(meeting.duration)}
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        {meeting.participants} participants
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-green-600">
                      ${meeting.cost}
                    </div>
                    <div className="text-sm text-gray-500">
                      ${(meeting.cost / (meeting.duration / 60)).toFixed(0)}/hour
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredMeetings.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              No meetings found matching your criteria.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
