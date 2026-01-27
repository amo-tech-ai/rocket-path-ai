import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const Footer = () => {
  const navigation = {
    product: [
      { name: "Features", href: "/features" },
      { name: "How it Works", href: "/how-it-works" },
      { name: "Pitch Deck Wizard", href: "/app/pitch-deck/new" },
      { name: "Events", href: "/events" },
    ],
    research: [
      { name: "AI Adoption", href: "/blog/ai-adoption-by-industry" },
      { name: "AI Jobs", href: "/blog/ai-jobs-future-of-work" },
      { name: "AI in E-commerce", href: "/blog/ai-in-ecommerce" },
      { name: "AI Startups", href: "/blog/ai-startup-products" },
      { name: "AI Hubs", href: "/blog/ai-investment-hubs" },
    ],
    resources: [
      { name: "All Research", href: "/blog" },
      { name: "Documentation", href: "#" },
      { name: "Help Center", href: "#" },
    ],
    legal: [
      { name: "Privacy Policy", href: "#" },
      { name: "Terms of Service", href: "#" },
      { name: "Security", href: "#" },
    ],
  };

  return (
    <footer className="bg-[hsl(220,20%,12%)] text-white/90">
      <div className="container-marketing py-16 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link to="/" className="text-2xl font-display font-medium text-white">
              StartupAI
            </Link>
            <p className="mt-4 text-sm text-white/50 max-w-xs">
              The operating system for founders. From strategy to daily execution, in one guided flow.
            </p>

            {/* Newsletter */}
            <div className="mt-8">
              <p className="text-sm font-medium text-white mb-3">Stay updated</p>
              <div className="flex gap-2">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/40 focus:border-sage"
                />
                <Button className="bg-sage hover:bg-sage/90 text-white shrink-0">
                  Subscribe
                </Button>
              </div>
            </div>
          </div>

          {/* Navigation columns */}
          <div>
            <h3 className="text-sm font-medium text-white/80 uppercase tracking-wider mb-4">
              Product
            </h3>
            <ul className="space-y-3">
              {navigation.product.map((item) => (
                <li key={item.name}>
                  <Link
                    to={item.href}
                    className="text-sm text-white/50 hover:text-sage transition-colors"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-medium text-white/80 uppercase tracking-wider mb-4">
              Research
            </h3>
            <ul className="space-y-3">
              {navigation.research.map((item) => (
                <li key={item.name}>
                  <Link
                    to={item.href}
                    className="text-sm text-white/50 hover:text-sage transition-colors"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-medium text-white/80 uppercase tracking-wider mb-4">
              Resources
            </h3>
            <ul className="space-y-3">
              {navigation.resources.map((item) => (
                <li key={item.name}>
                  <Link
                    to={item.href}
                    className="text-sm text-white/50 hover:text-sage transition-colors"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-16 pt-8 border-t border-white/10">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-sm text-white/40">
              © 2024 StartupAI. All rights reserved.
            </p>
            <div className="flex gap-6">
              {navigation.legal.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="text-sm text-white/40 hover:text-sage transition-colors"
                >
                  {item.name}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
