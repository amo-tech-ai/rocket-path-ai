import { describe, it, expect } from 'vitest';
import { 
  getScoreLabel, 
  parseTractionValue, 
  parseFundingStatus,
  MRR_LABELS,
} from '../step4/constants';
import { SIGNAL_LABELS, TOPICS, normalizeTopic } from '../step3/constants';

describe('Onboarding Step Constants', () => {
  describe('Step 3 constants', () => {
    it('has correct signal labels', () => {
      expect(SIGNAL_LABELS.b2b_saas.label).toBe('B2B SaaS');
      expect(SIGNAL_LABELS.has_revenue.label).toBe('Has Revenue');
    });

    it('has all topics', () => {
      expect(TOPICS).toContain('Business Model');
      expect(TOPICS).toContain('Market');
      expect(TOPICS).toContain('Traction');
    });

    it('normalizes topics correctly', () => {
      expect(normalizeTopic('Business Model')).toBe('businessmodel');
      expect(normalizeTopic('business_model')).toBe('businessmodel');
    });
  });

  describe('Step 4 constants', () => {
    it('getScoreLabel returns correct labels', () => {
      expect(getScoreLabel(90).label).toBe('EXCELLENT');
      expect(getScoreLabel(75).label).toBe('STRONG');
      expect(getScoreLabel(60).label).toBe('GOOD');
      expect(getScoreLabel(45).label).toBe('FAIR');
      expect(getScoreLabel(30).label).toBe('EARLY');
    });

    it('parseTractionValue handles string keys', () => {
      expect(parseTractionValue('10k_50k', MRR_LABELS)).toBe('$10K - $50K');
      expect(parseTractionValue('unknown', MRR_LABELS)).toBe('Not set');
    });

    it('parseTractionValue handles numbers', () => {
      expect(parseTractionValue(1500, MRR_LABELS)).toBe('1,500');
    });

    it('parseFundingStatus handles various states', () => {
      expect(parseFundingStatus(undefined)).toBe('Not set');
      expect(parseFundingStatus({ is_raising: false })).toBe('Not raising');
      expect(parseFundingStatus({ is_raising: true, target_amount: 500000 })).toBe('Raising $500,000');
      expect(parseFundingStatus({ is_raising: true })).toBe('Currently raising');
    });
  });
});
