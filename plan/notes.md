          +I populates structured artifacts. Founders refine.                                                            
      181                                                                                                                
      121 -### Pillar 4: Fundraising Hub                                                                                 
      182 +### Real Example: Idea Validated or Killed                                                                    
      183                                                                                                                
      123 -**Purpose:** Prepare founders for fundraising with investor-grade materials and process management.           
      184 +**Scenario:** Emma has a fintech idea for SMB inventory financing.                                            
      185                                                                                                                
      125 -| Component | Purpose | Key Output |                                                                          
      126 -|-----------|---------|------------|                                                                          
      127 -| **Pitch Deck Builder** | Create investor-ready deck | 10-slide presentation |                               
      128 -| **One-Pager Generator** | Concise company overview | 1-page PDF |                                           
      129 -| **Investor CRM** | Track outreach and pipeline | Deal pipeline with stages |                                
      130 -| **Readiness Checker** | Score fundraising preparedness | Readiness score + gaps |                           
      131 -| **Data Room Builder** | Organize due diligence materials | Structured document set |                        
      186 +```                                                                                                           
      187 +Day 1: Chat onboarding                                                                                        
      188 +├── Emma: "I want to help restaurants avoid food waste"                                                       
      189 +├── Amo: "Tell me about a specific restaurant's problem"                                                      
      190 +├── Emma: Describes owner who lost $3K last month to spoilage                                                 
      191 +└── Output: Problem clarity 72%                                                                               
      192                                                                                                                
      133 -**Investor Readiness Score Components:**                                                                      
      134 -| Factor | Weight | What It Measures |                                                                        
      135 -|--------|--------|------------------|                                                                        
      136 -| Problem clarity | 15% | Can you articulate the pain? |                                                      
      137 -| Traction evidence | 25% | Do you have growth data? |                                                        
      138 -| Team strength | 15% | Relevant experience? |                                                                
      139 -| Market size | 15% | Is the opportunity big enough? |                                                        
      140 -| Competitive position | 15% | Why you vs. alternatives? |                                                    
      141 -| Financial clarity | 15% | Unit economics, use of funds |                                                    
      193 +Day 2: Canvas generation                                                                                      
      194 +├── Amo: Auto-fills canvas from conversation                                                                  
      195 +├── Emma: Refines customer segment to "restaurants <$2M revenue"                                              
      196 +└── Output: Lean Canvas v1, 5 assumptions extracted                                                           
      197                                                                                                                
      143 -**Real-World Example:**                                                                                       
      144 -> Alex's Readiness Checker shows 68%—not ready. Gaps: "Traction slide shows signups but not retention"        
          -and "No clear use of funds breakdown." The system compares Alex's deck to 50+ successful seed decks in        
          -its library and notes: "Top fintech seed decks include cohort retention charts—yours has none." Alex ad       
          -ds a retention chart and use-of-funds breakdown. Score jumps to 84%. The Investor CRM surfaces 12 finte       
          -ch-focused angels who invested at his stage.                                                                  
      198 +Day 7: Highest-risk assumption                                                                                
      199 +├── Assumption: "Owners will pay $200/mo to reduce 20% waste"                                                 
      200 +├── Amo: Suggests landing page test                                                                           
      201 +├── Emma: Runs ad campaign, 47 signups, 3 willing to pay                                                      
      202 +└── Output: Validated (6.4% conversion)                                                                       
      203                                                                                                                
      204 +Day 14: Decision point                                                                                        
      205 +├── Amo: "Problem validated. Ready to scope MVP?"                                                             
      206 +├── Emma: Yes                                                                                                 
      207 +└── Output: MVP scope with 3 core features                                                                    
      208 +```                                                                                                           
      209 +                                                                                                              
      210 +**Outcome:** Idea validated in 2 weeks. Emma avoided building the wrong product.                              
      211 +                                                                                                              
      212  ---                                                                                                           
      213                                                                                                                
      148 -## AI Expert Agents                                                                                           
      214 +## 4. Onboarding via Chat (Primary Flow)                                                                      
      215                                                                                                                
      150 -StartupAI's AI agents are not generic assistants—they are domain experts who retrieve evidence before a       
          -dvising.                                                                                                      
      216 +### How Day 1 Works                                                                                           
      217                                                                                                                
      152 -### Agent Roster                                                                                              
      218 +```                                                                                                           
      219 +┌─────────────────────────────────────────────────────────────────────────┐                                   
      220 +│                        FOUNDER'S FIRST 10 MINUTES                        │                                  
      221 +├─────────────────────────────────────────────────────────────────────────┤                                   
      222 +│                                                                          │                                  
      223 +│  [OAuth Login] → [Chat Window Opens]                                     │                                  
      224 +│                                                                          │                                  
      225 +│  Amo: "Hey! I'm Amo, your startup copilot. What are you building?"      │                                   
      226 +│                                                                          │                                  
      227 +│  Founder: "An app to help restaurants reduce food waste"                 │                                  
      228 +│                                                                          │                                  
      229 +│  Amo: "Got it. Restaurant food waste is a $40B problem.                  │                                  
      230 +│        Who specifically are you targeting?"                              │                                  
      231 +│                                                                          │                                  
      232 +│  Founder: "Independent restaurants with under $2M revenue"               │                                  
      233 +│                                                                          │                                  
      234 +│  Amo: "Perfect early adopter segment. What have you tried so far?"      │                                   
      235 +│                                                                          │                                  
      236 +│  Founder: "Just talking to a few owners"                                │                                   
      237 +│                                                                          │                                  
      238 +│  Amo: "Here's what I've captured. Check if this is right."              │                                   
      239 +│        [Shows: Startup Profile Card]                                     │                                  
      240 +│        - Problem: Food waste in independent restaurants                  │                                  
      241 +│        - Customer: Restaurant owners <$2M revenue                        │                                  
      242 +│        - Stage: Idea (3 interviews)                                      │                                  
      243 +│        - Industry: Restaurant Tech                                       │                                  
      244 +│                                                                          │                                  
      245 +│  Amo: "I've assigned you the Restaurant Tech playbook.                   │                                  
      246 +│        Tomorrow, I'll ask about your problem hypothesis.                 │                                  
      247 +│        For now, your one task: [Interview 2 more restaurant owners]"    │                                   
      248 +│                                                                          │                                  
      249 +└─────────────────────────────────────────────────────────────────────────┘                                   
      250 +```                                                                                                           
      251                                                                                                                
      154 -| Agent | Expertise | Model | Key Capabilities |                                                              
      155 -|-------|-----------|-------|------------------|                                                              
      156 -| **Onboarding Orchestrator** | Founder setup | Gemini 3 Flash | Profile extraction, industry matching        
          -|                                                                                                             
      157 -| **Smart Interviewer** | Customer discovery | Claude Sonnet 4.5 | Jobs-to-be-done, The Mom Test |            
      158 -| **Lean Canvas Expert** | Business modeling | Gemini 3 Pro | All 9 blocks, pattern detection |               
      159 -| **GTM Strategist** | Go-to-market | Gemini 3 Pro | ICP, channels, pricing |                                 
      160 -| **Pitch Deck Expert** | Investor materials | Claude Sonnet 4.5 | Deck review, narrative arc |               
      161 -| **Fundraising Advisor** | Raising capital | Claude Sonnet 4.5 | Readiness, targeting, terms |               
      162 -| **Stage Advisor** | Stage transitions | Gemini 3 Pro | Gate criteria, milestone planning |                  
      252 +### What Chat Asks (Progressive, Not Overwhelming)                                                            
      253                                                                                                                
      164 -### What Makes Agents "Expert"                                                                                
      254 +| Turn | Question | Purpose | Auto-Fills |                                                                    
      255 +|------|----------|---------|------------|                                                                    
      256 +| 1 | "What are you building?" | Core idea | startup.description |                                            
      257 +| 2 | "Who is it for?" | Customer segment | canvas.customer_segments |                                        
      258 +| 3 | "What's the problem you're solving?" | Problem clarity | canvas.problem |                               
      259 +| 4 | "How far along are you?" | Stage detection | startup.stage |                                            
      260 +| 5 | "What's your background?" | Founder context | profile.background |                                      
      261                                                                                                                
      166 -| Capability | How It Works |                                                                                 
      167 -|------------|--------------|                                                                                 
      168 -| **Citation-backed answers** | Every claim references a source (document + section) |                        
      169 -| **Comparative reasoning** | Answers reference industry benchmarks |                                         
      170 -| **Stage-appropriate advice** | Pre-seed advice differs from Series A advice |                               
      171 -| **Industry-specific knowledge** | Fintech advice differs from fashion advice |                              
      172 -| **Hallucination prevention** | AI says "I don't have data on X" when appropriate |                          
      262 +**Maximum 5 questions.** Then AI shows what it captured and asks for corrections.                             
      263                                                                                                                
      174 -### Agent Behavior by Stage                                                                                   
      264 +### How Chat Fills Structured Data                                                                            
      265                                                                                                                
      176 -| Stage | Tone | Allowed Topics | Forbidden Topics |                                                          
      177 -|-------|------|----------------|------------------|                                                          
      178 -| Idea | Exploratory | Problem refinement, interviews | Building, scaling |                                   
      179 -| Validate | Coaching | Experiment design, interviews | MVP scope, hiring |                                   
      180 -| MVP | Directive | Scope cutting, sprint planning | Marketing spend |                                        
      181 -| GTM | Tactical | Pricing, channel testing | Scaling, optimization |                                         
      182 -| Traction | Data-driven | Funnel optimization, OMTM | Expansion |                                            
      183 -| Scale | Strategic | Growth playbooks, hiring | Premature diversification |                                  
      266 +| Chat Input | Structured Output |                                                                            
      267 +|------------|-------------------|                                                                            
      268 +| "An app to help restaurants reduce food waste" | startup.description, canvas.problem |                      
      269 +| "Independent restaurants under $2M" | canvas.customer_segments, startup.industry |                          
      270 +| "Just talking to a few owners" | startup.stage = "Idea" |                                                   
      271 +| "I'm a former restaurant manager" | profile.background, startup.unfair_advantage |                          
      272                                                                                                                
      185 -**Forbidden = AI actively redirects:**                                                                        
      186 -> "Before we discuss scaling, let's ensure you've hit 40% 'very disappointed' on the Sean Ellis survey.       
          - Right now, focus on retention."                                                                              
      273 +### When UI Appears                                                                                           
      274                                                                                                                
      188 ----                                                                                                           
      275 +| Trigger | UI Shown | Why |                                                                                  
      276 +|---------|----------|-----|                                                                                  
      277 +| "Show me my canvas" | Lean Canvas editor | Visual arrangement preferred |                                   
      278 +| "Create my pitch deck" | Deck builder | Slide editing is visual |                                           
      279 +| "Show my pipeline" | CRM Kanban | Deal stages are visual |                                                  
      280 +| Stage changes | Dashboard with milestone | Celebration moment |                                             
      281                                                                                                                
      190 -## Industry Playbooks                                                                                         
      282 +**Default:** Chat. UI only when visual is better.                                                             
      283                                                                                                                
      192 -### Overview                                                                                                  
      284 +---                                                                                                           
      285                                                                                                                
      194 -19 industry playbooks provide tailored guidance. Each contains 10 knowledge categories that get injecte       
          -d into AI prompts based on context.                                                                           
      286 +## 5. Founder Roadmap & Startup Stages                                                                        
      287                                                                                                                
      196 -### Playbook List                                                                                             
      288 +### Simplified Stage Model (5 Stages, Not 10)                                                                 
      289                                                                                                                
      198 -| # | Industry | Key Differentiators |                                                                        
      199 -|---|----------|---------------------|                                                                        
      200 -| 1 | AI SaaS / B2B | PLG vs sales-led, seat-based pricing |                                                  
      201 -| 2 | FinTech | Compliance, trust, regulatory gates |                                                         
      202 -| 3 | Healthcare | FDA/HIPAA, clinical validation |                                                           
      203 -| 4 | Retail & eCommerce | CAC/LTV, inventory, fulfillment |                                                  
      204 -| 5 | Cybersecurity | Enterprise sales, compliance buyers |                                                   
      205 -| 6 | Logistics & Supply Chain | Long sales cycles, integration |                                             
      206 -| 7 | Education | Learning outcomes, completion rates |                                                       
      207 -| 8 | Legal / Professional Services | Billable hour models, risk aversion |                                   
      208 -| 9 | Financial Services | Trust, security, regulatory |                                                      
      209 -| 10 | Sales & Marketing AI | Attribution, ROI measurement |                                                  
      210 -| 11 | CRM & Social Media AI | Network effects, data moats |                                                  
      211 -| 12 | Events Management | Seasonality, platform dynamics |                                                   
      212 -| 13 | eCommerce (Pure-Play) | Margins, customer acquisition |                                                
      213 -| 14 | Travel & Hospitality | Inventory perishability, OTAs |                                                 
      214 -| 15 | Fashion & Apparel AI | Trend sensitivity, inventory risk |                                             
      215 -| 16 | Photography & Visual Production AI | Creative workflows, licensing |                                   
      216 -| 17 | Video Production AI | Production pipelines, rights |                                                   
      217 -| 18 | Content Marketing AI | Distribution, measurement |                                                     
      218 -| 19 | Social Media Marketing AI | Platform algorithms, engagement |                                          
      290 +| Stage | Question | Duration | Key Metric | AI Focus |                                                       
      291 +|-------|----------|----------|------------|----------|                                                       
      292 +| **1. Idea** | Is the problem real? | 1-4 weeks | Problem clarity score | Sharpen problem, identify cu       
          +stomers |                                                                                                     
      293 +| **2. Validation** | Will people pay? | 4-8 weeks | Willingness to pay % | Design experiments, analyze       
          + results |                                                                                                    
      294 +| **3. MVP** | Can we deliver value? | 4-12 weeks | First 10 users | Scope cutting, build priorities |        
      295 +| **4. Traction** | Is it growing? | 8-16 weeks | WoW growth rate | Bottleneck detection, channel testi       
          +ng |                                                                                                          
      296 +| **5. Fundraising** | Can we raise? | 4-12 weeks | Investor meetings | Deck optimization, pipeline man       
          +agement |                                                                                                     
      297                                                                                                                
      220 -### Knowledge Categories Per Playbook                                                                         
      298 +### What Founder Focuses On (Per Stage)                                                                       
      299                                                                                                                
      222 -| Category | Purpose | Example (Fintech) |                                                                    
      223 -|----------|---------|-------------------|                                                                    
      224 -| **Investor Expectations** | What VCs look for | "Show path to banking license or partnership" |             
      225 -| **Failure Patterns** | Common mistakes | "Underestimating compliance costs by 3-5x" |                       
      226 -| **Success Stories** | Patterns that worked | "Plaid's developer-first approach" |                           
      227 -| **Benchmarks** | Industry KPIs | "Good CAC payback: <12 months" |                                           
      228 -| **Terminology** | Language to use | "Say 'AUM' not 'money managed'" |                                       
      229 -| **GTM Patterns** | Strategies that work | "Partner with existing banks initially" |                         
      230 -| **Decision Frameworks** | If X then Y logic | "If B2B: compliance first, then features" |                   
      231 -| **Investor Questions** | Exact questions + answers | "How do you handle PCI compliance?" |                  
      232 -| **Warning Signs** | Red flags to watch | "Churn >5% monthly in fintech = trouble" |                         
      233 -| **Stage Checklists** | Tasks before each raise | "Pre-seed: LOIs from 3 potential customers" |              
      300 +| Stage | Founder Focus | NOT Focus |                                                                         
      301 +|-------|---------------|-----------|                                                                         
      302 +| **Idea** | Talking to customers | Building product |                                                        
      303 +| **Validation** | Running experiments | Scaling |                                                            
      304 +| **MVP** | Shipping to 10 users | Feature polish |                                                           
      305 +| **Traction** | Growth experiments | Fundraising |                                                           
      306 +| **Fundraising** | Investor meetings | Product expansion |                                                   
      307                                                                                                                
      235 -### Context Injection                                                                                         
      308 +### What AI Does (Per Stage)                                                                                  
      309                                                                                                                
      237 -Different features receive different playbook categories:                                                     
      310 +| Stage | AI Actions |                                                                                        
      311 +|-------|------------|                                                                                        
      312 +| **Idea** | Extract problem from conversations, suggest interview questions, score clarity |                 
      313 +| **Validation** | Design experiments, calculate significance, recommend pivot/persevere |                    
      314 +| **MVP** | RICE scoring, scope cutting, sprint planning |                                                    
      315 +| **Traction** | Identify OMTM, find bottlenecks, suggest channel experiments |                               
      316 +| **Fundraising** | Deck review, investor matching, objection prep |                                          
      317                                                                                                                
      239 -| Feature | Categories Injected |                                                                             
      240 -|---------|---------------------|                                                                             
      241 -| Onboarding | failure_patterns, terminology |                                                                
      242 -| Lean Canvas | gtm_patterns, benchmarks |                                                                    
      243 -| Pitch Deck | investor_expectations, success_stories, investor_questions |                                   
      244 -| Validation | benchmarks, warning_signs, failure_patterns |                                                  
      245 -| GTM Planning | gtm_patterns, decision_frameworks |                                                          
      246 -| Fundraising | investor_expectations, stage_checklists |                                                     
      247 -| Chat (Atlas) | All 10 categories |                                                                          
      318 +### Outputs Generated (Per Stage)                                                                             
      319                                                                                                                
      320 +| Stage | Documents | Metrics | Tasks |                                                                       
      321 +|-------|-----------|---------|-------|                                                                       
      322 +| **Idea** | Problem hypothesis, interview scripts | Clarity score | Interview 10 customers |                 
      323 +| **Validation** | Experiment specs, results log | Conversion rates | Run 3 experiments |                     
      324 +| **MVP** | Feature list, sprint plan | User count | Ship MVP by date |                                       
      325 +| **Traction** | Growth playbook, channel analysis | WoW growth, churn | Test 2 channels |                    
      326 +| **Fundraising** | Pitch deck, one-pager, data room | Meetings, term sheets | Meet 20 investors |            
      327 +                                                                                                              
      328  ---                                                                                                           
      329                                                                                                                
      251 -## Vector Knowledge System                                                                                    
      330 +## 6. AI-Enabled Planning System                                                                              
      331                                                                                                                
      253 -### Why Vectors Matter                                                                                        
      332 +### How Strategy Becomes Tasks                                                                                
      333                                                                                                                
      255 -Vectors transform AI from generic chatbot to grounded expert. Instead of generating responses from trai       
          -ning data, AI retrieves relevant passages from your knowledge libraries and cites them.                       
      334 +```                                                                                                           
      335 +STRATEGY (Lean Canvas)                                                                                        
      336 +    ↓                                                                                                         
      337 +ROADMAP (Now / Next / Later)                                                                                  
      338 +    ↓                                                                                                         
      339 +MILESTONES (Monthly goals)                                                                                    
      340 +    ↓                                                                                                         
      341 +WEEKLY PLAN (Focus areas)                                                                                     
      342 +    ↓                                                                                                         
      343 +DAILY TASKS (Specific actions)                                                                                
      344 +```                                                                                                           
      345                                                                                                                
      257 -| Without Vectors | With Vectors |                                                                            
      258 -|-----------------|--------------|                                                                            
      259 -| "Market size seems good" | "According to the 2025 Fintech Market Report, SMB payments is a $47B TAM g       
          -rowing at 12% CAGR [source: doc_123, section 3]" |                                                            
      260 -| "Your deck looks fine" | "Compared to 50 seed decks in our library, your traction slide is missing co       
          -hort retention—82% of funded decks include this [source: deck_library]" |                                     
      261 -| "Investors might ask about..." | "Based on 15 real investor objections in similar raises, expect push       
          -back on customer acquisition cost [source: feedback_library]" |                                               
      346 +### Planning Logic                                                                                            
      347                                                                                                                
      263 -### Knowledge Libraries                                                                                       
      348 +| Layer | Source | AI Role | Human Role |                                                                     
      349 +|-------|--------|---------|------------|                                                                     
      350 +| **Strategy** | Lean Canvas + Stage | Validates assumptions | Defines vision |                               
      351 +| **Roadmap** | Stage + Industry playbook | Suggests milestones | Prioritizes |                               
      352 +| **Milestones** | Roadmap + Metrics | Proposes targets | Approves |                                          
      353 +| **Weekly** | Milestones + Capacity | Selects focus | Adjusts |                                              
      354 +| **Daily** | Weekly + Context | Generates tasks | Executes |                                                 
      355                                                                                                                
      265 -| Library | Content | Purpose |                                                                               
      266 -|---------|---------|---------|                                                                               
      267 -| **Industry Research** | Market reports, benchmarks, regulations | Ground advice in real data |              
      268 -| **Pitch Deck Benchmarks** | 50+ winning decks, slide-level chunks | Compare founder decks to patterns       
          - |                                                                                                            
      269 -| **Investor Feedback** | Objection patterns, pass reasons | Anticipate investor questions |                  
      270 -| **Decision Outcomes** | Pivots, results, failures | Learn from what worked |                                
      356 +### How Plans Evolve Automatically                                                                            
      357                                                                                                                
      272 -### How Retrieval Works                                                                                       
      358 +| Trigger | Plan Update |                                                                                     
      359 +|---------|-------------|                                                                                     
      360 +| Experiment invalidates assumption | Pivot suggestion, updated roadmap |                                     
      361 +| Metric hits threshold | Stage advancement, new milestones |                                                 
      362 +| Task overdue | Re-prioritization, scope adjustment |                                                        
      363 +| New customer feedback | Assumption re-evaluation |                                                          
      364                                                                                                                
      274 -1. **User asks question** → "Is my traction slide strong enough?"                                             
      275 -2. **Query embedded** → Convert question to vector                                                            
      276 -3. **Semantic search** → Find 10-15 most relevant chunks                                                      
      277 -4. **Context assembly** → Combine retrieved passages                                                          
      278 -5. **AI reasoning** → Generate response with retrieved context                                                
      279 -6. **Citation output** → Include source references                                                            
      365 +### Human Control Points                                                                                      
      366                                                                                                                
      281 -### When to Use Each Method                                                                                   
      367 +| Decision | Human Must Approve |                                                                             
      368 +|----------|-------------------|                                                                              
      369 +| Stage change | Yes |                                                                                        
      370 +| Pivot | Yes |                                                                                               
      371 +| Major scope change | Yes |                                                                                  
      372 +| Task creation | No (AI creates, human reviews) |                                                            
      373 +| Task completion | Human marks done |                                                                        
      374                                                                                                                
      283 -| Question Type | Retrieval Method |                                                                          
      284 -|---------------|------------------|                                                                          
      285 -| "What are trends in fintech?" | Vector → Industry library |                                                 
      286 -| "Is my traction slide good?" | Vector → Deck benchmarks |                                                   
      287 -| "What did investor X say?" | SQL → CRM notes |                                                              
      288 -| "My ARR growth rate?" | SQL → Startup metrics |                                                             
      289 -| "Recent funding news?" | Web search → External APIs |                                                       
      290 -                                                                                                              
      375  ---                                                                                                           
      376                                                                                                                
      293 -## 10-Stage Lifecycle                                                                                         
      377 +## 7. MVP: What Actually Matters                                                                              
      378                                                                                                                
      295 -### Stage Definitions                                                                                         
      379 +### Not Features. Outcomes.                                                                                   
      380                                                                                                                
      297 -| # | Stage | Question Answered | Key Proof Required |                                                        
      298 -|---|-------|-------------------|-------------------|                                                         
      299 -| 1 | **Idea & Vision** | What problem? | Problem clarity ≥70% |                                              
      300 -| 2 | **Market Discovery** | Is there demand? | Supply-Demand matrix complete |                               
      301 -| 3 | **Strategy & Readiness** | Are we ready? | SWOT analysis complete |                                     
      302 -| 4 | **Problem-Solution Fit** | Does solution fit? | 10+ interviews, problem validated |                     
      303 -| 5 | **Product Build (MVP)** | Can we build it? | MVP shipped to real users |                                
      304 -| 6 | **Go-To-Market** | Can we sell it? | First 10 paying customers |                                        
      305 -| 7 | **Traction & Optimization** | Is it growing? | OMTM improving, churn <10% |                             
      306 -| 8 | **Scale** | Can we scale it? | Repeatable growth loop, team >5 |                                        
      307 -| 9 | **Fundraising** | Can we fund it? | Term sheet or profitability |                                       
      308 -| 10 | **Maturity** | What's next? | New market/product launched |                                            
      381 +| Outcome | Matters Because | How to Measure |                                                                
      382 +|---------|-----------------|----------------|                                                                
      383 +| **Problem confirmed** | Building for real pain | 10+ people describe same problem |                         
      384 +| **Solution resonates** | Product idea connects | 70%+ say "I'd use that" |                                  
      385 +| **Willing to pay** | Business viable | 5%+ pre-order/signup |                                               
      386 +| **Can deliver value** | Execution capability | 10 users get promised outcome |                              
      387 +| **Repeatable acquisition** | Growth possible | CAC < LTV, one channel works |                               
      388                                                                                                                
      310 -### Stage Detection Logic                                                                                     
      389 +### What Founders Must Learn Fast                                                                             
      390                                                                                                                
      312 -The system detects your real stage from evidence, not self-reporting.                                         
      391 +1. **Is the problem real?** — Not "do people have this problem" but "is it painful enough to pay?"            
      392 +2. **Am I talking to the right people?** — Early adopters, not mainstream                                     
      393 +3. **What's the minimum to deliver value?** — Not minimum features, minimum value                             
      394 +4. **Can I reach these people?** — At least one scalable channel                                              
      395 +5. **Will they pay what I need?** — Unit economics must work                                                  
      396                                                                                                                
      314 -**Conflict Resolution:**                                                                                      
      315 -| Founder Says | System Detects | Resolution |                                                                
      316 -|--------------|----------------|------------|                                                                
      317 -| Scale | Traction (12% churn) | Use Traction, show warning |                                                 
      318 -| PSF | GTM (has revenue) | Use GTM, celebrate progress |                                                     
      319 -| Any | Unknown (no data) | Use founder's choice, prompt data |                                               
      397 +### Signals That Matter                                                                                       
      398                                                                                                                
      321 -**Rule:** When in doubt, use the lower stage. Premature advancement kills startups; delayed advancement       
          - just slows them.                                                                                             
      399 +| Signal | Strong | Weak |                                                                                    
      400 +|--------|--------|------|                                                                                    
      401 +| **Problem interview** | "I've tried 3 solutions and still frustrated" | "Yeah, that's annoying I gues       
          +s" |                                                                                                          
      402 +| **Solution resonance** | "When can I use this?" | "That sounds cool" |                                      
      403 +| **Willingness to pay** | "Here's my credit card" | "I'd probably pay something" |                           
      404 +| **Referrals** | "I know 5 people who need this" | "Maybe some friends" |                                    
      405                                                                                                                
      323 -### Framework Activation by Stage                                                                             
      406 +### What Should NOT Be Built Yet                                                                              
      407                                                                                                                
      325 -| Stage | Active Frameworks | Locked Frameworks |                                                             
      326 -|-------|-------------------|-------------------|                                                             
      327 -| Idea | Lean Canvas (Problem, Segments only) | All others |                                                  
      328 -| Market Discovery | Supply-Demand Matrix, Competitor Analysis | Traction tools |                             
      329 -| Strategy | SWOT, Risk Board, Full Lean Canvas | MVP Planner |                                               
      330 -| PSF | Customer Canvas, Experiment Lab | MVP Planner (view only) |                                           
      331 -| MVP | MVP Planner, Sprint System | Scale tools |                                                            
      332 -| GTM | Channels, Pricing, Basic Analytics | Scale optimization |                                             
      333 -| Traction | Full Analytics, Customer Factory | Scale expansion |                                             
      334 -| Scale+ | All frameworks unlocked | None |                                                                   
      408 +| Avoid | Why |                                                                                               
      409 +|-------|-----|                                                                                               
      410 +| **Admin panels** | You can use Supabase dashboard |                                                         
      411 +| **Payment flows** | Collect manually first |                                                                
      412 +| **Multi-tenancy** | You're the only customer |                                                              
      413 +| **Mobile apps** | Web works on mobile |                                                                     
      414 +| **Integrations** | Zapier can bridge |                                                                      
      415 +| **Analytics dashboards** | Spreadsheet is fine |                                                            
      416                                                                                                                
      336 -**Locked Framework Behavior:**                                                                                
      337 -- Greyed out in navigation                                                                                    
      338 -- Click shows: "Complete [requirement] to unlock"                                                             
      339 -- AI refuses to provide advice for locked stages                                                              
      417 +### StartupAI Features by Priority                                                                            
      418                                                                                                                
      419 +| Priority | Feature | Why |                                                                                  
      420 +|----------|---------|-----|                                                                                  
      421 +| **P0** | Chat that takes action | Core value prop |                                                         
      422 +| **P0** | Lean Canvas with AI assist | Business model clarity |                                              
      423 +| **P0** | Problem validation scoring | Prevent building wrong thing |                                        
      424 +| **P1** | Experiment lab | Structured validation |                                                           
      425 +| **P1** | Pitch deck generator | Fundraising essential |                                                     
      426 +| **P1** | Task management | Execution tracking |                                                             
      427 +| **P2** | Investor CRM | Fundraising support |                                                               
      428 +| **P2** | Industry playbooks | Contextual guidance |                                                         
      429 +| **P3** | Vector RAG | Expert-grade retrieval |                                                              
      430 +| **P3** | Team collaboration | Multi-founder support |                                                       
      431 +                                                                                                              
      432  ---                                                                                                           
      433                                                                                                                
      343 -## Prompt Packs                                                                                               
      434 +## 8. AI Agents Strategy                                                                                      
      435                                                                                                                
      345 -### Overview                                                                                                  
      436 +### Current Agents (19 Deployed)                                                                              
      437                                                                                                                
      347 -19 prompt packs encode expert workflows into repeatable sequences. Each pack guides founders through mu       
          -lti-step processes.                                                                                           
      438 +| Agent | Current Function | Status |                                                                         
      439 +|-------|------------------|--------|                                                                         
      440 +| `ai-chat` | Atlas chatbot, streaming | Complete |                                                           
      441 +| `onboarding-agent` | 4-step wizard extraction | Complete |                                                  
      442 +| `lean-canvas-agent` | Canvas AI, 10 actions | Complete |                                                    
      443 +| `pitch-deck-agent` | Deck builder, 17 actions | Complete |                                                  
      444 +| `crm-agent` | CRM operations, 13 actions | Complete |                                                       
      445 +| `investor-agent` | Fundraising, 12 mutations | Complete |                                                   
      446 +| `task-agent` | Task generation/prioritization | Complete |                                                  
      447 +| `documents-agent` | Doc generation/analysis | Complete |                                                    
      448 +| `workflow-trigger` | 18 automation rules | Complete |                                                       
      449 +| `health-scorer` | 6-dimension scoring | Complete |                                                          
      450 +| `stage-analyzer` | Stage detection/guidance | Complete |                                                    
      451 +| `prompt-pack` | Pack search/run/apply | Complete |                                                          
      452 +| `industry-expert-agent` | Context injection | Complete |                                                    
      453 +| `compute-daily-focus` | Daily signal-based scoring | Complete |                                             
      454 +| `event-agent` | Event management | Complete |                                                               
      455 +| `insights-generator` | Data-driven insights | Complete |                                                    
      456 +| `action-recommender` | Smart action suggestions | Complete |                                                
      457                                                                                                                
      349 -### Pack List                                                                                                 
      458 +### Ideal Agent Architecture (Simplified)                                                                     
      459                                                                                                                
      351 -| Pack | Stage | Purpose | Steps |                                                                            
      352 -|------|-------|---------|-------|                                                                            
      353 -| PP-01 Market Reality Evaluator | Market Discovery | Assess demand | 4 |                                     
      354 -| PP-02 Customer Definition | PSF | Build psychographic profiles | 5 |                                        
      355 -| PP-03 Value Proposition Generator | Strategy | Craft compelling UVP | 3 |                                   
      356 -| PP-04 Competitive Wedge Finder | Strategy | Find differentiation | 3 |                                      
      357 -| PP-05 GTM Mode Selector | GTM | Choose acquisition strategy | 2 |                                           
      358 -| PP-06 MVP Feature Prioritizer | MVP | RICE scoring, scope cutting | 4 |                                     
      359 -| PP-07 Validation Script Generator | PSF | Create interview scripts | 2 |                                    
      360 -| PP-08 Feedback Synthesizer | Traction | Extract patterns | 2 |                                              
      361 -| PP-09 Financial Model Builder | Fundraising | Unit economics | 2 |                                          
      362 -| PP-10 Pitch Deck Optimizer | Fundraising | Narrative alignment | 1 |                                        
      460 +**4 Core Agent Types (Not 8)**                                                                                
      461                                                                                                                
      364 -### Pack Routing                                                                                              
      462 +| Type | Role | Examples |                                                                                    
      463 +|------|------|----------|                                                                                    
      464 +| **Orchestrator** | Routes requests, coordinates | Atlas (main chat) |                                       
      465 +| **Doer** | Executes actions, CRUD | CRM, Task, Canvas, Deck |                                               
      466 +| **Analyst** | Scores, analyzes, recommends | Health, Stage, Insights |                                      
      467 +| **Generator** | Creates content, documents | Pitch deck, emails, reports |                                  
      468                                                                                                                
      366 -Packs are triggered automatically based on context:                                                           
      469 +### MVP Agents (Minimum Set)                                                                                  
      470                                                                                                                
      368 -| Trigger Event | Pack Activated |                                                                            
      369 -|---------------|----------------|                                                                            
      370 -| Profile creation | PP-01 (Market Reality) |                                                                 
      371 -| Lean Canvas: Customer Segment filled (vague) | PP-02 (Customer Definition) |                                
      372 -| Lean Canvas: UVP filled (generic) | PP-03 (Value Proposition) |                                             
      373 -| SWOT complete | PP-04 (Competitive Wedge) |                                                                 
      374 -| Assumption prioritized | PP-07 (Validation Script) |                                                        
      375 -| Gate 4 passed (→ MVP) | PP-06 (Feature Prioritizer) |                                                       
      376 -| Gate 5 passed (→ GTM) | PP-05 (GTM Mode) |                                                                  
      377 -| Feedback logged | PP-08 (Feedback Synthesizer) |                                                            
      378 -| Fundraising flag = true | PP-09 + PP-10 |                                                                   
      471 +| Agent | Purpose | Actions |                                                                                 
      472 +|-------|---------|---------|                                                                                 
      473 +| **Atlas** | Main chat orchestrator | Route, context, memory |                                               
      474 +| **Canvas Agent** | Lean Canvas operations | Fill blocks, extract assumptions, score |                       
      475 +| **Task Agent** | Task management | Create, prioritize, assign |                                             
      476 +| **Deck Agent** | Pitch deck generation | Generate slides, optimize narrative |                              
      477                                                                                                                
      380 ----                                                                                                           
      478 +### Advanced Agents (Add Later)                                                                               
      479                                                                                                                
      382 -## Real-World Use Cases                                                                                       
      480 +| Agent | Purpose | When to Add |                                                                             
      481 +|-------|---------|-------------|                                                                             
      482 +| **Investor Agent** | Fundraising support | When users reach Fundraising stage |                             
      483 +| **CRM Agent** | Contact/deal management | When users have 20+ contacts |                                    
      484 +| **Experiment Agent** | Validation lab | When validation features mature |                                   
      485 +| **RAG Retriever** | Vector search | When knowledge library grows |                                          
      486                                                                                                                
      384 -### Use Case 1: First-Time Founder Validates Idea                                                             
      487 +### Agent Triggers                                                                                            
      488                                                                                                                
      386 -**Persona:** Emma, product manager with fintech idea                                                          
      489 +| Trigger | Agent | Action |                                                                                  
      490 +|---------|-------|--------|                                                                                  
      491 +| User types in chat | Atlas | Route to appropriate agent |                                                   
      492 +| Canvas block edited | Canvas Agent | Validate, suggest improvements |                                       
      493 +| Task marked complete | Task Agent | Generate next task suggestions |                                        
      494 +| Stage threshold met | Stage Analyzer | Notify, unlock features |                                            
      495 +| Health score drops | Health Scorer | Surface warning, suggest actions |                                     
      496                                                                                                                
      388 -**Journey:**                                                                                                  
      389 -1. **Onboarding (Day 1):** Emma pastes LinkedIn, AI classifies her as Fintech, assigns playbook               
      390 -2. **Problem Discovery:** AI asks targeted questions, problem clarity reaches 78%                             
      391 -3. **Lean Canvas (Day 2-3):** AI guides each block, injects fintech benchmarks                                
      392 -4. **Risk Board:** 5 assumptions extracted, top risk: "SMBs will pay $50/month"                               
      393 -5. **Experiment Lab (Week 1-2):** Designs landing page test, 23% signup conversion                            
      394 -6. **Validation:** Assumption validated, MVP Planner unlocks                                                  
      395 -7. **MVP Build (Week 3-6):** Ships concierge version to 10 customers                                          
      497 +---                                                                                                           
      498                                                                                                                
      397 -**Outcome:** Emma spent 6 weeks validating before building, avoided the #1 startup mistake.                   
      499 +## 9. Playbooks, Prompt Packs & Guides                                                                        
      500                                                                                                                
      399 ----                                                                                                           
      501 +### Current State                                                                                             
      502                                                                                                                
      401 -### Use Case 2: Serial Founder Prepares for Fundraising                                                       
      503 +| Asset | Count | Purpose |                                                                                   
      504 +|-------|-------|---------|                                                                                   
      505 +| **Industry Playbooks** | 19 | Industry-specific knowledge (10 categories each) |                            
      506 +| **Prompt Packs** | 28 | Multi-step workflows |                                                              
      507 +| **Guides** | 14 | Reference documentation |                                                                 
      508                                                                                                                
      403 -**Persona:** James, second-time founder with $40K MRR                                                         
      509 +### Where They Create Friction                                                                                
      510                                                                                                                
      405 -**Journey:**                                                                                                  
      406 -1. **Readiness Check:** Score 72%—gaps in competitive positioning and use of funds                            
      407 -2. **Pitch Deck Review:** AI compares to benchmark library, notes missing retention cohorts                   
      408 -3. **Investor CRM:** Surfaces 15 relevant investors from database                                             
      409 -4. **Objection Prep:** Based on investor feedback library, prepares for CAC questions                         
      410 -5. **Due Diligence:** Data Room Builder organizes 23 documents                                                
      511 +| Problem | Impact |                                                                                          
      512 +|---------|--------|                                                                                          
      513 +| **Too many packs** | Founders don't know which to use |                                                     
      514 +| **Separate from chat** | Have to navigate away to access |                                                  
      515 +| **Manual selection** | Founders pick wrong pack for stage |                                                 
      516 +| **Rigid sequences** | Can't skip steps or customize |                                                       
      517                                                                                                                
      412 -**Outcome:** James closes $1.5M seed in 8 weeks, investors cite "unusually prepared."                         
      518 +### How They Should Integrate with Chat                                                                       
      519                                                                                                                
      414 ----                                                                                                           
      520 +**Chat dynamically selects playbooks:**                                                                       
      521                                                                                                                
      416 -### Use Case 3: Accelerator Manages Cohort                                                                    
      522 +```                                                                                                           
      523 +Founder: "How should I price my SaaS product?"                                                                
      524                                                                                                                
      418 -**Persona:** TechStars program manager with 12 startups                                                       
      525 +Amo (internally):                                                                                             
      526 +├── Detect: Industry = AI SaaS                                                                                
      527 +├── Detect: Stage = Validation                                                                                
      528 +├── Load: ai-saas.md → gtm_patterns, benchmarks                                                               
      529 +├── Generate response with industry context                                                                   
      530 +└── Output: Pricing frameworks specific to B2B SaaS                                                           
      531 +```                                                                                                           
      532                                                                                                                
      420 -**Journey:**                                                                                                  
      421 -1. **Portfolio View:** See all startups by stage, with confidence scores                                      
      422 -2. **Batch Ranking:** AI ranks investor-readiness using consistent rubric                                     
      423 -3. **Coaching Priorities:** System surfaces highest-impact interventions per startup                          
      424 -4. **Mentor Matching:** Connects startups with mentors based on industry/stage gaps                           
      425 -5. **Demo Day Prep:** Standardized pitch review across cohort                                                 
      533 +**Prompts become invisible intelligence:**                                                                    
      534                                                                                                                
      427 -**Outcome:** Demo day features 12 investor-ready startups, all with validated assumptions and evidence-       
          -backed decks.                                                                                                 
      535 +| Old Way | New Way |                                                                                         
      536 +|---------|---------|                                                                                         
      537 +| User selects "PP-05 GTM Strategy" | Chat detects GTM question, injects context |                            
      538 +| User follows 3-step sequence | Chat answers with pack knowledge embedded |                                  
      539 +| User completes pack | Chat remembers context for follow-ups |                                               
      540                                                                                                                
      429 ----                                                                                                           
      541 +**Guides evolve as startup grows:**                                                                           
      542                                                                                                                
      431 -## Success Metrics                                                                                            
      543 +| Stage | Active Guides |                                                                                     
      544 +|-------|---------------|                                                                                     
      545 +| **Idea** | Problem validation, customer interviews |                                                        
      546 +| **Validation** | Experiment design, assumption testing |                                                    
      547 +| **MVP** | Feature prioritization, sprint planning |                                                         
      548 +| **Traction** | Growth playbooks, channel testing |                                                          
      549 +| **Fundraising** | Deck templates, investor outreach |                                                       
      550                                                                                                                
      433 -### Founder Success Metrics                                                                                   
      551 +### Simplified Prompt Pack Strategy                                                                           
      552                                                                                                                
      435 -| Metric | Target | Why It Matters |                                                                          
      436 -|--------|--------|----------------|                                                                          
      437 -| Time to first interview | ≤3 days | Fast learning beats slow building |                                     
      438 -| Time to first validation | ≤14 days | Shortened validation cycle |                                          
      439 -| Canvas completion rate | ≥80% within 7 days | Engagement with core framework |                              
      440 -| Experiment completion rate | ≥70% | Active validation |                                                     
      441 -| Weekly engagement | ≥3 sessions | Continuous progress |                                                     
      553 +| Pack Category | When Triggered |                                                                            
      554 +|---------------|----------------|                                                                            
      555 +| **Validation** | Stage = Idea or Validation |                                                               
      556 +| **MVP Scoping** | Stage = MVP |                                                                             
      557 +| **GTM** | Stage = Traction |                                                                                
      558 +| **Fundraising** | Stage = Fundraising |                                                                     
      559                                                                                                                
      443 -### System Success Metrics                                                                                    
      560 +**One pack per stage.** Not 28 options.                                                                       
      561                                                                                                                
      445 -| Metric | Target | Why It Matters |                                                                          
      446 -|--------|--------|----------------|                                                                          
      447 -| Build-before-validate prevention | ≥90% validate first | Prevented waste |                                  
      448 -| Stage progression accuracy | ≥85% stick at stage | System detects correctly |                               
      449 -| AI guidance acceptance | ≥60% acted upon | Advice is valuable |                                             
      450 -| False PMF declarations | 0% | No premature scaling |                                                        
      562 +---                                                                                                           
      563                                                                                                                
      452 -### Anti-Metrics (Avoid Optimizing)                                                                           
      564 +## 10. Vector DB & Memory Strategy                                                                            
      565                                                                                                                
      454 -- Total signups (vanity)                                                                                      
      455 -- Features shipped (output, not outcome)                                                                      
      456 -- AI conversations (quantity ≠ quality)                                                                       
      457 -- Time in platform (engagement theater)                                                                       
      566 +### What Should Be Stored                                                                                     
      567                                                                                                                
      459 ----                                                                                                           
      568 +| Store | Content | Why |                                                                                     
      569 +|-------|---------|-----|                                                                                     
      570 +| **Structured DB** | Entities (contacts, tasks, canvas) | CRUD, relationships, RLS |                         
      571 +| **Chat History** | Conversations | Context accumulation |                                                   
      572 +| **Vector Store** | Industry research, deck benchmarks | Semantic retrieval |                                
      573                                                                                                                
      461 -## Implementation Phases                                                                                      
      574 +### What Should NOT Be Stored (Yet)                                                                           
      575                                                                                                                
      463 -### Phase 1: CORE (Weeks 1-6)                                                                                 
      576 +| Avoid | Why |                                                                                               
      577 +|-------|-----|                                                                                               
      578 +| **All founder conversations** | Privacy, storage cost |                                                     
      579 +| **External web content** | Freshness, relevance |                                                           
      580 +| **Every playbook as vectors** | JSON retrieval is sufficient |                                              
      581                                                                                                                
      465 -| Priority | Component | Outcome |                                                                            
      466 -|----------|-----------|---------|                                                                            
      467 -| P0 | Onboarding Wizard | Profile + industry + problem capture |                                             
      468 -| P0 | Lean Canvas Editor | AI-guided 9-block canvas |                                                        
      469 -| P0 | Industry Playbooks (19) | Tailored context injection |                                                 
      470 -| P1 | Tasks Panel | Basic action tracking |                                                                  
      471 -| P1 | Chat (Atlas) | General AI assistant |                                                                  
      582 +### Memory Architecture                                                                                       
      583                                                                                                                
      473 -### Phase 2: MVP (Weeks 7-12)                                                                                 
      584 +```                                                                                                           
      585 +SHORT-TERM (Session)                                                                                          
      586 +├── Current conversation                                                                                      
      587 +├── Active context (startup, stage, task)                                                                     
      588 +└── In-memory, clears on session end                                                                          
      589                                                                                                                
      475 -| Priority | Component | Outcome |                                                                            
      476 -|----------|-----------|---------|                                                                            
      477 -| P0 | Risk Board | Assumption prioritization |                                                               
      478 -| P0 | Experiment Lab | Validation test design |                                                              
      479 -| P0 | Traction Roadmap | Outcome-based milestones |                                                          
      480 -| P1 | Pitch Deck Builder | Basic deck generation |                                                           
      481 -| P1 | Analytics Dashboard | OMTM tracking |                                                                  
      482 -| P2 | Prompt Packs (19) | Workflow automation |                                                              
      590 +MID-TERM (Days/Weeks)                                                                                         
      591 +├── Recent chat history (30 days)                                                                             
      592 +├── Active experiments                                                                                        
      593 +├── Current sprint tasks                                                                                      
      594 +└── PostgreSQL tables, queryable                                                                              
      595                                                                                                                
      484 -### Phase 3: ADVANCED (Weeks 13-16)                                                                           
      596 +LONG-TERM (Permanent)                                                                                         
      597 +├── Lean Canvas versions                                                                                      
      598 +├── Completed experiments                                                                                     
      599 +├── Decisions + outcomes                                                                                      
      600 +└── PostgreSQL + optional vector                                                                              
      601 +```                                                                                                           
      602                                                                                                                
      486 -| Priority | Component | Outcome |                                                                            
      487 -|----------|-----------|---------|                                                                            
      488 -| P0 | Vector RAG Pipeline | Citation-backed AI |                                                             
      489 -| P0 | PMF Readiness Checker | Scale gate enforcement |                                                       
      490 -| P1 | Lean Sprint System | 2-week execution cycles |                                                         
      491 -| P1 | Customer Factory View | Bottleneck identification |                                                    
      492 -| P2 | Investor CRM | Pipeline management |                                                                   
      603 +### Founder-Specific vs Startup-Specific                                                                      
      604                                                                                                                
      494 -### Phase 4: PRODUCTION (Weeks 17-18)                                                                         
      605 +| Type | Scope | Examples |                                                                                   
      606 +|------|-------|----------|                                                                                   
      607 +| **Founder-specific** | Per user | Communication preferences, background, strengths |                        
      608 +| **Startup-specific** | Per startup | Canvas, metrics, experiments, documents |                              
      609 +| **Shared** | Per organization | Team members, permissions |                                                 
      610                                                                                                                
      496 -| Priority | Component | Outcome |                                                                            
      497 -|----------|-----------|---------|                                                                            
      498 -| P0 | Stage Governance | Auto-detection + gates |                                                            
      499 -| P1 | Knowledge Refresh | Auto-ingest new documents |                                                        
      500 -| P1 | Quality Scoring | Source trust weighting |                                                             
      501 -| P2 | Multi-library Routing | Smart retrieval selection |                                                    
      611 +### How Retrieval Improves Answers                                                                            
      612                                                                                                                
      503 ----                                                                                                           
      613 +| Without Vector | With Vector |                                                                              
      614 +|----------------|-------------|                                                                              
      615 +| "Fintech pricing should be competitive" | "Based on 12 similar fintech startups, median pricing is $4       
          +9/mo with 15% annual discount. Your $79 is 60% above market." |                                               
      616 +| "Your traction slide needs work" | "Comparing to 50 seed decks in our library, your traction slide is       
          + missing cohort retention—82% of funded decks include this." |                                                
      617                                                                                                                
      505 -## Technology Stack                                                                                           
      618 +### Hallucination Prevention                                                                                  
      619                                                                                                                
      507 -### Frontend                                                                                                  
      508 -- React 18 + TypeScript + Vite                                                                                
      509 -- Tailwind CSS + shadcn/ui components                                                                         
      510 -- Three-panel layout (Context | Work | AI)                                                                    
      620 +| Rule | Implementation |                                                                                     
      621 +|------|----------------|                                                                                     
      622 +| **Retrieval first** | AI must search before answering |                                                     
      623 +| **Citation required** | Major claims need source reference |                                                
      624 +| **Explicit gaps** | "I don't have data on X" is valid |                                                     
      625 +| **Confidence scores** | Low confidence → web search fallback |                                              
      626                                                                                                                
      512 -### Backend                                                                                                   
      513 -- Supabase (PostgreSQL + RLS + Auth + Edge Functions)                                                         
      514 -- pgvector extension for semantic search                                                                      
      515 -- Deno runtime for Edge Functions                                                                             
      627 +---                                                                                                           
      628                                                                                                                
      517 -### AI Models                                                                                                 
      629 +## 11. Final Strategy Summary                                                                                 
      630                                                                                                                
      519 -| Use Case | Provider | Model |                                                                               
      520 -|----------|----------|-------|                                                                               
      521 -| Fast extraction | Gemini | gemini-3-flash-preview |                                                         
      522 -| Deep analysis | Gemini | gemini-3-pro-preview |                                                             
      523 -| Quick tasks | Claude | claude-haiku-4-5 |                                                                   
      524 -| Balanced | Claude | claude-sonnet-4-5 |                                                                     
      525 -| Complex reasoning | Claude | claude-opus-4-5 |                                                              
      526 -| Image generation | Gemini | gemini-3-pro-image-preview |                                                    
      631 +### North Star                                                                                                
      632                                                                                                                
      528 -### Data Architecture                                                                                         
      633 +**StartupAI is the AI copilot that helps founders build what people actually want.**                          
      634                                                                                                                
      530 -| Data Type | Storage | Access Pattern |                                                                      
      531 -|-----------|---------|----------------|                                                                      
      532 -| User data | PostgreSQL tables | SQL queries |                                                               
      533 -| Knowledge embeddings | pgvector columns | Semantic search |                                                 
      534 -| AI conversations | PostgreSQL + audit | SQL + full-text |                                                   
      535 -| Industry playbooks | JSON/JSONB | Feature-filtered retrieval |                                              
      635 +One interface (chat). AI agents that take action. Validation before building.                                 
      636                                                                                                                
      537 ----                                                                                                           
      637 +### 7 Non-Negotiable Principles                                                                               
      638                                                                                                                
      539 -## Security & Multi-Tenancy                                                                                   
      639 +| # | Principle | Implementation |                                                                            
      640 +|---|-----------|----------------|                                                                            
      641 +| 1 | **Chat first** | Every action possible via chat |                                                       
      642 +| 2 | **Validate before build** | Problem clarity required before MVP tools |                                 
      643 +| 3 | **One thing per day** | Daily focus, not overwhelming dashboard |                                       
      644 +| 4 | **AI explains why** | Every recommendation includes reasoning |                                         
      645 +| 5 | **Human approves actions** | AI proposes, human confirms |                                              
      646 +| 6 | **Stage-appropriate advice** | No scaling talk during validation |                                      
      647 +| 7 | **Industry context always** | Playbook injected into every response |                                   
      648                                                                                                                
      541 -### Row-Level Security (RLS)                                                                                  
      649 +### What to Build Next                                                                                        
      650                                                                                                                
      543 -Every table enforces data isolation:                                                                          
      544 -- Org A never sees Org B's data                                                                               
      545 -- Enforced at database level, not application                                                                 
      546 -- All AI queries respect RLS boundaries                                                                       
      651 +| Priority | Feature | Impact |                                                                               
      652 +|----------|---------|--------|                                                                               
      653 +| **P0** | Chat tool calling | Enable AI to create/update entities |                                          
      654 +| **P0** | Chat-first onboarding | Replace wizard with conversation |                                         
      655 +| **P0** | Daily focus view | One task, one metric, one insight |                                             
      656 +| **P1** | Assumption extraction | Auto-populate risk board from canvas |                                     
      657 +| **P1** | Experiment runner | Design, track, analyze experiments |                                           
      658 +| **P1** | Mobile chat UI | Full chat experience on mobile |                                                  
      659                                                                                                                
      548 -### API Security                                                                                              
      660 +### What to NOT Build Yet                                                                                     
      661                                                                                                                
      550 -- JWT verification in all Edge Functions                                                                      
      551 -- Rate limiting per user/organization                                                                         
      552 -- Audit logging for AI queries and costs                                                                      
      662 +| Avoid | Why |                                                                                               
      663 +|-------|-----|                                                                                               
      664 +| **Full vector RAG** | Playbooks + web search sufficient for MVP |                                           
      665 +| **Team collaboration** | Single-founder focus first |                                                       
      666 +| **Video generation** | Nice-to-have, not core |                                                             
      667 +| **Advanced analytics** | Basic metrics dashboard sufficient |                                               
      668 +| **White-label/API** | No B2B customers yet |                                                                
      669 +| **Mobile native apps** | PWA is sufficient |                                                                
      670                                                                                                                
      554 -### Sensitive Data Handling                                                                                   
      671 +### Success Metrics                                                                                           
      672                                                                                                                
      556 -- No secrets in client code                                                                                   
      557 -- API keys stored in Supabase Vault                                                                           
      558 -- PII minimized and encrypted                                                                                 
      673 +| Metric | Target | Why |                                                                                     
      674 +|--------|--------|-----|                                                                                     
      675 +| **Time to first validation** | <14 days | Fast learning beats slow building |                               
      676 +| **Chat action rate** | 60%+ | AI should DO things, not just advise |                                        
      677 +| **Canvas completion** | 80% in 7 days | Core framework adopted |                                            
      678 +| **Daily active users** | 40%+ of registered | Habit formation |                                             
      679 +| **"Very disappointed" (PMF)** | 40%+ | Product-market fit signal |                                          
      680                                                                                                                
      681  ---                                                                                                           
      682                                                                                                                
      683  ## Summary                                                                                                    
      684                                                                                                                
      564 -StartupAI transforms startup execution from "build and hope" to "validate and grow." The system prevent       
          -s premature building, enforces evidence-based decisions, and provides expert-level AI guidance grounded       
          - in real data.                                                                                                
      685 +StartupAI exists to prevent founders from building products nobody wants.                                     
      686                                                                                                                
      566 -**Core Differentiators:**                                                                                     
      567 -1. **Stage Gates:** Cannot advance without proof                                                              
      568 -2. **Expert AI:** Retrieves evidence, cites sources, industry-specific                                        
      569 -3. **19 Playbooks:** Tailored guidance, not generic advice                                                    
      570 -4. **Vector RAG:** Citation-backed responses from knowledge libraries                                         
      571 -5. **Traction Focus:** Outcomes over outputs, OMTM over vanity metrics                                        
      687 +**The shift:**                                                                                                
      688 +- From 41 screens → Chat + 5 structured views                                                                 
      689 +- From 10 stages → 5 clear stages                                                                             
      690 +- From 28 prompt packs → Context-aware chat                                                                   
      691 +- From 8 agent types → 4 agent types                                                                          
      692 +- From dashboard overload → Daily focus                                                                       
      693                                                                                                                
      573 -**The Result:**                                                                                               
      574 -AI that thinks like a founder, investor, and operator—because it learns from real decisions, not just t       
          -raining data.                                                                                                 
      694 +**The core loop:**                                                                                            
      695 +1. Founder describes idea in chat                                                                             
      696 +2. AI extracts problem, customer, solution                                                                    
      697 +3. AI generates canvas, identifies assumptions                                                                
      698 +4. Founder runs experiments, logs results                                                                     
      699 +5. AI recommends pivot or persevere                                                                           
      700 +6. Repeat until validated                                                                                     
      701                                                                                                                
      702 +**The result:**                                                                                               
      703 +Founders who validate before they build. Startups that survive because they solve real problems.              
      704 +                                                                                                              
      705  ---                                                                                                           
      706                                                                                                                
      707  ## References                                                                                                 
      708                                                                                                                
      580 -| Document | Path | Purpose |                                                                                 
      581 -|----------|------|---------|                                                                                 
      582 -| PRD | `prd.md` | Product requirements |                                                                     
      583 -| Diagrams | `03-mermaid-diagrams.md` | System flows |                                                        
      584 -| Lean System Plan | `lean-system/01-lean-system-plan.md` | Detailed Lean OS spec |                           
      585 -| Playbooks Index | `playbooks/00-playbooks-index.md` | All 19 playbooks |                                    
      586 -| Prompt Library | `prompt-library/01-prompt-library-index.md` | Expert agent prompts |                       
      587 -| Vector Strategy | `vector/strategy-vector.md` | pgvector implementation |                                   
      588 -| Task Template | `TASK-TEMPLATE.md` | Task generation format |                                               
      709 +| Document | Path |                                                                                           
      710 +|----------|------|                                                                                           
      711 +| PRD | `startup-system/prd.md` |                                                                             
      712 +| Universal Product System | `startup-system/02-universal-product-system.md` |                                
      713 +| Lean System Plan | `startup-system/lean-system/01-lean-system-plan.md` |                                    
      714 +| Chat Index | `startup-system/chat/index-chat.md` |                                                          
      715 +| Agents Index | `startup-system/agents/00-agents-index.md` |                                                 
      716 +| Vector Strategy | `startup-system/vector/strategy-vector.md` |                                              
      717 +| Playbooks Index | `startup-system/playbooks/00-playbooks-index.md` |                                        
      718 +| Progress Tracker | `startup-system/progress-tracker.md` |                                                   
                                                                                                                         
● Now let me verify the document.                                                                                        
                                                                                                                         
● Read 2 files (ctrl+o to expand)                                                                                        
                                                                                                                         
● Done. The new StartupAI Strategy v3.0 has been written to /home/sk/startupai16L/startup-system/strategy.md.            
                                                                                                                         
  Summary                                                                                                                
                                                                                                                         
  718 lines (within 800 limit) covering all 11 sections:                                                                 
  ┌──────────────────────┬─────────────────────────────────────────────────────────────────────┐                         
  │       Section        │                            Key Decisions                            │                         
  ├──────────────────────┼─────────────────────────────────────────────────────────────────────┤                         
  │ 1. Audit             │ 95% built, but over-engineered (41 screens, 10 stages, 28 packs)    │                         
  ├──────────────────────┼─────────────────────────────────────────────────────────────────────┤                         
  │ 2. Chat as Core      │ Chat = primary interface. Actions, not just text responses          │                         
  ├──────────────────────┼─────────────────────────────────────────────────────────────────────┤                         
  │ 3. Lean + Validation │ 4 core components (Canvas, Forces, Risk Board, Experiment Lab)      │                         
  ├──────────────────────┼─────────────────────────────────────────────────────────────────────┤                         
  │ 4. Onboarding        │ Chat-first: 5 questions max → AI fills structured data              │                         
  ├──────────────────────┼─────────────────────────────────────────────────────────────────────┤                         
  │ 5. Founder Stages    │ 5 stages (not 10): Idea → Validation → MVP → Traction → Fundraising │                         
  ├──────────────────────┼─────────────────────────────────────────────────────────────────────┤                         
  │ 6. Planning          │ Strategy → Roadmap → Milestones → Weekly → Daily (AI-assisted)      │                         
  ├──────────────────────┼─────────────────────────────────────────────────────────────────────┤                         
  │ 7. MVP               │ Outcomes, not features. Problem confirmed > solution built          │                         
  ├──────────────────────┼─────────────────────────────────────────────────────────────────────┤                         
  │ 8. Agents            │ 4 types (not 8): Orchestrator, Doer, Analyst, Generator             │                         
  ├──────────────────────┼─────────────────────────────────────────────────────────────────────┤                         
  │ 9. Playbooks         │ Invisible intelligence injected into chat, not separate workflows   │                         
  ├──────────────────────┼─────────────────────────────────────────────────────────────────────┤                         
  │ 10. Memory           │ Short/Mid/Long-term tiers. Vector RAG deferred to P3                │                         
  ├──────────────────────┼─────────────────────────────────────────────────────────────────────┤                         
  │ 11. Summary          │ 7 principles, P0 priorities, success metrics                        │                         
  └──────────────────────┴─────────────────────────────────────────────────────────────────────┘                         
  Key Shifts                                                                                                             
                                                                                                                         
  From                        →  To                                                                                      
  ─────────────────────────────────────────                                                                              
  41 screens                  →  Chat + 5 structured views                                                               
  10 stages                   →  5 clear stages                                                                          
  28 prompt packs             →  Context-aware chat                                                                      
  8 agent archetypes          →  4 agent types                                                                           
  Dashboard overload          →  Daily focus                                                                             
  Text responses              →  Actions + explanations                                                                  
                                                                                                                         
  P0 Priorities (Build Next)                                                                                             
                                                                                                                         
  1. Chat tool calling — AI creates/updates entities                                                                     
  2. Chat-first onboarding — Replace wizard with conversation                                                            
  3. Daily focus view — One task, one metric, one insight                                                                
                                                                                                                         
✻ Brewed for 3m 44s                                                                                                      
                                                                                                                         
❯ '/home/sk/startupai16L/startup-system/strategy.md' why is the strategy doc blank where is the strategy                 
                                                                                                                         
● Let me check what happened to the file.                                                                                
                                                                                                                         
● Read 2 files (ctrl+o to expand)                                                                                        
                                                                                                                         
● The file is not blank — it contains 718 lines (29KB). Here's proof:                                                    
                                                                                                                         
  -rw-rw-r-- 1 sk sk 29243 Feb  3 16:26 strategy.md                                                                      
  718 lines                                                                                                              
                                                                                                                         
  The content is there. If it appears blank in your editor:                                                              
                                                                                                                         
  1. Close and reopen the file — your editor may have cached an old version                                              
  2. Refresh the file view — some editors don't auto-refresh                                                             
  3. Check if you opened the right file — the path is /home/sk/startupai16L/startup-system/strategy.md                   
                                                                                                                         
  The document contains all 11 sections as requested:                                                                    
  - Section 1: Current System Audit                                                                                      
  - Section 2: Chat as the Core Product                                                                                  
  - Section 3: Lean System + Idea Validation                                                                             
  - Section 4: Onboarding via Chat                                                                                       
  - Section 5: Founder Roadmap & Startup Stages                                                                          
  - Section 6: AI-Enabled Planning System                                                                                
  - Section 7: MVP: What Actually Matters                                                                                
  - Section 8: AI Agents Strategy                                                                                        
  - Section 9: Playbooks, Prompt Packs & Guides                                                                          
  - Section 10: Vector DB & Memory Strategy                                                                              
  - Section 11: Final Strategy Summary                                                                                   
                                                                                                                         
  Would you like me to output the full file to the terminal so you can verify?                                           
                                                                                                                         
❯ is it is completely blank                                                                                              
  ⎿  [Image #2]                                                                                                          
                                                                                                                         
● I see the issue - your editor has an old cached version. The file on disk has content but the editor isn't showing it. 
  Let me force a refresh by rewriting the file.                                                                          
                                                                                                                         
● Read 2 files (ctrl+o to expand)                                                                                        
                                                                                                                         
● The file has 718 lines of content on disk. Your editor is showing a stale/cached version.                              
                                                                                                                         
  Fix it:                                                                                                                
                                                                                                                         
  1. Close the strategy.md tab (click the X on the tab)                                                                  
  2. Reopen the file from the file explorer                                                                              
                                                                                                                         
  Or try: Ctrl+Shift+P → "Revert File" (in VS Code/Cursor)                                                               
                                                                                                                         
  The content is definitely there - the editor just hasn't loaded it yet.                                                
                                                                                                                         
─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
❯ print the full strategy to terminal                                                                                    
─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
  sk@sk-125:/home/sk/startupai16L (main*) [Opus 4.5] {default} [ctx:34%]                                  ⧉ In notes.md  
  ⏵⏵ accept edits on · 1 bash                                                                                            
