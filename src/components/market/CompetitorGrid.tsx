import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Crown, Rocket } from "lucide-react";

interface Leader {
  name: string;
  description: string;
  market_share?: string;
}

interface EmergingPlayer {
  name: string;
  description: string;
  differentiator?: string;
}

interface CompetitorGridProps {
  leaders: Leader[];
  emerging: EmergingPlayer[];
}

export function CompetitorGrid({ leaders, emerging }: CompetitorGridProps) {
  if (!leaders.length && !emerging.length) return null;

  return (
    <div>
      <h2 className="text-lg font-semibold mb-3">Competitive Landscape</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Market Leaders */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Crown className="h-4 w-4 text-amber-500" />
            <h3 className="text-sm font-semibold">Market Leaders</h3>
          </div>
          <div className="space-y-3">
            {leaders.map((l, i) => (
              <Card key={i}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-1">
                    <p className="font-medium text-sm">{l.name}</p>
                    {l.market_share && (
                      <Badge variant="outline" className="text-xs">{l.market_share}</Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">{l.description}</p>
                </CardContent>
              </Card>
            ))}
            {leaders.length === 0 && (
              <p className="text-sm text-muted-foreground">No leaders identified</p>
            )}
          </div>
        </div>

        {/* Emerging Players */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Rocket className="h-4 w-4 text-blue-500" />
            <h3 className="text-sm font-semibold">Emerging Players</h3>
          </div>
          <div className="space-y-3">
            {emerging.map((e, i) => (
              <Card key={i}>
                <CardContent className="p-4">
                  <p className="font-medium text-sm mb-1">{e.name}</p>
                  <p className="text-xs text-muted-foreground">{e.description}</p>
                  {e.differentiator && (
                    <p className="text-xs text-primary/80 mt-1">Differentiator: {e.differentiator}</p>
                  )}
                </CardContent>
              </Card>
            ))}
            {emerging.length === 0 && (
              <p className="text-sm text-muted-foreground">No emerging players identified</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
