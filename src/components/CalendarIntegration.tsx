
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, RefreshCw, ExternalLink, Plus, CheckCircle, AlertTriangle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type CalendarEvent = any;

interface CalendarIntegrationProps {
  onMeetingImport?: (meeting: any) => void;
}

const CalendarProviderView = ({ provider, onMeetingImport }: { provider: 'google' | 'microsoft', onMeetingImport?: (meeting: any) => void }) => {
    const { toast } = useToast();
    const functionName = provider === 'google' ? 'get-google-calendar-events' : 'get-microsoft-calendar-events';
    const providerName = provider === 'google' ? 'Google Calendar' : 'Outlook Calendar';
    
    const {
        data: events,
        isLoading: isLoadingEvents,
        error: eventsError,
        refetch,
      } = useQuery<CalendarEvent[]>({
        queryKey: [`${provider}-calendar-events`],
        queryFn: async () => {
          const { data, error } = await supabase.functions.invoke(functionName);
          if (error) throw new Error(error.message);
          return data.events;
        },
        staleTime: 1000 * 60 * 5, // 5 minutes
      });

    const formatTime = (dateStr: string) => new Date(dateStr).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
    const formatDate = (dateStr: string) => new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', weekday: 'short' });
    const getDuration = (start: any, end: any) => {
        if (!start?.dateTime || !end?.dateTime) return 'N/A';
        const duration = (new Date(end.dateTime).getTime() - new Date(start.dateTime).getTime()) / (1000 * 60);
        if (isNaN(duration)) return "All day";
        return `${Math.round(duration)}min`;
    };

    return (
        <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-medium">Upcoming Meetings from {providerName}</h4>
              <Button variant="ghost" size="sm" onClick={() => refetch()} disabled={isLoadingEvents}>
                <RefreshCw className={`h-4 w-4 mr-2 ${isLoadingEvents ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>
            
            <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                {isLoadingEvents && Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-24 w-full" />)}

                {eventsError && (
                <div className="text-red-600 bg-red-50 p-4 rounded-lg flex items-center">
                    <AlertTriangle className="h-5 w-5 mr-3" />
                    <div>
                    <p className="font-semibold">Failed to load calendar events.</p>
                    <p className="text-sm">Please ensure you've granted calendar permissions. You may need to reconnect. Error: {(eventsError as Error).message}</p>
                    </div>
                </div>
                )}

                {events && events.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                    No upcoming meetings found in your {providerName} for the next 7 days.
                </div>
                )}

                {events && events.map((event) => (
                    <div key={event.id} className="p-3 border rounded-lg">
                        <div className="flex items-start justify-between">
                        <div className="flex-1">
                            <h5 className="font-medium text-gray-900">{event.summary || "No Title"}</h5>
                            <div className="flex items-center flex-wrap gap-x-4 gap-y-1 mt-1 text-sm text-gray-500">
                            {event.start?.dateTime && <span className="flex items-center"><Calendar className="h-3 w-3 mr-1" />{formatDate(event.start.dateTime)}</span>}
                            {event.start?.dateTime && event.end?.dateTime && <span className="flex items-center"><Clock className="h-3 w-3 mr-1" />{formatTime(event.start.dateTime)} - {formatTime(event.end.dateTime)}</span>}
                            </div>
                            <div className="flex items-center space-x-4 mt-2">
                            <span className="text-sm text-gray-600">{event.attendees?.length || 1} attendees</span>
                            <span className="text-sm text-gray-600">{getDuration(event.start, event.end)}</span>
                            </div>
                        </div>
                        <Button size="sm" variant="outline" onClick={() => {
                             const start = new Date(event.start.dateTime || event.start.date);
                             const end = new Date(event.end.dateTime || event.end.date);
                             const duration = (end.getTime() - start.getTime()) / 1000;
                         
                             const meetingData = {
                               title: event.summary,
                               type: 'calendar-import',
                               duration: isNaN(duration) ? 0 : duration,
                               participants: event.attendees?.length || 1,
                               totalCost: 0, 
                               costMethod: 'role-based',
                               timestamp: start,
                             };
                         
                             if (onMeetingImport) {
                               onMeetingImport(meetingData);
                             }
                         
                             toast({
                               title: "Meeting Imported",
                               description: `${event.summary} has been imported for cost analysis.`,
                             });
                        }}>
                            <ExternalLink className="h-3 w-3 mr-1" /> Import
                        </Button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};


const CalendarIntegration = ({ onMeetingImport }: CalendarIntegrationProps) => {
  const { user, connectGoogle, connectMicrosoft } = useAuth();
  
  const isGoogleConnected = user?.app_metadata?.providers?.includes('google');
  const isMicrosoftConnected = user?.app_metadata?.providers?.includes('azure');

  if (!isGoogleConnected && !isMicrosoftConnected) {
    return (
         <Card>
            <CardHeader>
                <CardTitle className="flex items-center">
                    <Calendar className="h-5 w-5 mr-2 text-blue-600" />
                    Calendar Integration
                </CardTitle>
                <CardDescription>
                    Connect your calendars to automatically track and analyze meeting costs.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                     <div className="flex items-center space-x-3">
                         <div className="w-3 h-3 rounded-full bg-gray-300"></div>
                         <div>
                             <p className="font-medium">Google Calendar</p>
                             <p className="text-sm text-gray-500">Connect to import meetings</p>
                         </div>
                     </div>
                     <Button onClick={connectGoogle}>
                         <Plus className="h-4 w-4 mr-2" />
                         Connect
                     </Button>
                 </div>
                 <div className="flex items-center justify-between p-4 border rounded-lg">
                     <div className="flex items-center space-x-3">
                         <div className="w-3 h-3 rounded-full bg-gray-300"></div>
                         <div>
                             <p className="font-medium">Outlook Calendar</p>
                             <p className="text-sm text-gray-500">Connect to import meetings</p>
                         </div>
                     </div>
                     <Button onClick={connectMicrosoft}>
                         <Plus className="h-4 w-4 mr-2" />
                         Connect
                     </Button>
                 </div>
            </CardContent>
        </Card>
    );
  }

  const providers = [];
  if (isGoogleConnected) providers.push('google');
  if (isMicrosoftConnected) providers.push('microsoft');
  const defaultProvider = providers[0];

  return (
    <Tabs defaultValue={defaultProvider} className="w-full">
        <Card>
            <CardHeader>
                <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                     <div>
                        <CardTitle className="flex items-center">
                            <Calendar className="h-5 w-5 mr-2 text-blue-600" />
                            Calendar Integration
                        </CardTitle>
                        <CardDescription>
                            Your connected calendars. Sync meetings to track and analyze costs.
                        </CardDescription>
                     </div>
                     <TabsList>
                        {isGoogleConnected && <TabsTrigger value="google">Google</TabsTrigger>}
                        {isMicrosoftConnected && <TabsTrigger value="microsoft">Microsoft</TabsTrigger>}
                     </TabsList>
                </div>
            </CardHeader>
            <CardContent>
                {isGoogleConnected && (
                    <TabsContent value="google" className="mt-0">
                        <CalendarProviderView provider="google" onMeetingImport={onMeetingImport} />
                    </TabsContent>
                )}
                {isMicrosoftConnected && (
                    <TabsContent value="microsoft" className="mt-0">
                        <CalendarProviderView provider="microsoft" onMeetingImport={onMeetingImport} />
                    </TabsContent>
                )}
            </CardContent>
        </Card>
    </Tabs>
  );
};

export default CalendarIntegration;
