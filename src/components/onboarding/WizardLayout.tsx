import { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import StepProgress, { WizardStep } from './StepProgress';

interface WizardLayoutProps {
  children: ReactNode;
  aiPanel?: ReactNode;
  currentStep: number;
  completedSteps: number[];
  steps: WizardStep[];
  onStepChange?: (step: number) => void;
  onSaveLater?: () => void;
  isSaving?: boolean;
}

export function WizardLayout({
  children,
  aiPanel,
  currentStep,
  completedSteps,
  steps,
  onStepChange,
  onSaveLater,
  isSaving,
}: WizardLayoutProps) {
  return (
    <div className="min-h-screen bg-background flex">
      {/* Left Panel - Step Progress (256px) */}
      <aside className="hidden lg:flex w-64 border-r border-border bg-sidebar flex-col">
        {/* Logo */}
        <div className="h-16 flex items-center px-4 border-b border-sidebar-border">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-sidebar-primary flex items-center justify-center">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-sidebar-primary-foreground"
              >
                <path d="M12 2L2 7l10 5 10-5-10-5z" />
                <path d="M2 17l10 5 10-5" />
                <path d="M2 12l10 5 10-5" />
              </svg>
            </div>
            <span className="font-semibold text-sidebar-foreground">StartupAI</span>
          </Link>
        </div>

        {/* Step Progress */}
        <div className="flex-1 p-4">
          <StepProgress
            currentStep={currentStep}
            completedSteps={completedSteps}
            steps={steps}
            onStepClick={onStepChange}
            onSaveLater={onSaveLater}
            isSaving={isSaving}
          />
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile Header */}
        <header className="h-16 border-b border-border flex items-center justify-between px-4 lg:hidden">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <svg
                width="16"
                height="16"
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
            <span className="font-semibold">StartupAI</span>
          </Link>
          <span className="text-sm text-muted-foreground">
            Step {currentStep} of {steps.length}
          </span>
        </header>

        <div className="flex-1 flex overflow-hidden">
          {/* Center Panel - Main Content (flex) */}
          <main className="flex-1 overflow-y-auto">
            {children}
          </main>

          {/* Right Panel - AI Intelligence (320px) */}
          {aiPanel && (
            <aside className="hidden xl:block w-80 border-l ai-panel overflow-y-auto">
              {aiPanel}
            </aside>
          )}
        </div>
      </div>
    </div>
  );
}

export default WizardLayout;
