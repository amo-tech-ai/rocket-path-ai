-- migration: create_lean_canvas_versions
-- description: P2 lean canvas version history for undo/compare
-- task_ref: 02-lean-canvas
-- depends_on: lean_canvases

-- ============================================================
-- lean_canvas_versions: snapshot history for lean canvases
-- ============================================================
create table public.lean_canvas_versions (
  id uuid primary key default gen_random_uuid(),
  canvas_id uuid not null references public.lean_canvases(id) on delete cascade,
  version_number int not null default 1,
  content_json jsonb not null,
  change_summary text,
  created_by uuid references auth.users(id),
  created_at timestamptz not null default now(),
  unique (canvas_id, version_number)
);

comment on table public.lean_canvas_versions is 'Version history snapshots for lean canvases';

create index idx_lean_canvas_versions_canvas_id on public.lean_canvas_versions (canvas_id);

alter table public.lean_canvas_versions enable row level security;

-- read own versions via lean_canvases → startups → user_org_id() chain
create policy "select_own_canvas_versions"
  on public.lean_canvas_versions for select to authenticated
  using (canvas_id in (
    select lc.id from public.lean_canvases lc
    join public.startups s on s.id = lc.startup_id
    where s.org_id = (select public.user_org_id())
  ));

-- insert own versions
create policy "insert_own_canvas_versions"
  on public.lean_canvas_versions for insert to authenticated
  with check (canvas_id in (
    select lc.id from public.lean_canvases lc
    join public.startups s on s.id = lc.startup_id
    where s.org_id = (select public.user_org_id())
  ));

-- no update or delete — versions are immutable
