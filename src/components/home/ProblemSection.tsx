import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";

const ProblemSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const problems = [
    {
      stat: "73%",
      text: "of startups fail due to premature scaling—not from poor ideas, but scattered execution.",
    },
    {
      stat: "12+",
      text: "tools used by the average founder, creating cognitive overload and context switching.",
    },
    {
      stat: "4hrs",
      text: "lost daily to admin work instead of building, selling, or thinking strategically.",
    },
  ];

  return (
    <section ref={ref} className="section-padding bg-secondary/30">
      <div className="container-premium">
        <div className="max-w-4xl mx-auto">
          {/* Section header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-semibold tracking-tight mb-4">
              The real problem isn't effort.
              <br />
              <span className="text-muted-foreground">It's scattered execution.</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Founders don't fail from lack of hustle. They fail from fragmented tools, 
              unclear priorities, and losing sight of what matters.
            </p>
          </motion.div>

          {/* Problem stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {problems.map((problem, index) => (
              <motion.div
                key={problem.stat}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.1 * (index + 1) }}
                className="card-premium p-6 text-center"
              >
                <div className="text-4xl md:text-5xl font-semibold text-foreground mb-3">
                  {problem.stat}
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {problem.text}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProblemSection;
