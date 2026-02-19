import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Info } from "lucide-react";

function formatCurrency(value: number | null): string {
  if (!value) return '$0';
  if (value >= 1e12) return `$${(value / 1e12).toFixed(1)}T`;
  if (value >= 1e9) return `$${(value / 1e9).toFixed(1)}B`;
  if (value >= 1e6) return `$${(value / 1e6).toFixed(1)}M`;
  if (value >= 1e3) return `$${(value / 1e3).toFixed(0)}K`;
  return `$${value.toLocaleString()}`;
}

interface MarketSizingCardsProps {
  tam: { value: number | null; source: string | null };
  sam: { value: number | null; source: string | null };
  som: { value: number | null; source: string | null };
  methodology: string | null;
}

const SIZING_META = [
  { key: 'tam', label: 'TAM', desc: 'Total Addressable Market', color: 'from-blue-500/10 to-blue-600/5' },
  { key: 'sam', label: 'SAM', desc: 'Serviceable Addressable Market', color: 'from-violet-500/10 to-violet-600/5' },
  { key: 'som', label: 'SOM', desc: 'Serviceable Obtainable Market', color: 'from-emerald-500/10 to-emerald-600/5' },
] as const;

export function MarketSizingCards({ tam, sam, som, methodology }: MarketSizingCardsProps) {
  const data = { tam, sam, som };

  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <h2 className="text-lg font-semibold">Market Sizing</h2>
        {methodology && (
          <Tooltip>
            <TooltipTrigger>
              <Info className="h-4 w-4 text-muted-foreground" />
            </TooltipTrigger>
            <TooltipContent className="max-w-xs">
              <p className="text-sm">{methodology}</p>
            </TooltipContent>
          </Tooltip>
        )}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {SIZING_META.map((m) => {
          const d = data[m.key];
          return (
            <Card key={m.key} className={`bg-gradient-to-br ${m.color}`}>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {m.label}
                  <span className="block text-xs font-normal mt-0.5">{m.desc}</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{formatCurrency(d.value)}</p>
                {d.source && (
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{d.source}</p>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
