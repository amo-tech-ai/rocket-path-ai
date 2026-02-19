import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Quote } from "lucide-react";

interface PullQuoteProps {
  quote: string;
  attribution?: string;
  variant?: "default" | "callout" | "editorial";
}

const PullQuote = ({ quote, attribution, variant = "default" }: PullQuoteProps) => {
  const ref = useRef<HTMLQuoteElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  const variants = {
    default: "border-l-4 border-primary pl-6 py-2",
    callout: "bg-sage-light rounded-xl p-6 border border-sage/20",
    editorial: "text-center py-8 max-w-2xl mx-auto"
  };

  return (
    <motion.blockquote
      ref={ref}
      initial={{ opacity: 0, y: 12 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={variants[variant]}
    >
      {variant === "editorial" && (
        <Quote className="w-8 h-8 text-primary/20 mx-auto mb-4" />
      )}
      <p className={`font-display ${variant === "editorial" ? "text-2xl md:text-3xl" : "text-lg md:text-xl"} font-medium text-foreground leading-relaxed`}>
        "{quote}"
      </p>
      {attribution && (
        <cite className="block mt-3 text-sm text-muted-foreground not-italic">
          — {attribution}
        </cite>
      )}
    </motion.blockquote>
  );
};

export default PullQuote;
