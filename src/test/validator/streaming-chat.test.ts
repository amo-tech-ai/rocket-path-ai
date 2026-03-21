import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import { join } from 'path';

/**
 * Streaming AI Chat Integration Tests
 *
 * Verifies:
 * 1. callGeminiChatStream exists in shared gemini module
 * 2. ai-chat EF imports and uses streaming
 * 3. Frontend hook sends stream: true
 * 4. Realtime hook has token_chunk handler
 */

const ROOT = join(__dirname, '..', '..', '..');
const SHARED = join(ROOT, 'supabase', 'functions', '_shared');
const AI_CHAT = join(ROOT, 'supabase', 'functions', 'ai-chat');
const HOOKS = join(ROOT, 'src', 'hooks', 'realtime');

function readFile(path: string): string {
  return readFileSync(path, 'utf-8');
}

describe('Streaming — Shared Gemini Module', () => {
  const geminiSource = readFile(join(SHARED, 'gemini.ts'));

  it('exports callGeminiChatStream function', () => {
    expect(geminiSource).toContain('export async function callGeminiChatStream');
  });

  it('uses streamGenerateContent endpoint', () => {
    expect(geminiSource).toContain('streamGenerateContent?alt=sse');
  });

  it('has onChunk callback parameter', () => {
    expect(geminiSource).toContain('onChunk: (chunk: string) => void');
  });

  it('uses ReadableStream reader for SSE parsing', () => {
    expect(geminiSource).toContain('response.body.getReader()');
    expect(geminiSource).toContain('TextDecoder');
  });

  it('parses SSE data: prefix', () => {
    expect(geminiSource).toContain("data: ");
  });

  it('skips thinking tokens', () => {
    expect(geminiSource).toContain('part.thought');
  });

  it('has deadline safety', () => {
    expect(geminiSource).toContain('Stream deadline exceeded');
  });

  it('returns GeminiChatResult', () => {
    expect(geminiSource).toContain('Promise<GeminiChatResult>');
  });
});

describe('Streaming — ai-chat Edge Function', () => {
  const aiChatSource = readFile(join(AI_CHAT, 'index.ts'));

  it('imports callGeminiChatStream', () => {
    expect(aiChatSource).toContain('callGeminiChatStream');
  });

  it('checks canStream for coaching modes', () => {
    expect(aiChatSource).toContain('const canStream = stream && room_id && context?.startup_id');
  });

  it('checks canStreamAuth for authenticated modes', () => {
    expect(aiChatSource).toContain('const canStreamAuth = stream && !isPublicMode');
  });

  it('broadcasts token_chunk events', () => {
    expect(aiChatSource).toContain("event: 'token_chunk'");
    expect(aiChatSource).toContain('payload: { messageId, token: chunk }');
  });

  it('broadcasts message_complete after streaming', () => {
    expect(aiChatSource).toContain('streamComplete: true');
  });

  it('resolves room_id from context fallback', () => {
    expect(aiChatSource).toContain('explicit_room_id || (context as Record<string, unknown>)?.room_id');
  });

  it('logs chunk count', () => {
    expect(aiChatSource).toContain('Streamed');
    expect(aiChatSource).toContain('chunks');
  });
});

describe('Streaming — Frontend Hook', () => {
  const hookSource = readFile(join(HOOKS, 'useRealtimeAIChat.ts'));

  it('sends stream: true in request body', () => {
    expect(hookSource).toContain('stream: true');
  });

  it('has token_chunk event listener', () => {
    expect(hookSource).toContain("event: 'token_chunk'");
  });

  it('has handleTokenChunk handler that accumulates chunks', () => {
    expect(hookSource).toContain('handleTokenChunk');
    expect(hookSource).toContain('streamBufferRef.current += token');
  });

  it('sets isStreaming state', () => {
    expect(hookSource).toContain('isStreaming: true');
  });

  it('creates streaming message with incremental content', () => {
    expect(hookSource).toContain('content: streamBufferRef.current');
  });
});
