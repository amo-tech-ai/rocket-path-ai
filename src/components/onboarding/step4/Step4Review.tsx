/**
 * Step 4 Review Component
 * Final review with AI summary, investor score, and optional deep analysis pack
 * Task 29: Added Prompt Pack integration for deep analysis
 */

import { useState } from 'react';
import { WizardFormData, InvestorScore, AISummary } from '@/hooks/useWizardSession';
import { Sparkles } from 'lucide-react';

// Sub-components
import InvestorScoreCard from './InvestorScoreCard';
import AISummaryCard from './AISummaryCard';
import CompanyDetailsCard from './CompanyDetailsCard';
import TractionFundingCard from './TractionFundingCard';
import CompleteButton from './CompleteButton';

// Task 29: Prompt Pack integration
import { Button } from '@/components/ui/button';
import { usePromptPack } from '@/hooks/usePromptPack';
import { PackExecutionDrawer } from '@/components/ai/PackExecutionDrawer';

interface Step4ReviewProps {
  data: WizardFormData;
  sessionTraction?: Record<string, unknown> | null;  // Session-level traction data
  sessionFunding?: Record<string, unknown> | null;   // Session-level funding data
  onUpdate: (updates: Partial<WizardFormData>) => void;
  investorScore: InvestorScore | null;
  aiSummary: AISummary | null;
  onRecalculateScore: () => void;
  onRegenerateSummary: () => void;
  onComplete: () => void;
  isCalculatingScore: boolean;
  isGeneratingSummary: boolean;
  isCompleting: boolean;
}

export function Step4Review({
  data,
  sessionTraction,
  sessionFunding,
  onUpdate,
  investorScore,
  aiSummary,
  onRecalculateScore,
  onRegenerateSummary,
  onComplete,
  isCalculatingScore,
  isGeneratingSummary,
  isCompleting,
}: Step4ReviewProps) {
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    summary: true,
    company: false,
    traction: false,
  });

  // Task 29: Pack execution state
  const [showPackDrawer, setShowPackDrawer] = useState(false);
  const {
    runPack,
    applyResults,
    isExecuting,
    currentPack,
    currentStep: packStep,
    progress,
    error: packError,
  } = usePromptPack({
    onPackComplete: (result) => {
      console.log('[Step4Review] Pack completed:', result);
    },
  });

  const toggleSection = (section: string) => {
    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  // Task 29: Run deep analysis pack
  const handleRunDeepAnalysis = async () => {
    const industry = Array.isArray(data.industry) ? data.industry[0] : data.industry;
    
    setShowPackDrawer(true);
    
    await runPack({
      module: 'validator',
      industry: industry,
      stage: data.stage || 'Idea',
      initialContext: {
        company_name: data.company_name,
        description: data.description,
        website_url: data.website_url,
        key_features: data.key_features,
      },
    });
  };

  // Generate mock steps for the drawer if pack not loaded yet
  const packSteps = currentPack?.steps || [
    { id: '1', step_number: 1, title: 'Market Analysis', status: 'pending' as const },
    { id: '2', step_number: 2, title: 'Competitor Scan', status: 'pending' as const },
    { id: '3', step_number: 3, title: 'Team Assessment', status: 'pending' as const },
    { id: '4', step_number: 4, title: 'Investment Thesis', status: 'pending' as const },
  ];

  return (
    <div className="space-y-6">
      {/* Investor Score Card */}
      <InvestorScoreCard
        investorScore={investorScore}
        isCalculating={isCalculatingScore}
        onRecalculate={onRecalculateScore}
      />

      {/* AI Summary */}
      <AISummaryCard
        aiSummary={aiSummary}
        isGenerating={isGeneratingSummary}
        isOpen={openSections.summary}
        onToggle={() => toggleSection('summary')}
        onRegenerate={onRegenerateSummary}
      />

      {/* Task 29: Deep Analysis Pack Section */}
      <div className="p-4 border rounded-lg bg-gradient-to-br from-primary/5 to-background">
        <div className="flex items-start gap-4">
          <div className="p-2 rounded-lg bg-primary/10">
            <Sparkles className="h-5 w-5 text-primary" />
          </div>
          <div className="flex-1">
            <h3 className="font-medium mb-1">Deep Analysis Pack</h3>
            <p className="text-sm text-muted-foreground mb-3">
              Run a multi-step AI analysis for comprehensive market insights, competitor mapping, and investment thesis generation.
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={handleRunDeepAnalysis}
              disabled={isExecuting}
              className="gap-2"
            >
              <Sparkles className="h-4 w-4" />
              {isExecuting ? 'Running Analysis...' : 'Run Deep Analysis'}
            </Button>
          </div>
        </div>
      </div>

      {/* Company Details */}
      <CompanyDetailsCard
        data={data}
        isOpen={openSections.company}
        onToggle={() => toggleSection('company')}
      />

      {/* Traction & Funding - pass session data as source of truth */}
      <TractionFundingCard
        data={data}
        sessionTraction={sessionTraction}
        sessionFunding={sessionFunding}
        isOpen={openSections.traction}
        onToggle={() => toggleSection('traction')}
      />

      {/* Complete Button */}
      <CompleteButton
        isCompleting={isCompleting}
        onComplete={onComplete}
      />

      {/* Task 29: Pack Execution Drawer */}
      <PackExecutionDrawer
        open={showPackDrawer}
        onOpenChange={setShowPackDrawer}
        packName={currentPack?.name || 'Deep Analysis Pack'}
        steps={packSteps}
        currentStep={packStep}
        progress={progress}
        isExecuting={isExecuting}
        error={packError}
        onCancel={() => setShowPackDrawer(false)}
        onApplyResults={async () => {
          if (currentPack?.id) {
            await applyResults(currentPack.id, 'startups');
          }
          setShowPackDrawer(false);
        }}
      />
    </div>
  );
}

export default Step4Review;
