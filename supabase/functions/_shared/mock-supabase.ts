/**
 * Mock Supabase Client for Edge Function Testing
 * 
 * Provides a mock implementation that doesn't require live DB connection.
 * Used for unit testing edge functions in isolation.
 */

// Mock data storage
const mockStore: Record<string, unknown[]> = {
  industry_packs: [
    {
      industry: 'fintech',
      display_name: 'FinTech',
      description: 'Financial technology startups',
      icon: '💳',
      is_active: true,
      startup_types: [
        { id: 'payments', label: 'Payments' },
        { id: 'banking', label: 'Banking' },
      ],
      benchmarks: { avg_seed_raise: '$2.5M', time_to_pmf: '18-24 months' },
      terminology: [
        { term: 'PMF', definition: 'Product-Market Fit' },
        { term: 'AML', definition: 'Anti-Money Laundering' },
      ],
      mental_models: ['Regulatory-first GTM', 'Trust-based growth'],
      common_mistakes: ['Ignoring compliance early', 'Underestimating CAC'],
    },
    {
      industry: 'healthcare',
      display_name: 'Healthcare',
      description: 'Healthcare and life sciences startups',
      icon: '🏥',
      is_active: true,
      startup_types: [
        { id: 'digital_health', label: 'Digital Health' },
        { id: 'biotech', label: 'Biotech' },
      ],
      benchmarks: { avg_seed_raise: '$3M', time_to_pmf: '24-36 months' },
      terminology: [
        { term: 'HIPAA', definition: 'Health Insurance Portability Act' },
        { term: 'FDA', definition: 'Food and Drug Administration' },
      ],
      mental_models: ['Clinical validation first', 'Payor-first approach'],
      common_mistakes: ['Skipping clinical trials', 'Ignoring reimbursement'],
    },
  ],
  onboarding_questions: [
    {
      id: 'q1',
      question_key: 'problem_statement',
      category: 'problem',
      question: 'What problem are you solving?',
      is_required: true,
      display_order: 1,
    },
    {
      id: 'q2',
      question_key: 'target_customer',
      category: 'market',
      question: 'Who is your target customer?',
      is_required: true,
      display_order: 2,
    },
  ],
  wizard_sessions: [],
  profiles: [],
  startups: [],
  tasks: [],
};

// Mock query builder
function createMockQueryBuilder(tableName: string) {
  let filters: Record<string, unknown> = {};
  let selectedColumns = '*';
  let limitCount: number | null = null;
  let orderColumn: string | null = null;
  
  const builder = {
    select(columns = '*') {
      selectedColumns = columns;
      return builder;
    },
    eq(column: string, value: unknown) {
      filters[column] = value;
      return builder;
    },
    neq(column: string, value: unknown) {
      filters[`neq_${column}`] = value;
      return builder;
    },
    in(column: string, values: unknown[]) {
      filters[`in_${column}`] = values;
      return builder;
    },
    order(column: string) {
      orderColumn = column;
      return builder;
    },
    limit(count: number) {
      limitCount = count;
      return builder;
    },
    single() {
      const data = mockStore[tableName]?.[0] || null;
      return Promise.resolve({ data, error: null });
    },
    maybeSingle() {
      const data = mockStore[tableName]?.[0] || null;
      return Promise.resolve({ data, error: null });
    },
    async then(resolve: (result: { data: unknown[]; error: null }) => void) {
      let data = mockStore[tableName] || [];
      
      // Apply filters
      if (filters.industry) {
        data = data.filter((row: any) => row.industry === filters.industry);
      }
      if (filters.is_active !== undefined) {
        data = data.filter((row: any) => row.is_active === filters.is_active);
      }
      
      // Apply limit
      if (limitCount) {
        data = data.slice(0, limitCount);
      }
      
      resolve({ data, error: null });
    },
  };
  
  return builder;
}

// Mock insert builder
function createMockInsertBuilder(tableName: string) {
  return {
    insert(data: unknown) {
      const newData = Array.isArray(data) ? data : [data];
      mockStore[tableName] = [...(mockStore[tableName] || []), ...newData];
      return {
        select() {
          return {
            single() {
              return Promise.resolve({ data: newData[0], error: null });
            },
          };
        },
      };
    },
  };
}

// Mock Supabase Client
export function createMockSupabaseClient(options?: { 
  authenticated?: boolean;
  userId?: string;
}) {
  const isAuthenticated = options?.authenticated ?? true;
  const userId = options?.userId ?? 'test-user-id';
  
  return {
    auth: {
      getUser() {
        if (!isAuthenticated) {
          return Promise.resolve({
            data: { user: null },
            error: { message: 'Not authenticated' },
          });
        }
        return Promise.resolve({
          data: {
            user: {
              id: userId,
              email: 'test@example.com',
            },
          },
          error: null,
        });
      },
      getSession() {
        if (!isAuthenticated) {
          return Promise.resolve({
            data: { session: null },
            error: null,
          });
        }
        return Promise.resolve({
          data: {
            session: {
              access_token: 'mock-token',
              user: { id: userId },
            },
          },
          error: null,
        });
      },
    },
    from(tableName: string) {
      return {
        ...createMockQueryBuilder(tableName),
        ...createMockInsertBuilder(tableName),
      };
    },
  };
}

// Reset mock store (for test isolation)
export function resetMockStore() {
  Object.keys(mockStore).forEach((key) => {
    if (!['industry_packs', 'onboarding_questions'].includes(key)) {
      mockStore[key] = [];
    }
  });
}

// Add data to mock store
export function seedMockStore(tableName: string, data: unknown[]) {
  mockStore[tableName] = [...(mockStore[tableName] || []), ...data];
}

// Get mock store data (for assertions)
export function getMockStoreData(tableName: string) {
  return mockStore[tableName] || [];
}

export default createMockSupabaseClient;
