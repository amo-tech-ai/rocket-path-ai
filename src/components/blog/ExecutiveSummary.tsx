import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

interface KeyPoint {
  title: string;
  description: string;
}

interface ExecutiveSummaryProps {
  title?: string;
  introduction: string;
  keyPoints: KeyPoint[];
  pullQuote?: {
    quote: string;
    author: string;
    role: string;
  };
}

const ExecutiveSummary = ({ 
  title = "Executive Summary", 
  introduction, 
  keyPoints, 
  pullQuote 
}: ExecutiveSummaryProps) => {
  return (
    <div className="grid md:grid-cols-2 gap-8 md:gap-12">
      {/* Left column - Content */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="space-y-6"
      >
        <h3 className="font-display text-2xl md:text-3xl font-semibold text-foreground">
          {title}
        </h3>
        
        <p className="text-muted-foreground leading-relaxed">
          {introduction}
        </p>
        
        <div className="space-y-4">
          {keyPoints.map((point, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + index * 0.1, duration: 0.4 }}
              viewport={{ once: true }}
              className="flex gap-3"
            >
              <div className="flex-shrink-0 w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center mt-0.5">
                <Check className="w-3 h-3 text-primary" />
              </div>
              <div>
                <span className="font-medium text-foreground">{point.title}:</span>{" "}
                <span className="text-muted-foreground">{point.description}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
      
      {/* Right column - Pull quote */}
      {pullQuote && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          viewport={{ once: true }}
          className="flex items-center"
        >
          <div className="relative pl-8 border-l-2 border-primary/20">
            <span className="absolute -left-3 -top-2 text-6xl text-primary/20 font-display">
              "
            </span>
            <blockquote className="font-display text-xl md:text-2xl italic text-foreground leading-relaxed mb-4">
              {pullQuote.quote}
            </blockquote>
            <footer className="text-sm">
              <span className="font-medium text-foreground">— {pullQuote.author}</span>
              <span className="text-muted-foreground">, {pullQuote.role}</span>
            </footer>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default ExecutiveSummary;
