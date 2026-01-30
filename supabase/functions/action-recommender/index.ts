import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform',
};

interface RecommendedAction {
  id: string;
  title: string;
  description: string;
  module: 'canvas' | 'pitch' | 'tasks' | 'crm' | 'profile' | 'validation';
  impact: 'high' | 'medium' | 'low';
  effort: 'quick' | 'medium' | 'involved';
  route: string;
  priority: number;
  reason: string;
}

interface ActionRecommendation {
  todaysFocus: RecommendedAction[];
  upcomingTasks: Array<{ id: string; title: string; dueDate: string | null }>;
  recentActivity: Array<{ type: string; description: string; timestamp: string }>;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Auth check
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Missing authorization header' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const body = await req.json().catch(() => ({}));
    const { startupId, healthScore } = body;

    if (!startupId) {
      return new Response(
        JSON.stringify({ error: 'Missing startupId' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Verify access
    const { data: membership } = await supabase
      .from('startup_members')
      .select('id')
      .eq('startup_id', startupId)
      .eq('user_id', user.id)
      .single();

    if (!membership) {
      return new Response(
        JSON.stringify({ error: 'Access denied' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const result = await generateRecommendations(supabase, startupId, healthScore);

    console.log(`[action-recommender] StartupId: ${startupId}, Actions: ${result.todaysFocus.length}`);

    return new Response(
      JSON.stringify(result),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('[action-recommender] Error:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Internal error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

async function generateRecommendations(
  supabase: any, 
  startupId: string,
  healthScore?: { breakdown: Record<string, { score: number }> }
): Promise<ActionRecommendation> {
  // Fetch current state
  const [
    startupResult,
    canvasResult,
    pitchDeckResult,
    tasksResult,
    contactsResult,
    activitiesResult,
  ] = await Promise.all([
    supabase.from('startups').select('*, score_breakdown').eq('id', startupId).single(),
    supabase.from('lean_canvases').select('id, completeness_score').eq('startup_id', startupId).limit(1),
    supabase.from('pitch_decks').select('id, status').eq('startup_id', startupId).limit(1),
    supabase.from('tasks').select('id, title, due_date, status, priority').eq('startup_id', startupId).neq('status', 'completed').order('priority').limit(10),
    supabase.from('contacts').select('id, type, last_contacted_at').eq('startup_id', startupId).limit(5),
    supabase.from('activities').select('activity_type, description, created_at').eq('startup_id', startupId).order('created_at', { ascending: false }).limit(10),
  ]);

  const startup = startupResult.data;
  const canvas = canvasResult.data?.[0];
  const pitchDeck = pitchDeckResult.data?.[0];
  const tasks = tasksResult.data || [];
  const contacts = contactsResult.data || [];
  const activities = activitiesResult.data || [];

  const breakdown = healthScore?.breakdown || startup?.score_breakdown || {};
  const recommendations: RecommendedAction[] = [];

  // Priority 1: Canvas incomplete
  if (!canvas || (canvas.completeness_score && canvas.completeness_score < 50)) {
    recommendations.push({
      id: 'complete-canvas',
      title: 'Complete your Lean Canvas',
      description: 'Your business model canvas needs attention. Complete it to clarify your strategy.',
      module: 'canvas',
      impact: 'high',
      effort: 'medium',
      route: '/lean-canvas',
      priority: 1,
      reason: 'Canvas < 50% complete',
    });
  }

  // Priority 2: No pitch deck
  if (!pitchDeck) {
    recommendations.push({
      id: 'start-pitch',
      title: 'Start your pitch deck',
      description: 'Create an investor-ready pitch deck to prepare for fundraising.',
      module: 'pitch',
      impact: 'high',
      effort: 'involved',
      route: '/pitch-deck-wizard',
      priority: 2,
      reason: 'Pitch deck not started',
    });
  } else if (pitchDeck.status !== 'complete') {
    recommendations.push({
      id: 'complete-pitch',
      title: 'Complete your pitch deck',
      description: 'Finish your pitch deck to be investor-ready.',
      module: 'pitch',
      impact: 'high',
      effort: 'medium',
      route: '/pitch-deck-editor',
      priority: 2,
      reason: 'Pitch deck incomplete',
    });
  }

  // Priority 3: Low traction score
  const tractionScore = breakdown.tractionProof?.score || 0;
  if (tractionScore < 50) {
    recommendations.push({
      id: 'add-traction',
      title: 'Log recent wins and metrics',
      description: 'Add customer interactions, milestones, or metrics to boost your traction score.',
      module: 'crm',
      impact: 'high',
      effort: 'quick',
      route: '/crm',
      priority: 3,
      reason: 'No traction data recently',
    });
  }

  // Priority 4: Stale contacts
  const staleContacts = contacts.filter((c: any) => {
    if (!c.last_contacted_at) return true;
    const daysSince = (Date.now() - new Date(c.last_contacted_at).getTime()) / (1000 * 60 * 60 * 24);
    return daysSince > 14;
  });
  if (staleContacts.length > 0) {
    recommendations.push({
      id: 'follow-up',
      title: `Follow up with ${staleContacts.length} contacts`,
      description: 'Some contacts haven\'t been touched in 2+ weeks. Schedule follow-ups.',
      module: 'crm',
      impact: 'medium',
      effort: 'quick',
      route: '/crm',
      priority: 4,
      reason: 'Stale relationships',
    });
  }

  // Priority 5: Low problem clarity
  const problemScore = breakdown.problemClarity?.score || 0;
  if (problemScore < 60) {
    recommendations.push({
      id: 'sharpen-problem',
      title: 'Sharpen your problem statement',
      description: 'A clear problem statement is crucial. Refine it in your canvas.',
      module: 'canvas',
      impact: 'medium',
      effort: 'quick',
      route: '/lean-canvas',
      priority: 5,
      reason: 'Problem clarity needs work',
    });
  }

  // Priority 6: Run validation
  const investorScore = breakdown.investorReadiness?.score || 0;
  if (investorScore < 70 && pitchDeck) {
    recommendations.push({
      id: 'validate-idea',
      title: 'Validate your idea',
      description: 'Run a quick validation to identify blind spots before investor meetings.',
      module: 'validation',
      impact: 'high',
      effort: 'quick',
      route: '/validator',
      priority: 6,
      reason: 'Pre-pitch preparation',
    });
  }

  // Take top 3 recommendations
  const todaysFocus = recommendations
    .sort((a, b) => a.priority - b.priority)
    .slice(0, 3);

  // Get upcoming tasks with due dates
  const upcomingTasks = tasks
    .filter((t: any) => t.due_date)
    .sort((a: any, b: any) => new Date(a.due_date).getTime() - new Date(b.due_date).getTime())
    .slice(0, 5)
    .map((t: any) => ({
      id: t.id,
      title: t.title,
      dueDate: t.due_date,
    }));

  // Format recent activity
  const recentActivity = activities.slice(0, 5).map((a: any) => ({
    type: a.activity_type,
    description: a.description || `${a.activity_type} activity`,
    timestamp: a.created_at,
  }));

  return {
    todaysFocus,
    upcomingTasks,
    recentActivity,
  };
}
