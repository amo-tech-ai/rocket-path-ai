import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Calendar, Clock } from "lucide-react";
import Header from "@/components/marketing/Header";
import Footer from "@/components/marketing/Footer";
import { Badge } from "@/components/ui/badge";

interface BlogPost {
  slug: string;
  title: string;
  subtitle: string;
  category: string;
  readTime: string;
  date: string;
  kpis: { value: string; label: string }[];
}

const blogPosts: BlogPost[] = [
  {
    slug: "ai-adoption-by-industry",
    title: "AI Adoption by Industry — 2025",
    subtitle: "Where AI is working, what it's used for, and what outcomes are measurable.",
    category: "Industry Research",
    readTime: "15 min read",
    date: "January 2025",
    kpis: [
      { value: "88%", label: "Tech & SaaS adoption" },
      { value: "€190M", label: "Manufacturing savings" },
      { value: "+15%", label: "Retail revenue lift" }
    ]
  },
  {
    slug: "ai-jobs-future-of-work",
    title: "AI Jobs & Future of Work — 2024–2026",
    subtitle: "What's growing, what's emerging, what's at risk — and where the data is strongest.",
    category: "Talent & Skills",
    readTime: "12 min read",
    date: "January 2025",
    kpis: [
      { value: "1.3M", label: "New AI jobs" },
      { value: "+78M", label: "Net jobs by 2030" },
      { value: "+70%", label: "AI skill demand YoY" }
    ]
  },
  {
    slug: "ai-in-ecommerce",
    title: "AI in E-commerce",
    subtitle: "How retailers are deploying AI, what's working, and what still blocks scale.",
    category: "E-commerce",
    readTime: "10 min read",
    date: "January 2025",
    kpis: [
      { value: "$51B+", label: "Market by 2033" },
      { value: "1,200%", label: "GenAI traffic growth" },
      { value: "+16%", label: "AI shopper conversion" }
    ]
  },
  {
    slug: "ai-startup-products",
    title: "AI Startup Products",
    subtitle: "What AI startups actually build, how they create value, and why investors fund them.",
    category: "Startups & VC",
    readTime: "14 min read",
    date: "January 2025",
    kpis: [
      { value: "3", label: "Product types funded" },
      { value: "Vertical", label: "Focus beats generic" },
      { value: "ROI", label: "Drives acceleration" }
    ]
  },
  {
    slug: "ai-investment-hubs",
    title: "Leading AI Investment Hubs",
    subtitle: "Where global AI capital concentrates — and why.",
    category: "Global Markets",
    readTime: "8 min read",
    date: "January 2025",
    kpis: [
      { value: "~70%", label: "VC in North America" },
      { value: "Top 10", label: "Hubs = 85-90% funding" },
      { value: "$30B+", label: "SF Bay Area alone" }
    ]
  }
];

const BlogIndex = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main>
        {/* Hero */}
        <section className="py-16 md:py-24 lg:py-32 bg-background">
          <div className="container-premium">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-3xl"
            >
              <Badge variant="secondary" className="bg-sage-light text-sage-foreground border-0 mb-6">
                Research Reports
              </Badge>
              <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-medium tracking-tight text-foreground mb-6">
                AI Intelligence Reports
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed">
                Research-grade insights on AI adoption, impact, and opportunity. 
                Data-first analysis for executives, founders, and investors.
              </p>
            </motion.div>
          </div>
        </section>
        
        {/* Blog Grid */}
        <section className="py-16 bg-muted/30">
          <div className="container-premium">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {blogPosts.map((post, index) => (
                <motion.article
                  key={post.slug}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Link 
                    to={`/blog/${post.slug}`}
                    className="group block bg-card rounded-xl border border-border hover:border-primary/30 hover:shadow-premium-md transition-all duration-300 h-full"
                  >
                    <div className="p-6">
                      {/* Category & Meta */}
                      <div className="flex items-center gap-3 mb-4">
                        <Badge variant="outline" className="text-xs">
                          {post.category}
                        </Badge>
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {post.readTime}
                        </span>
                      </div>
                      
                      {/* Title */}
                      <h2 className="font-display text-xl font-medium text-foreground mb-2 group-hover:text-primary transition-colors">
                        {post.title}
                      </h2>
                      
                      {/* Subtitle */}
                      <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                        {post.subtitle}
                      </p>
                      
                      {/* KPI Preview */}
                      <div className="grid grid-cols-3 gap-3 pt-4 border-t border-border">
                        {post.kpis.map((kpi, i) => (
                          <div key={i} className="text-center">
                            <p className="font-display font-semibold text-primary text-lg">
                              {kpi.value}
                            </p>
                            <p className="text-[10px] text-muted-foreground uppercase tracking-wider">
                              {kpi.label}
                            </p>
                          </div>
                        ))}
                      </div>
                      
                      {/* Read More */}
                      <div className="flex items-center gap-2 mt-6 text-sm font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                        Read report
                        <ArrowRight className="w-4 h-4" />
                      </div>
                    </div>
                  </Link>
                </motion.article>
              ))}
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default BlogIndex;
