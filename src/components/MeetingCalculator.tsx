
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calculator, Clock, Users, DollarSign, Play, Pause, Square, TrendingUp } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import MeetingAnalytics from "./MeetingAnalytics";
import ExportPanel from "./ExportPanel";
import AIOptimization from "./AIOptimization";
import TeamCollaboration from "./TeamCollaboration";
import CalendarIntegration from "./CalendarIntegration";
import PremiumFeatures from "./PremiumFeatures";

interface MeetingData {
  title: string;
  type: string;
  duration: number;
  participants: number;
  totalCost: number;
  costMethod: string;
  timestamp: Date;
}

const MeetingCalculator = () => {
  const [meetingData, setMeetingData] = useState<MeetingData>({
    title: "Untitled Meeting",
    type: "brainstorming",
    duration: 0,
    participants: 1,
    totalCost: 0,
    costMethod: "salary-based",
    timestamp: new Date(),
  });

  const [hourlyRates, setHourlyRates] = useState({
    "ceo": 200,
    "manager": 100,
    "developer": 80,
    "designer": 70,
    "analyst": 60,
    "intern": 30,
  });

  const [timerRunning, setTimerRunning] = useState(false);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const { toast } = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setMeetingData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = (value: string, name: string) => {
    setMeetingData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const calculateCost = () => {
    let cost = 0;
    if (meetingData.costMethod === "salary-based") {
      // Example: Average hourly rate * duration in hours * participants
      cost = (80 * (meetingData.duration / 3600) * meetingData.participants); // Assume $80 is the average
    } else if (meetingData.costMethod === "fixed-rate") {
      // Example: Fixed rate per participant * number of participants
      cost = 50 * meetingData.participants; // Assume $50 per participant
    } else if (meetingData.costMethod === "role-based") {
      // Sum of each participant's hourly rate * duration in hours
      cost = (hourlyRates["ceo"] * 0.1 + hourlyRates["manager"] * 0.2 + hourlyRates["developer"] * 0.3 + hourlyRates["designer"] * 0.1 + hourlyRates["analyst"] * 0.2 + hourlyRates["intern"] * 0.1) * (meetingData.duration / 3600);
    }
    return cost;
  };

  const startTimer = () => {
    setTimerRunning(true);
    setStartTime(new Date());
  };

  const pauseTimer = () => {
    setTimerRunning(false);
  };

  const stopTimer = () => {
    if (startTime) {
      const endTime = new Date();
      const durationInSeconds = (endTime.getTime() - startTime.getTime()) / 1000;
      setMeetingData(prev => ({
        ...prev,
        duration: durationInSeconds,
        totalCost: calculateCost(),
      }));
      setTimerRunning(false);
      setStartTime(null);
    }
  };

  // Add new state for phase 3 features
  const [activeTab, setActiveTab] = useState<'calculator' | 'analytics' | 'ai' | 'team' | 'calendar' | 'premium'>('calculator');

  const handleMeetingImport = (importedMeeting: any) => {
    setMeetingData(importedMeeting);
    setActiveTab('calculator');
    toast({
      title: "Meeting Imported",
      description: "Meeting data has been imported from your calendar.",
    });
  };

  const tabs = [
    { id: 'calculator', label: 'Calculator', icon: <Calculator className="h-4 w-4" /> },
    { id: 'analytics', label: 'Analytics', icon: <TrendingUp className="h-4 w-4" /> },
    { id: 'ai', label: 'AI Insights', icon: <DollarSign className="h-4 w-4" /> },
    { id: 'team', label: 'Team', icon: <Users className="h-4 w-4" /> },
    { id: 'calendar', label: 'Calendar', icon: <Clock className="h-4 w-4" /> },
    { id: 'premium', label: 'Premium', icon: <TrendingUp className="h-4 w-4" /> }
  ];

  return (
    <div className="max-w-7xl mx-auto">
      {/* Tab Navigation */}
      <div className="flex flex-wrap border-b mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center space-x-2 px-4 py-2 border-b-2 transition-colors ${
              activeTab === tab.id
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'calculator' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Main Calculator */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calculator className="h-5 w-5 mr-2 text-blue-600" />
                Meeting Cost Calculator
              </CardTitle>
              <CardDescription>
                Calculate the true cost of your meetings in real-time
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                <div>
                  <Label htmlFor="title">Meeting Title</Label>
                  <Input
                    type="text"
                    id="title"
                    name="title"
                    placeholder="Project Kickoff"
                    value={meetingData.title}
                    onChange={handleInputChange}
                  />
                </div>

                <div>
                  <Label htmlFor="type">Meeting Type</Label>
                  <Select onValueChange={(value) => handleSelectChange(value, "type")}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a type" defaultValue={meetingData.type} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="brainstorming">Brainstorming</SelectItem>
                      <SelectItem value="status-update">Status Update</SelectItem>
                      <SelectItem value="decision-making">Decision Making</SelectItem>
                      <SelectItem value="training">Training</SelectItem>
                      <SelectItem value="client-meeting">Client Meeting</SelectItem>
                      <SelectItem value="team-building">Team Building</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="participants">Participants</Label>
                    <Input
                      type="number"
                      id="participants"
                      name="participants"
                      placeholder="5"
                      value={meetingData.participants}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div>
                    <Label htmlFor="costMethod">Cost Method</Label>
                    <Select onValueChange={(value) => handleSelectChange(value, "costMethod")}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a method" defaultValue={meetingData.costMethod} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="salary-based">Salary Based</SelectItem>
                        <SelectItem value="fixed-rate">Fixed Rate</SelectItem>
                        <SelectItem value="role-based">Role Based</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label>Duration</Label>
                  <div className="flex items-center space-x-3">
                    <Input
                      type="text"
                      placeholder="00:00:00"
                      value={new Date(meetingData.duration * 1000).toISOString().slice(11, 19)}
                      readOnly
                    />
                    {!timerRunning && (
                      <Button onClick={startTimer} disabled={timerRunning}>
                        <Play className="h-4 w-4 mr-2" />
                        Start
                      </Button>
                    )}
                    {timerRunning && (
                      <Button onClick={pauseTimer} variant="secondary">
                        <Pause className="h-4 w-4 mr-2" />
                        Pause
                      </Button>
                    )}
                    <Button onClick={stopTimer} variant="outline" disabled={!timerRunning && meetingData.duration === 0}>
                      <Square className="h-4 w-4 mr-2" />
                      Stop
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Results and Export */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Meeting Cost</CardTitle>
                <CardDescription>The estimated cost of this meeting</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-5xl font-bold">
                  ${calculateCost().toFixed(2)}
                </div>
              </CardContent>
            </Card>
            <ExportPanel meetingData={meetingData} />
          </div>
        </div>
      )}

      {activeTab === 'analytics' && (
        <MeetingAnalytics 
          duration={meetingData.duration}
          totalCost={calculateCost()}
          participants={meetingData.participants}
          meetingType={meetingData.type}
        />
      )}

      {activeTab === 'ai' && (
        <AIOptimization meetingData={meetingData} />
      )}

      {activeTab === 'team' && (
        <TeamCollaboration meetingData={meetingData} />
      )}

      {activeTab === 'calendar' && (
        <CalendarIntegration onMeetingImport={handleMeetingImport} />
      )}

      {activeTab === 'premium' && (
        <PremiumFeatures />
      )}
    </div>
  );
};

export default MeetingCalculator;
