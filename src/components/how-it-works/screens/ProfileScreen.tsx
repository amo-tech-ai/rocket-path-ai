import { motion } from "framer-motion";
import { Check } from "lucide-react";

interface ProfileScreenProps {
  uiState: string | null;
  isCompleted?: boolean;
}

const ProfileScreen = ({ uiState, isCompleted = false }: ProfileScreenProps) => {
  const showFocusRing = uiState === 'focus-url' || uiState === 'typing';
  const showAutofill = uiState === 'show-autofill' || uiState === 'click-continue' || isCompleted;
  const isButtonPressed = uiState === 'click-continue';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h3 className="font-display text-xl font-medium text-foreground">
          Startup Profile Wizard
        </h3>
        <p className="text-sm text-muted-foreground mt-1">
          Tell us about your company
        </p>
      </div>

      {/* Form Fields */}
      <div className="space-y-4">
        {/* Startup Name - Pre-filled */}
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-foreground">Startup Name</label>
          <div className="px-3 py-2.5 rounded-lg border border-border bg-secondary/30 text-sm">
            VertexAI
          </div>
        </div>

        {/* Website URL - Interactive target */}
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-foreground">Website URL</label>
          <motion.div
            className={`px-3 py-2.5 rounded-lg border text-sm transition-all duration-200 ${
              showFocusRing 
                ? 'border-sage ring-2 ring-sage/40 bg-card' 
                : 'border-border bg-secondary/30'
            }`}
            animate={{ scale: showFocusRing ? 1.01 : 1 }}
          >
            <span className={`${showFocusRing ? 'text-foreground' : 'text-muted-foreground'}`}>
              {uiState === 'typing' || showAutofill ? 'https://vertex-ai.io' : 'Enter your website...'}
            </span>
            {uiState === 'typing' && (
              <motion.span
                className="inline-block w-0.5 h-4 bg-sage ml-0.5"
                animate={{ opacity: [1, 0] }}
                transition={{ duration: 0.5, repeat: Infinity }}
              />
            )}
          </motion.div>
        </div>

        {/* Industry - Auto-filled */}
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-foreground">Industry</label>
          <motion.div
            className="px-3 py-2.5 rounded-lg border border-border bg-secondary/30 text-sm flex items-center justify-between"
            initial={false}
            animate={{ 
              borderColor: showAutofill ? 'hsl(var(--sage) / 0.5)' : undefined,
            }}
          >
            <span className={showAutofill ? 'text-foreground' : 'text-muted-foreground'}>
              {showAutofill ? 'AI Infrastructure' : 'Auto-detected...'}
            </span>
            {showAutofill && (
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center gap-1"
              >
                <Check className="w-4 h-4 text-sage" />
                <span className="text-xs text-muted-foreground">(auto)</span>
              </motion.div>
            )}
          </motion.div>
        </div>

        {/* Stage - Auto-filled */}
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-foreground">Stage</label>
          <motion.div
            className="px-3 py-2.5 rounded-lg border border-border bg-secondary/30 text-sm flex items-center justify-between"
            initial={false}
            animate={{ 
              borderColor: showAutofill ? 'hsl(var(--sage) / 0.5)' : undefined,
            }}
          >
            <span className={showAutofill ? 'text-foreground' : 'text-muted-foreground'}>
              {showAutofill ? 'Pre-seed' : 'Auto-detected...'}
            </span>
            {showAutofill && (
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.15 }}
                className="flex items-center gap-1"
              >
                <Check className="w-4 h-4 text-sage" />
                <span className="text-xs text-muted-foreground">(auto)</span>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>

      {/* Footer with Progress and Button */}
      <div className="flex items-center justify-between pt-2">
        {/* Progress Dots */}
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-border" />
          <div className="w-2 h-2 rounded-full bg-border" />
          <div className="w-2 h-2 rounded-full bg-sage" />
          <div className="w-2 h-2 rounded-full bg-border" />
        </div>

        {/* Continue Button */}
        <motion.button
          className="px-4 py-2 rounded-lg bg-sage text-sage-foreground text-sm font-medium flex items-center gap-2"
          animate={{
            scale: isButtonPressed ? 0.95 : 1,
            backgroundColor: isButtonPressed ? 'hsl(var(--sage) / 0.9)' : undefined,
          }}
          transition={{ duration: 0.1 }}
        >
          Continue
          <span>→</span>
        </motion.button>
      </div>
    </div>
  );
};

export default ProfileScreen;
