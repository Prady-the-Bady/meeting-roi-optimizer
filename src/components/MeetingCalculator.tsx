import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Play, Pause, Square, Users, DollarSign, Clock, Calculator } from "lucide-react";

const MeetingCalculator = () => {
  const [participants, setParticipants] = useState(5);
  const [avgHourlyRate, setAvgHourlyRate] = useState(50);
  const [duration, setDuration] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [startTime, setStartTime] = useState<Date | null>(null);

  const totalCost = (duration / 60) * participants * avgHourlyRate;

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
    setStartTime(new Date());
  };

  const handlePause = () => {
    setIsRunning(false);
  };

  const handleStop = () => {
    setIsRunning(false);
    setDuration(0);
    setStartTime(null);
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

  return (
    <div className="max-w-4xl mx-auto">
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
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
              <Label htmlFor="hourly-rate">Average Hourly Rate ($)</Label>
              <Input
                id="hourly-rate"
                type="number"
                value={avgHourlyRate}
                onChange={(e) => setAvgHourlyRate(Number(e.target.value))}
                min="1"
                max="500"
                className="mt-1"
              />
            </div>
          </div>

          <div className="text-center mb-8">
            <div className="text-6xl font-mono font-bold text-gray-900 mb-4">
              {formatTime(duration)}
            </div>
            <div className="flex justify-center space-x-4">
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
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <Users className="h-5 w-5 mr-2 text-blue-600" />
              Participants
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">{participants}</div>
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
              {formatCurrency(participants * avgHourlyRate)}/hour
            </p>
          </CardContent>
        </Card>
      </div>

      {totalCost > 0 && (
        <Card className="mt-6 bg-blue-50 border-blue-200">
          <CardContent className="pt-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-blue-900 mb-2">
                💡 Cost Optimization Tip
              </h3>
              <p className="text-blue-800">
                {totalCost > 500 
                  ? "This is a high-cost meeting! Consider reducing participants or duration."
                  : totalCost > 200
                  ? "Consider if all participants need to attend the full meeting."
                  : "This meeting is within reasonable cost parameters."
                }
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default MeetingCalculator;
