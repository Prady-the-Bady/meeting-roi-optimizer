
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useMeetingState } from "@/hooks/useMeetingState";
import { useMeetingTimer } from "@/hooks/useMeetingTimer";
import MeetingForm from "./MeetingForm";
import CostDisplay from "./CostDisplay";
import TabNavigation from "./TabNavigation";
import MeetingAnalytics from "./MeetingAnalytics";
import ExportPanel from "./ExportPanel";
import AIOptimization from "./AIOptimization";
import TeamCollaboration from "./TeamCollaboration";
import CalendarIntegration from "./CalendarIntegration";
import PremiumFeatures from "./PremiumFeatures";
import LiveInsights from "./LiveInsights";

type TabType = 'calculator' | 'analytics' | 'ai' | 'team' | 'calendar' | 'premium';

const MeetingCalculator = () => {
  const [activeTab, setActiveTab] = useState<TabType>('calculator');
  const { toast } = useToast();

  const {
    meetingData,
    setMeetingData,
    calculateCostFromDuration,
    handleInputChange,
    handleSelectChange,
  } = useMeetingState();

  const {
    timerRunning,
    costHistory,
    startTimer,
    pauseTimer,
    stopTimer,
    getEfficiencyRating,
  } = useMeetingTimer({ meetingData, setMeetingData, calculateCostFromDuration });

  const handleMeetingImport = (importedMeeting: any) => {
    setMeetingData(importedMeeting);
    setActiveTab('calculator');
    toast({
      title: "📥 Meeting Imported",
      description: "Meeting data has been imported successfully.",
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
            
            <LiveInsights
              timerRunning={timerRunning}
              costHistory={costHistory}
              totalCost={meetingData.totalCost}
              duration={meetingData.duration}
              getEfficiencyRating={getEfficiencyRating}
            />
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
