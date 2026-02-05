# CORE Phase Tasks

> **Version:** 1.0 | **Updated:** 2026-02-02
> **Phase:** CORE (Weeks 1-6)
> **Question:** Can it work at all?
> **Milestone:** Users can complete the basic flow end-to-end

---

## Executive Summary

The CORE phase establishes the foundational infrastructure for StartupAI. All tasks in this phase are P0 (blocking) and must be completed before MVP work begins.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         CORE PHASE TASK FLOW                                 │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│   Week 1-2              Week 3-4              Week 5-6                      │
│   ─────────             ─────────             ─────────                     │
│   INF-001 → DB-001      ONB-001 → ONB-005    INF-003 → INF-006             │
│   INF-002 → DB-002      ONB-002 → ONB-006    Polish & Validate             │
│   AUTH-001 → AUTH-004                                                       │
│                                                                              │
│   Deliverable:          Deliverable:         Deliverable:                   │
│   Schema + Auth         Onboarding Works     Full Flow Complete            │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Supabase Schema

### Core Tables

```sql
-- Migration: 20260202000000_core_schema.sql

-- 1. Profiles (extends auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Startups
CREATE TABLE IF NOT EXISTS public.startups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  website TEXT,
  industry TEXT,
  stage TEXT DEFAULT 'idea',
  business_model TEXT,
  target_customers TEXT,
  one_liner TEXT,
  problem_summary TEXT,
  solution_summary TEXT,
  lean_canvas JSONB DEFAULT '{}',
  onboarding_complete BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Playbooks
CREATE TABLE IF NOT EXISTS public.playbooks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  industry TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  interview_questions JSONB DEFAULT '[]',
  experiment_templates JSONB DEFAULT '[]',
  metrics_benchmarks JSONB DEFAULT '{}',
  gtm_patterns JSONB DEFAULT '[]',
  failure_modes JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Startup Playbook Assignment
CREATE TABLE IF NOT EXISTS public.startup_playbooks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  startup_id UUID NOT NULL REFERENCES public.startups(id) ON DELETE CASCADE,
  playbook_id UUID NOT NULL REFERENCES public.playbooks(id),
  activated_at TIMESTAMPTZ DEFAULT NOW(),
  progress JSONB DEFAULT '{}',
  UNIQUE(startup_id, playbook_id)
);

-- Indexes
CREATE INDEX idx_startups_user_id ON public.startups(user_id);
CREATE INDEX idx_startups_stage ON public.startups(stage);
CREATE INDEX idx_startups_industry ON public.startups(industry);

-- RLS Policies
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.startups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.playbooks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.startup_playbooks ENABLE ROW LEVEL SECURITY;

-- Profiles: Users can only access their own profile
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- Startups: Users can only access their own startups
CREATE POLICY "Users can view own startups" ON public.startups
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own startups" ON public.startups
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own startups" ON public.startups
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own startups" ON public.startups
  FOR DELETE USING (auth.uid() = user_id);

-- Playbooks: Everyone can read
CREATE POLICY "Anyone can view playbooks" ON public.playbooks
  FOR SELECT USING (true);

-- Startup Playbooks: Users can access their startup's playbooks
CREATE POLICY "Users can view own startup playbooks" ON public.startup_playbooks
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.startups WHERE id = startup_id AND user_id = auth.uid())
  );
CREATE POLICY "Users can insert own startup playbooks" ON public.startup_playbooks
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.startups WHERE id = startup_id AND user_id = auth.uid())
  );

-- Trigger: Update updated_at on change
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER startups_updated_at
  BEFORE UPDATE ON public.startups
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
```

---

## Task: INF-001 — Project Setup

```yaml
---
task_id: INF-001
title: Initialize Project Structure
diagram_ref: D-02
behavior: "System has proper project structure"
prd_ref: "Section 2.2: Tech Stack"
phase: CORE
priority: P0
status: Not Started
percent_complete: 0
category: Infrastructure
primary_skill: /feature-dev
secondary_skills: []
subagents: []
---
```

### User Story

> **As a** developer
> **I want** a properly configured project structure
> **So that** I can build features with consistent patterns

### Real-World Example

*Developer Alex joins the StartupAI team. They clone the repo and run `npm install && npm run dev`. Within 2 minutes, they see the dev server running at `localhost:8082` with hot reload working.*

### Implementation Steps

1. **Verify Vite Configuration**
   - Check `vite.config.ts` for proper aliases
   - Ensure `@/` maps to `./src/`
   - Verify port is 8082

2. **Verify TypeScript Configuration**
   - Check `tsconfig.json` for strict mode
   - Ensure path aliases match Vite

3. **Verify Tailwind Configuration**
   - Check `tailwind.config.js` for shadcn/ui setup
   - Verify dark mode configuration

4. **Verify Project Structure**
   ```
   src/
   ├── components/
   │   ├── ui/          # shadcn components
   │   ├── dashboard/   # Dashboard components
   │   ├── onboarding/  # Onboarding components
   │   └── shared/      # Shared components
   ├── hooks/           # Custom hooks
   ├── pages/           # Route components
   ├── lib/             # Utilities
   └── integrations/    # Supabase client
   ```

### Files

| File | Action |
|------|--------|
| `vite.config.ts` | Verify |
| `tsconfig.json` | Verify |
| `tailwind.config.js` | Verify |
| `src/` directory structure | Verify |

### Acceptance Criteria

- [ ] `npm run dev` starts without errors
- [ ] Hot reload works on file changes
- [ ] Path alias `@/` resolves correctly
- [ ] TypeScript shows no errors
- [ ] Tailwind classes apply correctly

### Effort

- **Time:** 1-2 hours
- **Complexity:** Low

---

## Task: INF-002 — Supabase Configuration

```yaml
---
task_id: INF-002
title: Configure Supabase Project
diagram_ref: D-02
behavior: "System connects to Supabase"
prd_ref: "Section 2.2: Tech Stack"
phase: CORE
priority: P0
status: Not Started
percent_complete: 0
category: Infrastructure
primary_skill: /supabase
secondary_skills: [/feature-dev]
subagents: [supabase-expert]
---
```

### User Story

> **As a** developer
> **I want** Supabase properly configured
> **So that** I can use auth, database, and edge functions

### Real-World Example

*The app loads and the Supabase client can query the database. When a user signs up, their profile appears in the `profiles` table automatically.*

### Implementation Steps

1. **Verify Supabase Client**
   ```typescript
   // src/integrations/supabase/client.ts
   import { createClient } from '@supabase/supabase-js';
   import type { Database } from './types';

   export const supabase = createClient<Database>(
     import.meta.env.VITE_SUPABASE_URL,
     import.meta.env.VITE_SUPABASE_ANON_KEY
   );
   ```

2. **Verify Environment Variables**
   ```
   VITE_SUPABASE_URL=https://xxx.supabase.co
   VITE_SUPABASE_ANON_KEY=xxx
   ```

3. **Generate TypeScript Types**
   ```bash
   supabase gen types typescript --local > src/integrations/supabase/types.ts
   ```

4. **Verify Supabase CLI**
   ```bash
   supabase link --project-ref xxx
   supabase db push
   ```

### Files

| File | Action |
|------|--------|
| `src/integrations/supabase/client.ts` | Verify/Create |
| `src/integrations/supabase/types.ts` | Generate |
| `.env.local` | Configure |
| `supabase/config.toml` | Verify |

### Acceptance Criteria

- [ ] `supabase` client exports work
- [ ] TypeScript types are generated
- [ ] Environment variables are set
- [ ] `supabase db push` succeeds
- [ ] Database is accessible from app

### Effort

- **Time:** 2-3 hours
- **Complexity:** Medium

---

## Task: DB-001 — Core Tables Migration

```yaml
---
task_id: DB-001
title: Create Core Database Tables
diagram_ref: D-09
behavior: "Database has all core tables with RLS"
prd_ref: "Section 13.1: Database Schema"
phase: CORE
priority: P0
status: Not Started
percent_complete: 0
category: Backend
primary_skill: /supabase
secondary_skills: [/database-migration]
subagents: [supabase-expert]
---
```

### User Story

> **As a** system
> **I want** a complete database schema
> **So that** user data can be stored securely

### Real-World Example

*When Sarah signs up, a profile record is created automatically. When she creates her startup "GreenTech", a startup record is created with her user_id. She cannot see other users' startups.*

### Implementation Steps

1. **Create Migration File**
   ```bash
   supabase migration new core_schema
   ```

2. **Add Tables** (see Schema section above)

3. **Add Trigger for Profile Creation**
   ```sql
   -- Auto-create profile on signup
   CREATE OR REPLACE FUNCTION public.handle_new_user()
   RETURNS TRIGGER AS $$
   BEGIN
     INSERT INTO public.profiles (id, email, full_name, avatar_url)
     VALUES (
       NEW.id,
       NEW.email,
       NEW.raw_user_meta_data->>'full_name',
       NEW.raw_user_meta_data->>'avatar_url'
     );
     RETURN NEW;
   END;
   $$ LANGUAGE plpgsql SECURITY DEFINER;

   CREATE TRIGGER on_auth_user_created
     AFTER INSERT ON auth.users
     FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
   ```

4. **Apply Migration**
   ```bash
   supabase db push
   ```

5. **Verify RLS**
   ```sql
   -- Test RLS (should return empty for other users)
   SELECT * FROM startups WHERE user_id != auth.uid();
   ```

### Files

| File | Action |
|------|--------|
| `supabase/migrations/20260202000000_core_schema.sql` | Create |
| `src/integrations/supabase/types.ts` | Regenerate |

### Acceptance Criteria

- [ ] `profiles` table exists with RLS
- [ ] `startups` table exists with RLS
- [ ] `playbooks` table exists with read-only policy
- [ ] Profile auto-created on signup
- [ ] `updated_at` trigger works
- [ ] Cannot access other users' data

### Effort

- **Time:** 3-4 hours
- **Complexity:** Medium

---

## Task: AUTH-001 — OAuth Provider Setup

```yaml
---
task_id: AUTH-001
title: Configure OAuth Providers
diagram_ref: D-05
behavior: "OAuth providers are configured in Supabase"
prd_ref: "Section 4.1: Progressive Onboarding Flow"
phase: CORE
priority: P0
status: Not Started
percent_complete: 0
category: Backend
primary_skill: /supabase
secondary_skills: []
subagents: [supabase-expert]
---
```

### User Story

> **As a** new user
> **I want** to sign up with Google or LinkedIn
> **So that** I can quickly access the platform without creating a password

### Real-World Example

*Marcus visits StartupAI for the first time. He clicks "Continue with Google", sees the familiar Google sign-in popup, authorizes the app, and is immediately redirected to the onboarding wizard with his name and email pre-filled.*

### Implementation Steps

1. **Google OAuth Setup**
   - Go to [Google Cloud Console](https://console.cloud.google.com)
   - Create OAuth 2.0 credentials
   - Add redirect URI: `https://xxx.supabase.co/auth/v1/callback`
   - Copy Client ID and Secret

2. **LinkedIn OAuth Setup**
   - Go to [LinkedIn Developer](https://developer.linkedin.com)
   - Create new app
   - Add redirect URI: `https://xxx.supabase.co/auth/v1/callback`
   - Request `r_liteprofile` and `r_emailaddress` scopes
   - Copy Client ID and Secret

3. **Configure in Supabase Dashboard**
   - Authentication → Providers → Google
   - Authentication → Providers → LinkedIn

4. **Set Redirect URLs**
   ```
   # Supabase Dashboard → Authentication → URL Configuration
   Site URL: https://your-domain.com
   Redirect URLs:
     - http://localhost:8082/auth/callback
     - https://your-domain.com/auth/callback
   ```

### Files

| File | Action |
|------|--------|
| Supabase Dashboard | Configure |
| Google Cloud Console | Configure |
| LinkedIn Developer | Configure |

### Acceptance Criteria

- [ ] Google OAuth enabled in Supabase
- [ ] LinkedIn OAuth enabled in Supabase
- [ ] Redirect URIs configured
- [ ] Test login works (manual test)

### Effort

- **Time:** 2-3 hours
- **Complexity:** Medium

---

## Task: AUTH-002 — Google OAuth Flow

```yaml
---
task_id: AUTH-002
title: Implement Google OAuth Login
diagram_ref: D-05
behavior: "User can sign in with Google"
prd_ref: "Section 4.1: Progressive Onboarding Flow"
phase: CORE
priority: P0
status: Not Started
percent_complete: 0
category: Frontend
primary_skill: /frontend-design
secondary_skills: [/supabase]
subagents: [frontend-designer]
depends_on: AUTH-001
---
```

### User Story

> **As a** new user
> **I want** to click "Continue with Google"
> **So that** I can sign up without creating a password

### Real-World Example

*Elena visits the login page and clicks the Google button. She selects her personal Google account, and within 3 seconds she's redirected to the onboarding wizard with her name and profile picture visible.*

### UI/UX Layout

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                  │
│                    Welcome to StartupAI                          │
│                                                                  │
│     AI-powered guidance from idea to investor-ready             │
│                                                                  │
│     ┌─────────────────────────────────────────────────────┐     │
│     │  [G] Continue with Google                            │     │
│     └─────────────────────────────────────────────────────┘     │
│                                                                  │
│     ┌─────────────────────────────────────────────────────┐     │
│     │  [in] Continue with LinkedIn                         │     │
│     └─────────────────────────────────────────────────────┘     │
│                                                                  │
│     By continuing, you agree to our Terms and Privacy Policy    │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Implementation Steps

1. **Create Login Page**
   ```typescript
   // src/pages/Login.tsx
   export function Login() {
     const { signInWithGoogle, signInWithLinkedIn } = useAuth();

     return (
       <div className="min-h-screen flex items-center justify-center">
         <Card className="w-full max-w-md">
           <CardHeader className="text-center">
             <h1 className="text-2xl font-bold">Welcome to StartupAI</h1>
             <p className="text-muted-foreground">
               AI-powered guidance from idea to investor-ready
             </p>
           </CardHeader>
           <CardContent className="space-y-4">
             <Button
               variant="outline"
               className="w-full"
               onClick={signInWithGoogle}
             >
               <GoogleIcon className="mr-2 h-4 w-4" />
               Continue with Google
             </Button>
             <Button
               variant="outline"
               className="w-full"
               onClick={signInWithLinkedIn}
             >
               <LinkedInIcon className="mr-2 h-4 w-4" />
               Continue with LinkedIn
             </Button>
           </CardContent>
           <CardFooter className="text-center text-sm text-muted-foreground">
             By continuing, you agree to our Terms and Privacy Policy
           </CardFooter>
         </Card>
       </div>
     );
   }
   ```

2. **Update useAuth Hook**
   ```typescript
   // src/hooks/useAuth.ts
   export function useAuth() {
     const signInWithGoogle = async () => {
       const { error } = await supabase.auth.signInWithOAuth({
         provider: 'google',
         options: {
           redirectTo: `${window.location.origin}/auth/callback`
         }
       });
       if (error) throw error;
     };

     return { signInWithGoogle, ... };
   }
   ```

3. **Create Auth Callback Page**
   ```typescript
   // src/pages/AuthCallback.tsx
   export function AuthCallback() {
     const navigate = useNavigate();

     useEffect(() => {
       const { data: { subscription } } = supabase.auth.onAuthStateChange(
         async (event, session) => {
           if (event === 'SIGNED_IN' && session) {
             // Check if onboarding complete
             const { data: startup } = await supabase
               .from('startups')
               .select('onboarding_complete')
               .eq('user_id', session.user.id)
               .single();

             if (startup?.onboarding_complete) {
               navigate('/dashboard');
             } else {
               navigate('/onboarding');
             }
           }
         }
       );

       return () => subscription.unsubscribe();
     }, []);

     return <LoadingSpinner />;
   }
   ```

### Files

| File | Action |
|------|--------|
| `src/pages/Login.tsx` | Create/Modify |
| `src/pages/AuthCallback.tsx` | Create |
| `src/hooks/useAuth.ts` | Modify |
| `src/App.tsx` | Add routes |

### Acceptance Criteria

- [ ] Login page renders with Google button
- [ ] Clicking Google opens OAuth popup
- [ ] Successful auth redirects to callback
- [ ] Callback redirects to appropriate page
- [ ] Error shows user-friendly message

### Effort

- **Time:** 4-6 hours
- **Complexity:** Medium

---

## Task: AUTH-003 — LinkedIn OAuth Flow

```yaml
---
task_id: AUTH-003
title: Implement LinkedIn OAuth Login
diagram_ref: D-05
behavior: "User can sign in with LinkedIn"
prd_ref: "Section 4.1: Progressive Onboarding Flow"
phase: CORE
priority: P0
status: Not Started
percent_complete: 0
category: Frontend
primary_skill: /frontend-design
secondary_skills: [/supabase]
subagents: [frontend-designer]
depends_on: AUTH-001
---
```

### User Story

> **As a** professional founder
> **I want** to sign up with my LinkedIn account
> **So that** my professional profile is automatically linked

### Real-World Example

*David, a serial entrepreneur, clicks "Continue with LinkedIn". His professional photo and job title from LinkedIn are imported, saving him time during onboarding.*

### Implementation Steps

1. **Add LinkedIn Sign-In**
   ```typescript
   const signInWithLinkedIn = async () => {
     const { error } = await supabase.auth.signInWithOAuth({
       provider: 'linkedin_oidc',
       options: {
         redirectTo: `${window.location.origin}/auth/callback`,
         scopes: 'openid profile email'
       }
     });
     if (error) throw error;
   };
   ```

2. **Extract LinkedIn Profile Data**
   ```typescript
   // In profile creation trigger
   const linkedinData = user.user_metadata;
   // Contains: picture, name, email
   ```

### Files

| File | Action |
|------|--------|
| `src/hooks/useAuth.ts` | Modify |
| `src/pages/Login.tsx` | Verify |

### Acceptance Criteria

- [ ] LinkedIn button visible on login page
- [ ] Clicking LinkedIn opens OAuth
- [ ] Profile data extracted correctly
- [ ] Redirect works same as Google

### Effort

- **Time:** 2-3 hours
- **Complexity:** Low

---

## Task: AUTH-004 — useAuth Hook

```yaml
---
task_id: AUTH-004
title: Complete useAuth Hook Implementation
diagram_ref: D-05
behavior: "App has complete auth state management"
prd_ref: "Section 4: Onboarding System"
phase: CORE
priority: P0
status: Not Started
percent_complete: 0
category: Frontend
primary_skill: /frontend-design
secondary_skills: [/supabase]
subagents: [frontend-designer]
depends_on: AUTH-002, AUTH-003
---
```

### User Story

> **As a** developer
> **I want** a comprehensive auth hook
> **So that** any component can access auth state and actions

### Implementation Steps

```typescript
// src/hooks/useAuth.ts
import { useEffect, useState, createContext, useContext } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { User, Session } from '@supabase/supabase-js';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithLinkedIn: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`
      }
    });
    if (error) throw error;
  };

  const signInWithLinkedIn = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'linkedin_oidc',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`
      }
    });
    if (error) throw error;
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  };

  return (
    <AuthContext.Provider value={{
      user,
      session,
      loading,
      signInWithGoogle,
      signInWithLinkedIn,
      signOut
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
```

### Files

| File | Action |
|------|--------|
| `src/hooks/useAuth.ts` | Modify |
| `src/App.tsx` | Wrap with AuthProvider |

### Acceptance Criteria

- [ ] `useAuth()` returns user, session, loading
- [ ] Auth state persists across refreshes
- [ ] Sign in methods work
- [ ] Sign out clears session
- [ ] Loading state prevents flash

### Effort

- **Time:** 3-4 hours
- **Complexity:** Medium

---

## Task: ONB-001 — Onboarding Wizard Shell

```yaml
---
task_id: ONB-001
title: Create Onboarding Wizard Shell
diagram_ref: D-05
behavior: "Wizard displays with step navigation"
prd_ref: "Section 4.1: Progressive Onboarding Flow"
phase: CORE
priority: P0
status: Not Started
percent_complete: 0
category: Frontend
primary_skill: /frontend-design
secondary_skills: []
subagents: [frontend-designer]
depends_on: AUTH-004
---
```

### User Story

> **As a** new user
> **I want** a guided onboarding experience
> **So that** I can set up my startup profile step by step

### Real-World Example

*After signing up, Maya sees a clean 4-step wizard. A progress bar shows she's on step 1 of 4. She can see the step titles: "Basics", "Website", "Industry", "Goals".*

### UI/UX Layout

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  StartupAI                                              [Skip] [Need Help?] │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│     Step 1 ●───●───●───● Step 4                                             │
│     Basics   Website Industry Goals                                         │
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────────┐│
│  │                                                                          ││
│  │                         Step Content Area                                ││
│  │                                                                          ││
│  │                    (Dynamic based on current step)                       ││
│  │                                                                          ││
│  │                                                                          ││
│  └─────────────────────────────────────────────────────────────────────────┘│
│                                                                              │
│                              [← Back]  [Continue →]                          │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Implementation Steps

1. **Create Wizard Component**
   ```typescript
   // src/pages/OnboardingWizard.tsx
   interface WizardStep {
     id: string;
     title: string;
     component: React.ComponentType;
   }

   const STEPS: WizardStep[] = [
     { id: 'basics', title: 'Basics', component: Step1Basics },
     { id: 'website', title: 'Website', component: Step2Website },
     { id: 'industry', title: 'Industry', component: Step3Industry },
     { id: 'goals', title: 'Goals', component: Step4Goals },
   ];

   export function OnboardingWizard() {
     const [currentStep, setCurrentStep] = useState(0);
     const [formData, setFormData] = useState<OnboardingData>({});

     const CurrentStepComponent = STEPS[currentStep].component;

     return (
       <div className="min-h-screen bg-background">
         <header className="border-b p-4 flex justify-between">
           <Logo />
           <div className="flex gap-2">
             <Button variant="ghost">Skip</Button>
             <Button variant="ghost">Need Help?</Button>
           </div>
         </header>

         <main className="max-w-2xl mx-auto py-8 px-4">
           <StepProgress steps={STEPS} currentStep={currentStep} />

           <Card className="mt-8">
             <CurrentStepComponent
               data={formData}
               onUpdate={(data) => setFormData({ ...formData, ...data })}
               onNext={() => setCurrentStep(s => s + 1)}
               onBack={() => setCurrentStep(s => s - 1)}
             />
           </Card>

           <div className="mt-6 flex justify-between">
             {currentStep > 0 && (
               <Button variant="outline" onClick={() => setCurrentStep(s => s - 1)}>
                 ← Back
               </Button>
             )}
             <Button onClick={() => setCurrentStep(s => s + 1)}>
               Continue →
             </Button>
           </div>
         </main>
       </div>
     );
   }
   ```

2. **Create Step Progress Component**
   ```typescript
   // src/components/onboarding/StepProgress.tsx
   export function StepProgress({ steps, currentStep }: Props) {
     return (
       <div className="flex items-center justify-center">
         {steps.map((step, index) => (
           <Fragment key={step.id}>
             <div className={cn(
               "flex flex-col items-center",
               index <= currentStep ? "text-primary" : "text-muted-foreground"
             )}>
               <div className={cn(
                 "w-8 h-8 rounded-full flex items-center justify-center",
                 index < currentStep ? "bg-primary text-primary-foreground" :
                 index === currentStep ? "border-2 border-primary" :
                 "border-2 border-muted"
               )}>
                 {index < currentStep ? <Check className="h-4 w-4" /> : index + 1}
               </div>
               <span className="text-sm mt-1">{step.title}</span>
             </div>
             {index < steps.length - 1 && (
               <div className={cn(
                 "w-12 h-0.5 mx-2",
                 index < currentStep ? "bg-primary" : "bg-muted"
               )} />
             )}
           </Fragment>
         ))}
       </div>
     );
   }
   ```

### Files

| File | Action |
|------|--------|
| `src/pages/OnboardingWizard.tsx` | Create |
| `src/components/onboarding/StepProgress.tsx` | Create |
| `src/components/onboarding/index.ts` | Create |
| `src/App.tsx` | Add route |

### Acceptance Criteria

- [ ] Wizard renders with 4 steps
- [ ] Progress indicator shows current step
- [ ] Step titles are visible
- [ ] Back/Continue buttons work
- [ ] URL updates with step (optional)

### Effort

- **Time:** 4-6 hours
- **Complexity:** Medium

---

## Task: ONB-002 — Step 1: Company Basics

```yaml
---
task_id: ONB-002
title: Implement Onboarding Step 1 - Company Basics
diagram_ref: D-05
behavior: "User can enter company name and description"
prd_ref: "Section 4.1: Step 1 - Account Creation"
phase: CORE
priority: P0
status: Not Started
percent_complete: 0
category: Frontend
primary_skill: /frontend-design
secondary_skills: []
subagents: [frontend-designer]
depends_on: ONB-001
---
```

### User Story

> **As a** founder
> **I want** to enter my company's basic information
> **So that** StartupAI can personalize my experience

### Real-World Example

*Tom enters "EcoPackage" as his startup name and writes "We're making sustainable packaging for e-commerce companies that's cheaper than plastic." The form shows a character count for the description and highlights good practices.*

### UI/UX Layout

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                              │
│     👋 Let's get to know your startup                                       │
│                                                                              │
│     What's your startup called?                                             │
│     ┌─────────────────────────────────────────────────────────────────────┐ │
│     │ EcoPackage                                                          │ │
│     └─────────────────────────────────────────────────────────────────────┘ │
│                                                                              │
│     Describe what you're building (2-3 sentences)                           │
│     ┌─────────────────────────────────────────────────────────────────────┐ │
│     │ We're making sustainable packaging for e-commerce companies that   │ │
│     │ is cheaper than plastic while being 100% compostable.              │ │
│     │                                                               156/500│ │
│     └─────────────────────────────────────────────────────────────────────┘ │
│     💡 Tip: Focus on the problem you're solving, not just features         │
│                                                                              │
│     What's the main problem you're solving?                                 │
│     ┌─────────────────────────────────────────────────────────────────────┐ │
│     │ E-commerce companies waste $50B/year on plastic packaging that     │ │
│     │ damages their brand image and contributes to ocean pollution.      │ │
│     └─────────────────────────────────────────────────────────────────────┘ │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Implementation Steps

1. **Create Step 1 Component**
   ```typescript
   // src/components/onboarding/step1/CompanyBasicsForm.tsx
   interface Step1Data {
     name: string;
     description: string;
     problem_summary: string;
   }

   export function Step1Basics({ data, onUpdate }: StepProps) {
     const [name, setName] = useState(data.name || '');
     const [description, setDescription] = useState(data.description || '');
     const [problem, setProblem] = useState(data.problem_summary || '');

     useEffect(() => {
       onUpdate({ name, description, problem_summary: problem });
     }, [name, description, problem]);

     return (
       <div className="space-y-6">
         <div>
           <Label htmlFor="name">What's your startup called?</Label>
           <Input
             id="name"
             value={name}
             onChange={(e) => setName(e.target.value)}
             placeholder="Your startup name"
           />
         </div>

         <div>
           <Label htmlFor="description">
             Describe what you're building (2-3 sentences)
           </Label>
           <Textarea
             id="description"
             value={description}
             onChange={(e) => setDescription(e.target.value)}
             placeholder="We're making..."
             maxLength={500}
           />
           <div className="text-right text-sm text-muted-foreground">
             {description.length}/500
           </div>
           <p className="text-sm text-muted-foreground mt-1">
             💡 Tip: Focus on the problem you're solving, not just features
           </p>
         </div>

         <div>
           <Label htmlFor="problem">What's the main problem you're solving?</Label>
           <Textarea
             id="problem"
             value={problem}
             onChange={(e) => setProblem(e.target.value)}
             placeholder="Describe the pain point..."
           />
         </div>
       </div>
     );
   }
   ```

### Files

| File | Action |
|------|--------|
| `src/components/onboarding/step1/CompanyBasicsForm.tsx` | Create |
| `src/components/onboarding/step1/index.ts` | Create |

### Acceptance Criteria

- [ ] Name input works
- [ ] Description textarea with character count
- [ ] Problem summary input
- [ ] Data persists when navigating steps
- [ ] Validation prevents empty required fields

### Effort

- **Time:** 3-4 hours
- **Complexity:** Low

---

## Task: ONB-003 — Step 2: Website Extraction

```yaml
---
task_id: ONB-003
title: Implement Onboarding Step 2 - Website Extraction
diagram_ref: D-05
behavior: "System extracts data from user's website"
prd_ref: "Section 4.2: AI-Powered Extraction"
phase: CORE
priority: P0
status: Not Started
percent_complete: 0
category: Full Stack
primary_skill: /feature-dev
secondary_skills: [/gemini, /edge-functions]
subagents: [ai-agent-dev]
depends_on: ONB-002
---
```

### User Story

> **As a** founder with an existing website
> **I want** to enter my URL and have my profile auto-filled
> **So that** I save time during onboarding

### Real-World Example

*Lisa enters "https://www.ecopackage.io". The system shows a loading spinner for 5 seconds, then reveals extracted data: "EcoPackage - Sustainable e-commerce packaging. Industry: Retail/E-commerce. Business Model: B2B. Key features: Compostable materials, custom branding, bulk pricing." She can edit any field before continuing.*

### UI/UX Layout

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                              │
│     🔍 Let's analyze your website                                           │
│                                                                              │
│     Do you have a website for your startup?                                 │
│                                                                              │
│     ┌─────────────────────────────────────────────────────────────────────┐ │
│     │ https://www.ecopackage.io                              [Analyze →] │ │
│     └─────────────────────────────────────────────────────────────────────┘ │
│                                                                              │
│     ─────────── OR ───────────                                              │
│                                                                              │
│     [No website yet, skip this step]                                        │
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────────┐│
│  │  ✅ We found some insights from your website!                           ││
│  │                                                                          ││
│  │  Company: EcoPackage                                         [Edit]    ││
│  │  Industry: Retail/E-commerce                                 [Edit]    ││
│  │  Business Model: B2B                                         [Edit]    ││
│  │  Key Features:                                                          ││
│  │  • Compostable materials                                                ││
│  │  • Custom branding                                                      ││
│  │  • Bulk pricing                                                         ││
│  │                                                                          ││
│  │  ───────────────────────────────────────────────────────────────────    ││
│  │  Looks correct? [Use These Insights]  [Edit Manually]                   ││
│  └─────────────────────────────────────────────────────────────────────────┘│
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Implementation Steps

1. **Create Edge Function**
   ```typescript
   // supabase/functions/onboarding-agent/index.ts
   import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
   import { GoogleGenerativeAI } from "https://esm.sh/@google/generative-ai";

   const genAI = new GoogleGenerativeAI(Deno.env.get("GEMINI_API_KEY")!);

   serve(async (req) => {
     const { action, url, startup_id } = await req.json();

     if (action === 'extract_website') {
       // 1. Scrape website with Firecrawl
       const firecrawlResponse = await fetch('https://api.firecrawl.dev/v1/scrape', {
         method: 'POST',
         headers: {
           'Authorization': `Bearer ${Deno.env.get("FIRECRAWL_API_KEY")}`,
           'Content-Type': 'application/json'
         },
         body: JSON.stringify({ url, formats: ['markdown'] })
       });

       const { data } = await firecrawlResponse.json();

       // 2. Extract insights with Gemini
       const model = genAI.getGenerativeModel({
         model: "gemini-3-flash-preview",
         generationConfig: {
           responseMimeType: "application/json",
           responseSchema: {
             type: "object",
             properties: {
               company_name: { type: "string" },
               description: { type: "string" },
               industry: { type: "string" },
               business_model: { type: "string" },
               target_customers: { type: "string" },
               key_features: { type: "array", items: { type: "string" } },
               problems_solved: { type: "array", items: { type: "string" } }
             }
           }
         }
       });

       const prompt = `Analyze this website content and extract startup information:

       ${data.markdown}

       Extract: company name, description, industry, business model, target customers, key features, and problems solved.`;

       const result = await model.generateContent(prompt);
       const insights = JSON.parse(result.response.text());

       return new Response(JSON.stringify({ success: true, insights }), {
         headers: { "Content-Type": "application/json" }
       });
     }
   });
   ```

2. **Create Step 2 Component**
   ```typescript
   // src/components/onboarding/step2/WebsiteInsightsCard.tsx
   export function Step2Website({ data, onUpdate }: StepProps) {
     const [url, setUrl] = useState(data.website || '');
     const [loading, setLoading] = useState(false);
     const [insights, setInsights] = useState<WebsiteInsights | null>(null);

     const handleAnalyze = async () => {
       setLoading(true);
       try {
         const { data } = await supabase.functions.invoke('onboarding-agent', {
           body: { action: 'extract_website', url }
         });
         setInsights(data.insights);
         onUpdate({
           website: url,
           ...data.insights
         });
       } catch (error) {
         toast.error('Failed to analyze website');
       } finally {
         setLoading(false);
       }
     };

     return (
       <div className="space-y-6">
         <div>
           <Label>Do you have a website for your startup?</Label>
           <div className="flex gap-2 mt-2">
             <Input
               value={url}
               onChange={(e) => setUrl(e.target.value)}
               placeholder="https://your-startup.com"
             />
             <Button onClick={handleAnalyze} disabled={!url || loading}>
               {loading ? <Loader2 className="animate-spin" /> : 'Analyze →'}
             </Button>
           </div>
         </div>

         {insights && (
           <InsightsCard insights={insights} onEdit={(field, value) => {
             setInsights({ ...insights, [field]: value });
             onUpdate({ [field]: value });
           }} />
         )}

         <Button variant="ghost" onClick={() => onUpdate({ website: null })}>
           No website yet, skip this step
         </Button>
       </div>
     );
   }
   ```

### Files

| File | Action |
|------|--------|
| `supabase/functions/onboarding-agent/index.ts` | Create |
| `src/components/onboarding/step2/WebsiteInsightsCard.tsx` | Create |
| `src/components/onboarding/step2/InsightsCard.tsx` | Create |

### Core MVP Prompt

```
You are analyzing a startup website to extract key information.

Extract the following:
1. Company name
2. One-line description (max 120 chars)
3. Industry (from: SaaS, Consumer, Fintech, E-commerce, Healthtech, Edtech, Proptech, Marketplace, AI/ML, Hardware, Climate, Gaming, Creator Economy)
4. Business model (B2B, B2C, B2B2C, Marketplace)
5. Target customers (specific segment)
6. Key features (top 3)
7. Problems solved (top 3)

If you cannot determine a field, return null for that field.
Prioritize accuracy over completeness.
```

### Acceptance Criteria

- [ ] URL input with validation
- [ ] Analyze button triggers extraction
- [ ] Loading state during processing
- [ ] Insights display in editable cards
- [ ] Skip option for no website
- [ ] Error handling for failed extraction

### Effort

- **Time:** 8-10 hours
- **Complexity:** High

---

## Task: ONB-004 — Step 3: Industry Selection

```yaml
---
task_id: ONB-004
title: Implement Onboarding Step 3 - Industry Selection
diagram_ref: D-05
behavior: "User selects industry and gets playbook assigned"
prd_ref: "Section 4.1: Step 6 - Playbook Assignment"
phase: CORE
priority: P0
status: Not Started
percent_complete: 0
category: Frontend
primary_skill: /frontend-design
secondary_skills: [/startup]
subagents: [startup-expert]
depends_on: ONB-003
---
```

### User Story

> **As a** founder
> **I want** to select my industry
> **So that** I receive industry-specific guidance

### Real-World Example

*After website analysis suggested "E-commerce", Carlos confirms this is correct. He sees a brief description: "E-commerce playbook includes: D2C growth strategies, CAC/LTV optimization, fulfillment best practices, and marketplace considerations." He clicks to continue.*

### UI/UX Layout

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                              │
│     🏭 Select your industry                                                 │
│                                                                              │
│     This helps us provide industry-specific guidance and benchmarks.        │
│                                                                              │
│     ┌────────────────┐ ┌────────────────┐ ┌────────────────┐               │
│     │  💻 SaaS/B2B   │ │  📱 Consumer   │ │  💰 Fintech    │               │
│     │               │ │                │ │                │               │
│     │  Enterprise   │ │  Mobile apps,  │ │  Payments,     │               │
│     │  software     │ │  social        │ │  lending       │               │
│     └────────────────┘ └────────────────┘ └────────────────┘               │
│                                                                              │
│     ┌────────────────┐ ┌────────────────┐ ┌────────────────┐               │
│     │  🛒 E-commerce │ │  🏥 Healthtech │ │  📚 Edtech     │ ← Selected    │
│     │     ✓         │ │                │ │                │               │
│     │  D2C, market- │ │  Digital       │ │  Learning      │               │
│     │  places       │ │  health        │ │  platforms     │               │
│     └────────────────┘ └────────────────┘ └────────────────┘               │
│                                                                              │
│     ┌─────────────────────────────────────────────────────────────────────┐ │
│     │  E-commerce Playbook includes:                                      │ │
│     │  • D2C growth strategies                                            │ │
│     │  • CAC/LTV optimization frameworks                                  │ │
│     │  • Fulfillment and logistics best practices                         │ │
│     │  • Marketplace expansion considerations                             │ │
│     └─────────────────────────────────────────────────────────────────────┘ │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Implementation Steps

1. **Create Industry Options**
   ```typescript
   // src/lib/onboardingConstants.ts
   export const INDUSTRIES = [
     { id: 'saas', name: 'SaaS/B2B', icon: '💻', description: 'Enterprise software' },
     { id: 'consumer', name: 'Consumer', icon: '📱', description: 'Mobile apps, social' },
     { id: 'fintech', name: 'Fintech', icon: '💰', description: 'Payments, lending' },
     { id: 'ecommerce', name: 'E-commerce', icon: '🛒', description: 'D2C, marketplaces' },
     { id: 'healthtech', name: 'Healthtech', icon: '🏥', description: 'Digital health' },
     { id: 'edtech', name: 'Edtech', icon: '📚', description: 'Learning platforms' },
     { id: 'proptech', name: 'Proptech', icon: '🏠', description: 'Real estate tech' },
     { id: 'marketplace', name: 'Marketplace', icon: '🔄', description: 'Two-sided platforms' },
     { id: 'ai', name: 'AI/ML', icon: '🤖', description: 'AI products and tools' },
     { id: 'hardware', name: 'Hardware', icon: '🔧', description: 'Physical products' },
     { id: 'climate', name: 'Climate', icon: '🌱', description: 'Sustainability tech' },
     { id: 'gaming', name: 'Gaming', icon: '🎮', description: 'Games and entertainment' },
     { id: 'creator', name: 'Creator Economy', icon: '🎨', description: 'Creator tools' },
   ];
   ```

2. **Create Step 3 Component**
   ```typescript
   // src/components/onboarding/step3/IndustrySelector.tsx
   export function Step3Industry({ data, onUpdate }: StepProps) {
     const [selected, setSelected] = useState(data.industry || '');
     const [playbook, setPlaybook] = useState<Playbook | null>(null);

     useEffect(() => {
       if (selected) {
         onUpdate({ industry: selected });
         // Load playbook preview
         loadPlaybookPreview(selected).then(setPlaybook);
       }
     }, [selected]);

     return (
       <div className="space-y-6">
         <div>
           <h3 className="text-lg font-semibold">Select your industry</h3>
           <p className="text-muted-foreground">
             This helps us provide industry-specific guidance and benchmarks.
           </p>
         </div>

         <div className="grid grid-cols-3 gap-4">
           {INDUSTRIES.map((industry) => (
             <Card
               key={industry.id}
               className={cn(
                 "cursor-pointer hover:border-primary transition-colors",
                 selected === industry.id && "border-primary bg-primary/5"
               )}
               onClick={() => setSelected(industry.id)}
             >
               <CardContent className="p-4 text-center">
                 <div className="text-2xl mb-2">{industry.icon}</div>
                 <div className="font-medium">{industry.name}</div>
                 <div className="text-sm text-muted-foreground">
                   {industry.description}
                 </div>
                 {selected === industry.id && (
                   <Check className="h-4 w-4 text-primary mt-2 mx-auto" />
                 )}
               </CardContent>
             </Card>
           ))}
         </div>

         {playbook && (
           <Card>
             <CardContent className="p-4">
               <h4 className="font-medium">{playbook.name} Playbook includes:</h4>
               <ul className="mt-2 space-y-1">
                 {playbook.highlights.map((item, i) => (
                   <li key={i} className="text-sm text-muted-foreground">
                     • {item}
                   </li>
                 ))}
               </ul>
             </CardContent>
           </Card>
         )}
       </div>
     );
   }
   ```

### Files

| File | Action |
|------|--------|
| `src/lib/onboardingConstants.ts` | Create |
| `src/components/onboarding/step3/IndustrySelector.tsx` | Create |

### Acceptance Criteria

- [ ] All 13 industries displayed
- [ ] Selection highlights card
- [ ] Playbook preview shows on selection
- [ ] Pre-selected if from website extraction
- [ ] Data persists on step navigation

### Effort

- **Time:** 4-6 hours
- **Complexity:** Medium

---

## Task: ONB-005 — Step 4: Traction & Funding

```yaml
---
task_id: ONB-005
title: Implement Onboarding Step 4 - Traction & Funding
diagram_ref: D-05
behavior: "User enters traction metrics and funding status"
prd_ref: "Section 4.1: Step 4 - Stage Assessment"
phase: CORE
priority: P0
status: Not Started
percent_complete: 0
category: Frontend
primary_skill: /frontend-design
secondary_skills: [/startup]
subagents: [startup-expert]
depends_on: ONB-004
---
```

### User Story

> **As a** founder
> **I want** to input my current traction and funding status
> **So that** StartupAI can accurately determine my stage

### Real-World Example

*Jessica selects: "We have 50 paying customers" and "We've raised a small friends & family round ($50K)". Based on this, the system suggests she's at the "Traction" stage and shows what features are unlocked.*

### UI/UX Layout

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                              │
│     📊 Tell us about your progress                                          │
│                                                                              │
│     Where are you with customers?                                           │
│     ○ Still researching the problem                                         │
│     ○ Talking to potential customers                                        │
│     ○ Have beta users testing                                               │
│     ● Have paying customers (50)                                            │
│     ○ Significant revenue ($100K+ ARR)                                      │
│                                                                              │
│     Have you raised funding?                                                │
│     ○ No, bootstrapping                                                     │
│     ● Yes, friends & family / angels                                        │
│     ○ Yes, seed round                                                       │
│     ○ Yes, Series A+                                                        │
│                                                                              │
│     ┌─────────────────────────────────────────────────────────────────────┐ │
│     │  Based on your progress, you're at the TRACTION stage              │ │
│     │                                                                      │ │
│     │  ✅ Unlocked: Lean Canvas, Validation Lab, Sprint Planning         │ │
│     │  🔒 Next: PMF Survey, Pitch Deck Builder (after PMF)               │ │
│     └─────────────────────────────────────────────────────────────────────┘ │
│                                                                              │
│     What's your #1 goal for the next 90 days?                               │
│     ┌─────────────────────────────────────────────────────────────────────┐ │
│     │ Achieve product-market fit (40%+ "very disappointed" in PMF survey)│ │
│     └─────────────────────────────────────────────────────────────────────┘ │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Implementation Steps

1. **Create Step 4 Component**
   ```typescript
   // src/components/onboarding/step4/TractionFundingCard.tsx
   const CUSTOMER_STAGES = [
     { id: 'researching', label: 'Still researching the problem', stage: 'idea' },
     { id: 'talking', label: 'Talking to potential customers', stage: 'market_discovery' },
     { id: 'beta', label: 'Have beta users testing', stage: 'psf' },
     { id: 'paying', label: 'Have paying customers', stage: 'traction' },
     { id: 'revenue', label: 'Significant revenue ($100K+ ARR)', stage: 'scale' },
   ];

   const FUNDING_STAGES = [
     { id: 'bootstrap', label: 'No, bootstrapping' },
     { id: 'ff', label: 'Yes, friends & family / angels' },
     { id: 'seed', label: 'Yes, seed round' },
     { id: 'series', label: 'Yes, Series A+' },
   ];

   export function Step4Traction({ data, onUpdate }: StepProps) {
     const [customerStage, setCustomerStage] = useState(data.customer_stage || '');
     const [fundingStage, setFundingStage] = useState(data.funding_stage || '');
     const [goal, setGoal] = useState(data.ninety_day_goal || '');

     const detectedStage = CUSTOMER_STAGES.find(s => s.id === customerStage)?.stage || 'idea';

     useEffect(() => {
       onUpdate({
         customer_stage: customerStage,
         funding_stage: fundingStage,
         ninety_day_goal: goal,
         stage: detectedStage
       });
     }, [customerStage, fundingStage, goal, detectedStage]);

     return (
       <div className="space-y-6">
         <div>
           <Label className="text-base">Where are you with customers?</Label>
           <RadioGroup value={customerStage} onValueChange={setCustomerStage} className="mt-3">
             {CUSTOMER_STAGES.map((stage) => (
               <div key={stage.id} className="flex items-center space-x-2">
                 <RadioGroupItem value={stage.id} id={stage.id} />
                 <Label htmlFor={stage.id}>{stage.label}</Label>
               </div>
             ))}
           </RadioGroup>
         </div>

         <div>
           <Label className="text-base">Have you raised funding?</Label>
           <RadioGroup value={fundingStage} onValueChange={setFundingStage} className="mt-3">
             {FUNDING_STAGES.map((stage) => (
               <div key={stage.id} className="flex items-center space-x-2">
                 <RadioGroupItem value={stage.id} id={stage.id} />
                 <Label htmlFor={stage.id}>{stage.label}</Label>
               </div>
             ))}
           </RadioGroup>
         </div>

         {detectedStage && (
           <StageDetectionCard
             stage={detectedStage}
             unlocked={getUnlockedFeatures(detectedStage)}
             locked={getLockedFeatures(detectedStage)}
           />
         )}

         <div>
           <Label htmlFor="goal">What's your #1 goal for the next 90 days?</Label>
           <Textarea
             id="goal"
             value={goal}
             onChange={(e) => setGoal(e.target.value)}
             placeholder="e.g., Achieve product-market fit"
           />
         </div>
       </div>
     );
   }
   ```

### Files

| File | Action |
|------|--------|
| `src/components/onboarding/step4/TractionFundingCard.tsx` | Create |
| `src/components/onboarding/step4/StageDetectionCard.tsx` | Create |

### Acceptance Criteria

- [ ] Customer progress options selectable
- [ ] Funding status options selectable
- [ ] Stage detection shows automatically
- [ ] Unlocked/locked features displayed
- [ ] 90-day goal input works

### Effort

- **Time:** 4-6 hours
- **Complexity:** Medium

---

## Task: ONB-006 — Completion & Redirect

```yaml
---
task_id: ONB-006
title: Implement Onboarding Completion
diagram_ref: D-05
behavior: "Onboarding data saved, user redirected to dashboard"
prd_ref: "Section 4.1: Progressive Onboarding Flow"
phase: CORE
priority: P0
status: Not Started
percent_complete: 0
category: Full Stack
primary_skill: /feature-dev
secondary_skills: [/supabase]
subagents: [supabase-expert]
depends_on: ONB-005
---
```

### User Story

> **As a** founder completing onboarding
> **I want** my data saved and to be taken to my dashboard
> **So that** I can start using StartupAI immediately

### Implementation Steps

1. **Save Onboarding Data**
   ```typescript
   // src/pages/OnboardingWizard.tsx
   const handleComplete = async () => {
     setLoading(true);
     try {
       // Upsert startup record
       const { error } = await supabase
         .from('startups')
         .upsert({
           user_id: user.id,
           name: formData.name,
           description: formData.description,
           website: formData.website,
           industry: formData.industry,
           stage: formData.stage,
           business_model: formData.business_model,
           target_customers: formData.target_customers,
           problem_summary: formData.problem_summary,
           onboarding_complete: true,
           lean_canvas: {
             problem: [formData.problem_summary],
             customer_segments: [formData.target_customers],
           }
         });

       if (error) throw error;

       // Assign playbook
       if (formData.industry) {
         const { data: playbook } = await supabase
           .from('playbooks')
           .select('id')
           .eq('industry', formData.industry)
           .single();

         if (playbook) {
           await supabase.from('startup_playbooks').insert({
             startup_id: startupId,
             playbook_id: playbook.id
           });
         }
       }

       // Generate first tasks
       await supabase.functions.invoke('task-orchestrator', {
         body: { action: 'generate_first_tasks', startup_id: startupId }
       });

       navigate('/dashboard');
     } catch (error) {
       toast.error('Failed to save onboarding data');
     } finally {
       setLoading(false);
     }
   };
   ```

2. **Create Completion Screen**
   ```typescript
   // src/components/onboarding/CompletionStep.tsx
   export function CompletionStep({ data, onComplete }: Props) {
     return (
       <div className="text-center space-y-6">
         <div className="text-6xl">🎉</div>
         <h2 className="text-2xl font-bold">You're all set!</h2>
         <p className="text-muted-foreground">
           We've set up your {data.name} workspace with:
         </p>
         <ul className="text-left max-w-sm mx-auto space-y-2">
           <li className="flex items-center gap-2">
             <Check className="h-4 w-4 text-green-500" />
             {data.industry} playbook assigned
           </li>
           <li className="flex items-center gap-2">
             <Check className="h-4 w-4 text-green-500" />
             Lean Canvas started with your problem
           </li>
           <li className="flex items-center gap-2">
             <Check className="h-4 w-4 text-green-500" />
             First tasks generated for {data.stage} stage
           </li>
         </ul>
         <Button onClick={onComplete} size="lg">
           Go to Dashboard →
         </Button>
       </div>
     );
   }
   ```

### Files

| File | Action |
|------|--------|
| `src/pages/OnboardingWizard.tsx` | Modify |
| `src/components/onboarding/CompletionStep.tsx` | Create |

### Acceptance Criteria

- [ ] All form data saved to `startups` table
- [ ] Playbook assigned based on industry
- [ ] `onboarding_complete` set to true
- [ ] Redirect to dashboard works
- [ ] First tasks visible on dashboard

### Effort

- **Time:** 4-6 hours
- **Complexity:** Medium

---

## Task: INF-003 — Dashboard Layout

```yaml
---
task_id: INF-003
title: Create Dashboard 3-Panel Layout
diagram_ref: D-03
behavior: "Dashboard shows 3-panel layout with navigation"
prd_ref: "Section 19.4: Dashboard Layout"
phase: CORE
priority: P0
status: Not Started
percent_complete: 0
category: Frontend
primary_skill: /frontend-design
secondary_skills: []
subagents: [frontend-designer]
depends_on: ONB-006
---
```

### User Story

> **As a** founder
> **I want** a clear dashboard layout
> **So that** I can navigate and work efficiently

### UI/UX Layout

```
┌──────────────────────────────────────────────────────────────────────────────┐
│  [Logo] StartupAI          EcoPackage ▾         [?] [Settings] [👤 Marcus]  │
├─────────┬────────────────────────────────────────────────────────┬───────────┤
│  LEFT   │                      MAIN                               │  RIGHT    │
│  200px  │                      flex-1                             │  300px    │
│         │                                                          │           │
│ ┌─────┐ │  ┌──────────────────────────────────────────────────┐  │ ┌───────┐ │
│ │ 🏠  │ │  │  Welcome back, Marcus!                           │  │ │ Atlas │ │
│ │Home │ │  │  Your startup is at the TRACTION stage           │  │ │ Says  │ │
│ └─────┘ │  └──────────────────────────────────────────────────┘  │ │       │ │
│ ┌─────┐ │                                                          │ │"Focus │ │
│ │ 📋  │ │  ┌──────────────────┐ ┌──────────────────┐            │ │on PMF"│ │
│ │Tasks│ │  │  Today's Focus    │ │  Key Metrics     │            │ │       │ │
│ └─────┘ │  │  🎯 Run PMF survey│ │  Users: 50       │            │ └───────┘ │
│ ┌─────┐ │  │  ⏰ Sprint: 4 days│ │  MRR: $2,500     │            │           │
│ │ 📊  │ │  └──────────────────┘ └──────────────────┘            │ ┌───────┐ │
│ │Canvs│ │                                                          │ │ Quick │ │
│ └─────┘ │  ┌──────────────────────────────────────────────────┐  │ │Actions│ │
│ ┌─────┐ │  │  Task List                                        │  │ │       │ │
│ │ 🧪  │ │  │  ☐ Interview 3 customers                         │  │ │[Chat] │ │
│ │Valid│ │  │  ☐ Complete Problem block                        │  │ │[+Task]│ │
│ └─────┘ │  │  ☐ Design landing page test                      │  │ │       │ │
│ ┌─────┐ │  └──────────────────────────────────────────────────┘  │ └───────┘ │
│ │ 📈  │ │                                                          │           │
│ │Metrx│ │                                                          │           │
│ └─────┘ │                                                          │           │
│         │                                                          │           │
└─────────┴────────────────────────────────────────────────────────┴───────────┘
```

### Implementation Steps

1. **Create Layout Component**
   ```typescript
   // src/components/dashboard/DashboardLayout.tsx
   export function DashboardLayout({ children }: { children: React.ReactNode }) {
     return (
       <div className="min-h-screen bg-background">
         <Header />
         <div className="flex">
           <LeftSidebar />
           <main className="flex-1 p-6">{children}</main>
           <RightSidebar />
         </div>
       </div>
     );
   }
   ```

2. **Create Left Sidebar**
   ```typescript
   // src/components/dashboard/LeftSidebar.tsx
   const NAV_ITEMS = [
     { icon: Home, label: 'Home', path: '/dashboard' },
     { icon: ListTodo, label: 'Tasks', path: '/tasks' },
     { icon: LayoutGrid, label: 'Canvas', path: '/canvas' },
     { icon: FlaskConical, label: 'Validation', path: '/validation' },
     { icon: BarChart, label: 'Metrics', path: '/metrics' },
     { icon: Presentation, label: 'Pitch', path: '/pitch' },
     { icon: Users, label: 'CRM', path: '/crm' },
   ];

   export function LeftSidebar() {
     const location = useLocation();

     return (
       <aside className="w-[200px] border-r p-4 space-y-2">
         {NAV_ITEMS.map((item) => (
           <NavLink
             key={item.path}
             to={item.path}
             className={cn(
               "flex items-center gap-2 p-2 rounded-lg",
               location.pathname === item.path
                 ? "bg-primary text-primary-foreground"
                 : "hover:bg-muted"
             )}
           >
             <item.icon className="h-4 w-4" />
             {item.label}
           </NavLink>
         ))}
       </aside>
     );
   }
   ```

3. **Create Right Sidebar**
   ```typescript
   // src/components/dashboard/RightSidebar.tsx
   export function RightSidebar() {
     return (
       <aside className="w-[300px] border-l p-4 space-y-4">
         <AtlasSays />
         <QuickActions />
       </aside>
     );
   }
   ```

### Files

| File | Action |
|------|--------|
| `src/components/dashboard/DashboardLayout.tsx` | Create |
| `src/components/dashboard/LeftSidebar.tsx` | Create |
| `src/components/dashboard/RightSidebar.tsx` | Create |
| `src/components/dashboard/Header.tsx` | Create |

### Acceptance Criteria

- [ ] 3-panel layout renders correctly
- [ ] Left nav has all menu items
- [ ] Active nav item highlighted
- [ ] Right sidebar shows Atlas + Quick Actions
- [ ] Responsive on smaller screens

### Effort

- **Time:** 6-8 hours
- **Complexity:** Medium

---

## Remaining CORE Tasks Summary

| Task ID | Title | Effort |
|---------|-------|--------|
| INF-004 | Navigation System | 3-4 hours |
| INF-005 | Error Boundaries | 2-3 hours |
| INF-006 | Loading States | 2-3 hours |
| DB-002 | Seed Playbooks Data | 2-3 hours |

---

## Phase Validation

**CORE Phase is complete when:**

- [ ] User can sign up via Google or LinkedIn OAuth
- [ ] User completes 4-step onboarding wizard
- [ ] Website data is extracted and processed
- [ ] User lands on dashboard with startup data visible
- [ ] Data persists across sessions
- [ ] User can only access their own data (RLS working)
- [ ] Navigation between pages works
- [ ] Error states handled gracefully
- [ ] Loading states prevent flash of content

---

## Next Phase

After CORE completion, proceed to [`02-tasks-mvp.md`](02-tasks-mvp.md) for:
- Lean Canvas implementation
- Validation Lab
- AI Agents
- Atlas Chat

---

*Generated by Claude Code — 2026-02-02*
