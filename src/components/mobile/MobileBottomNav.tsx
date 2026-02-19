/**
 * Mobile Bottom Navigation
 * Fixed bottom navigation bar for quick access on mobile
 */

import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  CheckSquare,
  Users,
  FolderKanban,
  Menu
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface NavItem {
  label: string;
  path: string;
  icon: React.ElementType;
}

const navItems: NavItem[] = [
  { label: 'Home', path: '/dashboard', icon: LayoutDashboard },
  { label: 'Tasks', path: '/tasks', icon: CheckSquare },
  { label: 'Projects', path: '/projects', icon: FolderKanban },
  { label: 'CRM', path: '/crm', icon: Users },
];

interface MobileBottomNavProps {
  onMenuClick?: () => void;
  className?: string;
}

export function MobileBottomNav({ onMenuClick, className }: MobileBottomNavProps) {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  return (
    <nav 
      className={cn(
        "fixed bottom-0 left-0 right-0 z-30 bg-background/95 backdrop-blur-lg border-t border-border",
        "pb-safe lg:hidden", // Hide on desktop
        className
      )}
    >
      <div className="flex items-center justify-around h-16 px-2">
        {navItems.map((item) => {
          const active = isActive(item.path);
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex flex-col items-center justify-center gap-1 flex-1 py-2 px-1 rounded-xl transition-colors min-w-0",
                "active:scale-95 touch-manipulation",
                active 
                  ? "text-primary" 
                  : "text-muted-foreground"
              )}
            >
              <item.icon className={cn(
                "w-5 h-5 transition-transform",
                active && "scale-110"
              )} />
              <span className={cn(
                "text-[10px] font-medium truncate",
                active && "font-semibold"
              )}>
                {item.label}
              </span>
            </Link>
          );
        })}
        
        {/* More menu button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={onMenuClick}
          className="flex flex-col items-center justify-center gap-1 flex-1 h-auto py-2 px-1"
        >
          <Menu className="w-5 h-5" />
          <span className="text-[10px] font-medium">More</span>
        </Button>
      </div>
    </nav>
  );
}

export default MobileBottomNav;
