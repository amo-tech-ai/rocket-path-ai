import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MEDDPICCScorecard, type MEDDPICCElements } from '@/components/investors/MEDDPICCScorecard';

const mockElements: MEDDPICCElements = {
  metrics: { score: 5, evidence: 'Clear ROI multiple' },
  economic_buyer: { score: 4, evidence: 'Direct GP access' },
  decision_criteria: { score: 3, evidence: 'Partial thesis match' },
  decision_process: { score: 2, evidence: 'Complex IC' },
  paper_process: { score: 4, evidence: 'Standard terms' },
  identify_pain: { score: 5, evidence: 'Fills portfolio gap' },
  champion: { score: 1, evidence: 'Cold outreach only' },
  competition: { score: 3, evidence: 'One competing deal' },
};

describe('MEDDPICCScorecard', () => {
  it('renders all 8 MEDDPICC elements', () => {
    render(<MEDDPICCScorecard elements={mockElements} />);
    expect(screen.getByText('Metrics')).toBeInTheDocument();
    expect(screen.getByText('Economic Buyer')).toBeInTheDocument();
    expect(screen.getByText('Decision Criteria')).toBeInTheDocument();
    expect(screen.getByText('Decision Process')).toBeInTheDocument();
    expect(screen.getByText('Paper Process')).toBeInTheDocument();
    expect(screen.getByText('Identify Pain')).toBeInTheDocument();
    expect(screen.getByText('Champion')).toBeInTheDocument();
    expect(screen.getByText('Competition')).toBeInTheDocument();
  });

  it('shows correct total score', () => {
    render(<MEDDPICCScorecard elements={mockElements} />);
    // 5+4+3+2+4+5+1+3 = 27
    expect(screen.getByText('27')).toBeInTheDocument();
    expect(screen.getByText('/40')).toBeInTheDocument();
  });

  it('shows Consider verdict for score 20-27', () => {
    render(<MEDDPICCScorecard elements={mockElements} />);
    expect(screen.getByText('Consider')).toBeInTheDocument();
  });

  it('shows Pursue verdict for score >= 28', () => {
    const highElements: MEDDPICCElements = {
      metrics: { score: 5, evidence: '' },
      economic_buyer: { score: 4, evidence: '' },
      decision_criteria: { score: 4, evidence: '' },
      decision_process: { score: 4, evidence: '' },
      paper_process: { score: 4, evidence: '' },
      identify_pain: { score: 4, evidence: '' },
      champion: { score: 4, evidence: '' },
      competition: { score: 4, evidence: '' },
    };
    render(<MEDDPICCScorecard elements={highElements} />);
    expect(screen.getByText('Pursue')).toBeInTheDocument();
  });

  it('shows Deprioritize verdict for score < 20', () => {
    const lowElements: MEDDPICCElements = {
      metrics: { score: 2, evidence: '' },
      economic_buyer: { score: 2, evidence: '' },
      decision_criteria: { score: 2, evidence: '' },
      decision_process: { score: 2, evidence: '' },
      paper_process: { score: 2, evidence: '' },
      identify_pain: { score: 2, evidence: '' },
      champion: { score: 2, evidence: '' },
      competition: { score: 2, evidence: '' },
    };
    render(<MEDDPICCScorecard elements={lowElements} />);
    expect(screen.getByText('Deprioritize')).toBeInTheDocument();
  });

  it('renders individual score badges', () => {
    render(<MEDDPICCScorecard elements={mockElements} />);
    // Check that score badges exist (5, 4, 3, 2, etc.)
    const badges = screen.getAllByText('5');
    expect(badges.length).toBeGreaterThanOrEqual(2); // metrics + identify_pain
  });

  it('shows MEDDPICC Qualification title', () => {
    render(<MEDDPICCScorecard elements={mockElements} />);
    expect(screen.getByText('MEDDPICC Qualification')).toBeInTheDocument();
  });
});
