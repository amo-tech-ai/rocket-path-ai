/**
 * Agent Loader Utility
 *
 * Loads prompt fragments and chat mode prompts at runtime inside Supabase Edge Functions.
 * Fragments are markdown files appended to system prompts to inject domain knowledge.
 *
 * Usage:
 *   import { loadFragment } from '../../../agency/lib/agent-loader.ts'
 *   const fragment = await loadFragment('validator-scoring-fragment')
 *   const systemPrompt = `${basePrompt}\n\n${fragment}`
 */

const PROMPTS_DIR = new URL('../prompts/', import.meta.url)
const CHAT_MODES_DIR = new URL('../chat-modes/', import.meta.url)

// Module-scope cache: populated on first read, persists for Deno Deploy isolate lifetime
const fragmentCache = new Map<string, string>()
const chatModeCache = new Map<string, string>()

/**
 * Load an edge function prompt fragment by name.
 * Returns the markdown content as a string, or empty string on failure.
 * Cached after first read — no repeated disk I/O.
 */
export async function loadFragment(name: string): Promise<string> {
  const cached = fragmentCache.get(name)
  if (cached !== undefined) return cached

  try {
    const path = new URL(`${name}.md`, PROMPTS_DIR)
    const content = await Deno.readTextFile(path)
    fragmentCache.set(name, content)
    return content
  } catch {
    console.warn(`[agent-loader] Fragment not found: ${name}`)
    fragmentCache.set(name, '')
    return ''
  }
}

/**
 * Load a chat mode system prompt by name.
 * Returns the markdown content as a string, or empty string on failure.
 * Cached after first read.
 */
export async function loadChatMode(name: string): Promise<string> {
  const cached = chatModeCache.get(name)
  if (cached !== undefined) return cached

  try {
    const path = new URL(`${name}.md`, CHAT_MODES_DIR)
    const content = await Deno.readTextFile(path)
    chatModeCache.set(name, content)
    return content
  } catch {
    console.warn(`[agent-loader] Chat mode not found: ${name}`)
    chatModeCache.set(name, '')
    return ''
  }
}

/** Clear all caches — for dev iteration only */
export function bustCache(): void {
  fragmentCache.clear()
  chatModeCache.clear()
}

/** Diagnostic: which fragments have been loaded this isolate */
export function getLoadedFragments(): string[] {
  return [...fragmentCache.keys()].filter(k => fragmentCache.get(k) !== '')
}

/** Available prompt fragments */
export const FRAGMENTS = [
  'validator-scoring-fragment',
  'validator-composer-fragment',
  'crm-investor-fragment',
  'sprint-agent-fragment',
  'pitch-deck-fragment',
] as const

/** Available chat modes */
export const CHAT_MODES = [
  'practice-pitch',
  'growth-strategy',
  'deal-review',
  'canvas-coach',
] as const

export type FragmentName = (typeof FRAGMENTS)[number]
export type ChatModeName = (typeof CHAT_MODES)[number]
