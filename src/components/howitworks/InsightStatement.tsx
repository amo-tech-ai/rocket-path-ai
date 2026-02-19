import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";

const InsightStatement = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="section-padding bg-dark">
      <div className="container-premium text-center">
        <motion.span
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5 }}
          className="text-sm font-semibold tracking-widest text-sage uppercase mb-8 block"
        >
          Step 02
        </motion.span>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="font-display text-3xl md:text-4xl lg:text-5xl font-medium tracking-tight text-dark-foreground mb-6 max-w-3xl mx-auto"
        >
          Your strategy becomes a{" "}
          <span className="text-sage italic">living system</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto"
        >
          Every feature pulls from the same strategy — no sibling drift or contradictions.
        </motion.p>

        {/* Decorative dots */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 0.3 } : {}}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="flex justify-center gap-2 mt-12"
        >
          <div className="w-1.5 h-1.5 rounded-full bg-sage" />
          <div className="w-1.5 h-1.5 rounded-full bg-sage" />
          <div className="w-1.5 h-1.5 rounded-full bg-sage" />
        </motion.div>
      </div>
    </section>
  );
};

export default InsightStatement;
