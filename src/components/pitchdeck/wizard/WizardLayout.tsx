/**
 * Wizard Layout Component
 * 3-panel layout: Left (stepper), Center (form), Right (AI assistant)
 */

import { motion } from 'framer-motion';
import { ReactNode } from 'react';
import { WizardStepper } from './WizardStepper';
import { WizardAIPanel } from './WizardAIPanel';

interface WizardLayoutProps {
  currentStep: number;
  onStepClick: (step: number) => void;
  signalStrength: number;
  children: ReactNode;
  aiContent?: {
    title?: string;
    tips?: string[];
    suggestions?: Array<{ text: string; action?: () => void }>;
    confidenceLevel?: 'low' | 'medium' | 'high';
    confidenceText?: string;
  };
  completedSteps?: number[];
}

const WIZARD_STEPS = [
  { number: 1, title: 'Startup Info', description: 'Tell us about your company' },
  { number: 2, title: 'Market & Traction', description: 'Show the problem and your progress' },
  { number: 3, title: 'Smart Interview', description: 'Answer industry-specific questions' },
  { number: 4, title: 'Review & Generate', description: 'Check your deck details' },
];

export function WizardLayout({
  currentStep,
  onStepClick,
  signalStrength,
  children,
  aiContent,
  completedSteps = [],
}: WizardLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-xl font-display font-semibold text-foreground">
              Create Pitch Deck
            </span>
            <span className="px-2 py-0.5 rounded-full bg-sage/10 text-sage text-xs font-medium">
              Step {currentStep} of 4
            </span>
          </div>
          <div className="text-sm text-muted-foreground">
            Signal Strength: <span className="text-foreground font-medium">{signalStrength}%</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-12 gap-6">
          {/* Left Panel - Stepper */}
          <div className="col-span-12 md:col-span-3 lg:col-span-2">
            <WizardStepper
              steps={WIZARD_STEPS}
              currentStep={currentStep}
              completedSteps={completedSteps}
              onStepClick={onStepClick}
            />
          </div>

          {/* Center Panel - Form */}
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.2 }}
            className="col-span-12 md:col-span-6 lg:col-span-7"
          >
            <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
              {children}
            </div>
          </motion.div>

          {/* Right Panel - AI Assistant */}
          <div className="col-span-12 md:col-span-3 lg:col-span-3">
            <WizardAIPanel
              title={aiContent?.title || 'AI Assistant'}
              tips={aiContent?.tips}
              suggestions={aiContent?.suggestions}
              confidenceLevel={aiContent?.confidenceLevel}
              confidenceText={aiContent?.confidenceText}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
