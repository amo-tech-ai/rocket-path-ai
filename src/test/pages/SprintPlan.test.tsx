/**
 * SprintPlan Tests
 * Smoke tests for the 90-Day Plan page + view toggle + kanban/list states
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';

const mockCampaigns = [
  { id: 'c1', startup_id: 's1', name: '90-Day Plan', status: 'active', start_date: null, end_date: null, created_at: '2026-01-01', updated_at: '2026-01-01' },
];

const mockSprints = [
  {
    id: 'sp1', campaign_id: 'c1', sprint_number: 1, name: 'Validate problem', status: 'active',
    start_date: null, end_date: null, created_at: '2026-01-01', updated_at: '2026-01-01',
    pdca_step: 'plan', purpose: 'Validate problem', hypothesis: null, experiment_design: null,
    success_criteria: null, method: null, actions_taken: null, notes: null, results: null,
    metrics_achieved: null, success: null, learnings: null, decision: null,
    decision_rationale: null, next_steps: null,
  },
];

const mockTasks = [
  { id: 't1', title: 'Interview 5 users', source: 'AI', sprint_number: 1, success_criteria: '5 interviews', ai_tip: 'Focus on pain points', priority: 'high' as const, column: 'backlog' as const },
  { id: 't2', title: 'Build landing page', source: 'AI', sprint_number: 1, success_criteria: 'Page live', ai_tip: '', priority: 'medium' as const, column: 'doing' as const },
];

// Mock supabase
vi.mock('@/integrations/supabase/client', () => {
  const chainable = {
    select: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    order: vi.fn().mockReturnThis(),
    insert: vi.fn().mockReturnThis(),
    update: vi.fn().mockReturnThis(),
    delete: vi.fn().mockReturnThis(),
    single: vi.fn().mockResolvedValue({ data: null, error: null }),
    then: (resolve: any) => resolve({ data: [], error: null }),
  };
  return {
    supabase: {
      from: vi.fn().mockReturnValue(chainable),
      auth: {
        getUser: vi.fn().mockResolvedValue({ data: { user: { id: 'u1' } }, error: null }),
        refreshSession: vi.fn().mockResolvedValue({ data: { session: { access_token: 'tok' } }, error: null }),
        onAuthStateChange: vi.fn().mockReturnValue({
          data: { subscription: { unsubscribe: vi.fn() } },
        }),
      },
      functions: { invoke: vi.fn().mockResolvedValue({ data: { tasks: [] }, error: null }) },
    },
  };
});

vi.mock('@/hooks/useAuth', () => ({
  useAuth: vi.fn().mockReturnValue({
    user: { id: 'user-1' },
    profile: { org_id: 'org-1' },
    isLoading: false,
  }),
}));

vi.mock('@/hooks/useNotifications', () => ({
  useNotifications: vi.fn().mockReturnValue({
    notifications: [],
    unreadCount: 0,
    markAsRead: vi.fn(),
    markAllAsRead: vi.fn(),
    showBudgetAlert: vi.fn(),
  }),
}));

vi.mock('@/hooks/useDashboardData', () => ({
  useStartup: vi.fn().mockReturnValue({
    data: { id: 's1', name: 'Test Startup' },
    isLoading: false,
  }),
}));

const mockGenerateTasks = vi.fn();
const mockMoveTask = vi.fn();

vi.mock('@/hooks/useSprintAgent', () => ({
  useSprintAgent: vi.fn().mockReturnValue({
    tasks: mockTasks,
    tasksByColumn: {
      backlog: [mockTasks[0]],
      todo: [],
      doing: [mockTasks[1]],
      done: [],
    },
    isGenerating: false,
    generateTasks: mockGenerateTasks,
    moveTask: mockMoveTask,
    hasTasks: true,
  }),
}));

vi.mock('@/hooks/useSprints', () => ({
  useCampaigns: vi.fn().mockReturnValue({ data: mockCampaigns, isLoading: false }),
  useSprints: vi.fn().mockReturnValue({ data: mockSprints, isLoading: false }),
  useCreateSprint: vi.fn().mockReturnValue({ mutateAsync: vi.fn(), isPending: false }),
  useCompleteSprint: vi.fn().mockReturnValue({ mutateAsync: vi.fn(), isPending: false }),
}));

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return function Wrapper({ children }: { children: React.ReactNode }) {
    return React.createElement(
      QueryClientProvider,
      { client: queryClient },
      React.createElement(BrowserRouter, null, children)
    );
  };
}

describe('SprintPlan', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders page heading', async () => {
    const SprintPlan = (await import('@/pages/SprintPlan')).default;
    render(React.createElement(SprintPlan), { wrapper: createWrapper() });
    expect(screen.getByText('90-Day Validation Plan')).toBeTruthy();
  }, 15_000);

  it('renders campaign selector', async () => {
    const SprintPlan = (await import('@/pages/SprintPlan')).default;
    render(React.createElement(SprintPlan), { wrapper: createWrapper() });
    // Campaign name appears in selector (and possibly sidebar nav)
    expect(screen.getAllByText('90-Day Plan').length).toBeGreaterThanOrEqual(1);
  });

  it('renders view toggle buttons', async () => {
    const SprintPlan = (await import('@/pages/SprintPlan')).default;
    render(React.createElement(SprintPlan), { wrapper: createWrapper() });
    expect(screen.getByTitle('Kanban view')).toBeTruthy();
    expect(screen.getByTitle('List view')).toBeTruthy();
  });

  it('renders kanban board when hasTasks is true', async () => {
    const SprintPlan = (await import('@/pages/SprintPlan')).default;
    render(React.createElement(SprintPlan), { wrapper: createWrapper() });
    // KanbanBoard renders column headers
    expect(screen.getByText('Backlog')).toBeTruthy();
  });

  it('shows empty state when no tasks in kanban view', async () => {
    const { useSprintAgent } = await import('@/hooks/useSprintAgent');
    (useSprintAgent as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      tasks: [],
      tasksByColumn: { backlog: [], todo: [], doing: [], done: [] },
      isGenerating: false,
      generateTasks: vi.fn(),
      moveTask: vi.fn(),
      hasTasks: false,
    });

    const SprintPlan = (await import('@/pages/SprintPlan')).default;
    render(React.createElement(SprintPlan), { wrapper: createWrapper() });
    expect(screen.getByText('No tasks yet')).toBeTruthy();
  });

  it('switches to list view and shows sprint cards', async () => {
    // Reset mock to default
    const { useSprintAgent } = await import('@/hooks/useSprintAgent');
    (useSprintAgent as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      tasks: mockTasks,
      tasksByColumn: { backlog: [mockTasks[0]], todo: [], doing: [mockTasks[1]], done: [] },
      isGenerating: false,
      generateTasks: mockGenerateTasks,
      moveTask: mockMoveTask,
      hasTasks: true,
    });

    const SprintPlan = (await import('@/pages/SprintPlan')).default;
    render(React.createElement(SprintPlan), { wrapper: createWrapper() });

    const listBtn = screen.getByTitle('List view');
    fireEvent.click(listBtn);

    // Sprint card text
    expect(screen.getByText('Sprint 1')).toBeTruthy();
  });

  it('shows New Sprint button in list view', async () => {
    const SprintPlan = (await import('@/pages/SprintPlan')).default;
    render(React.createElement(SprintPlan), { wrapper: createWrapper() });

    const listBtn = screen.getByTitle('List view');
    fireEvent.click(listBtn);

    expect(screen.getByText('New Sprint')).toBeTruthy();
  });

  it('shows empty state when no startup', async () => {
    const { useStartup } = await import('@/hooks/useDashboardData');
    (useStartup as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      data: null,
      isLoading: false,
    });
    const { useCampaigns } = await import('@/hooks/useSprints');
    (useCampaigns as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      data: [],
      isLoading: false,
    });

    const SprintPlan = (await import('@/pages/SprintPlan')).default;
    render(React.createElement(SprintPlan), { wrapper: createWrapper() });
    // "90-Day Plan" may appear in sidebar nav too
    expect(screen.getAllByText(/90-Day Plan/).length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText('Go to Validator')).toBeTruthy();
  });
});
