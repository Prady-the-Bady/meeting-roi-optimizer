
import { useState } from "react";

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

export const useMeetingState = () => {
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

  return {
    meetingData,
    setMeetingData,
    calculateCostFromDuration,
    handleInputChange,
    handleSelectChange,
  };
};
