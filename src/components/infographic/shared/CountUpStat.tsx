import { useEffect, useRef } from "react";
import { animate, useInView, motion, useMotionValue, useTransform } from "framer-motion";

interface CountUpStatProps {
  value: number;
  duration?: number;
  suffix?: string;
  prefix?: string;
  className?: string; // Additional classes for styling the text
  decimals?: number; // Number of decimal places
}

const CountUpStat = ({
  value,
  duration = 2,
  suffix = "",
  prefix = "",
  className = "",
  decimals = 0,
}: CountUpStatProps) => {
  const nodeRef = useRef<HTMLSpanElement>(null);
  const isInView = useInView(nodeRef, { once: true, margin: "-100px" });

  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) =>
    latest.toFixed(decimals)
  );

  useEffect(() => {
    if (isInView) {
      const controls = animate(count, value, { duration, ease: "circOut" });
      return controls.stop;
    }
  }, [isInView, value, duration, count]);

  return (
    <span ref={nodeRef} className={className}>
      {prefix}
      <motion.span>{rounded}</motion.span>
      {suffix}
    </span>
  );
};

export default CountUpStat;
