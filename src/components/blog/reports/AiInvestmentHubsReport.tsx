import { 
  ReportHero, 
  ReportSection, 
  SectionTitle, 
  DataTable,
  StatGrid,
  FeatureCard,
  HubProfileCard,
  PullQuote,
  SourcesSection 
} from "@/components/blog";
import { 
  Users, 
  GraduationCap, 
  Server, 
  Banknote
} from "lucide-react";

const AiInvestmentHubsReport = () => {
  return (
    <article>
      {/* Hero Section */}
      <ReportHero
        title="Global AI Investment Is Highly Concentrated"
        subtitle="A small number of cities capture the majority of global AI venture capital due to talent, research, and compute infrastructure."
        chips={["Top 10 hubs", "Regional breakdown", "2025–2026"]}
        kpis={[
          { value: "~70%", label: "Global AI VC flows into North America", type: "measured" },
          { value: "50–80%", label: "Captured by top 3 hubs (proxy-based)", type: "estimated" },
          { value: "85–90%", label: "Absorbed by top 10 hubs", type: "estimated" },
          { value: "Talent", label: "+ compute + research = capital follows", type: "measured" }
        ]}
      />

      {/* Why These Cities Win */}
      <ReportSection>
        <SectionTitle 
          title="Why Capital Concentrates in These Hubs"
        />
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <FeatureCard
            icon={<Users className="w-5 h-5" />}
            title="Talent Density"
            description="Elite AI researchers and engineers. Immigration magnets for global talent. Founder recycling (ex-OpenAI, Google, DeepMind)."
            index={0}
          />
          <FeatureCard
            icon={<GraduationCap className="w-5 h-5" />}
            title="Universities & Labs"
            description="Stanford, Berkeley, MIT. Oxford, Cambridge, Tsinghua. Research → faster commercialization."
            index={1}
          />
          <FeatureCard
            icon={<Server className="w-5 h-5" />}
            title="Compute & Infrastructure"
            description="GPU data centers. Cloud + sovereign AI initiatives. Proximity to Nvidia & hyperscalers."
            index={2}
          />
          <FeatureCard
            icon={<Banknote className="w-5 h-5" />}
            title="Capital Flywheel"
            description="Deep VC ecosystems. Faster follow-on rounds. Mega-rounds attract more founders."
            index={3}
          />
        </div>
      </ReportSection>

      {/* Ranked Hubs Table */}
      <ReportSection className="bg-muted/20">
        <SectionTitle 
          title="Top AI Investment Hubs (2025–2026)"
          subtitle="City-level data where available; otherwise ecosystem + country proxies"
        />
        <DataTable
          headers={["Rank", "Hub", "Region", "Investment Signal", "Core Strengths"]}
          rows={[
            ["1", "San Francisco Bay Area", "USA", "$30B+ AI funding (US proxy)", "Foundation models, infra, agents"],
            ["2", "New York City", "USA", "High applied-AI funding", "Finance, media, enterprise AI"],
            ["3", "London", "UK", "Europe's AI capital", "Cloud AI, fintech, autonomy"],
            ["4", "Beijing / Shanghai", "China", "Billions (China proxy)", "Autonomous systems, cloud AI"],
            ["5", "Paris", "France", "Late-stage surge", "Foundation models (Mistral)"],
            ["6", "Toronto–Waterloo", "Canada", "High AI-native share", "Research & ML talent"],
            ["7", "Tel Aviv", "Israel", "Strong per-capita funding", "Cyber, defense, edge AI"],
            ["8", "Singapore", "Asia", "Policy-driven growth", "Enterprise & sovereign AI"],
            ["9", "Dubai / Abu Dhabi", "MENA", "$46B sovereign push", "Compute, data centers"],
            ["10", "Boston", "USA", "Research-led strength", "Health AI, robotics"]
          ]}
        />
      </ReportSection>

      {/* Regional Concentration */}
      <ReportSection>
        <SectionTitle 
          title="Global AI Venture Capital Share by Region"
        />
        <div className="bg-card rounded-xl border border-border p-8">
          <div className="space-y-4">
            {[
              { region: "North America", share: "~70%", width: "70%" },
              { region: "Asia (China-led)", share: "~20%", width: "20%" },
              { region: "Europe", share: "~10%", width: "10%" },
              { region: "Rest of World", share: "<5%", width: "5%" }
            ].map((item, i) => (
              <div key={i}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-foreground">{item.region}</span>
                  <span className="font-display font-semibold text-primary">{item.share}</span>
                </div>
                <div className="h-3 bg-muted rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary rounded-full transition-all duration-1000"
                    style={{ width: item.width }}
                  />
                </div>
              </div>
            ))}
          </div>
          <p className="text-center text-sm text-muted-foreground mt-6 italic">
            "AI capital behaves like infrastructure capital — it clusters, then compounds."
          </p>
        </div>
      </ReportSection>

      {/* Hub Profiles */}
      <ReportSection className="bg-muted/20">
        <SectionTitle 
          title="Hub Profiles"
        />
        <div className="grid md:grid-cols-2 gap-6">
          <HubProfileCard
            name="San Francisco Bay Area"
            region="USA"
            whyItMatters={[
              "OpenAI, Anthropic, Scale AI",
              "Deepest VC pools globally",
              "GPU access + hyperscaler proximity"
            ]}
            whatGetsFunded={[
              "Foundation models",
              "AI infrastructure",
              "Agent platforms"
            ]}
            whyFoundersMove={[
              "Faster fundraising",
              "Better talent matching",
              "Global credibility"
            ]}
            index={0}
          />
          <HubProfileCard
            name="London"
            region="UK"
            whyItMatters={[
              "Europe's strongest AI labor market",
              "Fintech + enterprise adoption",
              "Regulatory clarity"
            ]}
            whatGetsFunded={[
              "Applied AI at scale",
              "DeepMind alumni ecosystem"
            ]}
            index={1}
          />
        </div>
      </ReportSection>

      {/* Emerging Hubs */}
      <ReportSection>
        <SectionTitle 
          title="Fast-Rising AI Hubs"
        />
        <DataTable
          headers={["Hub", "Growth Driver", "Why It's Rising"]}
          rows={[
            ["Paris", "Foundation models", "Mistral + EU support"],
            ["Singapore", "Policy + infrastructure", "Government-led AI adoption"],
            ["Dubai / Abu Dhabi", "Sovereign capital", "Compute + data center race"],
            ["Toronto", "Research depth", "Global ML talent export"]
          ]}
        />
      </ReportSection>

      {/* Reality Check */}
      <ReportSection className="bg-muted/20">
        <SectionTitle 
          title="Important Caveats"
        />
        <div className="grid md:grid-cols-2 gap-6">
          {[
            "City-level AI VC data is often paywalled",
            "Many figures rely on country-level proxies",
            "AI-native ≠ AI-enabled startups",
            "Private mega-rounds skew totals"
          ].map((caveat, i) => (
            <div key={i} className="bg-card rounded-lg border border-border p-4 flex items-start gap-3">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2 flex-shrink-0" />
              <p className="text-sm text-muted-foreground">{caveat}</p>
            </div>
          ))}
        </div>
      </ReportSection>

      {/* Key Takeaways */}
      <ReportSection dark>
        <SectionTitle title="Key Takeaways" />
        <div className="space-y-8 max-w-3xl mx-auto">
          <PullQuote 
            quote="AI investment follows talent, not hype."
            variant="editorial"
          />
          <PullQuote 
            quote="Compute access is the new strategic moat."
            variant="editorial"
          />
          <PullQuote 
            quote="The gap between top hubs and the rest is widening."
            variant="editorial"
          />
          <PullQuote 
            quote="Late-moving cities must invest in infrastructure first."
            variant="editorial"
          />
        </div>
      </ReportSection>

      {/* Sources */}
      <ReportSection>
        <SourcesSection
          sources={[
            { name: "Stanford AI Index" },
            { name: "WIPO" },
            { name: "EY" },
            { name: "UNCTAD" },
            { name: "Startup Genome" },
            { name: "Visual Capitalist" }
          ]}
          methodology="AI funding defined as venture capital into AI-native companies (foundation models, infrastructure, core AI systems), excluding general tech with minor AI features."
        />
      </ReportSection>
    </article>
  );
};

export default AiInvestmentHubsReport;
