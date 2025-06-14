
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, DollarSign, Clock, Users } from "lucide-react";

interface CostDisplayProps {
  cost: number;
}

const CostDisplay = ({ cost }: CostDisplayProps) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const getCostColor = (cost: number) => {
    if (cost < 100) return "text-green-600";
    if (cost < 300) return "text-yellow-600";
    if (cost < 500) return "text-orange-600";
    return "text-red-600";
  };

  const getCostBackground = (cost: number) => {
    if (cost < 100) return "bg-gradient-to-br from-green-50 to-green-100";
    if (cost < 300) return "bg-gradient-to-br from-yellow-50 to-yellow-100";
    if (cost < 500) return "bg-gradient-to-br from-orange-50 to-orange-100";
    return "bg-gradient-to-br from-red-50 to-red-100";
  };

  return (
    <Card className={`${getCostBackground(cost)} border-2`}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center">
            <DollarSign className="h-5 w-5 mr-2 text-blue-600" />
            Meeting Cost - Phase 4
          </span>
          <TrendingUp className={`h-4 w-4 ${getCostColor(cost)}`} />
        </CardTitle>
        <CardDescription>
          Real-time cost calculation with enhanced accuracy
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className={`text-6xl font-bold ${getCostColor(cost)} text-center py-4`}>
            {formatCurrency(cost)}
          </div>
          
          {cost > 0 && (
            <div className="grid grid-cols-2 gap-4 pt-4 border-t">
              <div className="text-center">
                <div className="text-2xl font-semibold text-gray-700">
                  {formatCurrency(cost / 60)}
                </div>
                <div className="text-xs text-gray-500 uppercase tracking-wide">
                  Per Minute
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-semibold text-gray-700">
                  {formatCurrency(cost / 3600)}
                </div>
                <div className="text-xs text-gray-500 uppercase tracking-wide">
                  Per Second
                </div>
              </div>
            </div>
          )}
          
          {cost > 500 && (
            <div className="mt-4 p-3 bg-yellow-100 border border-yellow-300 rounded-lg">
              <p className="text-sm text-yellow-800 font-medium">
                💡 High-cost meeting detected! Consider optimization strategies.
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default CostDisplay;
