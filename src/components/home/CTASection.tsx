import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const CTASection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="section-padding">
      <div className="container-premium">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="max-w-3xl mx-auto text-center"
        >
          {/* Decorative element */}
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-sage-light mb-8">
            <div className="w-8 h-8 rounded-lg bg-sage flex items-center justify-center">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-primary-foreground"
              >
                <path d="M12 2L2 7l10 5 10-5-10-5z" />
                <path d="M2 17l10 5 10-5" />
                <path d="M2 12l10 5 10-5" />
              </svg>
            </div>
          </div>

          <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold tracking-tight mb-6 text-balance">
            Start building with clarity
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
            Join thousands of founders who've replaced tool chaos with a single, 
            intelligent operating system.
          </p>

          <Button variant="hero" size="xl" asChild>
            <Link to="/dashboard">
              Start Your Strategy Session
              <ArrowRight className="w-5 h-5" />
            </Link>
          </Button>

          <p className="mt-6 text-sm text-muted-foreground">
            Free to start • No credit card required
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default CTASection;
