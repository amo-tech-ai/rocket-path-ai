import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";

const LivingSystemProof = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="py-20 md:py-28 bg-background">
      <div className="container-premium text-center">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="font-display text-2xl md:text-3xl lg:text-4xl font-medium tracking-tight text-dark max-w-3xl mx-auto leading-relaxed"
        >
          This is the core difference:{" "}
          <span className="text-sage italic">one truth, zero drift.</span>{" "}
          Your priorities, pipeline, and analysis all stay aligned automatically.
        </motion.p>
      </div>
    </section>
  );
};

export default LivingSystemProof;
