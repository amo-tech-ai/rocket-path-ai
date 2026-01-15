import { Sparkles, AlertTriangle, ArrowRight, TrendingUp, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

const AIPanel = () => {
  const insights = [
    {
      type: "opportunity",
      icon: TrendingUp,
      title: "Momentum building",
      description: "You've completed 12 tasks this week—40% above your average. Consider scheduling a strategic review.",
    },
    {
      type: "risk",
      icon: AlertTriangle,
      title: "Funding timeline",
      description: "Based on current burn rate and runway, you have 8 months. Recommend starting investor outreach in 2 weeks.",
    },
    {
      type: "action",
      icon: Clock,
      title: "Follow-up needed",
      description: "Sarah Chen hasn't responded in 5 days. This deal is in your top 3 pipeline—consider a warm re-engagement.",
    },
  ];

  const suggestedActions = [
    "Review Q1 OKRs with team",
    "Prepare investor update",
    "Schedule product roadmap session",
  ];

  return (
    <div className="space-y-6">
      {/* Panel header */}
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-sage/20 flex items-center justify-center">
          <Sparkles className="w-4 h-4 text-sage" />
        </div>
        <div>
          <h3 className="font-semibold text-sm">AI Insights</h3>
          <p className="text-xs text-muted-foreground">Updated just now</p>
        </div>
      </div>

      {/* Summary */}
      <div className="p-4 rounded-xl bg-sage-light border border-sage/20">
        <p className="text-sm text-sage-foreground leading-relaxed">
          <span className="font-medium">Today's Focus:</span> Strong progress on product launch. 
          Two high-priority items need attention before EOD. Cash position stable.
        </p>
      </div>

      {/* Insights */}
      <div className="space-y-3">
        <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
          Active Insights
        </h4>
        {insights.map((insight, index) => (
          <div 
            key={index}
            className="p-3 rounded-xl bg-card border border-border hover:border-sage/30 transition-colors cursor-pointer"
          >
            <div className="flex items-start gap-3">
              <div className={`w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0 ${
                insight.type === "risk" 
                  ? "bg-warm text-warm-foreground" 
                  : insight.type === "opportunity"
                  ? "bg-sage-light text-sage"
                  : "bg-secondary text-secondary-foreground"
              }`}>
                <insight.icon className="w-3.5 h-3.5" />
              </div>
              <div className="flex-1 min-w-0">
                <h5 className="text-sm font-medium mb-1">{insight.title}</h5>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {insight.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Suggested actions */}
      <div className="space-y-3">
        <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
          Suggested Next Actions
        </h4>
        <div className="space-y-2">
          {suggestedActions.map((action, index) => (
            <button
              key={index}
              className="w-full flex items-center justify-between p-3 rounded-xl bg-secondary/50 hover:bg-secondary text-sm text-left transition-colors group"
            >
              <span>{action}</span>
              <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
            </button>
          ))}
        </div>
      </div>

      {/* Ask AI */}
      <div className="pt-4 border-t border-ai-border">
        <Button variant="sage" size="sm" className="w-full">
          <Sparkles className="w-4 h-4" />
          Ask AI a question
        </Button>
      </div>
    </div>
  );
};

export default AIPanel;
