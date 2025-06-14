
import { useState } from "react";
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
  const [activeTab, setActiveTab] = useState<TabType>('calculator');
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
      cost = (80 * (meetingData.duration / 3600) * meetingData.participants);
    } else if (meetingData.costMethod === "fixed-rate") {
      cost = 50 * meetingData.participants;
    } else if (meetingData.costMethod === "role-based") {
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

  const handleMeetingImport = (importedMeeting: any) => {
    setMeetingData(importedMeeting);
    setActiveTab('calculator');
    toast({
      title: "Meeting Imported",
      description: "Meeting data has been imported from your calendar.",
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
            <CostDisplay cost={calculateCost()} />
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
