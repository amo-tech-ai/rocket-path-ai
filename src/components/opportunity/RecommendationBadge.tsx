import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, Search, Clock, XCircle } from "lucide-react";

const RECOMMENDATION_CONFIG: Record<string, {
  label: string;
  color: string;
  bg: string;
  icon: typeof CheckCircle;
}> = {
  pursue: {
    label: 'PURSUE',
    color: 'text-green-700',
    bg: 'bg-green-50 border-green-200',
    icon: CheckCircle,
  },
  explore: {
    label: 'EXPLORE',
    color: 'text-blue-700',
    bg: 'bg-blue-50 border-blue-200',
    icon: Search,
  },
  defer: {
    label: 'DEFER',
    color: 'text-amber-700',
    bg: 'bg-amber-50 border-amber-200',
    icon: Clock,
  },
  reject: {
    label: 'REJECT',
    color: 'text-red-700',
    bg: 'bg-red-50 border-red-200',
    icon: XCircle,
  },
};

interface RecommendationBadgeProps {
  recommendation: string;
  reasoning: string | null;
  opportunityScore: number | null;
}

export function RecommendationBadge({ recommendation, reasoning, opportunityScore }: RecommendationBadgeProps) {
  const config = RECOMMENDATION_CONFIG[recommendation] || RECOMMENDATION_CONFIG.explore;
  const Icon = config.icon;

  return (
    <Card className={`${config.bg}`}>
      <CardContent className="p-6">
        <div className="flex items-center gap-4 mb-3">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${config.color} bg-white/60`}>
            <Icon className="w-6 h-6" />
          </div>
          <div>
            <p className={`text-2xl font-bold ${config.color}`}>{config.label}</p>
            {opportunityScore !== null && (
              <p className="text-sm text-muted-foreground">Overall Score: {opportunityScore}/100</p>
            )}
          </div>
        </div>
        {reasoning && (
          <p className="text-sm leading-relaxed">{reasoning}</p>
        )}
      </CardContent>
    </Card>
  );
}
