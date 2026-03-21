---
paths:
  - "src/components/**"
  - "src/pages/**"
---

# React Component Rules

- Path alias: `@/` maps to `./src/`
- Import UI from `@/components/ui/` (shadcn barrel exports)
- Use `useAuth` hook for auth state, `<ProtectedRoute>` for route guards
- Env vars: `import.meta.env.VITE_*` only — never expose server keys
- Prefer named exports for components
- Use React 18 patterns: `useTransition`, `Suspense`, error boundaries
- Tailwind for all styling — no inline styles or CSS modules
- shadcn/ui components are in `src/components/ui/` — customize there, not in pages
- Loading states: always handle loading/error/empty states
- Hooks rules: no conditional hooks, no hooks in loops
