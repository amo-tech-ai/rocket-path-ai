# 04-Roadmap

> Product Roadmap System - Now-Next-Later, Story Mapping, Stakeholder Views

---

## 00-Summary

| Component | Description |
|-----------|-------------|
| NowNextLater | 3-column flexible roadmap without fixed dates |
| StoryMap | User journey backbone with feature stories |
| StakeholderViews | Tailored views for Executive, Engineering, Sales, Customer |
| Portfolio | Multi-product roadmap coordination |
| SprintIntegration | Connect roadmap to 90-day lean sprints |

| Screen | Purpose |
|--------|---------|
| `/roadmap` | Main Now-Next-Later view |
| `/roadmap/stories` | Story mapping workspace |
| `/roadmap/executive` | Executive summary view |
| `/roadmap/engineering` | Technical dependency view |
| `/roadmap/sales` | Customer-facing view |
| `/roadmap/portfolio` | Multi-product view |

---

## 01-Philosophy

| Principle | Traditional Roadmap | Lean Roadmap |
|-----------|---------------------|--------------|
| Commitments | Fixed dates and features | Time horizons with flexibility |
| Planning | Waterfall annual cycles | Continuous discovery |
| Communication | One roadmap for all | Stakeholder-specific views |
| Metrics | Delivery dates | Outcomes and learning |
| Updates | Quarterly reviews | Continuous evolution |

| Time Horizon | Certainty | Planning Depth |
|--------------|-----------|----------------|
| Now (0-6 weeks) | High - Committed | Detailed stories, assigned teams |
| Next (6-12 weeks) | Medium - Planned | Defined features, estimated effort |
| Later (3-6 months) | Low - Exploring | Problem statements, opportunities |

| Anti-Pattern | Problem | Solution |
|--------------|---------|----------|
| Date promises | Over-commitment | Time horizons instead |
| Feature factory | Building without learning | Outcome-focused items |
| One roadmap fits all | Stakeholder confusion | Tailored views |
| Set and forget | Stale roadmaps | Continuous updates |

---

## 02-NowNextLater

### Wireframe

| Now (Committed) | Next (Planned) | Later (Exploring) |
|-----------------|----------------|-------------------|
| ........................... | ........................... | ........................... |
| CARD: Feature A | CARD: Feature D | CARD: Opportunity X |
| Status: In Progress | Status: Scoped | Status: Discovery |
| Team: Alpha | Team: TBD | Team: TBD |
| Outcome: +15% retention | Outcome: New segment | Outcome: Market expansion |
| ........................... | ........................... | ........................... |
| CARD: Feature B | CARD: Feature E | CARD: Opportunity Y |
| Status: Testing | Status: Backlog | Status: Research |
| ........................... | ........................... | ........................... |
| CARD: Feature C | CARD: Feature F | CARD: Opportunity Z |
| Status: Deploying | Status: Ideation | Status: Watching |
| ........................... | ........................... | ........................... |
| [+ Add Item] | [+ Add Item] | [+ Add Item] |

### Card Detail

| Field | Now Column | Next Column | Later Column |
|-------|------------|-------------|--------------|
| Title | Required | Required | Required |
| Problem Statement | Required | Required | Required |
| Outcome Metric | Required | Required | Optional |
| Team Assignment | Required | Optional | Not shown |
| Story Points | Required | Optional | Not shown |
| Dependencies | Required | Optional | Not shown |
| Customer Segment | Required | Required | Required |
| Confidence Level | High | Medium | Low |

### Column Rules

| Rule | Now | Next | Later |
|------|-----|------|-------|
| Max Items | 5-7 | 8-12 | Unlimited |
| Detail Level | Full specs | High-level | Problem only |
| Movement | Only forward with approval | Bidirectional | Bidirectional |
| Review Cycle | Weekly | Bi-weekly | Monthly |

---

## 03-StoryMap

### Wireframe

| Backbone Row | Discover | Evaluate | Purchase | Onboard | Use | Advocate |
|--------------|----------|----------|----------|---------|-----|----------|
| User Activity | Find solution | Compare options | Sign up | Get started | Daily use | Share |

| Story Row 1 | Search landing | Feature compare | Pricing page | Welcome flow | Dashboard | Referral |
|-------------|----------------|-----------------|--------------|--------------|-----------|----------|
| Story Row 2 | Content discovery | Demo request | Checkout | Tutorial | Core feature | Review |
| Story Row 3 | Social proof | Trial signup | Payment | Import data | Settings | Case study |
| MVP Line | -------------- | -------------- | -------------- | -------------- | -------------- | -------------- |
| Story Row 4 | Retargeting | ROI calculator | Enterprise | Advanced setup | Integrations | Community |
| Story Row 5 | Webinar | Security review | Custom quote | Team invite | Analytics | Partner |

### Backbone Definition

| Journey Phase | User Goal | Key Question | Success Metric |
|---------------|-----------|--------------|----------------|
| Discover | Find a solution | How do I solve this problem? | Traffic, awareness |
| Evaluate | Compare options | Is this the right solution? | Engagement, trials |
| Purchase | Make decision | Is the value worth the price? | Conversion rate |
| Onboard | Get started | How do I get value quickly? | Activation rate |
| Use | Achieve goals | Does this solve my problem? | Retention, NPS |
| Advocate | Share success | How can I help others? | Referrals, reviews |

### Story Card

| Field | Description |
|-------|-------------|
| Title | Short feature name |
| User Story | As a [persona], I want [goal], so that [benefit] |
| Acceptance Criteria | Bullet list of requirements |
| Effort Estimate | T-shirt size (S, M, L, XL) |
| Value Score | 1-10 impact rating |
| Dependencies | Related stories |
| Release Cluster | MVP, V1.1, V2.0, etc. |

### Release Clusters

| Cluster | Scope | Goal |
|---------|-------|------|
| MVP | Above the line, all phases | Minimum viable journey |
| V1.1 | First row below line | Enhanced core experience |
| V1.2 | Second row below line | Power user features |
| V2.0 | Major new capabilities | Market expansion |

---

## 04-Executive

### Wireframe

| Strategic Theme | Q1 Status | Q2 Outlook | Key Metric |
|-----------------|-----------|------------|------------|
| ........................... | ........................... | ........................... | ........................... |
| Growth | On Track | Expanding | ARR +45% |
| Retention | At Risk | Improving | Churn -2% |
| Expansion | Ahead | Maintaining | NRR 115% |
| ........................... | ........................... | ........................... | ........................... |

| Initiative | Status | Investment | Expected Return |
|------------|--------|------------|-----------------|
| Mobile App | In Progress | $150K | +20% engagement |
| Enterprise Tier | Planning | $200K | +$500K ARR |
| API Platform | Discovery | $100K | New revenue stream |

| Risk | Mitigation | Owner |
|------|------------|-------|
| Competitor launch | Accelerate Feature X | Product |
| Talent shortage | Contractor support | HR |
| Market shift | Customer research | Strategy |

### View Configuration

| Element | Shown | Hidden |
|---------|-------|--------|
| Strategic themes | Yes | |
| Status indicators | Yes | |
| Investment amounts | Yes | |
| Expected outcomes | Yes | |
| Technical details | | Yes |
| Sprint tickets | | Yes |
| Bug fixes | | Yes |
| Technical debt | | Yes |

---

## 05-Engineering

### Wireframe

| System | Now (Sprint) | Next (Quarter) | Later (Half) |
|--------|--------------|----------------|--------------|
| ........................... | ........................... | ........................... | ........................... |
| Frontend | React upgrade | Design system | Micro-frontends |
| Backend | API v2 | Event sourcing | Multi-region |
| Data | Analytics v2 | ML pipeline | Data lake |
| Infra | K8s migration | Auto-scaling | Multi-cloud |
| ........................... | ........................... | ........................... | ........................... |

| Dependency Map | |
|----------------|---|
| API v2 | blocks → Mobile App, Partner Integrations |
| Analytics v2 | blocks → ML Pipeline, Executive Dashboard |
| K8s migration | blocks → Auto-scaling, Multi-region |
| Design system | blocks → Component library, White-label |

| Tech Debt Item | Priority | Sprint Allocation |
|----------------|----------|-------------------|
| Legacy auth removal | P1 | 20% capacity |
| Test coverage gaps | P2 | 15% capacity |
| Documentation debt | P3 | 10% capacity |

### View Configuration

| Element | Shown | Hidden |
|---------|-------|--------|
| Technical dependencies | Yes | |
| System architecture | Yes | |
| Tech debt allocation | Yes | |
| Sprint capacity | Yes | |
| Business metrics | | Yes |
| Revenue projections | | Yes |
| Customer names | | Yes |

---

## 06-Sales

### Wireframe

| Coming Soon | Target Segment | Sales Impact |
|-------------|----------------|--------------|
| ........................... | ........................... | ........................... |
| Mobile App (Q2) | SMB, Remote teams | +15% close rate |
| SSO Integration (Q2) | Enterprise | Removes blocker |
| Advanced Analytics (Q3) | Data-driven orgs | Premium upsell |
| API Access (Q3) | Technical buyers | Platform play |
| ........................... | ........................... | ........................... |

| Competitive Response | Our Advantage | Talking Point |
|---------------------|---------------|---------------|
| Competitor X launched Y | We have Z | "Unlike X, we..." |
| Market shift to mobile | Mobile-first approach | "Already ahead..." |
| Enterprise security concerns | SOC2 certified | "Enterprise-ready..." |

| Customer Request | Status | ETA |
|------------------|--------|-----|
| Bulk import | In Progress | 4 weeks |
| Custom reports | Planning | Q2 |
| White-label | Discovery | Q3+ |

### View Configuration

| Element | Shown | Hidden |
|---------|-------|--------|
| Customer-facing features | Yes | |
| Competitive positioning | Yes | |
| Rough timelines | Yes | |
| Customer requests status | Yes | |
| Technical implementation | | Yes |
| Internal refactoring | | Yes |
| Exact dates | | Yes |
| Resource allocation | | Yes |

---

## 07-Customer

### Wireframe

| What's New | Coming Soon | Share Your Ideas |
|------------|-------------|------------------|
| ........................... | ........................... | ........................... |
| Feature A - Live Now | Mobile App - Q2 | [Submit Feedback] |
| Improved performance | Advanced Analytics | |
| Bug fixes | API Access | Vote on features: |
| ........................... | ........................... | Bulk Import (234 votes) |
| | | Custom Reports (189 votes) |
| | | Dark Mode (156 votes) |
| ........................... | ........................... | ........................... |

| Recent Updates | |
|----------------|---|
| Mar 15 | Performance improvements - 2x faster load times |
| Mar 8 | New dashboard widgets - customize your view |
| Mar 1 | Export enhancements - more format options |

| Changelog Entry | |
|-----------------|---|
| Version | 2.4.0 |
| Date | March 15, 2024 |
| Category | Performance |
| Summary | Dashboard loads 2x faster |
| Details | Optimized data queries and added caching |

### View Configuration

| Element | Shown | Hidden |
|---------|-------|--------|
| Shipped features | Yes | |
| Coming soon (approved) | Yes | |
| Feedback collection | Yes | |
| Changelog | Yes | |
| Internal roadmap | | Yes |
| Unconfirmed features | | Yes |
| Technical details | | Yes |
| Resource constraints | | Yes |

---

## 08-Portfolio

### Wireframe

| Product | Now | Next | Later | Health |
|---------|-----|------|-------|--------|
| ........................... | ........................... | ........................... | ........................... | ........................... |
| Core Platform | Feature A, B | Feature D | Opportunity X | Green |
| Mobile App | MVP launch | V1.1 features | Tablet support | Yellow |
| API Platform | Beta testing | GA launch | Partner program | Green |
| Enterprise | Security audit | SSO, SCIM | White-label | Yellow |
| ........................... | ........................... | ........................... | ........................... | ........................... |

| Cross-Product Dependency | |
|--------------------------|---|
| Core API v2 | enables → Mobile App, API Platform |
| Design System | enables → All products |
| Auth Service | enables → Enterprise SSO |

| Resource Allocation | |
|--------------------|---|
| Team Alpha | Core Platform (60%), Mobile (40%) |
| Team Beta | API Platform (80%), Enterprise (20%) |
| Team Gamma | Enterprise (70%), Core Platform (30%) |

| Portfolio Health | |
|------------------|---|
| Overall Progress | 73% on track |
| At Risk Items | 2 items need attention |
| Blocked Items | 1 item blocked |
| Resource Conflicts | Team Alpha overallocated |

---

## 09-DataModel

### Tables

| Table | Purpose |
|-------|---------|
| roadmap_items | Main roadmap entries |
| roadmap_columns | Now, Next, Later definitions |
| story_maps | Story mapping canvases |
| story_cards | Individual story cards |
| stakeholder_views | View configurations |
| roadmap_changelog | Public changelog entries |
| feature_votes | Customer feature voting |

### roadmap_items

| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| project_id | uuid | FK to projects |
| column_id | uuid | FK to roadmap_columns |
| title | text | Item title |
| problem_statement | text | Problem being solved |
| outcome_metric | text | Success metric |
| team_id | uuid | Assigned team |
| effort_estimate | text | T-shirt size |
| confidence_level | text | high, medium, low |
| customer_segment | text | Target segment |
| dependencies | uuid[] | Related items |
| position | integer | Sort order |
| created_at | timestamptz | Creation time |
| updated_at | timestamptz | Last update |

### story_cards

| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| story_map_id | uuid | FK to story_maps |
| backbone_phase | text | Journey phase |
| title | text | Story title |
| user_story | text | As a... I want... so that... |
| acceptance_criteria | jsonb | Requirements list |
| effort_estimate | text | T-shirt size |
| value_score | integer | 1-10 impact |
| release_cluster | text | MVP, V1.1, etc. |
| row_position | integer | Vertical position |
| col_position | integer | Horizontal position |
| is_above_mvp_line | boolean | MVP scope flag |

### stakeholder_views

| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| project_id | uuid | FK to projects |
| view_type | text | executive, engineering, sales, customer |
| config | jsonb | Show/hide settings |
| custom_labels | jsonb | Renamed fields |
| access_level | text | public, internal, restricted |

---

## 10-Agents

### RoadmapAgent

| Capability | Description |
|------------|-------------|
| Item Analysis | Evaluate roadmap items for clarity and outcomes |
| Prioritization | Suggest Now/Next/Later placement |
| Dependency Detection | Identify cross-item dependencies |
| Balance Check | Ensure healthy mix across columns |
| Stakeholder Translation | Adapt messaging per audience |

| Action | Trigger |
|--------|---------|
| analyze_item | New item added |
| suggest_priority | Item needs placement |
| check_dependencies | Dependencies updated |
| generate_view | Stakeholder view requested |
| update_changelog | Feature shipped |

### StoryAgent

| Capability | Description |
|------------|-------------|
| Story Writing | Generate user stories from requirements |
| Backbone Mapping | Place stories on journey phases |
| MVP Scoping | Recommend MVP line placement |
| Gap Analysis | Find missing journey coverage |
| Effort Estimation | Suggest T-shirt sizes |

| Action | Trigger |
|--------|---------|
| write_story | Feature description provided |
| map_to_backbone | Story needs placement |
| analyze_mvp | MVP scope review |
| find_gaps | Journey completeness check |
| estimate_effort | Story sizing needed |

---

## 11-Integration

### Journey to Roadmap

| Journey Phase | Roadmap Signal |
|---------------|----------------|
| Pain Point Identified | Later column opportunity |
| Solution Validated | Next column feature |
| Sprint Ready | Now column item |

### Story Map to Sprint

| Story Map | Sprint Connection |
|-----------|-------------------|
| Above MVP Line | Sprint backlog candidates |
| Release Cluster | Sprint grouping |
| Dependencies | Sprint sequencing |

### Roadmap to Changelog

| Roadmap Status | Changelog Action |
|----------------|------------------|
| Shipped | Auto-generate entry |
| In Progress | Coming soon preview |
| Blocked | Internal note only |

---

## 12-Workflows

### Item Lifecycle

| Stage | Actions |
|-------|---------|
| 1. Discovery | Problem identified, added to Later |
| 2. Validation | Research complete, move to Next |
| 3. Scoping | Stories written, dependencies mapped |
| 4. Commitment | Capacity confirmed, move to Now |
| 5. Execution | Sprint work, status updates |
| 6. Shipping | Feature launched, changelog updated |
| 7. Measurement | Outcomes tracked, learnings captured |

### View Generation

| Step | Action |
|------|--------|
| 1 | Select stakeholder type |
| 2 | Apply view configuration |
| 3 | Filter appropriate items |
| 4 | Translate terminology |
| 5 | Add relevant context |
| 6 | Export or present |

### Roadmap Review

| Cadence | Focus |
|---------|-------|
| Weekly | Now column status |
| Bi-weekly | Next column readiness |
| Monthly | Later column opportunities |
| Quarterly | Strategic alignment |

---

## 13-Metrics

### Roadmap Health

| Metric | Target | Calculation |
|--------|--------|-------------|
| Throughput | Varies | Items shipped per month |
| Cycle Time | < 6 weeks | Average Now to Shipped |
| Predictability | > 80% | Items shipped as planned |
| Balance | 5/10/15 | Now/Next/Later distribution |

### Outcome Tracking

| Metric | Measurement |
|--------|-------------|
| Outcome Achievement | % items hitting target metric |
| Learning Rate | Insights per shipped feature |
| Pivot Rate | Items moved back to Later |
| Customer Impact | NPS/CSAT change per release |

### Stakeholder Satisfaction

| Stakeholder | Success Metric |
|-------------|----------------|
| Executive | Strategic alignment score |
| Engineering | Technical debt ratio |
| Sales | Feature request fulfillment |
| Customer | Feature voting engagement |

---

## 14-Permissions

### Role Access

| Role | Now | Next | Later | Views |
|------|-----|------|-------|-------|
| Admin | Full | Full | Full | All |
| Product Manager | Full | Full | Full | All |
| Engineering Lead | View + Comment | View + Comment | View | Engineering |
| Sales Lead | View | View | View | Sales, Customer |
| Customer | None | None | None | Customer only |

### View Permissions

| View | Internal | External |
|------|----------|----------|
| Full Roadmap | Product, Engineering | None |
| Executive | Leadership | Board |
| Engineering | Engineering | None |
| Sales | Sales, Success | Partners |
| Customer | All | Public |

---

## 15-EdgeFunctions

### Functions

| Function | Purpose |
|----------|---------|
| roadmap-agent | AI-powered roadmap analysis |
| story-agent | Story writing and mapping |
| changelog-generator | Auto-generate release notes |
| view-exporter | Export stakeholder views |

### roadmap-agent Actions

| Action | Input | Output |
|--------|-------|--------|
| analyze | item_id | Analysis with recommendations |
| prioritize | item_id, context | Suggested column placement |
| translate | item_id, audience | Stakeholder-appropriate description |
| generate_changelog | item_ids | Formatted changelog entry |

### story-agent Actions

| Action | Input | Output |
|--------|-------|--------|
| write | feature_description | Formatted user story |
| map | story_id | Suggested backbone placement |
| scope | story_ids | MVP line recommendation |
| estimate | story_id | T-shirt size with rationale |

---

## 16-Summary

| Component | Status | Priority |
|-----------|--------|----------|
| NowNextLater Screen | Core | P0 |
| StoryMap Screen | Core | P0 |
| Executive View | Essential | P1 |
| Engineering View | Essential | P1 |
| Sales View | Essential | P1 |
| Customer View | Essential | P1 |
| Portfolio View | Advanced | P2 |
| RoadmapAgent | Core | P1 |
| StoryAgent | Core | P1 |

| Integration | Connection |
|-------------|------------|
| CustomerJourney → StoryMap | Pain points become stories |
| StoryMap → NowNextLater | Stories populate roadmap |
| NowNextLater → LeanSprint | Committed items enter sprints |
| LeanSprint → Changelog | Shipped items generate updates |

| Key Principle | Implementation |
|---------------|----------------|
| No fixed dates | Time horizons instead |
| Outcome focus | Every item has success metric |
| Stakeholder views | Tailored communication |
| Continuous update | Living document, not static |
| Learning loops | Measure and adapt |
