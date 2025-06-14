
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
  customRate?: number;
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
          Calculate the true cost of your meetings with customizable rates and advanced features
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
                <SelectItem value="project-review">Project Review</SelectItem>
                <SelectItem value="planning">Planning Session</SelectItem>
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
                max="50"
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
                  <SelectItem value="salary-based">Salary Based ($80/hr)</SelectItem>
                  <SelectItem value="fixed-rate">Fixed Rate ($50/hr)</SelectItem>
                  <SelectItem value="role-based">Role Based (Mixed)</SelectItem>
                  <SelectItem value="custom">Custom Rate</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {meetingData.costMethod === 'custom' && (
            <div>
              <Label htmlFor="customRate">Custom Hourly Rate ($)</Label>
              <Input
                type="number"
                id="customRate"
                name="customRate"
                placeholder="75"
                min="1"
                max="1000"
                value={meetingData.customRate || ''}
                onChange={onInputChange}
                className="bg-yellow-50 border-yellow-300"
              />
              <p className="text-xs text-gray-500 mt-1">
                This rate will be applied per participant per hour
              </p>
            </div>
          )}

          <div>
            <Label>Duration & Timer</Label>
            <div className="flex items-center space-x-3">
              <Input
                type="text"
                placeholder="00:00:00"
                value={formatDuration(meetingData.duration)}
                readOnly
                className={timerRunning ? "bg-green-50 border-green-300 text-green-700 font-medium" : ""}
              />
              {!timerRunning && (
                <Button onClick={onStartTimer} className="bg-green-600 hover:bg-green-700">
                  <Play className="h-4 w-4 mr-2" />
                  Start
                </Button>
              )}
              {timerRunning && (
                <Button onClick={onPauseTimer} variant="secondary" className="bg-orange-100 hover:bg-orange-200">
                  <Pause className="h-4 w-4 mr-2" />
                  Pause
                </Button>
              )}
              <Button 
                onClick={onStopTimer} 
                variant="outline" 
                disabled={!timerRunning && meetingData.duration === 0}
                className="border-red-300 text-red-600 hover:bg-red-50"
              >
                <Square className="h-4 w-4 mr-2" />
                Stop
              </Button>
            </div>
            {timerRunning && (
              <div className="mt-2 p-2 bg-green-50 border-l-4 border-green-400 rounded">
                <p className="text-sm text-green-700 font-medium">
                  ⏱️ Timer is running - cost is being calculated in real-time
                </p>
              </div>
            )}
          </div>

          {meetingData.duration > 0 && (
            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">Meeting Progress</h4>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-blue-600">Duration:</span> {formatDuration(meetingData.duration)}
                </div>
                <div>
                  <span className="text-blue-600">Participants:</span> {meetingData.participants}
                </div>
                <div>
                  <span className="text-blue-600">Cost/Min:</span> ${(meetingData.totalCost / (meetingData.duration / 60)).toFixed(2)}
                </div>
                <div>
                  <span className="text-blue-600">Cost/Person:</span> ${(meetingData.totalCost / meetingData.participants).toFixed(2)}
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default MeetingForm;
