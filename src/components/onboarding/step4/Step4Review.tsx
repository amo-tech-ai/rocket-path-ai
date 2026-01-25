import { useState } from 'react';
import { WizardFormData, InvestorScore, AISummary } from '@/hooks/useWizardSession';

// Sub-components
import InvestorScoreCard from './InvestorScoreCard';
import AISummaryCard from './AISummaryCard';
import CompanyDetailsCard from './CompanyDetailsCard';
import TractionFundingCard from './TractionFundingCard';
import CompleteButton from './CompleteButton';

interface Step4ReviewProps {
  data: WizardFormData;
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

  const toggleSection = (section: string) => {
    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

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

      {/* Company Details */}
      <CompanyDetailsCard
        data={data}
        isOpen={openSections.company}
        onToggle={() => toggleSection('company')}
      />

      {/* Traction & Funding */}
      <TractionFundingCard
        data={data}
        isOpen={openSections.traction}
        onToggle={() => toggleSection('traction')}
      />

      {/* Complete Button */}
      <CompleteButton
        isCompleting={isCompleting}
        onComplete={onComplete}
      />
    </div>
  );
}

export default Step4Review;
