import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8200,
    hmr: {
      overlay: false,
    },
    watch: {
      ignored: [
        "**/.backups/**",
        "**/thinktankAI/**",
        "**/node_modules/**",
        "**/.git/**",
        "**/.venv*/**",
        "**/.obsidian/**",
        "**/.claude/**",
        "**/.agents/**",
        "**/.cursor/**",
        "**/.auto-claude/**",
        "**/tasks/**",
        "**/lean/**",
        "**/docs/**",
        "**/doc100/**",
        "**/plan/**",
        "**/pm/**",
        "**/research/**",
        "**/screenshots/**",
        "**/website/**",
        "**/SERVICES/**",
        "**/30-day/**",
        "**/knowledge/**",
      ],
    },
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          react: ["react", "react-dom", "react-router-dom"],
          supabase: ["@supabase/supabase-js"],
          recharts: ["recharts"],
          pdf: ["jspdf", "html2canvas"],
          markdown: ["react-markdown"],
          motion: ["framer-motion"],
        },
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
