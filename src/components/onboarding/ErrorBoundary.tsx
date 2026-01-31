/**
 * Error Boundary for Onboarding Wizard
 * Catches React errors and displays user-friendly error UI
 */

import { Component, ReactNode } from 'react';
import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class OnboardingErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  private hasCaughtError = false; // Guard to prevent re-triggering

  static getDerivedStateFromError(error: Error): State {
    // Only set error state if we haven't already caught an error
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Guard: prevent multiple error catches from causing loops
    if (this.hasCaughtError) {
      return;
    }
    this.hasCaughtError = true;

    // Log error (always log error boundary catches)
    if (import.meta.env.DEV) {
      console.error('[OnboardingErrorBoundary]', error, errorInfo);
    }
    
    // Call optional error handler (only once)
    this.props.onError?.(error, errorInfo);
  }

  handleReset = () => {
    // Reset error state and flag
    this.hasCaughtError = false;
    this.setState({ hasError: false, error: null });
    // Reload the page to reset state
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-background">
          <Card className="w-full max-w-md">
            <CardHeader>
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-destructive" />
                <CardTitle>Something went wrong</CardTitle>
              </div>
              <CardDescription>
                An error occurred while loading the onboarding wizard.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {import.meta.env.DEV && this.state.error && (
                <div className="p-3 bg-muted rounded-md">
                  <p className="text-sm font-mono text-destructive">
                    {this.state.error.message}
                  </p>
                </div>
              )}
              <div className="flex gap-2">
                <Button onClick={this.handleReset} variant="default">
                  Reload Page
                </Button>
                <Button
                  onClick={() => (window.location.href = '/dashboard')}
                  variant="outline"
                >
                  Go to Dashboard
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}
