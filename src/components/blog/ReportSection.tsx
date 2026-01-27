import { useRef, ReactNode } from "react";
import { motion, useInView } from "framer-motion";

interface ReportSectionProps {
  children: ReactNode;
  className?: string;
  dark?: boolean;
  id?: string;
}

const ReportSection = ({ children, className = "", dark = false, id }: ReportSectionProps) => {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.section
      ref={ref}
      id={id}
      initial={{ opacity: 0, y: 12 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={`py-16 md:py-24 ${dark ? 'bg-dark text-dark-foreground' : 'bg-background'} ${className}`}
    >
      <div className="container-premium">
        {children}
      </div>
    </motion.section>
  );
};

export default ReportSection;
