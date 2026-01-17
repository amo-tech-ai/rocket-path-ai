# Venue Finder Screen

**Route:** `/app/events/:id/venues/search`  
**Screen Type:** Dashboard  
**Classification:** 2-Panel Search Interface

---

## Description

AI-powered venue discovery using Gemini Search and image analysis. Finds venues by location, capacity, and amenities, then analyzes photos to estimate capacity and detect amenities.

---

## Purpose & Goals

**Purpose:** Find venues using AI-powered search grounding and image analysis. Match venues by location, capacity, amenities, and budget.

**Goals:**
- Reduce venue discovery time (AI-powered search)
- Match venues by capacity, location, amenities
- Image analysis for capacity estimation and amenity detection
- Venue cards with photos, capacity, amenities, pricing
- One-click booking request or contact

---

## Wireframe

```
┌──────────────────────────────────────────────────────────────────────────────┐
│ ← Event Detail   FIND VENUES                                    [Filters]    │
│──────────────────────────────────────────────────────────────────────────────│
│ ┌────────────────────────────────────────┐  ┌────────────────────────────┐ │
│ │ VENUE SEARCH 🔍                        │  │ VENUE RECOMMENDATIONS      │ │
│ │                                        │  │                            │ │
│ │ Location                               │  │ Based on:                  │ │
│ │ ┌──────────────────────────────────┐  │  │ • 60 attendees             │ │
│ │ │ 📍 San Francisco Bay Area        │  │  │ • April 15, 2024           │ │
│ │ └──────────────────────────────────┘  │  │ • In-person event          │ │
│ │                                        │  │                            │ │
│ │ Capacity                               │  │ ┌────────────────────────┐ │ │
│ │ ┌──────────────────────────────────┐  │  │ │ 🏢 TechHub SF           │ │ │
│ │ │ 60 attendees                     │  │  │ │ Capacity: 80            │ │ │
│ │ └──────────────────────────────────┘  │  │ │ Match: 95%              │ │ │
│ │                                        │  │ │ [Photo Analysis]         │ │ │
│ │ Amenities                              │  │ │ ✅ WiFi, Projector      │ │ │
│ │ ☑ WiFi  ☑ Projector  ☐ Catering      │  │ │ 💰 $500-800/day          │ │ │
│ │                                        │  │ │ [View] [Request Quote]  │ │ │
│ │ Budget                                 │  │ └────────────────────────┘ │ │
│ │ ┌──────────────────────────────────┐  │  │ ┌────────────────────────┐ │ │
│ │ │ $500-1000 per day                │  │  │ │ 🏢 Cowork Space DT      │ │ │
│ │ └──────────────────────────────────┘  │  │ │ Capacity: 50            │ │ │
│ │                                        │  │ │ Match: 87%              │ │ │
│ │ [🔍 Search Venues]                     │  │ │ ✅ WiFi, Catering       │ │ │
│ │                                        │  │ │ 💰 $300-600/day          │ │ │
│ │ ─────────────────────────────────────  │  │ │ [View] [Request Quote]  │ │ │
│ │                                        │  │ └────────────────────────┘ │ │
│ │ SELECTED VENUES (1)                    │  │                            │ │
│ │ ┌─────────────┐                        │  │ [Search more...]           │ │
│ │ │ TechHub SF  │                        │  │                            │ │
│ │ │ Primary     │                        │  │                            │ │
│ │ └─────────────┘                        │  │                            │ │
│ │                                        │  │                            │ │
│ └────────────────────────────────────────┘  └────────────────────────────┘ │
│                                                                              │
│                              [Back]  [Done]                                  │
└──────────────────────────────────────────────────────────────────────────────┘
```

---

## 3-Panel Layout Logic

**Left Panel (Flexible) = Work:**
- Venue Search form: Location, capacity, amenities, budget
- [🔍 Search Venues] button
- Selected venues list (with primary flag)

**Right Panel (320px) = Intelligence:**
- Venue Recommendations: Top matches from Gemini Search
- Venue cards: Name, capacity, match score, amenities, pricing, [View] [Request Quote] buttons
- [Photo Analysis] button for image-based capacity estimation

---

## Content & Data

**Supabase Tables:**
- `event_venues` — Selected venues (created when user adds venue)
- `startup_events` — Event context (for venue matching: date, capacity, location)

**Venue Search:**
- Location: Search by city/area (San Francisco Bay Area, etc.)
- Capacity: Filter by attendee count (60, 80, 100+, etc.)
- Amenities: Filter by amenities (WiFi, Projector, Catering, Parking, etc.)
- Budget: Filter by price range ($300-600, $500-1000, etc.)

**Venue Cards:**
- Name, address, website
- Capacity (estimated from photos if available)
- Match score (capacity, location, amenities, budget fit)
- Amenities list (detected from photos or listed)
- Pricing range
- Photos (if available)

---

## Features

- Location/capacity/amenities/budget filters
- AI-powered venue discovery (Gemini Search)
- Match scoring based on capacity, location, amenities, budget
- Image analysis for capacity estimation and amenity detection
- Venue cards with photos, capacity, amenities, pricing
- Photo analysis button for image-based capacity estimation
- One-click booking request or contact
- Select primary venue

---

## AI Agents & Interactions

**Venue Agent:**
- **Model:** `gemini-3-flash-preview` (search with structured output)
- **Purpose:** Location search, capacity matching, amenity filtering
- **Tools:** Gemini Search (web search grounding), Structured Output (response schema)
- **Interaction:** Search on button click, displays recommendations in right panel
- **Edge Function:** `venue-search`
- **Input:** `{ event_id, criteria: { location, capacity, amenities, budget } }`
- **Reads from:** `startup_events` (for event context: date, capacity, location)
- **Returns:** `{ venues: [{ name, capacity, match_score, amenities, pricing, photos, website, address }] }`

**Photo Analyzer (Venue Agent sub-agent):**
- **Model:** `gemini-3-pro-image-preview`
- **Purpose:** Analyze venue photos to estimate capacity and detect amenities
- **Tools:** Gemini Vision (image analysis)
- **Interaction:** [Photo Analysis] button on venue card
- **Edge Function:** `analyze-venue-photos` *(Planned - not yet implemented)*
- **Input:** `{ venue_id, photos: [urls] }`
- **Logic:** Analyze photos for capacity estimate, amenity detection, layout assessment
- **Returns:** `{ capacity_estimate: 80, amenities: ["WiFi", "Projector"], layout: "open space" }`

**Agent Interaction Flow:**
1. User sets criteria (location, capacity, amenities, budget)
2. User clicks [🔍 Search Venues]
3. Venue Agent searches via Gemini Search (web search grounding)
4. Venue Agent scores matches based on capacity, location, amenities, budget fit
5. Displays top matches in right panel with match scores
6. User clicks [Photo Analysis] on venue card → Photo Analyzer analyzes photos
7. Photo Analyzer estimates capacity and detects amenities from photos
8. Updates venue card with analyzed capacity and amenities

---

## Modules

- **VenueSearchForm** — Criteria form (location, capacity, amenities, budget)
- **VenueRecommendations** — Right panel AI recommendations
- **VenueCard** — Individual venue card with match score
- **SelectedVenues** — Selected venues list with primary flag
- **PhotoAnalyzer** — Image analysis component

---

## Workflows

**Venue Discovery:**
1. User sets criteria (location, capacity, amenities, budget)
2. User clicks [🔍 Search Venues]
3. Venue Agent searches via Gemini Search
4. Venue Agent scores matches based on criteria + event context
5. Display top matches in right panel with match scores
6. User clicks [View] to see venue details
7. User clicks [Photo Analysis] to analyze photos
8. Photo Analyzer estimates capacity and detects amenities
9. Updates venue card with analyzed data
10. User clicks venue card to add to selected list

**Add Venue:**
1. User clicks venue card in recommendations
2. Add venue to `event_venues` table
3. Mark as primary if no primary venue exists
4. Update selected venues list

**Photo Analysis:**
1. User clicks [Photo Analysis] on venue card
2. Photo Analyzer analyzes venue photos via Gemini Vision
3. Estimates capacity from photo layout
4. Detects amenities from photos (projector, WiFi router, catering setup, etc.)
5. Updates venue card with analyzed capacity and amenities

---

## Automations

- **Match scoring:** Auto-score matches based on capacity, location, amenities, budget fit
- **Photo analysis:** Auto-analyze photos when available for capacity estimation
- **Primary venue:** Auto-select first venue as primary if no primary exists

---

## Supabase

**Writes:**
- INSERT into `event_venues` — Add selected venues

**Queries:**
- Event context: `SELECT * FROM startup_events WHERE id = $1` (for venue matching)

**RLS:**
- Filtered by `startup_in_org(startup_id)`

---

## Edge Functions

**`venue-search`:**
- **Model:** `gemini-3-flash-preview`
- **Tool:** Google Search (web search grounding), Structured Output (response schema)
- **Input:** `{ event_id, criteria: { location, capacity, amenities, budget } }`
- **Logic:**
  1. Build search query from criteria + event context
  2. Gemini Search finds venues via web search grounding
  3. Score matches based on capacity, location, amenities, budget fit
- **Returns:** `{ venues: [{ name, capacity, match_score, amenities, pricing, photos, website, address }] }`

**`analyze-venue-photos`:** *(Planned - not yet implemented)*
- **Model:** `gemini-3-pro-image-preview`
- **Tool:** Gemini Vision (image analysis)
- **Input:** `{ venue_id, photos: [urls] }`
- **Logic:** Analyze photos for capacity estimate, amenity detection, layout assessment
- **Returns:** `{ capacity_estimate: 80, amenities: ["WiFi", "Projector"], layout: "open space" }`

---

## Claude SDK & Gemini 3

**Claude SDK:**
- Not used (Venue Agent uses Gemini only)

**Gemini 3 Tools:**
- `gemini-3-flash-preview` — Venue search (Google Search tool for web search grounding)
- `gemini-3-pro-image-preview` — Photo analysis (Vision tool for capacity estimation, amenity detection)

**Agent Workflows:**
1. Venue Agent (Gemini Flash) → Searches venues via Google Search → Scores matches
2. Photo Analyzer (Gemini Pro Image) → Analyzes photos → Estimates capacity and detects amenities

**Logic:**
- Gemini Flash for fast venue search via web search grounding
- Gemini Pro Image for photo analysis (capacity estimation, amenity detection)
- Venue Agent scores matches based on capacity, location, amenities, budget fit
- Photo analysis optional but recommended for accurate capacity estimation
