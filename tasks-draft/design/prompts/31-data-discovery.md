---
task_id: DES-031
title: Data Discovery (AI Workflow)
phase: MVP
priority: P2
status: Not Started
skill: none
subagents: []
depends_on: []
---

# 31 — Data Discovery (AI Workflow)

> **Purpose:** Use AI to find trustworthy, downloadable data sources for your visualization
> **Source:** Flourish "AI for Better Charts" — Step 1

---

## Prompt A — Find Data Sources

```
I am working on a [report / article / infographic] about [TOPIC].

I want to give context on [SPECIFIC ANGLE — e.g., "inflation trends over the past 20 years" or "AI adoption rates by industry"].

Point me to 3-5 resources where I can get trustworthy data that is:
- Publicly accessible (free to download)
- Available in CSV, Excel, or API format
- From reputable sources (government, research institutions, industry reports)
- Covering [TIME PERIOD] and [GEOGRAPHY]

For each source, provide:
1. Source name and direct URL to the data download page
2. Data format (CSV, API, PDF tables)
3. Update frequency (annual, quarterly, real-time)
4. Variables available (what columns/metrics)
5. Sample size or coverage scope
6. Any licensing restrictions
```

---

## Prompt B — Extract Data from a Source

```
I found data at [URL or describe the source].

The data is in [format: PDF table / website table / API endpoint / messy CSV].

Help me extract and clean it into a structured CSV with these columns:
- [Column 1]: [description]
- [Column 2]: [description]
- [Column 3]: [description]

Drop any rows that are: [aggregates, incomplete, outside my date range]
Sort by: [field, direction]
```

---

## Pro Tips

- Always ask for "publicly accessible" data — ensures you can actually download it
- Specify the geography and time period upfront to avoid irrelevant suggestions
- Ask for the direct download URL, not just the homepage
- Cross-reference AI suggestions — verify the source actually exists and is current
