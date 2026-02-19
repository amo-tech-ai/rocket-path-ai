/**
 * Mermaid diagram sources for the Diagrams viewer page.
 * Extracted from tasks/diagrams/*.md
 */

export interface DiagramDef {
  id: string;
  title: string;
  phase?: string;
  mermaid: string;
}

export const DIAGRAM_DEFINITIONS: DiagramDef[] = [
  {
    id: "01-auth",
    title: "D-01: User Authentication Flow",
    phase: "CORE",
    mermaid: `sequenceDiagram
    actor User
    participant Frontend
    participant Supabase Auth
    participant Database

    User->>Frontend: Click "Sign in with Google"
    Frontend->>Supabase Auth: OAuth redirect
    Supabase Auth->>User: Google consent screen
    User->>Supabase Auth: Approve
    Supabase Auth->>Frontend: JWT token + user
    Frontend->>Database: Create/update profile
    Database-->>Frontend: Profile data
    Frontend->>User: Redirect to Dashboard`,
  },
  {
    id: "01-auth-flowchart",
    title: "D-01: Auth entry flowchart",
    phase: "CORE",
    mermaid: `flowchart TD
    Entry[Auth entry] --> ChoiceEntry{Action}
    ChoiceEntry -->|Login| Login
    ChoiceEntry -->|Sign up| SignUp
    ChoiceEntry -->|Forgot password| ForgotPassword

    Login --> MethodLogin{Method}
    SignUp --> MethodSignUp{Method}
    MethodLogin --> Google
    MethodLogin --> LinkedIn
    MethodLogin --> EmailLogin[Email]
    MethodSignUp --> Google
    MethodSignUp --> LinkedIn
    MethodSignUp --> EmailSignUp[Email]

    Google --> RedirectOAuth[Redirect to provider]
    LinkedIn --> RedirectOAuth
    RedirectOAuth --> AuthCallback[Callback]
    AuthCallback --> ProfileCreate[Create or update profile]
    ProfileCreate --> DashboardOrOnboarding[Dashboard or Onboarding]

    EmailLogin --> SubmitCreds[Submit credentials]
    EmailSignUp --> SubmitCreds
    SubmitCreds --> ProfileCreate

    ForgotPassword --> EnterEmail[Enter email]
    EnterEmail --> SendResetLink[Send reset link]
    SendResetLink --> SetNewPassword[User sets new password]
    SetNewPassword --> RedirectToLogin[Redirect to Login]`,
  },
  {
    id: "02-onboarding",
    title: "D-02: Onboarding Wizard Flow",
    phase: "CORE",
    mermaid: `flowchart TD
    A[User signs up] --> B[Step 1: Company Info]
    B --> C{Has URL?}
    C -->|Yes| D[AI extracts from URL]
    C -->|No| E[Manual input]
    D --> F[Step 2: Founder Context]
    E --> F
    F --> G[AI extraction]
    G --> H[Step 3: Industry Selection]
    H --> I[Step 4: Interview Questions]
    I --> J[6 Core Questions]
    J --> K[AI generates Canvas]
    K --> L[Canvas Review]
    L --> M[Dashboard]`,
  },
  {
    id: "03-canvas",
    title: "D-03: Canvas Generation Flow",
    phase: "CORE",
    mermaid: `flowchart LR
    subgraph Input
        A[6 Questions]
        B[URL Data]
        C[Founder Context]
    end

    subgraph Processing
        D[lean-canvas-agent]
        E[Map to 9 blocks]
    end

    subgraph Output
        F[Lean Canvas v1]
        G[Validation Report]
    end

    A --> D
    B --> D
    C --> D
    D --> E
    E --> F
    E --> G`,
  },
  {
    id: "04-data",
    title: "D-04: Data Persistence Flow",
    phase: "CORE",
    mermaid: `flowchart TD
    A[User Action] --> B{Action Type}
    B -->|Read| C[Supabase Client]
    B -->|Write| D[RLS Check]
    D -->|Pass| E[Database Write]
    D -->|Fail| F[403 Forbidden]
    C --> G[Return Data]
    E --> H[Realtime Broadcast]
    H --> I[UI Update]`,
  },
  {
    id: "05-coach",
    title: "D-05: Coach Conversation Flow",
    phase: "MVP",
    mermaid: `sequenceDiagram
    actor Founder
    participant Chat UI
    participant ai-chat
    participant knowledge_chunks
    participant Database

    Founder->>Chat UI: Ask question
    Chat UI->>ai-chat: Message + context
    ai-chat->>knowledge_chunks: Vector search
    knowledge_chunks-->>ai-chat: Relevant stats
    ai-chat->>ai-chat: Generate response
    ai-chat-->>Chat UI: Answer + citation + confidence
    Chat UI->>Database: Save message
    Chat UI-->>Founder: Display response`,
  },
];
