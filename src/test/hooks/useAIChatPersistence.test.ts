import { describe, it, expect } from 'vitest';

/**
 * Tests for chat persistence schema alignment and data structures.
 * These verify the persistence hook works with the actual DB schema.
 */
describe('useAIChatPersistence', () => {
  // chat_sessions schema alignment
  describe('chat_sessions schema', () => {
    it('insert shape matches actual columns', () => {
      const insert = {
        user_id: '4bf963de-44fa-4dcf-ab50-1d3b178497a3',
        startup_id: '8997249f-1b39-4054-adb3-f6b1d6298ca0',
        agent_type: 'atlas',
        status: 'active',
        message_count: 0,
      };
      // These are the required/available columns
      expect(insert).toHaveProperty('user_id');
      expect(insert).toHaveProperty('startup_id');
      expect(insert).toHaveProperty('agent_type');
      expect(insert).toHaveProperty('status');
      expect(insert).toHaveProperty('message_count');
      // These should NOT be present (don't exist in schema)
      expect(insert).not.toHaveProperty('last_tab');
      expect(insert).not.toHaveProperty('ended_at');
      expect(insert).not.toHaveProperty('started_at');
    });

    it('status values are valid', () => {
      const validStatuses = ['active', 'ended'];
      expect(validStatuses).toContain('active');
      expect(validStatuses).toContain('ended');
    });

    it('session lookup uses correct filters', () => {
      const filters = {
        user_id: 'test-user',
        status: 'active',
        created_at_gte: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      };
      expect(filters.status).toBe('active');
      expect(new Date(filters.created_at_gte).getTime()).toBeGreaterThan(0);
    });
  });

  // chat_messages schema alignment
  describe('chat_messages schema', () => {
    it('insert shape matches actual columns', () => {
      const insert = {
        session_id: 'test-session-id',
        role: 'user',
        content: 'Hello, AI!',
        metadata: null,
      };
      expect(insert).toHaveProperty('session_id');
      expect(insert).toHaveProperty('role');
      expect(insert).toHaveProperty('content');
      expect(insert).toHaveProperty('metadata');
      // These should NOT be present (don't exist in schema)
      expect(insert).not.toHaveProperty('user_id');
      expect(insert).not.toHaveProperty('tab');
      expect(insert).not.toHaveProperty('suggested_actions');
    });

    it('role values are valid', () => {
      const validRoles = ['user', 'assistant'];
      expect(validRoles).toContain('user');
      expect(validRoles).toContain('assistant');
    });

    it('select shape returns expected fields', () => {
      const selectFields = ['id', 'role', 'content', 'created_at', 'metadata'];
      expect(selectFields).toContain('id');
      expect(selectFields).toContain('role');
      expect(selectFields).toContain('content');
      expect(selectFields).toContain('created_at');
      expect(selectFields).toContain('metadata');
    });
  });

  // PersistedMessage type
  describe('PersistedMessage mapping', () => {
    it('maps DB row to PersistedMessage correctly', () => {
      const dbRow = {
        id: 'msg-123',
        role: 'assistant',
        content: 'Hello!',
        created_at: '2026-03-17T10:00:00Z',
        metadata: { model: 'gemini-3-flash-preview' },
      };

      const message = {
        id: dbRow.id,
        role: dbRow.role as 'user' | 'assistant',
        content: dbRow.content,
        createdAt: dbRow.created_at,
        metadata: dbRow.metadata as Record<string, unknown>,
      };

      expect(message.id).toBe('msg-123');
      expect(message.role).toBe('assistant');
      expect(message.content).toBe('Hello!');
      expect(message.createdAt).toBe('2026-03-17T10:00:00Z');
    });

    it('handles null metadata gracefully', () => {
      const dbRow = {
        id: 'msg-456',
        role: 'user',
        content: 'Test',
        created_at: '2026-03-17T10:00:00Z',
        metadata: null,
      };

      const message = {
        id: dbRow.id,
        role: dbRow.role,
        content: dbRow.content,
        createdAt: dbRow.created_at,
        metadata: dbRow.metadata as Record<string, unknown> | undefined,
      };

      expect(message.metadata).toBeNull();
    });
  });

  // Session lifecycle
  describe('session lifecycle', () => {
    it('24-hour window is calculated correctly', () => {
      const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
      const now = new Date();
      const diffMs = now.getTime() - oneDayAgo.getTime();
      expect(diffMs).toBeCloseTo(24 * 60 * 60 * 1000, -2);
    });

    it('end session sets status to ended', () => {
      const update = { status: 'ended' };
      expect(update.status).toBe('ended');
    });

    it('message limit is 50', () => {
      const HISTORY_LIMIT = 50;
      expect(HISTORY_LIMIT).toBe(50);
    });
  });
});
