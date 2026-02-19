import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Play } from "lucide-react";
import { Link } from "react-router-dom";

const FeaturesHero = () => {
  return (
    <section className="section-marketing bg-background pt-32 md:pt-40">
      <div className="container-marketing text-center">
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="eyebrow"
        >
          Features
        </motion.p>
        
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="headline-xl text-foreground mt-4 mb-6"
        >
          Everything a founder needs.
          <br />
          One connected system.
        </motion.h1>
        
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="body-lg max-w-2xl mx-auto mb-10"
        >
          Strategy, execution, investors, and progress — finally working together.
        </motion.p>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Button size="lg" className="btn-primary" asChild>
            <Link to="/login">
              Explore the system
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button size="lg" variant="outline" className="btn-secondary" asChild>
            <Link to="/how-it-works">
              <Play className="mr-2 h-4 w-4" />
              See how it works
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturesHero;
