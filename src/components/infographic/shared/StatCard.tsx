import { motion } from "framer-motion";
import { fadeUp } from "@/lib/animation-presets";
import { cn } from "@/lib/utils";

interface StatCardProps {
  value: string | number;
  label: string;
  delay?: number;
  className?: string; // Additional classes
  variant?: "dark" | "light";
}

const StatCard = ({ value, label, delay = 0, className, variant = "dark" }: StatCardProps) => {
  return (
    <motion.div
      variants={fadeUp}
      custom={delay}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true }}
      className={cn(
        "rounded-xl border p-6 flex flex-col justify-center",
        variant === "dark" 
          ? "bg-white/10 border-white/15 backdrop-blur-sm" 
          : "bg-white border-slate-200 shadow-sm",
        className
      )}
    >
      <div className={cn("text-3xl font-bold mb-2", variant === "dark" ? "text-[#F1EEEA]" : "text-[#1a1a2e]")}>{value}</div>
      <div className={cn("text-sm", variant === "dark" ? "text-[#F1EEEA]/75" : "text-slate-500")}>{label}</div>
    </motion.div>
  );
};

export default StatCard;
