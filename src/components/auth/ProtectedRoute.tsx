import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Loader2 } from 'lucide-react';
import { DEV_BYPASS_AUTH } from '@/lib/devConfig';
import { setReturnPathOnce } from '@/lib/authReturnPath';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
  requireModerator?: boolean;
}

export function ProtectedRoute({
  children,
  requireAdmin = false,
  requireModerator = false
}: ProtectedRouteProps) {
  const { user, loading, isAdmin, isModerator } = useAuth();
  const location = useLocation();

  // Development bypass - remove or set to false for production
  if (DEV_BYPASS_AUTH) {
    return <>{children}</>;
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    const returnPath = location.pathname + location.search;
    setReturnPathOnce(returnPath);
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requireAdmin && !isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  if (requireModerator && !isModerator) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}
