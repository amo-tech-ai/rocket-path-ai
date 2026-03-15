import { motion } from "framer-motion";

interface LeanCanvasScreenProps {
  uiState: string | null;
  isCompleted?: boolean;
}

const blocks = [
  { label: "Problem", value: "Manual inventory tracking", color: "bg-destructive/10 text-destructive" },
  { label: "Solution", value: "AI-powered predictions", color: "bg-sage/10 text-sage" },
  { label: "Key Metrics", value: "Waste %, accuracy", color: "bg-primary/10 text-primary" },
  { label: "Unique Value", value: "Real-time demand forecasting", color: "bg-sage/10 text-sage" },
  { label: "Channels", value: "Direct sales, partnerships", color: "bg-primary/10 text-primary" },
  { label: "Customer Segments", value: "Small restaurants", color: "bg-accent/20 text-accent-foreground" },
  { label: "Revenue Streams", value: "SaaS subscription", color: "bg-sage/10 text-sage" },
  { label: "Cost Structure", value: "Cloud, data, support", color: "bg-primary/10 text-primary" },
  { label: "Unfair Advantage", value: "Proprietary local data", color: "bg-accent/20 text-accent-foreground" },
];

const LeanCanvasScreen = ({ uiState, isCompleted = false }: LeanCanvasScreenProps) => {
  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-display text-xl font-medium text-foreground">
            Lean Canvas
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            Auto-generated from validation
          </p>
        </div>
        <span className="px-2 py-1 rounded-full bg-sage/10 text-sage text-xs font-medium">
          9/9 blocks filled
        </span>
      </div>

      {/* Canvas Grid */}
      <div className="grid grid-cols-3 gap-1.5">
        {blocks.map((block, index) => (
          <motion.div
            key={block.label}
            className={`p-2.5 rounded-lg border border-border ${block.color}`}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: isCompleted ? 0 : 0.1 + index * 0.06 }}
          >
            <p className="text-[10px] font-semibold uppercase tracking-wider opacity-70 mb-1">
              {block.label}
            </p>
            <p className="text-xs font-medium leading-snug">
              {block.value}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default LeanCanvasScreen;
