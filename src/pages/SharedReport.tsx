/**
 * SharedReport — Public page for viewing a validation report via share token.
 * No authentication required. Uses marketing Header/Footer layout.
 * Delegates all report rendering to ReportV2Layout (same as authenticated view).
 */
import { useState, useEffect } from 'react';
import { useParams, Link, useSearchParams } from 'react-router-dom';
import Header from '@/components/marketing/Header';
import Footer from '@/components/marketing/Footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Shield, AlertTriangle, Lock, Clock, Rocket } from 'lucide-react';
import { ReportV2Layout } from '@/components/validator/report/ReportV2Layout';
import { fetchReportByToken, type ShareError } from '@/hooks/useShareableLinks';
import type { ReportDetailsV2 } from '@/types/validation-report';

interface ReportData {
  score: number;
  summary: string;
  verified: boolean;
  details: ReportDetailsV2;
  created_at: string;
}

type ErrorType = 'expired' | 'revoked' | 'invalid' | 'unknown';

export default function SharedReport() {
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
        verified: data.verified || false,
        details: safeDetails,
        created_at: data.created_at,
      });
      setLoading(false);
    }

    load();
  }, [token]);

  // Section state via query param: /share/report/:token?tab=overview
  const activeSection = searchParams.get('tab') || 'overview';
  const handleSectionChange = (section: string) => {
    setSearchParams({ tab: section }, { replace: true });
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-24 pb-16">
          <div className="max-w-4xl mx-auto px-6 space-y-6">
            <Skeleton className="h-10 w-64" />
            <Skeleton className="h-48 w-full rounded-xl" />
            <div className="grid grid-cols-3 gap-4">
              <Skeleton className="h-32 rounded-xl" />
              <Skeleton className="h-32 rounded-xl" />
              <Skeleton className="h-32 rounded-xl" />
            </div>
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-40 rounded-xl" />
            ))}
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Error states
  if (errorType || !report) {
    const errorMessages: Record<ErrorType, { icon: React.ReactNode; title: string; desc: string }> = {
      expired: {
        icon: <Clock className="w-16 h-16 text-amber-500" />,
        title: 'Link Expired',
        desc: 'This share link has expired. Ask the report owner to generate a new one.',
      },
      revoked: {
        icon: <Lock className="w-16 h-16 text-destructive" />,
        title: 'Link Revoked',
        desc: 'This share link has been revoked by the report owner.',
      },
      invalid: {
        icon: <AlertTriangle className="w-16 h-16 text-muted-foreground" />,
        title: 'Invalid Link',
        desc: 'This share link is not valid. Please check the URL and try again.',
      },
      unknown: {
        icon: <AlertTriangle className="w-16 h-16 text-destructive" />,
        title: 'Report Not Found',
        desc: 'We could not load this report. The link may be invalid or the report may no longer exist.',
      },
    };
    const err = errorMessages[errorType || 'unknown'];

    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-24 pb-16">
          <div className="max-w-lg mx-auto px-6 text-center space-y-6 min-h-[50vh] flex flex-col items-center justify-center">
            {err.icon}
            <h1 className="text-2xl font-semibold text-foreground">{err.title}</h1>
            <p className="text-muted-foreground">{err.desc}</p>
            <Link to="/">
              <Button>
                <Rocket className="w-4 h-4 mr-2" />
                Try StartupAI
              </Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24 pb-16">
        {/* Verification badge */}
        {report.verified && (
          <div className="max-w-[1000px] mx-auto px-4 lg:px-8 mb-4">
            <Badge className="bg-emerald-500/10 text-emerald-500">
              <Shield className="w-3 h-3 mr-1" />
              AI Verified Report
            </Badge>
          </div>
        )}

        <ReportV2Layout
          report={report}
          activeSection={activeSection}
          onSectionChange={handleSectionChange}
        />

        {/* CTA */}
        <div className="max-w-[1000px] mx-auto px-4 lg:px-8 text-center py-12 space-y-4">
          <h2 className="text-xl font-semibold text-foreground">
            Want to validate your startup idea?
          </h2>
          <p className="text-muted-foreground">
            Get an AI-powered validation report with market sizing, competitive analysis, and financial projections.
          </p>
          <Link to="/login">
            <Button size="lg">
              <Rocket className="w-4 h-4 mr-2" />
              Try StartupAI Free
            </Button>
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}
