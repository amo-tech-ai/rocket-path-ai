/**
 * EmbedReport — Minimal iframe-embeddable version of SharedReport.
 * No Header, Footer, or CTA. Just the report content + "Powered by StartupAI" bar.
 * Delegates all report rendering to ReportV2Layout.
 */
import { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertTriangle, Lock, Clock } from 'lucide-react';
import { ReportV2Layout } from '@/components/validator/report/ReportV2Layout';
import { fetchReportByToken, type ShareError } from '@/hooks/useShareableLinks';
import type { ReportDetailsV2 } from '@/types/validation-report';

interface ReportData {
  score: number;
  summary: string;
  details: ReportDetailsV2;
  created_at: string;
}

type ErrorType = 'expired' | 'revoked' | 'invalid' | 'unknown';

export default function EmbedReport() {
  const { token } = useParams<{ token: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const [report, setReport] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorType, setErrorType] = useState<ErrorType | null>(null);

  useEffect(() => {
    if (!token) {
      setErrorType('invalid');
      setLoading(false);
      return;
    }

    async function load() {
      const { data, error: fetchError } = await fetchReportByToken(token!);
      if (fetchError) {
        if (fetchError && typeof fetchError === 'object' && 'code' in fetchError) {
          const typedError = fetchError as ShareError;
          setErrorType(typedError.code === 'not_found' ? 'unknown' : typedError.code);
        } else {
          setErrorType('unknown');
        }
        setLoading(false);
        return;
      }

      // FIX: Gemini occasionally wraps JSON in an array [{}] — unwrap to object
      const rawDetails = data.details;
      const safeDetails = (Array.isArray(rawDetails) ? rawDetails[0] : rawDetails) || {};
      setReport({
        score: data.score || 0,
        summary: data.summary || safeDetails.summary_verdict || '',
        details: safeDetails,
        created_at: data.created_at,
      });
      setLoading(false);
    }

    load();
  }, [token]);

  // Section state via query param: /embed/report/:token?tab=overview
  const activeSection = searchParams.get('tab') || 'overview';
  const handleSectionChange = (section: string) => {
    setSearchParams({ tab: section }, { replace: true });
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4 p-6">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-48 w-full max-w-4xl rounded-xl" />
        <Skeleton className="h-32 w-full max-w-4xl rounded-xl" />
      </div>
    );
  }

  // Error states
  if (errorType || !report) {
    const errorConfig: Record<ErrorType, { icon: React.ReactNode; title: string }> = {
      expired: { icon: <Clock className="w-12 h-12 text-amber-500" />, title: 'Link Expired' },
      revoked: { icon: <Lock className="w-12 h-12 text-destructive" />, title: 'Link Revoked' },
      invalid: { icon: <AlertTriangle className="w-12 h-12 text-muted-foreground" />, title: 'Invalid Link' },
      unknown: { icon: <AlertTriangle className="w-12 h-12 text-destructive" />, title: 'Report Not Found' },
    };
    const err = errorConfig[errorType || 'unknown'];

    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4 p-6">
        {err.icon}
        <h1 className="text-lg font-semibold text-foreground">{err.title}</h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <ReportV2Layout
        report={report}
        activeSection={activeSection}
        onSectionChange={handleSectionChange}
      />

      {/* Powered-by bar */}
      <div className="text-center py-4 border-t border-border">
        <a
          href="https://startupai.app"
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-muted-foreground hover:text-primary transition-colors"
        >
          Powered by StartupAI
        </a>
      </div>
    </div>
  );
}
