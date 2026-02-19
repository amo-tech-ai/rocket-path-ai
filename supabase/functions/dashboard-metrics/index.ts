/**
 * Dashboard Metrics Edge Function
 * Summary metrics, changes, and analytics for the dashboard.
 * Migrated to shared patterns: JWT auth, rate limiting, shared CORS.
 */

import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";
import { handleCors, getCorsHeaders } from "../_shared/cors.ts";
import { checkRateLimit, RATE_LIMITS, rateLimitResponse } from "../_shared/rate-limit.ts";

interface AuthContext {
  userId: string;
  startupId: string;
}

interface SummaryMetrics {
  decksCount: number;
  investorsCount: number;
  tasksCount: number;
  eventsCount: number;
  documentsCount: number;
  contactsCount: number;
  dealsCount: number;
  projectsCount: number;
}

interface MetricChanges {
  decks: number;
  investors: number;
  tasks: number;
  events: number;
}

interface AnalyticsData {
  taskTrends: Array<{ date: string; completed: number; created: number }>;
  projectVelocity: Array<{ name: string; completed: number; active: number }>;
  pipelineConversion: Array<{ stage: string; count: number; value: number }>;
  investorEngagement: Array<{ status: string; count: number }>;
}

Deno.serve(async (req) => {
  const corsResponse = handleCors(req);
  if (corsResponse) return corsResponse;

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405, headers: { ...getCorsHeaders(req), 'Content-Type': 'application/json' },
    });
  }

  const corsHeaders = getCorsHeaders(req);

  try {
    // Auth check
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Missing authorization header' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // User-scoped client (RLS enforced)
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!,
      { global: { headers: { Authorization: authHeader } } }
    );

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Rate limit (light — read-only metrics, no AI)
    const rateResult = checkRateLimit(user.id, "dashboard-metrics", RATE_LIMITS.light);
    if (!rateResult.allowed) {
      return rateLimitResponse(rateResult, corsHeaders);
    }

    // Parse request body
    const body = await req.json().catch(() => ({}));
    const { action, startupId, dateRange } = body;

    if (!startupId) {
      return new Response(
        JSON.stringify({ error: 'Missing startupId' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Verify user has access to startup (defense-in-depth — RLS also enforces)
    const { data: membership } = await supabase
      .from('startup_members')
      .select('id')
      .eq('startup_id', startupId)
      .eq('user_id', user.id)
      .single();

    if (!membership) {
      return new Response(
        JSON.stringify({ error: 'Access denied to startup' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const auth: AuthContext = { userId: user.id, startupId };

    let result;

    switch (action) {
      case 'get_summary_metrics':
        result = await getSummaryMetrics(supabase, auth);
        break;
      case 'get_metric_changes':
        result = await getMetricChanges(supabase, auth);
        break;
      case 'get_analytics_metrics':
        result = await getAnalyticsMetrics(supabase, auth, dateRange);
        break;
      default:
        return new Response(
          JSON.stringify({ error: 'Invalid action' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
    }

    console.log(`[dashboard-metrics] Action: ${action}, StartupId: ${startupId}, Success`);

    return new Response(
      JSON.stringify(result),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('[dashboard-metrics] Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Internal server error';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

async function getSummaryMetrics(supabase: any, auth: AuthContext): Promise<SummaryMetrics> {
  const today = new Date().toISOString().split('T')[0];

  // Run all count queries in parallel
  const [
    pitchDecks,
    investors,
    tasks,
    events,
    documents,
    contacts,
    deals,
    projects,
  ] = await Promise.all([
    supabase.from('pitch_decks').select('id', { count: 'exact', head: true }).eq('startup_id', auth.startupId),
    supabase.from('investors').select('id', { count: 'exact', head: true }).eq('startup_id', auth.startupId),
    supabase.from('tasks').select('id', { count: 'exact', head: true }).eq('startup_id', auth.startupId).neq('status', 'completed'),
    supabase.from('events').select('id', { count: 'exact', head: true }).eq('startup_id', auth.startupId).gte('start_date', today),
    supabase.from('documents').select('id', { count: 'exact', head: true }).eq('startup_id', auth.startupId),
    supabase.from('contacts').select('id', { count: 'exact', head: true }).eq('startup_id', auth.startupId),
    supabase.from('deals').select('id', { count: 'exact', head: true }).eq('startup_id', auth.startupId).eq('is_active', true),
    supabase.from('projects').select('id', { count: 'exact', head: true }).eq('startup_id', auth.startupId).eq('status', 'active'),
  ]);

  return {
    decksCount: pitchDecks.count || 0,
    investorsCount: investors.count || 0,
    tasksCount: tasks.count || 0,
    eventsCount: events.count || 0,
    documentsCount: documents.count || 0,
    contactsCount: contacts.count || 0,
    dealsCount: deals.count || 0,
    projectsCount: projects.count || 0,
  };
}

async function getMetricChanges(supabase: any, auth: AuthContext): Promise<MetricChanges> {
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
  const weekAgoISO = oneWeekAgo.toISOString();

  const [newDecks, newInvestors, completedTasks, newEvents] = await Promise.all([
    supabase.from('pitch_decks').select('id', { count: 'exact', head: true })
      .eq('startup_id', auth.startupId).gte('created_at', weekAgoISO),
    supabase.from('investors').select('id', { count: 'exact', head: true })
      .eq('startup_id', auth.startupId).gte('created_at', weekAgoISO),
    supabase.from('tasks').select('id', { count: 'exact', head: true })
      .eq('startup_id', auth.startupId).eq('status', 'completed').gte('updated_at', weekAgoISO),
    supabase.from('events').select('id', { count: 'exact', head: true })
      .eq('startup_id', auth.startupId).gte('created_at', weekAgoISO),
  ]);

  return {
    decks: newDecks.count || 0,
    investors: newInvestors.count || 0,
    tasks: completedTasks.count || 0,
    events: newEvents.count || 0,
  };
}

async function getAnalyticsMetrics(
  supabase: any,
  auth: AuthContext,
  dateRange?: { startDate: string; endDate: string }
): Promise<AnalyticsData> {
  const endDate = dateRange?.endDate || new Date().toISOString();
  const startDate = dateRange?.startDate || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();

  // Get task trends (last 30 days by default)
  const [tasksData, projectsData, dealsData, investorsData] = await Promise.all([
    supabase.from('tasks')
      .select('id, status, created_at, updated_at')
      .eq('startup_id', auth.startupId)
      .gte('created_at', startDate)
      .lte('created_at', endDate),
    supabase.from('projects')
      .select('id, name, status')
      .eq('startup_id', auth.startupId),
    supabase.from('deals')
      .select('id, stage, amount')
      .eq('startup_id', auth.startupId)
      .eq('is_active', true),
    supabase.from('investors')
      .select('id, status')
      .eq('startup_id', auth.startupId),
  ]);

  // Process task trends (group by day)
  const taskTrends = processTaskTrends(tasksData.data || [], startDate, endDate);

  // Process project velocity
  const projectVelocity = processProjectVelocity(projectsData.data || []);

  // Process pipeline conversion
  const pipelineConversion = processPipelineConversion(dealsData.data || []);

  // Process investor engagement
  const investorEngagement = processInvestorEngagement(investorsData.data || []);

  return {
    taskTrends,
    projectVelocity,
    pipelineConversion,
    investorEngagement,
  };
}

function processTaskTrends(
  tasks: Array<{ id: string; status: string; created_at: string; updated_at: string }>,
  startDate: string,
  endDate: string
): Array<{ date: string; completed: number; created: number }> {
  const trends: Record<string, { completed: number; created: number }> = {};

  // Initialize days
  const start = new Date(startDate);
  const end = new Date(endDate);
  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    const dateStr = d.toISOString().split('T')[0];
    trends[dateStr] = { completed: 0, created: 0 };
  }

  // Count tasks
  tasks.forEach(task => {
    const createdDate = task.created_at.split('T')[0];
    if (trends[createdDate]) {
      trends[createdDate].created++;
    }
    if (task.status === 'completed') {
      const completedDate = task.updated_at.split('T')[0];
      if (trends[completedDate]) {
        trends[completedDate].completed++;
      }
    }
  });

  return Object.entries(trends)
    .map(([date, counts]) => ({ date, ...counts }))
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(-14); // Last 14 days
}

function processProjectVelocity(
  projects: Array<{ id: string; name: string; status: string }>
): Array<{ name: string; completed: number; active: number }> {
  const statusCounts = projects.reduce((acc, p) => {
    acc[p.status] = (acc[p.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return [
    { name: 'Active', completed: 0, active: statusCounts['active'] || 0 },
    { name: 'Completed', completed: statusCounts['completed'] || 0, active: 0 },
    { name: 'On Hold', completed: 0, active: statusCounts['on_hold'] || 0 },
  ];
}

function processPipelineConversion(
  deals: Array<{ id: string; stage: string; amount: number | null }>
): Array<{ stage: string; count: number; value: number }> {
  const stageOrder = ['lead', 'qualified', 'proposal', 'negotiation', 'closed'];
  const stageData: Record<string, { count: number; value: number }> = {};

  stageOrder.forEach(stage => {
    stageData[stage] = { count: 0, value: 0 };
  });

  deals.forEach(deal => {
    const stage = deal.stage || 'lead';
    if (stageData[stage]) {
      stageData[stage].count++;
      stageData[stage].value += deal.amount || 0;
    }
  });

  return stageOrder.map(stage => ({
    stage: stage.charAt(0).toUpperCase() + stage.slice(1),
    count: stageData[stage].count,
    value: stageData[stage].value,
  }));
}

function processInvestorEngagement(
  investors: Array<{ id: string; status: string }>
): Array<{ status: string; count: number }> {
  const statusCounts = investors.reduce((acc, inv) => {
    const status = inv.status || 'researching';
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return Object.entries(statusCounts).map(([status, count]) => ({
    status: status.charAt(0).toUpperCase() + status.slice(1).replace('_', ' '),
    count,
  }));
}
