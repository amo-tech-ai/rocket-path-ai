import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { AIAssistantProvider } from "@/providers/AIAssistantProvider";
import { PlaybookProvider } from "@/providers/PlaybookProvider";
import { GlobalAIAssistant } from "@/components/ai";
import { ErrorBoundary } from "@/components/ErrorBoundary";

// ── Lazy-loaded pages — each becomes its own chunk ──────────
const Index = lazy(() => import("./pages/Index"));
const HowItWorks = lazy(() => import("./pages/HowItWorks"));
const Features = lazy(() => import("./pages/Features"));
const Login = lazy(() => import("./pages/Login"));
const AuthCallback = lazy(() => import("./pages/AuthCallback"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Projects = lazy(() => import("./pages/Projects"));
const ProjectDetail = lazy(() => import("./pages/ProjectDetail"));
const Tasks = lazy(() => import("./pages/Tasks"));
const CRM = lazy(() => import("./pages/CRM"));
const Documents = lazy(() => import("./pages/Documents"));
const Investors = lazy(() => import("./pages/Investors"));
const Settings = lazy(() => import("./pages/Settings"));
const NotFound = lazy(() => import("./pages/NotFound"));
const LeanCanvas = lazy(() => import("./pages/LeanCanvas"));
const UserProfile = lazy(() => import("./pages/UserProfile"));
const CompanyProfile = lazy(() => import("./pages/CompanyProfile"));
const Events = lazy(() => import("./pages/Events"));
const EventDetail = lazy(() => import("./pages/EventDetail"));
const EventWizard = lazy(() => import("./pages/EventWizard"));
const OnboardingWizard = lazy(() => import("./pages/OnboardingWizard"));
const OnboardingComplete = lazy(() => import("./pages/OnboardingComplete"));
const PublicEventsDirectory = lazy(() => import("./pages/PublicEventsDirectory"));
const PublicEventDetail = lazy(() => import("./pages/PublicEventDetail"));
const BlogIndex = lazy(() => import("./pages/BlogIndex"));
const BlogPost = lazy(() => import("./pages/BlogPost"));
const PitchDeckWizard = lazy(() => import("./pages/PitchDeckWizard"));
const PitchDecksDashboard = lazy(() => import("./pages/PitchDecksDashboard"));
const PitchDeckEditor = lazy(() => import("./pages/PitchDeckEditor"));
const PitchDeckGenerating = lazy(() => import("./pages/PitchDeckGenerating"));
const AIChat = lazy(() => import("./pages/AIChat"));
const Analytics = lazy(() => import("./pages/Analytics"));
const Validator = lazy(() => import("./pages/Validator"));
const ValidateIdea = lazy(() => import("./pages/ValidateIdea"));
const ValidatorProgress = lazy(() => import("./pages/ValidatorProgress"));
const ValidatorReport = lazy(() => import("./pages/ValidatorReport"));
const SharedReport = lazy(() => import("./pages/SharedReport"));
const EmbedReport = lazy(() => import("./pages/EmbedReport"));
const WeeklyReview = lazy(() => import("./pages/WeeklyReview"));
const FashionInfographic = lazy(() => import("./pages/infographic/FashionInfographic"));

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <ErrorBoundary>
        <BrowserRouter>
          <AIAssistantProvider>
            <PlaybookProvider>
            {/* Global AI Assistant — public pages only (authenticated pages use persistent panel in DashboardLayout) */}
            <GlobalAIAssistant />
            <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" /></div>}>
            <Routes>
            {/* ── Public / Marketing ─────────────────────────── */}
            <Route path="/" element={<Index />} />
            <Route path="/how-it-works" element={<HowItWorks />} />
            <Route path="/features" element={<Features />} />
            <Route path="/blog" element={<BlogIndex />} />
            <Route path="/blog/:slug" element={<BlogPost />} />
            <Route path="/events" element={<PublicEventsDirectory />} />
            <Route path="/events/:eventId" element={<PublicEventDetail />} />
            <Route path="/share/report/:token" element={<SharedReport />} />
            <Route path="/embed/report/:token" element={<EmbedReport />} />
            <Route path="/fashion-infographic" element={<FashionInfographic />} />

            {/* ── Auth ───────────────────────────────────────── */}
            <Route path="/login" element={<Login />} />
            <Route path="/auth/callback" element={<AuthCallback />} />

            {/* ── Core app ───────────────────────────────────── */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/projects"
              element={
                <ProtectedRoute>
                  <Projects />
                </ProtectedRoute>
              }
            />
            <Route
              path="/projects/:projectId"
              element={
                <ProtectedRoute>
                  <ProjectDetail />
                </ProtectedRoute>
              }
            />
            <Route
              path="/tasks"
              element={
                <ProtectedRoute>
                  <Tasks />
                </ProtectedRoute>
              }
            />
            <Route
              path="/crm"
              element={
                <ProtectedRoute>
                  <CRM />
                </ProtectedRoute>
              }
            />
            <Route
              path="/documents"
              element={
                <ProtectedRoute>
                  <Documents />
                </ProtectedRoute>
              }
            />
            <Route
              path="/investors"
              element={
                <ProtectedRoute>
                  <Investors />
                </ProtectedRoute>
              }
            />
            <Route
              path="/settings"
              element={
                <ProtectedRoute>
                  <Settings />
                </ProtectedRoute>
              }
            />
            <Route
              path="/lean-canvas"
              element={
                <ProtectedRoute>
                  <LeanCanvas />
                </ProtectedRoute>
              }
            />
            <Route
              path="/user-profile"
              element={
                <ProtectedRoute>
                  <UserProfile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/company-profile"
              element={
                <ProtectedRoute>
                  <CompanyProfile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/app/events"
              element={
                <ProtectedRoute>
                  <Events />
                </ProtectedRoute>
              }
            />
            <Route
              path="/app/events/:id"
              element={
                <ProtectedRoute>
                  <EventDetail />
                </ProtectedRoute>
              }
            />
            <Route
              path="/app/events/new"
              element={
                <ProtectedRoute>
                  <EventWizard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/onboarding"
              element={
                <ProtectedRoute>
                  <OnboardingWizard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/onboarding/complete"
              element={
                <ProtectedRoute>
                  <OnboardingComplete />
                </ProtectedRoute>
              }
            />
            <Route
              path="/app/pitch-decks"
              element={
                <ProtectedRoute>
                  <PitchDecksDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/app/pitch-deck/new"
              element={
                <ProtectedRoute>
                  <PitchDeckWizard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/app/pitch-deck/:deckId"
              element={
                <ProtectedRoute>
                  <PitchDeckWizard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/app/pitch-deck/:deckId/edit"
              element={
                <ProtectedRoute>
                  <PitchDeckEditor />
                </ProtectedRoute>
              }
            />
            <Route
              path="/app/pitch-deck/:deckId/generating"
              element={
                <ProtectedRoute>
                  <PitchDeckGenerating />
                </ProtectedRoute>
              }
            />
            <Route
              path="/ai-chat"
              element={
                <ProtectedRoute>
                  <AIChat />
                </ProtectedRoute>
              }
            />
            <Route
              path="/analytics"
              element={
                <ProtectedRoute>
                  <Analytics />
                </ProtectedRoute>
              }
            />
            <Route
              path="/validator"
              element={
                <ProtectedRoute>
                  <Validator />
                </ProtectedRoute>
              }
            />
            <Route
              path="/validate"
              element={
                <ProtectedRoute>
                  <ValidateIdea />
                </ProtectedRoute>
              }
            />
            <Route
              path="/validator/run/:sessionId"
              element={
                <ProtectedRoute>
                  <ValidatorProgress />
                </ProtectedRoute>
              }
            />
            <Route
              path="/validator/report/:reportId/:section?"
              element={
                <ProtectedRoute>
                  <ValidatorReport />
                </ProtectedRoute>
              }
            />
            <Route
              path="/weekly-review"
              element={
                <ProtectedRoute>
                  <WeeklyReview />
                </ProtectedRoute>
              }
            />

            {/* ── Redirects for removed pages ────────────────── */}
            <Route path="/assumption-board" element={<Navigate to="/dashboard" replace />} />
            <Route path="/decision-log" element={<Navigate to="/dashboard" replace />} />
            <Route path="/sprint-plan" element={<Navigate to="/tasks" replace />} />
            <Route path="/diagrams" element={<Navigate to="/dashboard" replace />} />

            {/* ── Catch-all ──────────────────────────────────── */}
            <Route path="*" element={<NotFound />} />
          </Routes>
            </Suspense>
            </PlaybookProvider>
          </AIAssistantProvider>
        </BrowserRouter>
        </ErrorBoundary>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
