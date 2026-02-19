import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp } from "lucide-react";

interface Trend {
  name: string;
  impact: string;
  timeframe: string;
  evidence: string;
}

const IMPACT_COLORS: Record<string, string> = {
  high: "bg-red-100 text-red-700",
  medium: "bg-amber-100 text-amber-700",
  low: "bg-green-100 text-green-700",
};

interface TrendListProps {
  trends: Trend[];
}

export function TrendList({ trends }: TrendListProps) {
  if (!trends.length) return null;

  return (
    <div>
      <h2 className="text-lg font-semibold mb-3">Market Trends</h2>
      <div className="space-y-3">
        {trends.map((trend, i) => (
          <Card key={i}>
            <CardContent className="p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                    <TrendingUp className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">{trend.name}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{trend.evidence}</p>
                    <p className="text-xs text-muted-foreground mt-1">Timeframe: {trend.timeframe}</p>
                  </div>
                </div>
                <Badge className={`shrink-0 ${IMPACT_COLORS[trend.impact] || IMPACT_COLORS.medium}`}>
                  {trend.impact}
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
