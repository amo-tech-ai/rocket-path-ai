                                                                         
● You're right — the agency directory is a knowledge source, not a product. The goal is making StartupAI smarter. Let me reframe:         
                                                                                                                                          
  What Actually Matters for StartupAI Founders
                                                                                                                                          
  1. Smarter Validation Reports (Tasks 002+003)             
  Wire scoring and composer fragments into validator-start. Every new report gets:                                                        
  - Evidence quality indicators (cited data vs founder claims vs AI guesses)                                                              
  - Bias detection flags
  - Better exec summaries with three-act narrative
  - Impact: Reports go from "good AI summary" to "consulting-grade analysis"

  2. AI Chat That Actually Coaches (Tasks 010+011)
  Right now /ai-chat is a generic Q&A bot. Add 4 specialized modes:
  - Practice Pitch — AI plays investor, scores your delivery
  - Growth Strategy — Diagnoses your AARRR funnel, designs experiments
  - Deal Review — Scores your investor pipeline, flags stalled deals
  - Canvas Coach — Finds vague spots in your lean canvas, asks probing questions
  - Impact: Chat becomes the founder's daily coach, not just a chatbot

  3. Better Sprint Prioritization (Task 005)
  Sprint board already exists. Add RICE scoring so AI-generated tasks come with Reach/Impact/Confidence/Effort scores and Kano
  classification (must-have vs nice-to-have). Schema columns already exist.
  - Impact: Founders stop guessing what to work on first

  4. Investor Pipeline Intelligence (Tasks 006+007)
  MEDDPICC scoring on investors — 8 dimensions that show deal health. Schema columns already exist. Wire into investor-agent so it
  auto-scores each investor.
  - Impact: Founders know which investors to prioritize

  Prerequisite

  Task 001 (loader) is the plumbing that lets edge functions read the domain knowledge files. It's 30 minutes of work but unblocks
  everything above.

  Want me to start with the validator report enhancements (smarter reports) or the AI chat coaching modes?

❯ do we have prompts for the above                                                                                                        
                                                       
● Yes — all prompts are written and ready to execute:                                                                                     
                                                                                                                                          
  ┌─────────────────────┬───────────────────────────────────────────────────┬───────┐
  │     Enhancement     │                    Prompt File                    │ Size  │                                                     
  ├─────────────────────┼───────────────────────────────────────────────────┼───────┤
  │ Loader (plumbing)   │ agency/prompts/001-agent-loader-runtime.md        │ 5.4KB │                                                     
  ├─────────────────────┼───────────────────────────────────────────────────┼───────┤                                                     
  │ Smarter Scoring     │ agency/prompts/002-validator-scoring-fragment.md  │ 6.5KB │
  ├─────────────────────┼───────────────────────────────────────────────────┼───────┤
  │ Smarter Composer    │ agency/prompts/003-validator-composer-fragment.md │ 6.6KB │
  ├─────────────────────┼───────────────────────────────────────────────────┼───────┤
  │ Report UI badges    │ agency/prompts/004-report-ui-agency-badges.md     │ 6.7KB │
  ├─────────────────────┼───────────────────────────────────────────────────┼───────┤
  │ Sprint RICE+Kano    │ agency/prompts/005-sprint-board-rice-kano.md      │ 4.9KB │
  ├─────────────────────┼───────────────────────────────────────────────────┼───────┤
  │ Investor schema     │ agency/prompts/006-investor-meddpicc-schema.md    │ 5.4KB │
  ├─────────────────────┼───────────────────────────────────────────────────┼───────┤
  │ Investor wiring     │ agency/prompts/007-investor-meddpicc-wiring.md    │ 5.3KB │
  ├─────────────────────┼───────────────────────────────────────────────────┼───────┤
  │ Pitch deck upgrade  │ agency/prompts/008-pitch-deck-challenger.md       │ 5.0KB │
  ├─────────────────────┼───────────────────────────────────────────────────┼───────┤
  │ Canvas specificity  │ agency/prompts/009-lean-canvas-specificity.md     │ 4.6KB │
  ├─────────────────────┼───────────────────────────────────────────────────┼───────┤
  │ Chat modes backend  │ agency/prompts/010-chat-modes-backend.md          │ 4.9KB │
  ├─────────────────────┼───────────────────────────────────────────────────┼───────┤
  │ Chat modes frontend │ agency/prompts/011-chat-modes-frontend.md         │ 4.8KB │
  └─────────────────────┴───────────────────────────────────────────────────┴───────┘

  Plus the domain knowledge fragments they inject:

  ┌──────────────────────┬───────────────────────────────────────────────┐
  │       Fragment       │                     File                      │
  ├──────────────────────┼───────────────────────────────────────────────┤
  │ Scoring rules        │ agency/prompts/validator-scoring-fragment.md  │
  ├──────────────────────┼───────────────────────────────────────────────┤
  │ Composer rules       │ agency/prompts/validator-composer-fragment.md │
  ├──────────────────────┼───────────────────────────────────────────────┤
  │ Sprint RICE/Kano     │ agency/prompts/sprint-agent-fragment.md       │
  ├──────────────────────┼───────────────────────────────────────────────┤
  │ Investor MEDDPICC    │ agency/prompts/crm-investor-fragment.md       │
  ├──────────────────────┼───────────────────────────────────────────────┤
  │ Pitch deck narrative │ agency/prompts/pitch-deck-fragment.md         │
  └──────────────────────┴───────────────────────────────────────────────┘

  And 4 chat mode system prompts in agency/chat-modes/.

  All 34 prompts follow the v4.0 task template with situation, rationale, acceptance criteria, wiring plan, and edge cases. Which one
  should I open and start building?