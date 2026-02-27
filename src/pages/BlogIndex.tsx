import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Clock, Sparkles, BarChart3, Briefcase, ShoppingCart, Rocket, Globe } from "lucide-react";
import Header from "@/components/marketing/Header";
import Footer from "@/components/marketing/Footer";
import { Badge } from "@/components/ui/badge";
import DarkCTASection from "@/components/blog/DarkCTASection";

/* ── Types ──────────────────────────────────────────────── */

interface BlogPost {
  slug: string;
  title: string;
  subtitle: string;
  category: string;
  readTime: string;
  date: string;
  gradient: string;
  icon: React.ComponentType<{ className?: string }>;
  featured?: boolean;
}

/* ── Data ───────────────────────────────────────────────── */

const blogPosts: BlogPost[] = [
  {
    slug: "fashion-ai-2026",
    title: "The State of Fashion AI — 2026",
    subtitle: "How big is the AI opportunity in fashion? Where the money is flowing, who's building, and the five best opportunities for founders.",
    category: "Fashion & Retail",
    readTime: "12 min read",
    date: "February 2026",
    gradient: "from-purple-500/20 via-pink-500/20 to-rose-500/20",
    icon: Sparkles,
    featured: true,
  },
  {
    slug: "ai-adoption-by-industry",
    title: "AI Adoption by Industry — 2025",
    subtitle: "Which industries are actually using AI, what they use it for, and what results they're seeing.",
    category: "Industry Research",
    readTime: "15 min read",
    date: "January 2025",
    gradient: "from-blue-500/20 via-cyan-500/20 to-teal-500/20",
    icon: BarChart3,
  },
  {
    slug: "ai-jobs-future-of-work",
    title: "AI Jobs & Future of Work — 2024–2026",
    subtitle: "Which AI jobs are growing fast, which roles are at risk, and what skills companies are hiring for.",
    category: "Talent & Skills",
    readTime: "12 min read",
    date: "January 2025",
    gradient: "from-amber-500/20 via-orange-500/20 to-red-500/20",
    icon: Briefcase,
  },
  {
    slug: "ai-in-ecommerce",
    title: "AI in E-commerce",
    subtitle: "How online stores are using AI, what's actually working, and what's holding them back from doing more.",
    category: "E-commerce",
    readTime: "10 min read",
    date: "January 2025",
    gradient: "from-green-500/20 via-emerald-500/20 to-teal-500/20",
    icon: ShoppingCart,
  },
  {
    slug: "ai-startup-products",
    title: "AI Startup Products",
    subtitle: "What AI startups actually build, how they make money, and why investors fund them.",
    category: "Startups & VC",
    readTime: "14 min read",
    date: "January 2025",
    gradient: "from-violet-500/20 via-purple-500/20 to-indigo-500/20",
    icon: Rocket,
  },
  {
    slug: "ai-investment-hubs",
    title: "Leading AI Investment Hubs",
    subtitle: "Where global AI capital concentrates — and why.",
    category: "Global Markets",
    readTime: "8 min read",
    date: "January 2025",
    gradient: "from-sky-500/20 via-blue-500/20 to-indigo-500/20",
    icon: Globe,
  },
];

/* ── Helpers ─────────────────────────────────────────────── */

const featuredPost = blogPosts.find((p) => p.featured)!;
const remainingPosts = blogPosts.filter((p) => !p.featured);

/* ── Card Components ─────────────────────────────────────── */

const FeaturedCard = ({ post }: { post: BlogPost }) => {
  const Icon = post.icon;
  return (
    <Link
      to={`/blog/${post.slug}`}
      className="group block bg-card rounded-2xl border border-border hover:border-primary/30 hover:shadow-xl transition-all duration-300 overflow-hidden"
    >
      {/* Gradient thumbnail — vertical, full-width */}
      <div className={`bg-gradient-to-br ${post.gradient} flex items-center justify-center aspect-video`}>
        <Icon className="w-16 h-16 text-foreground/40 group-hover:scale-110 transition-transform duration-300" />
      </div>
      {/* Content */}
      <div className="p-8 md:p-10">
        <div className="flex items-center gap-3 mb-4">
          <Badge variant="outline" className="text-xs">
            {post.category}
          </Badge>
          <span className="text-xs text-muted-foreground flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {post.readTime}
          </span>
        </div>
        <h2 className="font-display text-2xl md:text-3xl font-medium text-foreground mb-3 group-hover:text-primary transition-colors">
          {post.title}
        </h2>
        <p className="text-muted-foreground leading-relaxed mb-6 max-w-3xl">
          {post.subtitle}
        </p>
        <div className="flex items-center gap-2 text-sm font-medium text-primary">
          Read report
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </Link>
  );
};

const StoryCard = ({ post }: { post: BlogPost }) => {
  const Icon = post.icon;
  return (
    <Link
      to={`/blog/${post.slug}`}
      className="group block bg-card rounded-xl border border-border hover:border-primary/30 hover:shadow-lg transition-all duration-300 overflow-hidden h-full"
    >
      {/* Gradient thumbnail */}
      <div className={`bg-gradient-to-br ${post.gradient} flex items-center justify-center h-48`}>
        <Icon className="w-12 h-12 text-foreground/40 group-hover:scale-110 transition-transform duration-300" />
      </div>
      {/* Content */}
      <div className="p-6">
        <div className="flex items-center gap-3 mb-3">
          <Badge variant="outline" className="text-xs">
            {post.category}
          </Badge>
          <span className="text-xs text-muted-foreground flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {post.readTime}
          </span>
        </div>
        <h3 className="font-display text-lg font-medium text-foreground mb-2 group-hover:text-primary transition-colors">
          {post.title}
        </h3>
        <p className="text-sm text-muted-foreground leading-relaxed mb-4 line-clamp-2">
          {post.subtitle}
        </p>
        <div className="flex items-center gap-2 text-sm font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity">
          Read report
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </Link>
  );
};

/* ── Page ─────────────────────────────────────────────────── */

const BlogIndex = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main>
        {/* Section A: Editorial Hero */}
        <section className="py-16 md:py-24 lg:py-32 bg-background">
          <div className="container-premium">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-3xl mx-auto text-center"
            >
              <Badge variant="secondary" className="bg-sage-light text-sage-foreground border-0 mb-6">
                Research Reports
              </Badge>
              <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-medium tracking-tight text-foreground mb-6">
                AI Intelligence Reports
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed">
                Clear, data-backed reports on how AI is changing industries.
                Written for founders, executives, and investors who want facts, not hype.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Section B: Featured Story */}
        <section className="pb-12 bg-background">
          <div className="container-premium">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <FeaturedCard post={featuredPost} />
            </motion.div>
          </div>
        </section>

        {/* Section C: All Reports Grid */}
        <section className="py-12 bg-background">
          <div className="container-premium">
            <motion.h2
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="font-display text-2xl font-medium text-foreground mb-8"
            >
              More Reports
            </motion.h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {remainingPosts.map((post, index) => (
                <motion.div
                  key={post.slug}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <StoryCard post={post} />
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Section D: CTA Strip */}
        <section className="py-12 pb-24 bg-background">
          <div className="container-premium">
            <DarkCTASection
              title="Ready to validate your startup idea?"
              subtitle="Use AI to test your business concept before you invest months building it."
              primaryButton={{
                label: "Start validating",
                href: "/validate",
              }}
              secondaryButton={{
                label: "See how it works",
                href: "/",
              }}
            />
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default BlogIndex;
