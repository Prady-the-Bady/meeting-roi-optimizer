
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import MeetingForm from "./MeetingForm";
import CostDisplay from "./CostDisplay";
import TabNavigation from "./TabNavigation";
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
  customRate?: number;
  timestamp: Date;
}

type TabType = 'calculator' | 'analytics' | 'ai' | 'team' | 'calendar' | 'premium';

const MeetingCalculator = () => {
  const [meetingData, setMeetingData] = useState<MeetingData>({
    title: "Untitled Meeting",
    type: "brainstorming",
    duration: 0,
    participants: 1,
    totalCost: 0,
    costMethod: "salary-based",
    customRate: 75,
    timestamp: new Date(),
  });

  const [hourlyRates] = useState({
    "ceo": 200,
    "manager": 100,
    "developer": 80,
    "designer": 70,
    "analyst": 60,
    "intern": 30,
  });

  const [timerRunning, setTimerRunning] = useState(false);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>('calculator');
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
  }, [timerRunning, startTime, meetingData.participants, meetingData.costMethod, meetingData.customRate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setMeetingData(prev => {
      const newData = {
        ...prev,
        [name]: name === 'participants' ? Math.max(1, parseInt(value) || 1) : 
               name === 'customRate' ? Math.max(1, parseFloat(value) || 1) : value,
      };
      
      // Recalculate cost if duration exists
      if (newData.duration > 0) {
        newData.totalCost = calculateCostFromDuration(newData.duration, newData);
      }
      
      return newData;
    });
  };

  const handleSelectChange = (value: string, name: string) => {
    setMeetingData(prev => {
      const newData = { ...prev, [name]: value };
      
      // Reset custom rate if switching away from custom
      if (name === 'costMethod' && value !== 'custom') {
        delete newData.customRate;
      }
      
      // Recalculate cost if duration exists
      if (newData.duration > 0) {
        newData.totalCost = calculateCostFromDuration(newData.duration, newData);
      }
      
      return newData;
    });
  };

  const calculateCostFromDuration = (durationInSeconds: number, data = meetingData) => {
    const hours = durationInSeconds / 3600;
    let cost = 0;
    
    switch (data.costMethod) {
      case "salary-based":
        cost = 80 * hours * data.participants;
        break;
      case "fixed-rate":
        cost = 50 * hours * data.participants;
        break;
      case "role-based":
        const avgRate = (hourlyRates.ceo * 0.1 + hourlyRates.manager * 0.2 + 
                        hourlyRates.developer * 0.3 + hourlyRates.designer * 0.1 + 
                        hourlyRates.analyst * 0.2 + hourlyRates.intern * 0.1);
        cost = avgRate * hours * data.participants;
        break;
      case "custom":
        const customRate = data.customRate || 75;
        cost = customRate * hours * data.participants;
        break;
      default:
        cost = 75 * hours * data.participants;
    }
    
    return Math.max(0, cost);
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

    setTimerRunning(true);
    setStartTime(new Date());
    setCostHistory([]);
    
    toast({
      title: "🚀 Phase 4 Timer Started",
      description: `Meeting "${meetingData.title}" cost tracking has begun with enhanced features.`,
    });
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
      
      // Phase 4 enhanced completion toast
      toast({
        title: "✅ Meeting Completed - Phase 4",
        description: `Total cost: $${finalCost.toFixed(2)} | Duration: ${Math.round(durationInSeconds/60)} min | Efficiency: ${getEfficiencyRating(finalCost, durationInSeconds)}`,
      });
    }
  };

  const getEfficiencyRating = (cost: number, duration: number) => {
    const costPerMinute = cost / (duration / 60);
    if (costPerMinute < 5) return "Excellent";
    if (costPerMinute < 10) return "Good";
    if (costPerMinute < 20) return "Fair";
    return "Needs Optimization";
  };

  const handleMeetingImport = (importedMeeting: any) => {
    setMeetingData(importedMeeting);
    setActiveTab('calculator');
    toast({
      title: "📥 Meeting Imported - Phase 4",
      description: "Meeting data has been imported with enhanced processing capabilities.",
    });
  };

  return (
    <div className="max-w-7xl mx-auto">
      <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />

      {activeTab === 'calculator' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <MeetingForm
            meetingData={meetingData}
            timerRunning={timerRunning}
            onInputChange={handleInputChange}
            onSelectChange={handleSelectChange}
            onStartTimer={startTimer}
            onPauseTimer={pauseTimer}
            onStopTimer={stopTimer}
          />
          
          <div className="space-y-6">
            <CostDisplay cost={meetingData.totalCost} />
            <ExportPanel meetingData={meetingData} />
            
            {/* Phase 4 Enhancement: Real-time insights */}
            {timerRunning && costHistory.length > 10 && (
              <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg">
                <h3 className="font-semibold text-blue-900 mb-2">Phase 4 - Live Insights</h3>
                <div className="text-sm space-y-1">
                  <p>💰 Cost trend: {costHistory[costHistory.length-1] > costHistory[0] ? '📈 Increasing' : '📉 Stable'}</p>
                  <p>⚡ Efficiency: {getEfficiencyRating(meetingData.totalCost, meetingData.duration)}</p>
                  <p>🎯 Projected 1hr cost: ${(meetingData.totalCost / meetingData.duration * 3600).toFixed(0)}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'analytics' && (
        <MeetingAnalytics 
          duration={meetingData.duration}
          totalCost={meetingData.totalCost}
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
