import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { AIAssistantProvider } from "@/providers/AIAssistantProvider";
import { PlaybookProvider } from "@/providers/PlaybookProvider";
import { GlobalAIAssistant } from "@/components/ai";
import Index from "./pages/Index";
import HowItWorks from "./pages/HowItWorks";
import Features from "./pages/Features";
import Login from "./pages/Login";
import AuthCallback from "./pages/AuthCallback";
import Dashboard from "./pages/Dashboard";
import Projects from "./pages/Projects";
import ProjectDetail from "./pages/ProjectDetail";
import Tasks from "./pages/Tasks";
import CRM from "./pages/CRM";
import Documents from "./pages/Documents";
import Investors from "./pages/Investors";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import LeanCanvas from "./pages/LeanCanvas";
import UserProfile from "./pages/UserProfile";
import CompanyProfile from "./pages/CompanyProfile";
import Events from "./pages/Events";
import EventDetail from "./pages/EventDetail";
import EventWizard from "./pages/EventWizard";
import OnboardingWizard from "./pages/OnboardingWizard";
import PublicEventsDirectory from "./pages/PublicEventsDirectory";
import PublicEventDetail from "./pages/PublicEventDetail";
import BlogIndex from "./pages/BlogIndex";
import BlogPost from "./pages/BlogPost";
import PitchDeckWizard from "./pages/PitchDeckWizard";
import PitchDecksDashboard from "./pages/PitchDecksDashboard";
import PitchDeckEditor from "./pages/PitchDeckEditor";
import PitchDeckGenerating from "./pages/PitchDeckGenerating";
import AIChat from "./pages/AIChat";
import Analytics from "./pages/Analytics";
import Validator from "./pages/Validator";
import ValidateIdea from "./pages/ValidateIdea";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AIAssistantProvider>
            <PlaybookProvider>
            {/* Global AI Assistant - visible on ALL pages */}
            <GlobalAIAssistant />
            <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/how-it-works" element={<HowItWorks />} />
            <Route path="/features" element={<Features />} />
            <Route path="/blog" element={<BlogIndex />} />
            <Route path="/blog/:slug" element={<BlogPost />} />
            <Route path="/events" element={<PublicEventsDirectory />} />
            <Route path="/events/:eventId" element={<PublicEventDetail />} />
            <Route path="/login" element={<Login />} />
            <Route path="/auth/callback" element={<AuthCallback />} />
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
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
            </PlaybookProvider>
          </AIAssistantProvider>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
