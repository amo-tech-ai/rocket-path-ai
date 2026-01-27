import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

interface DarkCTASectionProps {
  title: string;
  subtitle?: string;
  primaryButton?: {
    label: string;
    href?: string;
    onClick?: () => void;
  };
  secondaryButton?: {
    label: string;
    href?: string;
    onClick?: () => void;
  };
}

const DarkCTASection = ({ 
  title, 
  subtitle, 
  primaryButton, 
  secondaryButton 
}: DarkCTASectionProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      className="relative overflow-hidden rounded-2xl bg-[#1a1a1a] p-8 md:p-12 lg:p-16"
    >
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent" />
      
      {/* Content */}
      <div className="relative z-10 text-center max-w-2xl mx-auto">
        <h3 className="font-display text-2xl md:text-3xl lg:text-4xl font-semibold text-white mb-4">
          {title}
        </h3>
        
        {subtitle && (
          <p className="text-white/60 mb-8 text-sm md:text-base">
            {subtitle}
          </p>
        )}
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          {primaryButton && (
            <Button
              size="lg"
              className="bg-white text-[#1a1a1a] hover:bg-white/90 rounded-full px-8"
              onClick={primaryButton.onClick}
              asChild={!!primaryButton.href}
            >
              {primaryButton.href ? (
                <a href={primaryButton.href}>
                  {primaryButton.label}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </a>
              ) : (
                <>
                  {primaryButton.label}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>
          )}
          
          {secondaryButton && (
            <Button
              variant="outline"
              size="lg"
              className="border-white/20 text-white hover:bg-white/10 rounded-full px-8"
              onClick={secondaryButton.onClick}
              asChild={!!secondaryButton.href}
            >
              {secondaryButton.href ? (
                <a href={secondaryButton.href}>{secondaryButton.label}</a>
              ) : (
                <>{secondaryButton.label}</>
              )}
            </Button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default DarkCTASection;
