
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Play, Pause, Square, Users, DollarSign, Clock, Calculator, Download, BarChart } from "lucide-react";
import MeetingAnalytics from "./MeetingAnalytics";
import ExportPanel from "./ExportPanel";

type CostMethod = "hourly" | "salary" | "role-based";

interface Participant {
  id: string;
  name: string;
  hourlyRate: number;
  role: string;
}

const MeetingCalculator = () => {
  const [participants, setParticipants] = useState(5);
  const [avgHourlyRate, setAvgHourlyRate] = useState(50);
  const [duration, setDuration] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [costMethod, setCostMethod] = useState<CostMethod>("hourly");
  const [participantList, setParticipantList] = useState<Participant[]>([]);
  const [meetingTitle, setMeetingTitle] = useState("");
  const [meetingType, setMeetingType] = useState("team-meeting");
  
  // Cost calculation based on method
  const calculateTotalCost = () => {
    const hours = duration / 3600;
    
    switch (costMethod) {
      case "hourly":
        return hours * participants * avgHourlyRate;
      case "salary":
        // Assuming 2080 working hours per year for salary calculation
        const avgSalary = avgHourlyRate * 2080;
        return hours * participants * (avgSalary / 2080);
      case "role-based":
        if (participantList.length === 0) return 0;
        return hours * participantList.reduce((total, p) => total + p.hourlyRate, 0);
      default:
        return hours * participants * avgHourlyRate;
    }
  };

  const totalCost = calculateTotalCost();

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning && startTime) {
      interval = setInterval(() => {
        const now = new Date();
        setDuration(Math.floor((now.getTime() - startTime.getTime()) / 1000));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, startTime]);

  const handleStart = () => {
    setIsRunning(true);
    if (!startTime) {
      setStartTime(new Date());
    }
  };

  const handlePause = () => {
    setIsRunning(false);
  };

  const handleStop = () => {
    setIsRunning(false);
    setDuration(0);
    setStartTime(null);
  };

  const handleReset = () => {
    handleStop();
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const addParticipant = () => {
    const newParticipant: Participant = {
      id: Date.now().toString(),
      name: `Participant ${participantList.length + 1}`,
      hourlyRate: 50,
      role: "Team Member"
    };
    setParticipantList([...participantList, newParticipant]);
  };

  const updateParticipant = (id: string, field: keyof Participant, value: string | number) => {
    setParticipantList(participantList.map(p => 
      p.id === id ? { ...p, [field]: value } : p
    ));
  };

  const removeParticipant = (id: string) => {
    setParticipantList(participantList.filter(p => p.id !== id));
  };

  return (
    <div className="max-w-6xl mx-auto">
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center">
            <Calculator className="h-6 w-6 mr-2 text-blue-600" />
            Meeting Cost Calculator
          </CardTitle>
          <CardDescription>
            Configure your meeting parameters and track costs in real-time
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="basic">Basic Setup</TabsTrigger>
              <TabsTrigger value="advanced">Advanced Setup</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>
            
            <TabsContent value="basic" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <Label htmlFor="meeting-title">Meeting Title</Label>
                  <Input
                    id="meeting-title"
                    value={meetingTitle}
                    onChange={(e) => setMeetingTitle(e.target.value)}
                    placeholder="Enter meeting title"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="meeting-type">Meeting Type</Label>
                  <Select value={meetingType} onValueChange={setMeetingType}>
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="team-meeting">Team Meeting</SelectItem>
                      <SelectItem value="client-meeting">Client Meeting</SelectItem>
                      <SelectItem value="planning">Planning Session</SelectItem>
                      <SelectItem value="review">Review Meeting</SelectItem>
                      <SelectItem value="training">Training</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="cost-method">Cost Calculation Method</Label>
                  <Select value={costMethod} onValueChange={(value: CostMethod) => setCostMethod(value)}>
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hourly">Hourly Rate</SelectItem>
                      <SelectItem value="salary">Salary Based</SelectItem>
                      <SelectItem value="role-based">Role Based</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {costMethod !== "role-based" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="participants">Number of Participants</Label>
                    <Input
                      id="participants"
                      type="number"
                      value={participants}
                      onChange={(e) => setParticipants(Number(e.target.value))}
                      min="1"
                      max="50"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="hourly-rate">
                      Average {costMethod === "salary" ? "Annual Salary ($)" : "Hourly Rate ($)"}
                    </Label>
                    <Input
                      id="hourly-rate"
                      type="number"
                      value={avgHourlyRate}
                      onChange={(e) => setAvgHourlyRate(Number(e.target.value))}
                      min="1"
                      max={costMethod === "salary" ? "500000" : "500"}
                      className="mt-1"
                    />
                  </div>
                </div>
              )}

              <div className="text-center">
                <div className="text-6xl font-mono font-bold text-gray-900 mb-4">
                  {formatTime(duration)}
                </div>
                <div className="flex justify-center space-x-4 mb-4">
                  {!isRunning ? (
                    <Button onClick={handleStart} className="bg-green-600 hover:bg-green-700">
                      <Play className="h-4 w-4 mr-2" />
                      Start Meeting
                    </Button>
                  ) : (
                    <Button onClick={handlePause} className="bg-yellow-600 hover:bg-yellow-700">
                      <Pause className="h-4 w-4 mr-2" />
                      Pause
                    </Button>
                  )}
                  <Button onClick={handleStop} variant="destructive">
                    <Square className="h-4 w-4 mr-2" />
                    Stop
                  </Button>
                  <Button onClick={handleReset} variant="outline">
                    Reset
                  </Button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="advanced" className="space-y-6">
              {costMethod === "role-based" && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold">Participants</h3>
                    <Button onClick={addParticipant} variant="outline">
                      Add Participant
                    </Button>
                  </div>
                  {participantList.map((participant) => (
                    <Card key={participant.id} className="p-4">
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                        <div>
                          <Label>Name</Label>
                          <Input
                            value={participant.name}
                            onChange={(e) => updateParticipant(participant.id, 'name', e.target.value)}
                          />
                        </div>
                        <div>
                          <Label>Role</Label>
                          <Input
                            value={participant.role}
                            onChange={(e) => updateParticipant(participant.id, 'role', e.target.value)}
                          />
                        </div>
                        <div>
                          <Label>Hourly Rate ($)</Label>
                          <Input
                            type="number"
                            value={participant.hourlyRate}
                            onChange={(e) => updateParticipant(participant.id, 'hourlyRate', Number(e.target.value))}
                          />
                        </div>
                        <Button 
                          onClick={() => removeParticipant(participant.id)}
                          variant="destructive"
                          size="sm"
                        >
                          Remove
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="analytics">
              <MeetingAnalytics 
                duration={duration}
                totalCost={totalCost}
                participants={costMethod === "role-based" ? participantList.length : participants}
                meetingType={meetingType}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <Users className="h-5 w-5 mr-2 text-blue-600" />
              Participants
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">
              {costMethod === "role-based" ? participantList.length : participants}
            </div>
            <p className="text-sm text-gray-600">People in meeting</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <Clock className="h-5 w-5 mr-2 text-blue-600" />
              Duration
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">
              {Math.round(duration / 60)} min
            </div>
            <p className="text-sm text-gray-600">Meeting length</p>
          </CardContent>
        </Card>

        <Card className="border-red-200 bg-red-50">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <DollarSign className="h-5 w-5 mr-2 text-red-600" />
              Total Cost
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-600">
              {formatCurrency(totalCost)}
            </div>
            <p className="text-sm text-gray-600">
              {formatCurrency(calculateTotalCost() * 3600 / Math.max(duration, 1))}/hour
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <BarChart className="h-5 w-5 mr-2 text-blue-600" />
              Efficiency
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">
              {duration > 0 ? Math.max(100 - Math.floor(totalCost / 10), 10) : 100}%
            </div>
            <p className="text-sm text-gray-600">Meeting score</p>
          </CardContent>
        </Card>
      </div>

      <ExportPanel 
        meetingData={{
          title: meetingTitle || "Untitled Meeting",
          type: meetingType,
          duration,
          participants: costMethod === "role-based" ? participantList.length : participants,
          totalCost,
          costMethod,
          timestamp: startTime || new Date()
        }}
      />

      {totalCost > 0 && (
        <Card className="mt-6 bg-blue-50 border-blue-200">
          <CardContent className="pt-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-blue-900 mb-2">
                💡 Meeting Optimization Tips
              </h3>
              <div className="space-y-2 text-blue-800">
                {totalCost > 500 && (
                  <p>⚠️ High-cost meeting detected! Consider reducing participants or shortening duration.</p>
                )}
                {duration > 3600 && (
                  <p>⏰ Long meeting alert! Consider breaking into smaller focused sessions.</p>
                )}
                {(costMethod === "role-based" ? participantList.length : participants) > 8 && (
                  <p>👥 Large group detected! Consider if all participants need to attend the entire meeting.</p>
                )}
                {totalCost <= 200 && duration > 0 && (
                  <p>✅ This meeting is within optimal cost parameters.</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default MeetingCalculator;
