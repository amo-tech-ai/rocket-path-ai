/**
 * AI Capabilities System
 * 
 * Defines what the AI can and cannot do based on authentication state.
 * This is the source of truth for capability gating across the app.
 */

// ============ Types ============

export type AIMode = 'public' | 'authenticated';

export interface AICapability {
  id: string;
  label: string;
  description: string;
  mode: AIMode[];
  category: 'info' | 'action' | 'navigation';
}

export interface GatedActionResult {
  allowed: boolean;
  message?: string;
  action?: 'signup' | 'login' | 'upgrade';
}

// ============ Public Mode Capabilities ============

export const PUBLIC_CAPABILITIES: AICapability[] = [
  {
    id: 'explain_features',
    label: 'Explain Features',
    description: 'Answer questions about StartupAI features and benefits',
    mode: ['public', 'authenticated'],
    category: 'info',
  },
  {
    id: 'pricing_info',
    label: 'Pricing Information',
    description: 'Explain pricing plans and what\'s included',
    mode: ['public', 'authenticated'],
    category: 'info',
  },
  {
    id: 'use_cases',
    label: 'Use Cases',
    description: 'Share how founders use StartupAI with examples',
    mode: ['public', 'authenticated'],
    category: 'info',
  },
  {
    id: 'getting_started',
    label: 'Getting Started',
    description: 'Guide visitors on how to start with StartupAI',
    mode: ['public', 'authenticated'],
    category: 'info',
  },
  {
    id: 'general_startup_tips',
    label: 'General Startup Tips',
    description: 'Provide general startup advice and resources',
    mode: ['public', 'authenticated'],
    category: 'info',
  },
];

// ============ Authenticated Mode Capabilities ============

export const AUTHENTICATED_CAPABILITIES: AICapability[] = [
  ...PUBLIC_CAPABILITIES,
  {
    id: 'task_planning',
    label: 'Task Planning',
    description: 'Generate and prioritize tasks for your startup',
    mode: ['authenticated'],
    category: 'action',
  },
  {
    id: 'startup_analysis',
    label: 'Startup Analysis',
    description: 'Analyze your startup profile and provide insights',
    mode: ['authenticated'],
    category: 'action',
  },
  {
    id: 'pitch_deck_generation',
    label: 'Pitch Deck Generation',
    description: 'Create and refine pitch deck content',
    mode: ['authenticated'],
    category: 'action',
  },
  {
    id: 'document_creation',
    label: 'Document Creation',
    description: 'Generate documents like business plans, proposals',
    mode: ['authenticated'],
    category: 'action',
  },
  {
    id: 'investor_research',
    label: 'Investor Research',
    description: 'Find and analyze potential investors',
    mode: ['authenticated'],
    category: 'action',
  },
  {
    id: 'crm_actions',
    label: 'CRM Actions',
    description: 'Manage contacts and outreach sequences',
    mode: ['authenticated'],
    category: 'action',
  },
  {
    id: 'contextual_guidance',
    label: 'Contextual Guidance',
    description: 'Screen-specific advice based on current context',
    mode: ['authenticated'],
    category: 'info',
  },
  {
    id: 'navigate_app',
    label: 'Navigate App',
    description: 'Help navigate to different sections of the app',
    mode: ['authenticated'],
    category: 'navigation',
  },
];

// ============ Gated Action Keywords ============

const GATED_ACTION_PATTERNS = [
  // Task-related
  { patterns: ['create task', 'generate task', 'add task', 'plan tasks'], action: 'task_planning' },
  { patterns: ['prioritize', 'my tasks', 'task list'], action: 'task_planning' },
  
  // Startup analysis
  { patterns: ['analyze my startup', 'my startup', 'my company', 'our progress'], action: 'startup_analysis' },
  { patterns: ['stage analysis', 'where am i', 'what should i focus'], action: 'startup_analysis' },
  
  // Pitch deck
  { patterns: ['pitch deck', 'create deck', 'generate slides', 'investor presentation'], action: 'pitch_deck_generation' },
  
  // Documents
  { patterns: ['create document', 'business plan', 'generate proposal', 'write executive summary'], action: 'document_creation' },
  
  // Investors
  { patterns: ['find investors', 'investor list', 'who should i pitch', 'vc research'], action: 'investor_research' },
  
  // CRM
  { patterns: ['my contacts', 'add contact', 'outreach', 'follow up', 'email sequence'], action: 'crm_actions' },
  
  // Dashboard/Context
  { patterns: ['my dashboard', 'show me', 'open my', 'go to my'], action: 'contextual_guidance' },
];

// ============ Utility Functions ============

/**
 * Get capabilities for a given mode
 */
export function getCapabilities(mode: AIMode): AICapability[] {
  if (mode === 'authenticated') {
    return AUTHENTICATED_CAPABILITIES;
  }
  return PUBLIC_CAPABILITIES;
}

/**
 * Check if a specific capability is available for a mode
 */
export function hasCapability(mode: AIMode, capabilityId: string): boolean {
  const capabilities = getCapabilities(mode);
  return capabilities.some(c => c.id === capabilityId);
}

/**
 * Check if a user message requires a gated action
 */
export function checkGatedAction(message: string, mode: AIMode): GatedActionResult {
  if (mode === 'authenticated') {
    return { allowed: true };
  }

  const lowerMessage = message.toLowerCase();
  
  for (const gated of GATED_ACTION_PATTERNS) {
    for (const pattern of gated.patterns) {
      if (lowerMessage.includes(pattern)) {
        return {
          allowed: false,
          message: getGatedMessage(gated.action),
          action: 'signup',
        };
      }
    }
  }

  return { allowed: true };
}

/**
 * Get a friendly message for a gated action
 */
function getGatedMessage(actionId: string): string {
  const actionMessages: Record<string, string> = {
    task_planning: "To create and manage tasks for your startup, please sign up or sign in. I'd be happy to tell you more about how StartupAI helps founders prioritize their work!",
    startup_analysis: "To analyze your startup and get personalized insights, please sign up or sign in. StartupAI provides tailored guidance based on your stage and industry.",
    pitch_deck_generation: "To generate pitch decks, please sign up or sign in. Our AI can create investor-ready presentations tailored to your startup story.",
    document_creation: "To create documents, please sign up or sign in. StartupAI helps founders generate professional documents with AI assistance.",
    investor_research: "To research investors matched to your startup, please sign up or sign in. We'll help you find the right investors for your stage and industry.",
    crm_actions: "To manage your contacts and outreach, please sign up or sign in. StartupAI includes powerful CRM tools for founders.",
    contextual_guidance: "To get personalized guidance based on your startup, please sign up or sign in. I'll be able to provide much more helpful advice!",
  };

  return actionMessages[actionId] || "To access this feature, please sign up or sign in.";
}

// ============ Quick Actions by Mode ============

export interface QuickAction {
  id: string;
  label: string;
  prompt: string;
  icon?: string;
}

export const PUBLIC_QUICK_ACTIONS: QuickAction[] = [
  { id: 'features', label: 'What can StartupAI do?', prompt: 'What features does StartupAI offer for founders?' },
  { id: 'pricing', label: 'Pricing plans', prompt: 'What are the pricing plans for StartupAI?' },
  { id: 'how_it_works', label: 'How it works', prompt: 'How does StartupAI help founders build their startups?' },
  { id: 'success_stories', label: 'Success stories', prompt: 'Can you share examples of how founders use StartupAI?' },
];

export const AUTHENTICATED_QUICK_ACTIONS: QuickAction[] = [
  { id: 'status', label: 'My startup status', prompt: 'What\'s the current status of my startup and what should I focus on?' },
  { id: 'tasks', label: 'Prioritize my tasks', prompt: 'Help me prioritize my current tasks for maximum impact.' },
  { id: 'next_steps', label: 'Suggest next steps', prompt: 'What are the most important next steps for my startup?' },
  { id: 'insights', label: 'Key insights', prompt: 'What insights can you share about my startup\'s progress?' },
];

export function getQuickActions(mode: AIMode): QuickAction[] {
  return mode === 'authenticated' ? AUTHENTICATED_QUICK_ACTIONS : PUBLIC_QUICK_ACTIONS;
}

// ============ System Prompts ============

export const PUBLIC_SYSTEM_PROMPT = `You are Atlas, StartupAI's friendly assistant on the public website.

CAPABILITIES:
- Explain StartupAI features and benefits
- Answer pricing and plan questions  
- Share how founders use StartupAI (examples)
- Guide visitors to sign up or log in
- Provide general startup advice and tips

RESTRICTIONS:
- You cannot access any user dashboards or data
- You cannot perform startup planning, tasks, or CRM actions
- You cannot create documents or pitch decks
- You cannot view or analyze any specific startup

When asked to perform restricted actions, respond warmly:
"To [action], please sign up or sign in. I'm happy to explain how StartupAI can help with that!"

PERSONALITY:
- Friendly and helpful
- Concise responses (2-3 sentences when possible)
- Encourage exploration of features
- Highlight value propositions naturally
- Use a conversational, approachable tone

ABOUT STARTUPAI:
StartupAI is an AI-powered platform that helps founders:
- Plan and track their startup journey
- Generate pitch decks and documents
- Manage investor relations and CRM
- Get AI-powered strategic guidance
- Validate ideas and track progress`;

export function getAuthenticatedSystemPrompt(context: {
  startupName?: string;
  stage?: string;
  industry?: string;
  currentRoute?: string;
  completionPercentage?: number;
}): string {
  return `You are Atlas, a senior startup strategist helping ${context.startupName || 'the founder'}.

CURRENT CONTEXT:
- Screen: ${context.currentRoute || 'Dashboard'}
- Stage: ${context.stage || 'Unknown'}
- Industry: ${context.industry || 'Unknown'}
- Completion: ${context.completionPercentage || 0}%

CAPABILITIES:
- Provide stage-specific guidance and recommendations
- Explain metrics and insights on the current screen
- Suggest prioritized next actions based on context
- Generate draft content (with user confirmation)
- Answer strategic questions about fundraising, growth, product
- Navigate the user to relevant sections of the app

RULES:
- Always consider the current screen context
- Offer specific, actionable advice
- Confirm before any database writes or actions
- Reference actual startup data when relevant
- Be concise but thorough

PERSONALITY:
- Expert but approachable
- Data-driven recommendations
- Encouraging but honest
- Action-oriented`;
}
