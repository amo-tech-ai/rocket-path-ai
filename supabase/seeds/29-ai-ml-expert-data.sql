-- supabase/seeds/29-ai-ml-expert-data.sql
-- Description: Populate high-fidelity expert knowledge for the AI/ML (Artificial Intelligence & Machine Learning) industry.

BEGIN;

UPDATE public.industry_playbooks
SET 
    benchmarks = '{
        "gpu_utilization_target": "> 80%",
        "inference_latency_ms": "< 200ms (Real-time) / < 2s (Complex)",
        "data_moat_ratio": "> 40% proprietary vs public data",
        "token_efficiency_gain": "> 5x vs manual workflow",
        "gross_margin_target": "> 65% (Accounting for compute costs)",
        "retention_rate_llm": "> 85% annual"
    }'::jsonb,
    warning_signs = '[
        "Thin Wrapper: Product is essentially a UI for a single API call (e.g., GPT-4) with no proprietary logic.",
        "Prohibitive compute costs exceed 40% of revenue without a clear optimization roadmap.",
        "Lack of human-in-the-loop (HITL) processes for edge case handling and data labeling.",
        "Hallucination rates > 5% in mission-critical output fields.",
        "Heavy reliance on public datasets that competitors can easily replicate."
    ]'::jsonb,
    failure_patterns = '[
        {
            "pattern": "The OpenAI Death Star",
            "description": "Building a feature that becomes a native platform update for major model providers (OpenAI, Google, Anthropic) within 6 months."
        },
        {
            "pattern": "The R&D Rabbit Hole",
            "description": "Focusing on building custom models for years without validating product-market fit or user demand for the specific output."
        },
        {
            "pattern": "Data Drift Bankruptcy",
            "description": "Model performance degrades over time due to shifts in real-world data, and the startup lacks the infrastructure to re-train or adapt."
        }
    ]'::jsonb,
    terminology = '{
        "RAG (Retrieval-Augmented Generation)": "Querying external data to provide context to an LLM before generation.",
        "Fine-tuning": "Adjusting a pre-trained model on a smaller, specific dataset to improve performance on a task.",
        "Embeddings / Vector DB": "Numerical representations of data used for semantic search and retrieval.",
        "RLHF (Reinforcement Learning from Human Feedback)": "Training models based on human preferences to align output with user intent.",
        "Inference vs Training": "Inference is running the model for users; Training is building the model logic.",
        "Context Window": "The amount of information a model can process at one time.",
        "Quantization": "Reducing model precision to decrease compute requirements and latency."
    }'::jsonb,
    investor_expectations = '{
        "Pre-seed": "Unique data access layer; validated workflow improvement; basic RAG implementation.",
        "Seed": "Proprietary fine-tuning or logic layer; initial enterprise pilots; clear unit economics on inference.",
        "Series A": "Compound AI System (multiple agents/models); moat established via data flywheels; $1M+ ARR with 60%+ margins."
    }'::jsonb,
    gtm_patterns = '[
        "Vertical AI: Solving deep, specific problems for a single industry (e.g., Legal AI, BioTech AI).",
        "Invisible AI: Embedding ML into existing workflows so users don''t even know it''s there.",
        "API-First / Developer Tools: Selling infrastructure to other builders."
    ]'::jsonb,
    slide_emphasis = '{
        "The_Moat": "Critical (Explain why OpenAI won''t kill you)",
        "Data_Strategy": "High (Show the feedback loop/flywheel)",
        "Unit_Economics": "Medium (Address the GPU/Inference cost)"
    }'::jsonb,
    is_active = true,
    updated_at = NOW()
WHERE industry_id = 'ai_saas';

COMMIT;
