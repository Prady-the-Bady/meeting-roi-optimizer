
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface CostDisplayProps {
  cost: number;
}

const CostDisplay = ({ cost }: CostDisplayProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Meeting Cost</CardTitle>
        <CardDescription>The estimated cost of this meeting</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-5xl font-bold">
          ${cost.toFixed(2)}
        </div>
      </CardContent>
    </Card>
  );
};

export default CostDisplay;
