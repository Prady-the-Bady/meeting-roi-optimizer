
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, RefreshCw, ExternalLink, Plus, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  attendees: number;
  estimatedCost: number;
  status: 'upcoming' | 'in-progress' | 'completed';
}

interface CalendarIntegrationProps {
  onMeetingImport?: (meeting: any) => void;
}

const CalendarIntegration = ({ onMeetingImport }: CalendarIntegrationProps) => {
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [upcomingMeetings, setUpcomingMeetings] = useState<CalendarEvent[]>([
    {
      id: '1',
      title: 'Weekly Team Standup',
      start: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours from now
      end: new Date(Date.now() + 2.5 * 60 * 60 * 1000),
      attendees: 6,
      estimatedCost: 180,
      status: 'upcoming'
    },
    {
      id: '2',
      title: 'Product Strategy Review',
      start: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
      end: new Date(Date.now() + 25 * 60 * 60 * 1000),
      attendees: 8,
      estimatedCost: 400,
      status: 'upcoming'
    },
    {
      id: '3',
      title: 'Client Presentation',
      start: new Date(Date.now() + 48 * 60 * 60 * 1000), // Day after tomorrow
      end: new Date(Date.now() + 49.5 * 60 * 60 * 1000),
      attendees: 5,
      estimatedCost: 225,
      status: 'upcoming'
    }
  ]);
  
  const { toast } = useToast();

  const connectCalendar = async () => {
    setIsConnecting(true);
    
    // Simulate calendar connection
    setTimeout(() => {
      setIsConnected(true);
      setIsConnecting(false);
      toast({
        title: "Calendar Connected",
        description: "Successfully connected to your calendar. Meeting data will be synced automatically.",
      });
    }, 2000);
  };

  const importMeeting = (meeting: CalendarEvent) => {
    const duration = (meeting.end.getTime() - meeting.start.getTime()) / 1000;
    const meetingData = {
      title: meeting.title,
      type: 'calendar-import',
      duration: duration,
      participants: meeting.attendees,
      totalCost: meeting.estimatedCost,
      costMethod: 'role-based',
      timestamp: meeting.start
    };

    if (onMeetingImport) {
      onMeetingImport(meetingData);
    }

    toast({
      title: "Meeting Imported",
      description: `${meeting.title} has been imported for cost analysis.`,
    });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      weekday: 'short'
    });
  };

  const getDuration = (start: Date, end: Date) => {
    const duration = (end.getTime() - start.getTime()) / (1000 * 60);
    return `${duration}min`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming': return 'bg-blue-100 text-blue-800';
      case 'in-progress': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Calendar className="h-5 w-5 mr-2 text-green-600" />
          Calendar Integration
        </CardTitle>
        <CardDescription>
          Connect your calendar to automatically track and analyze meeting costs
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Connection Status */}
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center space-x-3">
              <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-gray-300'}`}></div>
              <div>
                <p className="font-medium">
                  {isConnected ? 'Calendar Connected' : 'Calendar Not Connected'}
                </p>
                <p className="text-sm text-gray-500">
                  {isConnected ? 'Syncing meetings automatically' : 'Connect to import meetings'}
                </p>
              </div>
            </div>
            <Button 
              onClick={connectCalendar}
              disabled={isConnecting || isConnected}
              variant={isConnected ? "outline" : "default"}
            >
              {isConnecting ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Connecting...
                </>
              ) : isConnected ? (
                <>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Connected
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4 mr-2" />
                  Connect Calendar
                </>
              )}
            </Button>
          </div>

          {/* Upcoming Meetings */}
          {isConnected && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium">Upcoming Meetings</h4>
                <span className="text-sm text-gray-500">{upcomingMeetings.length} meetings</span>
              </div>
              
              <div className="space-y-3 max-h-60 overflow-y-auto">
                {upcomingMeetings.map((meeting) => (
                  <div key={meeting.id} className="p-3 border rounded-lg">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h5 className="font-medium text-gray-900">{meeting.title}</h5>
                        <div className="flex items-center space-x-4 mt-1 text-sm text-gray-500">
                          <span className="flex items-center">
                            <Calendar className="h-3 w-3 mr-1" />
                            {formatDate(meeting.start)}
                          </span>
                          <span className="flex items-center">
                            <Clock className="h-3 w-3 mr-1" />
                            {formatTime(meeting.start)} - {formatTime(meeting.end)}
                          </span>
                        </div>
                        <div className="flex items-center space-x-4 mt-2">
                          <span className="text-sm text-gray-600">
                            {meeting.attendees} attendees
                          </span>
                          <span className="text-sm text-gray-600">
                            {getDuration(meeting.start, meeting.end)}
                          </span>
                          <span className="text-sm font-medium text-green-600">
                            ~${meeting.estimatedCost}
                          </span>
                          <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(meeting.status)}`}>
                            {meeting.status}
                          </span>
                        </div>
                      </div>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => importMeeting(meeting)}
                      >
                        <ExternalLink className="h-3 w-3 mr-1" />
                        Import
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Integration Benefits */}
          <div className="p-4 bg-green-50 rounded-lg">
            <h4 className="font-medium text-green-900 mb-2">Calendar Integration Benefits</h4>
            <ul className="text-sm text-green-800 space-y-1">
              <li>• Automatic meeting cost tracking</li>
              <li>• Real-time budget monitoring</li>
              <li>• Historical meeting analysis</li>
              <li>• Proactive optimization alerts</li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CalendarIntegration;
