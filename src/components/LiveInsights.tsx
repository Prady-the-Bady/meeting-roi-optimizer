
interface LiveInsightsProps {
  timerRunning: boolean;
  costHistory: number[];
  totalCost: number;
  duration: number;
  getEfficiencyRating: (cost: number, duration: number) => string;
}

const LiveInsights = ({ 
  timerRunning, 
  costHistory, 
  totalCost, 
  duration, 
  getEfficiencyRating 
}: LiveInsightsProps) => {
  if (!timerRunning || costHistory.length <= 10) {
    return null;
  }

  return (
    <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg">
      <h3 className="font-semibold text-blue-900 mb-2">Live Insights</h3>
      <div className="text-sm space-y-1">
        <p>💰 Cost trend: {costHistory[costHistory.length-1] > costHistory[0] ? '📈 Increasing' : '📉 Stable'}</p>
        <p>⚡ Efficiency: {getEfficiencyRating(totalCost, duration)}</p>
        <p>🎯 Projected 1hr cost: ${(totalCost / duration * 3600).toFixed(0)}</p>
      </div>
    </div>
  );
};

export default LiveInsights;
