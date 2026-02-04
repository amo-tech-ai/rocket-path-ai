/**
 * Step 1 Validation Tests
 * Unit tests for Step 1 form validation
 */

import { describe, it, expect } from 'vitest';
import { validateStep1, Step1ValidationErrors } from '../lib/step1Schema';

describe('step1Validation', () => {
  describe('validateStep1', () => {
    it('should pass with valid data', () => {
      const data = {
        company_name: 'Test Company',
        description: 'A test company description that is long enough',
        target_market: 'Enterprise',
        industry: ['Technology'],
        business_model: ['SaaS'],
        stage: 'Seed',
      };

      const result = validateStep1(data);
      expect(result.isValid).toBe(true);
      expect(result.errors).toEqual({});
    });

    it('should fail with missing required fields', () => {
      const data = {
        company_name: '',
        description: '',
      };

      const result = validateStep1(data);
      expect(result.isValid).toBe(false);
      expect(result.errors.company_name).toBeTruthy();
      expect(result.errors.description).toBeTruthy();
    });

    it('should fail with short target_market', () => {
      const data = {
        company_name: 'Test Company',
        description: 'A test company description that is long enough',
        target_market: 'Short', // Less than 10 characters
        stage: 'Seed',
        business_model: ['SaaS'],
        industry: ['Technology'],
      };

      const result = validateStep1(data);
      // target_market requires min(10), so validation should fail
      expect(result.isValid).toBe(false);
      // Should have target_market error (too short)
      expect(result.errors.target_market).toBeTruthy();
    });

    it('should require at least one business model', () => {
      const data = {
        company_name: 'Test Company',
        description: 'A test company description that is long enough',
        target_market: 'Enterprise',
        business_model: [],
      };

      const result = validateStep1(data);
      expect(result.isValid).toBe(false);
      expect(result.errors.business_model).toBeTruthy();
    });
  });
});
