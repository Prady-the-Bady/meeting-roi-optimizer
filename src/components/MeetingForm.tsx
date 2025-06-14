
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calculator, Play, Pause, Square } from "lucide-react";

interface MeetingData {
  title: string;
  type: string;
  duration: number;
  participants: number;
  totalCost: number;
  costMethod: string;
  timestamp: Date;
}

interface MeetingFormProps {
  meetingData: MeetingData;
  timerRunning: boolean;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSelectChange: (value: string, name: string) => void;
  onStartTimer: () => void;
  onPauseTimer: () => void;
  onStopTimer: () => void;
}

const MeetingForm = ({
  meetingData,
  timerRunning,
  onInputChange,
  onSelectChange,
  onStartTimer,
  onPauseTimer,
  onStopTimer
}: MeetingFormProps) => {
  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
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
              onChange={onInputChange}
            />
          </div>

          <div>
            <Label htmlFor="type">Meeting Type</Label>
            <Select value={meetingData.type} onValueChange={(value) => onSelectChange(value, "type")}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a type" />
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
                min="1"
                value={meetingData.participants}
                onChange={onInputChange}
              />
            </div>

            <div>
              <Label htmlFor="costMethod">Cost Method</Label>
              <Select value={meetingData.costMethod} onValueChange={(value) => onSelectChange(value, "costMethod")}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a method" />
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
                value={formatDuration(meetingData.duration)}
                readOnly
                className={timerRunning ? "bg-green-50 border-green-300" : ""}
              />
              {!timerRunning && (
                <Button onClick={onStartTimer}>
                  <Play className="h-4 w-4 mr-2" />
                  Start
                </Button>
              )}
              {timerRunning && (
                <Button onClick={onPauseTimer} variant="secondary">
                  <Pause className="h-4 w-4 mr-2" />
                  Pause
                </Button>
              )}
              <Button onClick={onStopTimer} variant="outline" disabled={!timerRunning && meetingData.duration === 0}>
                <Square className="h-4 w-4 mr-2" />
                Stop
              </Button>
            </div>
            {timerRunning && (
              <p className="text-sm text-green-600 mt-1">Timer is running - cost is being calculated in real-time</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MeetingForm;
