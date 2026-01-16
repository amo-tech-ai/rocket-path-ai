import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ChatRequest {
  message: string;
  session_id?: string;
  context?: {
    screen?: string;
    startup_id?: string;
    data?: Record<string, unknown>;
  };
}

interface ChatResponse {
  response: string;
  suggested_actions?: Array<{
    type: string;
    label: string;
    payload?: Record<string, unknown>;
  }>;
  sources?: string[];
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    
    // Get authorization header for user context
    const authHeader = req.headers.get('Authorization');
    
    // Create Supabase client
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: {
        headers: authHeader ? { Authorization: authHeader } : {},
      },
    });

    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      console.log('Auth error or no user:', userError?.message);
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Parse request body
    const body: ChatRequest = await req.json();
    const { message, session_id, context } = body;

    if (!message) {
      return new Response(
        JSON.stringify({ error: 'Message is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Processing message from user ${user.id}:`, message.substring(0, 100));

    // Get user's profile and org
    const { data: profile } = await supabase
      .from('profiles')
      .select('org_id, full_name')
      .eq('id', user.id)
      .single();

    // Get startup context if available
    let startup = null;
    if (context?.startup_id || profile?.org_id) {
      const { data } = await supabase
        .from('startups')
        .select('*')
        .eq('org_id', profile?.org_id)
        .single();
      startup = data;
    }

    // Build context for AI
    const aiContext = {
      user_name: profile?.full_name || 'User',
      startup_name: startup?.name,
      startup_stage: startup?.stage,
      industry: startup?.industry,
      is_raising: startup?.is_raising,
      screen: context?.screen || 'dashboard',
    };

    // For now, return a structured mock response
    // TODO: Integrate with actual AI provider (Gemini/OpenAI)
    const response = generateMockResponse(message, aiContext);

    // Log the AI run
    if (profile?.org_id) {
      await supabase.from('ai_runs').insert({
        user_id: user.id,
        org_id: profile.org_id,
        startup_id: startup?.id,
        agent_name: 'chat-assistant',
        action: 'chat',
        model: 'mock-v1',
        status: 'completed',
        input_tokens: message.length,
        output_tokens: response.response.length,
      });
    }

    // Store chat message if session exists
    if (session_id) {
      await supabase.from('chat_messages').insert([
        {
          session_id,
          user_id: user.id,
          role: 'user',
          content: message,
          tab: context?.screen || 'general',
        },
        {
          session_id,
          user_id: user.id,
          role: 'assistant',
          content: response.response,
          tab: context?.screen || 'general',
          suggested_actions: response.suggested_actions,
        },
      ]);
    }

    return new Response(
      JSON.stringify(response),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in ai-chat function:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

function generateMockResponse(
  message: string, 
  context: Record<string, unknown>
): ChatResponse {
  const lowerMessage = message.toLowerCase();
  const userName = context.user_name || 'there';
  const startupName = context.startup_name || 'your startup';

  // Task-related queries
  if (lowerMessage.includes('task') || lowerMessage.includes('todo') || lowerMessage.includes('priority')) {
    return {
      response: `I can help you prioritize tasks for ${startupName}. Based on your current stage, I'd recommend focusing on:

1. **Customer validation** - Talk to at least 5 potential customers this week
2. **Product iteration** - Ship small, iterate fast
3. **Fundraising prep** - Keep your data room updated

Would you like me to create specific tasks for any of these?`,
      suggested_actions: [
        { type: 'create_task', label: 'Create customer interview task' },
        { type: 'navigate', label: 'View all tasks', payload: { route: '/tasks' } },
      ],
    };
  }

  // Fundraising queries
  if (lowerMessage.includes('fundrais') || lowerMessage.includes('investor') || lowerMessage.includes('pitch')) {
    return {
      response: `For ${startupName}'s fundraising journey, here's what I recommend:

**Immediate priorities:**
- Polish your pitch deck (especially problem-solution fit)
- Build a target investor list of 30-50 names
- Prepare your financial model with realistic projections

**Key metrics to highlight:**
- Monthly growth rate
- Customer acquisition cost
- Lifetime value

Need help with any specific aspect of your fundraise?`,
      suggested_actions: [
        { type: 'navigate', label: 'Go to Investors', payload: { route: '/investors' } },
        { type: 'create_document', label: 'Create pitch deck' },
      ],
    };
  }

  // Growth/strategy queries
  if (lowerMessage.includes('grow') || lowerMessage.includes('strateg') || lowerMessage.includes('scale')) {
    return {
      response: `Great question about growth strategy for ${startupName}!

Based on ${context.industry || 'your industry'}, I'd focus on:

1. **Distribution channels** - Where do your customers hang out?
2. **Retention loops** - What brings users back?
3. **Viral mechanics** - Can users invite others naturally?

The best growth strategies are specific to your business. Tell me more about your current traction and I can give more targeted advice.`,
      suggested_actions: [
        { type: 'navigate', label: 'View CRM', payload: { route: '/crm' } },
      ],
    };
  }

  // Default response
  return {
    response: `Hi ${userName}! I'm your AI startup advisor for ${startupName}. I can help you with:

- **Task prioritization** - What should you focus on today?
- **Fundraising advice** - Investor targeting, pitch prep, and more
- **Strategic planning** - Growth strategies and market positioning
- **Document creation** - Pitch decks, memos, and business plans

What would you like to work on?`,
    suggested_actions: [
      { type: 'navigate', label: 'Dashboard', payload: { route: '/dashboard' } },
      { type: 'navigate', label: 'Tasks', payload: { route: '/tasks' } },
    ],
  };
}
