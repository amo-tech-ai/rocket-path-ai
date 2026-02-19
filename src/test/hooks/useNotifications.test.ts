/**
 * Notifications Library Tests
 * Tests for notification utilities
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { 
  checkNotificationSupport,
  requestNotificationPermission,
  calculateNextReminderTime,
  formatTimeUntilReminder,
  scheduleLocalReminder,
  DEFAULT_OUTREACH_DELAYS,
  type NotificationType,
  type NotificationPayload,
} from '@/lib/notifications';

describe('Notifications Library', () => {
  describe('NotificationType', () => {
    it('has valid notification types', () => {
      const types: NotificationType[] = [
        'outreach_reminder',
        'investor_meeting',
        'task_due',
        'ai_insight',
        'budget_alert',
        'weekly_digest',
      ];
      
      types.forEach(type => {
        expect(typeof type).toBe('string');
      });
    });
  });

  describe('checkNotificationSupport', () => {
    it('returns supported status and permission', () => {
      const result = checkNotificationSupport();
      expect(result).toHaveProperty('supported');
      expect(result).toHaveProperty('permission');
    });
  });

  describe('calculateNextReminderTime', () => {
    it('calculates next reminder based on delay', () => {
      const lastSent = new Date('2026-01-30T10:00:00Z');
      const result = calculateNextReminderTime(lastSent, 1, DEFAULT_OUTREACH_DELAYS);
      
      expect(result).toBeInstanceOf(Date);
      expect(result!.getTime()).toBeGreaterThan(lastSent.getTime());
    });

    it('returns null when sequence is complete', () => {
      const lastSent = new Date();
      const result = calculateNextReminderTime(lastSent, 4, DEFAULT_OUTREACH_DELAYS);
      
      expect(result).toBeNull();
    });

    it('uses correct delay for each stage', () => {
      const lastSent = new Date('2026-01-30T10:00:00Z');
      
      // Stage 0 has 0 day delay
      const stage0 = calculateNextReminderTime(lastSent, 0, DEFAULT_OUTREACH_DELAYS);
      expect(stage0!.getTime()).toBe(lastSent.getTime());
      
      // Stage 1 has 3 day delay
      const stage1 = calculateNextReminderTime(lastSent, 1, DEFAULT_OUTREACH_DELAYS);
      const expectedStage1 = new Date(lastSent);
      expectedStage1.setDate(expectedStage1.getDate() + 3);
      expect(stage1!.getTime()).toBe(expectedStage1.getTime());
    });
  });

  describe('formatTimeUntilReminder', () => {
    it('returns "Overdue" for past dates', () => {
      const pastDate = new Date(Date.now() - 1000 * 60 * 60);
      expect(formatTimeUntilReminder(pastDate)).toBe('Overdue');
    });

    it('returns minutes for times less than an hour away', () => {
      const soonDate = new Date(Date.now() + 1000 * 60 * 30);
      const result = formatTimeUntilReminder(soonDate);
      expect(result).toMatch(/in \d+ minute/);
    });

    it('returns hours for times 1-24 hours away', () => {
      const laterDate = new Date(Date.now() + 1000 * 60 * 60 * 5);
      const result = formatTimeUntilReminder(laterDate);
      expect(result).toMatch(/in \d+ hour/);
    });

    it('returns days for times more than 24 hours away', () => {
      const futureDate = new Date(Date.now() + 1000 * 60 * 60 * 48);
      const result = formatTimeUntilReminder(futureDate);
      expect(result).toMatch(/in \d+ day/);
    });
  });

  describe('scheduleLocalReminder', () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    it('calls callback immediately for past dates', () => {
      const callback = vi.fn();
      const pastDate = new Date(Date.now() - 1000);
      
      scheduleLocalReminder(pastDate, callback);
      
      expect(callback).toHaveBeenCalledTimes(1);
    });

    it('returns cleanup function', () => {
      const callback = vi.fn();
      const futureDate = new Date(Date.now() + 10000);
      
      const cleanup = scheduleLocalReminder(futureDate, callback);
      
      expect(typeof cleanup).toBe('function');
    });

    it('calls callback after delay', () => {
      const callback = vi.fn();
      const futureDate = new Date(Date.now() + 5000);
      
      scheduleLocalReminder(futureDate, callback);
      
      expect(callback).not.toHaveBeenCalled();
      
      vi.advanceTimersByTime(5000);
      
      expect(callback).toHaveBeenCalledTimes(1);
    });

    it('cleanup prevents callback execution', () => {
      const callback = vi.fn();
      const futureDate = new Date(Date.now() + 5000);
      
      const cleanup = scheduleLocalReminder(futureDate, callback);
      cleanup();
      
      vi.advanceTimersByTime(5000);
      
      expect(callback).not.toHaveBeenCalled();
    });

    afterEach(() => {
      vi.useRealTimers();
    });
  });

  describe('DEFAULT_OUTREACH_DELAYS', () => {
    it('has expected delay pattern', () => {
      expect(DEFAULT_OUTREACH_DELAYS).toEqual([0, 3, 7, 14]);
    });

    it('is an array of numbers', () => {
      expect(Array.isArray(DEFAULT_OUTREACH_DELAYS)).toBe(true);
      DEFAULT_OUTREACH_DELAYS.forEach(delay => {
        expect(typeof delay).toBe('number');
      });
    });
  });
});
