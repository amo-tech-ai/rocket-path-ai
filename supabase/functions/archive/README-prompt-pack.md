# Archived: Prompt Pack (apply, run, search)

**Archived:** Replaced by a single combined function.

## Why 4 became 1

Previously there were 4 edge functions:

| Function | Purpose | Status |
|---------|---------|--------|
| **prompt-pack** | Combined: search, get, list, run_step, run_pack, apply, preview | ✅ **Use this** |
| prompt-pack-apply | Apply outputs to DB | ❌ Archived |
| prompt-pack-run | Run AI steps/pack | ❌ Archived |
| prompt-pack-search | Search/get/list packs | ❌ Archived |

The three separate functions were combined into **`prompt-pack`** (single endpoint, action-based routing) to:

- Reduce cold starts (one function for the full flow)
- Match Supabase best practices (combine related operations)
- Simplify deployment and wiring

## Replacement

**Endpoint:** `POST /functions/v1/prompt-pack`  
**Body:** `{ "action": "search" | "get" | "list" | "run_step" | "run_pack" | "apply" | "preview", ... }`

- Catalog (no JWT): `action: "search" | "get" | "list"`
- Run/apply (JWT required): `action: "run_step" | "run_pack" | "apply" | "preview"`

See `supabase/functions/prompt-pack/index.ts` for the implementation.

## Archived folders

- `archive/prompt-pack-apply/` – logic merged into `prompt-pack` (apply/preview)
- `archive/prompt-pack-run/` – logic merged into `prompt-pack` (run_step/run_pack)
- `archive/prompt-pack-search/` – logic merged into `prompt-pack` (search/get/list)

Do not deploy these; use `prompt-pack` only.
