import { useParams, Navigate } from "react-router-dom";
import { lazy, Suspense } from "react";
import Header from "@/components/marketing/Header";
import Footer from "@/components/marketing/Footer";
import { ErrorBoundary } from "@/components/ErrorBoundary";

// Import all report components
import AiAdoptionReport from "@/components/blog/reports/AiAdoptionReport";
import AiJobsReport from "@/components/blog/reports/AiJobsReport";
import AiEcommerceReport from "@/components/blog/reports/AiEcommerceReport";
import AiStartupProductsReport from "@/components/blog/reports/AiStartupProductsReport";
import AiInvestmentHubsReport from "@/components/blog/reports/AiInvestmentHubsReport";

// Lazy-load FashionAiReport (large component — 1600+ lines)
const FashionAiReport = lazy(() => import("@/components/blog/reports/FashionAiReport"));

const reportComponents: Record<string, React.ComponentType> = {
  "ai-adoption-by-industry": AiAdoptionReport,
  "ai-jobs-future-of-work": AiJobsReport,
  "ai-in-ecommerce": AiEcommerceReport,
  "ai-startup-products": AiStartupProductsReport,
  "ai-investment-hubs": AiInvestmentHubsReport,
  "fashion-ai-2026": FashionAiReport,
};

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();

  if (!slug || !reportComponents[slug]) {
    return <Navigate to="/blog" replace />;
  }

  const ReportComponent = reportComponents[slug];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <ErrorBoundary>
          <Suspense fallback={
            <div className="flex items-center justify-center min-h-[60vh]">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
            </div>
          }>
            <ReportComponent />
          </Suspense>
        </ErrorBoundary>
      </main>
      <Footer />
    </div>
  );
};

export default BlogPost;
