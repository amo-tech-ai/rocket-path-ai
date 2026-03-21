-- session 44: add per-element MEDDPICC breakdown to deals
-- elements: metrics, economic_buyer, decision_criteria, decision_process,
--           paper_process, identify_pain, champion, competition (each 1-5)
-- total stored in existing meddpicc_score column (0-40)

alter table deals
  add column if not exists meddpicc_elements jsonb default null;

comment on column deals.meddpicc_elements is
  'Per-element MEDDPICC scores: {metrics, economic_buyer, decision_criteria, decision_process, paper_process, identify_pain, champion, competition} each 1-5. Sum = meddpicc_score (0-40).';
