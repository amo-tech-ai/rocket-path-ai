import { Link, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  FolderKanban, 
  CheckSquare, 
  Users, 
  FileText, 
  TrendingUp,
  Settings,
  Menu,
  X,
  LayoutGrid,
  User,
  Building2,
  CalendarDays,
  Sparkles,
  Presentation,
  MessageSquare,
  BarChart3,
  Layers
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { MobileAISheet } from "@/components/mobile/MobileAISheet";
import { MobileBottomNav } from "@/components/mobile/MobileBottomNav";

const navItems = [
  { label: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
  { label: "Onboarding", path: "/onboarding", icon: Sparkles },
  { label: "Pitch Decks", path: "/app/pitch-decks", icon: Presentation },
  { label: "Projects", path: "/projects", icon: FolderKanban },
  { label: "Tasks", path: "/tasks", icon: CheckSquare },
  { label: "Events", path: "/app/events", icon: CalendarDays },
  { label: "CRM", path: "/crm", icon: Users },
  { label: "Documents", path: "/documents", icon: FileText },
  { label: "Lean Canvas", path: "/lean-canvas", icon: LayoutGrid },
  { label: "Investors", path: "/investors", icon: TrendingUp },
  { label: "Prompt Packs", path: "/prompt-packs", icon: Layers },
  { label: "AI Chat", path: "/ai-chat", icon: MessageSquare },
  { label: "Analytics", path: "/analytics", icon: BarChart3 },
];

const profileItems = [
  { label: "User Profile", path: "/user-profile", icon: User },
  { label: "Company Profile", path: "/company-profile", icon: Building2 },
];

interface DashboardLayoutProps {
  children: React.ReactNode;
  aiPanel?: React.ReactNode;
  hideBottomNav?: boolean;
}

const DashboardLayout = ({ children, aiPanel, hideBottomNav = false }: DashboardLayoutProps) => {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background flex">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-foreground/20 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Left Sidebar - Context Panel */}
      <aside 
        className={cn(
          "fixed lg:static inset-y-0 left-0 z-50 w-64 bg-sidebar border-r border-sidebar-border flex flex-col transform transition-transform duration-300 lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-sidebar-border">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-sidebar-primary flex items-center justify-center">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-sidebar-primary-foreground"
              >
                <path d="M12 2L2 7l10 5 10-5-10-5z" />
                <path d="M2 17l10 5 10-5" />
                <path d="M2 12l10 5 10-5" />
              </svg>
            </div>
            <span className="font-semibold text-sidebar-foreground">StartupAI</span>
          </Link>
          <Button 
            variant="ghost" 
            size="icon" 
            className="lg:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {/* Main nav items */}
          {navItems.map((item) => {
            const isActive = location.pathname === item.path || location.pathname.startsWith(item.path + '/');
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors touch-manipulation",
                  isActive 
                    ? "bg-sidebar-accent text-sidebar-accent-foreground" 
                    : "text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/50"
                )}
              >
                <item.icon className="w-5 h-5 flex-shrink-0" />
                <span className="truncate">{item.label}</span>
              </Link>
            );
          })}
          
          {/* Divider */}
          <div className="h-px bg-sidebar-border my-4" />
          
          {/* Profile items */}
          {profileItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors touch-manipulation",
                  isActive 
                    ? "bg-sidebar-accent text-sidebar-accent-foreground" 
                    : "text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/50"
                )}
              >
                <item.icon className="w-5 h-5 flex-shrink-0" />
                <span className="truncate">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Progress indicator */}
        <div className="p-4 border-t border-sidebar-border">
          <div className="p-3 rounded-xl bg-sidebar-accent/50">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-sidebar-foreground/70">Strategy Progress</span>
              <span className="text-xs font-semibold text-sage">68%</span>
            </div>
            <div className="h-1.5 bg-sidebar-border rounded-full overflow-hidden">
              <div className="h-full w-[68%] bg-sage rounded-full" />
            </div>
          </div>
        </div>

        {/* Settings */}
        <div className="p-4 border-t border-sidebar-border">
          <Link
            to="/settings"
            onClick={() => setSidebarOpen(false)}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/50 transition-colors touch-manipulation"
          >
            <Settings className="w-5 h-5" />
            Settings
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar for mobile */}
        <header className="h-14 sm:h-16 border-b border-border flex items-center justify-between px-4 lg:hidden sticky top-0 bg-background/95 backdrop-blur-lg z-30">
          <Button 
            variant="ghost" 
            size="icon"
            className="touch-manipulation"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="w-5 h-5" />
          </Button>
          <Link to="/dashboard" className="font-semibold">StartupAI</Link>
          <div className="w-10" /> {/* Spacer */}
        </header>

        <div className="flex-1 flex overflow-hidden">
          {/* Center Panel - Work Area */}
          <main className={cn(
            "flex-1 overflow-y-auto",
            "px-4 py-4 sm:p-6 lg:p-8", // Responsive padding
            !hideBottomNav && "pb-24 lg:pb-8" // Extra bottom padding for mobile nav
          )}>
            {children}
          </main>

          {/* Right Panel - AI Intelligence (Desktop only) */}
          {aiPanel && (
            <aside className="hidden xl:block w-80 ai-panel overflow-y-auto p-6">
              {aiPanel}
            </aside>
          )}
        </div>
      </div>

      {/* Mobile AI Sheet (shows on mobile/tablet when aiPanel exists) */}
      {aiPanel && (
        <MobileAISheet title="AI Assistant">
          {aiPanel}
        </MobileAISheet>
      )}

      {/* Mobile Bottom Navigation */}
      {!hideBottomNav && (
        <MobileBottomNav onMenuClick={() => setSidebarOpen(true)} />
      )}
    </div>
  );
};

export default DashboardLayout;
