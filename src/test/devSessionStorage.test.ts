/**
 * Dev Session Storage Tests
 * Unit tests for localStorage-based session management
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { getDevSession, saveDevSession, deleteDevSession } from '../lib/devSessionStorage';
import type { WizardSession } from '../hooks/useWizardSession';

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};

  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

describe('devSessionStorage', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe('saveDevSession', () => {
    it('should create new session if none exists', () => {
      const sessionId = saveDevSession({
        current_step: 1,
        status: 'in_progress',
        form_data: {},
      });

      expect(sessionId).toMatch(/^dev-\d+-/);
      
      const session = getDevSession();
      expect(session).toBeTruthy();
      expect(session?.current_step).toBe(1);
      expect(session?.status).toBe('in_progress');
    });

    it('should update existing session', () => {
      const sessionId1 = saveDevSession({
        current_step: 1,
        status: 'in_progress',
        form_data: {},
      });

      const sessionId2 = saveDevSession({
        current_step: 2,
        status: 'in_progress',
      });

      expect(sessionId1).toBe(sessionId2);
      
      const session = getDevSession();
      expect(session?.current_step).toBe(2);
      expect(session?.status).toBe('in_progress');
    });

    it('should merge form_data', () => {
      saveDevSession({
        current_step: 1,
        form_data: { company_name: 'Test Co' },
      });

      saveDevSession({
        form_data: { description: 'Test description' },
      });

      const session = getDevSession();
      expect(session?.form_data).toEqual({
        company_name: 'Test Co',
        description: 'Test description',
      });
    });
  });

  describe('getDevSession', () => {
    it('should return null if no session exists', () => {
      expect(getDevSession()).toBeNull();
    });

    it('should return session if exists', () => {
      saveDevSession({
        current_step: 2,
        status: 'in_progress',
        form_data: { test: 'data' },
      });

      const session = getDevSession();
      expect(session).toBeTruthy();
      expect(session?.current_step).toBe(2);
      expect(session?.form_data).toEqual({ test: 'data' });
    });
  });

  describe('deleteDevSession', () => {
    it('should delete session from localStorage', () => {
      saveDevSession({
        current_step: 1,
        status: 'in_progress',
      });

      expect(getDevSession()).toBeTruthy();

      deleteDevSession();

      expect(getDevSession()).toBeNull();
    });
  });
});
