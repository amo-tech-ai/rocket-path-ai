import { useParams, Navigate } from "react-router-dom";
import Header from "@/components/marketing/Header";
import Footer from "@/components/marketing/Footer";

// Import all report components
import AiAdoptionReport from "@/components/blog/reports/AiAdoptionReport";
import AiJobsReport from "@/components/blog/reports/AiJobsReport";
import AiEcommerceReport from "@/components/blog/reports/AiEcommerceReport";
import AiStartupProductsReport from "@/components/blog/reports/AiStartupProductsReport";
import AiInvestmentHubsReport from "@/components/blog/reports/AiInvestmentHubsReport";

const reportComponents: Record<string, React.ComponentType> = {
  "ai-adoption-by-industry": AiAdoptionReport,
  "ai-jobs-future-of-work": AiJobsReport,
  "ai-in-ecommerce": AiEcommerceReport,
  "ai-startup-products": AiStartupProductsReport,
  "ai-investment-hubs": AiInvestmentHubsReport,
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
        <ReportComponent />
      </main>
      <Footer />
    </div>
  );
};

export default BlogPost;
