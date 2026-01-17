# Marketing Hub Screen

**Route:** `/app/events/:id/marketing`  
**Screen Type:** Dashboard  
**Classification:** 3-Panel Dashboard

---

## Description

AI-powered marketing asset generation hub. Creates social posts, email sequences, graphics, and press releases using Claude for copy and Gemini Pro Image for graphics.

---

## Purpose & Goals

**Purpose:** Generate all marketing assets (social posts, emails, graphics, press releases) with AI-powered content creation and image generation.

**Goals:**
- Reduce marketing content creation time (AI-generated copy and graphics)
- Generate social posts for multiple platforms (Twitter/X, LinkedIn, Instagram)
- Create email sequences (invitation, reminder, thank you)
- Generate event graphics (banners, carousels, infographics)
- Schedule posts and emails
- Track asset performance

---

## Wireframe

```
┌──────────────────────────────────────────────────────────────────────────────┐
│ ← Event Detail   MARKETING HUB                          [Schedule] [Export]  │
│──────────────────────────────────────────────────────────────────────────────│
│ ┌──────────────┐ ┌─────────────────────────────┐ ┌────────────────────────┐ │
│ │ ASSETS       │ │ [Social] [Email] [Graphics] │ │ MARKETING AGENT 🤖     │ │
│ │──────────────│ │─────────────────────────────│ │────────────────────────│ │
│ │ 📱 Social    │ │ SOCIAL MEDIA POSTS          │ │ "I can help create     │ │
│ │   Posts (8)  │ │                             │ │  content for your      │ │
│ │              │ │ ┌─────────────────────────┐ │ │  Demo Day. What would  │ │
│ │ 📧 Email     │ │ │ 🐦 Twitter/X            │ │ │  you like to create?"  │ │
│ │   Templates  │ │ │ "🚀 Join us for Demo    │ │ │                        │ │
│ │   (4)        │ │ │ Day 2024! Watch 10      │ │ │ QUICK GENERATE         │ │
│ │              │ │ │ startups pitch live..." │ │ │ ─────────────────────  │ │
│ │ 🎨 Graphics  │ │ │ [Edit] [Schedule] [Post]│ │ │ [📱 Social Posts]      │ │
│ │   (6)        │ │ └─────────────────────────┘ │ │ [📧 Email Sequence]    │ │
│ │              │ │                             │ │ [🎨 Event Banner]      │ │
│ │ ─────────────│ │ ┌─────────────────────────┐ │ │ [📋 Press Release]     │ │
│ │ SCHEDULED    │ │ │ 💼 LinkedIn             │ │ │                        │ │
│ │ • Apr 10 🐦  │ │ │ "Excited to announce    │ │ │ ─────────────────────  │ │
│ │ • Apr 12 💼  │ │ │ our Q1 Demo Day..."     │ │ │                        │ │
│ │ • Apr 14 📧  │ │ │ [Edit] [Schedule] [Post]│ │ │ BRAND SETTINGS         │ │
│ │              │ │ └─────────────────────────┘ │ │ Colors: #1a365d        │ │
│ │ CALENDAR     │ │                             │ │ Font: Inter            │ │
│ │ ┌──────────┐ │ │ ┌─────────────────────────┐ │ │ Logo: ✓ Uploaded       │ │
│ │ │ Apr 2024 │ │ │ │ 📸 Instagram            │ │ │                        │ │
│ │ │ ○○●○○○○  │ │ │ │ [Generate carousel...]  │ │ │ ─────────────────────  │ │
│ │ │ ○○○●○○○  │ │ │ │                         │ │ │ 💬 Chat                │ │
│ │ └──────────┘ │ │ │ [Edit] [Schedule] [Post]│ │ │ ┌──────────────────┐   │ │
│ │              │ │ └─────────────────────────┘ │ │ │ Create a series  │   │ │
│ │              │ │                             │ │ │ of countdown...  │   │ │
│ └──────────────┘ └─────────────────────────────┘ └────────────────────────┘ │
└──────────────────────────────────────────────────────────────────────────────┘
```

---

## 3-Panel Layout Logic

**Left Panel (240px) = Context:**
- Assets list: Social Posts (8), Email Templates (4), Graphics (6)
- Scheduled assets: Calendar view with scheduled posts
- Asset categories: Social, Email, Graphics

**Main Panel (Flexible) = Work:**
- Header: [Social] [Email] [Graphics] tabs
- Social tab: Posts for Twitter/X, LinkedIn, Instagram
- Email tab: Email sequences (invitation, reminder, thank you)
- Graphics tab: Event banners, carousels, infographics
- Asset cards: Content preview, [Edit] [Schedule] [Post] buttons

**Right Panel (320px) = Intelligence:**
- Marketing Agent: AI coach with chat interface
- Quick Generate: [📱 Social Posts] [📧 Email Sequence] [🎨 Event Banner] [📋 Press Release]
- Brand Settings: Colors, font, logo
- AI chat: "Create a series of countdown..." input

---

## Content & Data

**Supabase Tables:**
- `event_assets` — Marketing assets (id, event_id, asset_type, platform, content, image_url, scheduled_at, status)
- `startup_events` — Event context (for content generation)

**Asset Types:**
- `social_post` — Social media posts (Twitter/X, LinkedIn, Instagram)
- `email_template` — Email sequences (invitation, reminder, thank you)
- `graphic` — Event graphics (banners, carousels, infographics)
- `press_release` — Press releases

**Platforms:**
- `twitter` — Twitter/X posts
- `linkedin` — LinkedIn posts
- `instagram` — Instagram posts (carousels)
- `email` — Email templates

---

## Features

- Generate social posts for multiple platforms
- Create email sequences (invitation, reminder, thank you)
- Generate event graphics (banners, carousels, infographics)
- Schedule posts and emails
- Brand settings (colors, font, logo)
- Asset library with categories
- Edit, schedule, and post buttons
- Track asset performance (views, clicks, conversions)

---

## AI Agents & Interactions

**Marketing Agent:**
- **Model:** `claude-sonnet-4-5` (copy generation) + `gemini-3-pro-image-preview` (graphics)
- **Purpose:** Content creation, image generation, scheduling
- **Tools:** Social APIs, Image generation, Content generation
- **Interaction:** Right panel chat, quick generate buttons
- **Edge Function:** `event-marketing`
- **Input:** `{ event_id, asset_type, platform, prompt }`
- **Reads from:** `startup_events` (for event context), `event_assets` (for brand settings)
- **Returns:** `{ content: "", image_url: "", scheduled_at: null }`

**Agent Interaction Flow:**
1. User clicks [📱 Social Posts] or [📧 Email Sequence] or [🎨 Event Banner]
2. Marketing Agent generates content via Claude (copy) + Gemini (graphics if needed)
3. Displays generated content in main panel
4. User edits content if needed
5. User clicks [Schedule] to schedule post
6. User clicks [Post] to post immediately
7. Asset saved to `event_assets` table

**Content Generation Flow:**
1. **Social Posts:** Marketing Agent generates copy for Twitter/X, LinkedIn, Instagram
2. **Email Sequence:** Marketing Agent generates invitation, reminder, thank you emails
3. **Event Banner:** Marketing Agent generates copy, Gemini generates banner image
4. **Press Release:** Marketing Agent generates press release content

---

## Modules

- **MarketingTabs** — Tabbed interface (Social, Email, Graphics)
- **SocialPosts** — Social posts component (Twitter/X, LinkedIn, Instagram)
- **EmailTemplates** — Email sequences component
- **Graphics** — Graphics component (banners, carousels)
- **AssetCard** — Individual asset card with preview
- **MarketingAgentPanel** — Right panel AI agent
- **BrandSettings** — Brand settings (colors, font, logo)
- **ScheduledAssets** — Calendar view with scheduled posts

---

## Workflows

**Generate Social Posts:**
1. User clicks [📱 Social Posts] in right panel
2. Marketing Agent generates posts for Twitter/X, LinkedIn, Instagram
3. Displays generated posts in main panel (Social tab)
4. User edits posts if needed
5. User clicks [Schedule] to schedule or [Post] to post immediately
6. Posts saved to `event_assets` table with `asset_type = 'social_post'`

**Generate Email Sequence:**
1. User clicks [📧 Email Sequence] in right panel
2. Marketing Agent generates invitation, reminder, thank you emails
3. Displays generated emails in main panel (Email tab)
4. User edits emails if needed
5. User clicks [Schedule] to schedule emails
6. Emails saved to `event_assets` table with `asset_type = 'email_template'`

**Generate Event Banner:**
1. User clicks [🎨 Event Banner] in right panel
2. Marketing Agent generates banner copy
3. Gemini generates banner image via image generation
4. Displays generated banner in main panel (Graphics tab)
5. User edits banner if needed
6. User clicks [Schedule] to schedule or [Post] to post immediately
7. Banner saved to `event_assets` table with `asset_type = 'graphic'`

**AI Chat:**
1. User types prompt in right panel chat (e.g., "Create a series of countdown posts")
2. Marketing Agent generates content based on prompt
3. Displays generated content in main panel
4. User edits content if needed
5. User clicks [Schedule] or [Post]

---

## Automations

- **Content generation:** Auto-generate content based on event context and brand settings
- **Image generation:** Auto-generate graphics for social posts and banners
- **Scheduling:** Auto-schedule posts based on event date (countdown posts, reminders)
- **Brand consistency:** Auto-apply brand settings (colors, font, logo) to all assets

---

## Supabase

**Writes:**
- INSERT into `event_assets` — Create new marketing assets

**Queries:**
- Event context: `SELECT * FROM startup_events WHERE id = $1` (for content generation)
- Assets list: `SELECT * FROM event_assets WHERE startup_event_id = $1 ORDER BY scheduled_at`
- Brand settings: `SELECT brand_colors, brand_font, brand_logo FROM startups WHERE id = (SELECT startup_id FROM startup_events WHERE id = $1)`

**RLS:**
- Filtered by `startup_in_org(startup_id)`

---

## Edge Functions

**`event-marketing`:**
- **Model:** `claude-sonnet-4-5` (copy) + `gemini-3-pro-image-preview` (graphics)
- **Tool:** Content generation, Image generation
- **Input:** `{ event_id, asset_type, platform, prompt, generation_type }`
- **Logic:**
  1. Get event context and brand settings
  2. Generate content via Claude (copy) or Gemini (graphics)
  3. Apply brand settings to content
- **Generation Types:**
  - `social_posts`: Generate platform-specific posts (Twitter/X, LinkedIn, Instagram)
  - `email_sequence`: Generate invitation, reminder, thank you emails
  - `graphics`: Generate banner, carousel, or infographic images
- **Returns:** `{ content: "", image_url: "", scheduled_at: null, posts: [], emails: [] }`

*Note: All marketing content generation is handled by the single `event-marketing` edge function with different generation types, rather than separate functions.*

---

## Claude SDK & Gemini 3

**Claude SDK:**
- `claude-sonnet-4-5` — Marketing Agent (content generation, copy writing)

**Gemini 3 Tools:**
- `gemini-3-pro-image-preview` — Graphics generation (image generation for banners, carousels)

**Agent Workflows:**
1. Marketing Agent (Claude) → Generates copy → Applies brand settings
2. Marketing Agent (Gemini) → Generates graphics → Creates images
3. Marketing Agent (Claude) → Schedules posts → Updates `event_assets` table

**Logic:**
- Claude for all text content (social posts, emails, press releases)
- Gemini Pro Image for graphics (banners, carousels, infographics)
- Marketing Agent coordinates both Claude and Gemini
- Brand settings applied to all generated content automatically
