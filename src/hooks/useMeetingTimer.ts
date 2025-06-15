import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

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

interface UseMeetingTimerProps {
  meetingData: MeetingData;
  setMeetingData: React.Dispatch<React.SetStateAction<MeetingData>>;
  calculateCostFromDuration: (durationInSeconds: number, data?: MeetingData) => number;
}

export const useMeetingTimer = ({ meetingData, setMeetingData, calculateCostFromDuration }: UseMeetingTimerProps) => {
  const [timerRunning, setTimerRunning] = useState(false);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [costHistory, setCostHistory] = useState<number[]>([]);
  const { toast } = useToast();

  // Timer effect with real-time cost calculation
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (timerRunning && startTime) {
      interval = setInterval(() => {
        const now = new Date();
        const durationInSeconds = (now.getTime() - startTime.getTime()) / 1000;
        const newCost = calculateCostFromDuration(durationInSeconds);
        
        setMeetingData(prev => ({
          ...prev,
          duration: durationInSeconds,
          totalCost: newCost,
        }));
        
        // Track cost history for analytics
        setCostHistory(prev => [...prev.slice(-59), newCost]);
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timerRunning, startTime, meetingData.participants, meetingData.costMethod, meetingData.customRate, calculateCostFromDuration, setMeetingData]);

  const getEfficiencyRating = (cost: number, duration: number) => {
    const costPerMinute = cost / (duration / 60);
    if (costPerMinute < 5) return "Excellent";
    if (costPerMinute < 10) return "Good";
    if (costPerMinute < 20) return "Fair";
    return "Needs Optimization";
  };

  const startTimer = () => {
    if (meetingData.costMethod === 'custom' && !meetingData.customRate) {
      toast({
        title: "Custom Rate Required",
        description: "Please set a custom hourly rate before starting the timer.",
        variant: "destructive",
      });
      return;
    }

    // A null startTime indicates a fresh start (initial or after a stop).
    const isFreshStart = startTime === null;

    setTimerRunning(true);

    if (isFreshStart) {
      // For a new timer, reset duration, cost, and history.
      setMeetingData(prev => ({ ...prev, duration: 0, totalCost: 0 }));
      setCostHistory([]);
      setStartTime(new Date());
      toast({
        title: "🚀 Timer Started",
        description: `Meeting "${meetingData.title}" cost tracking has begun.`,
      });
    } else {
      // For resuming, adjust the start time based on the already elapsed duration.
      const now = new Date();
      const adjustedStartTime = new Date(now.getTime() - (meetingData.duration * 1000));
      setStartTime(adjustedStartTime);
      toast({
        title: "▶️ Timer Resumed",
        description: `Meeting "${meetingData.title}" cost tracking has resumed.`,
      });
    }
  };

  const pauseTimer = () => {
    setTimerRunning(false);
    toast({
      title: "⏸️ Timer Paused",
      description: "Meeting timer has been paused. Cost calculation is on hold.",
    });
  };

  const stopTimer = () => {
    if (startTime) {
      const endTime = new Date();
      const durationInSeconds = (endTime.getTime() - startTime.getTime()) / 1000;
      const finalCost = calculateCostFromDuration(durationInSeconds);
      
      setMeetingData(prev => ({
        ...prev,
        duration: durationInSeconds,
        totalCost: finalCost,
      }));
      
      setTimerRunning(false);
      setStartTime(null);
      
      toast({
        title: "✅ Meeting Completed",
        description: `Total cost: $${finalCost.toFixed(2)} | Duration: ${Math.round(durationInSeconds/60)} min | Efficiency: ${getEfficiencyRating(finalCost, durationInSeconds)}`,
      });
    }
  };

  return {
    timerRunning,
    costHistory,
    startTimer,
    pauseTimer,
    stopTimer,
    getEfficiencyRating,
  };
};
