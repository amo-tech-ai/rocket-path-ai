/**
 * Validator Agent JSON Schemas
 * F18: JSON Schemas per Agent (G1 — guarantees valid JSON from Gemini)
 */

export const AGENT_SCHEMAS = {
  extractor: {
    type: 'object',
    properties: {
      idea: { type: 'string', description: 'One-sentence description of the startup idea' },
      problem: { type: 'string', description: 'The core problem being solved' },
      customer: { type: 'string', description: 'Target customer segment' },
      solution: { type: 'string', description: 'How the startup solves the problem' },
      differentiation: { type: 'string', description: 'What makes this unique vs alternatives' },
      alternatives: { type: 'string', description: 'Current alternatives/competitors mentioned' },
      validation: { type: 'string', description: 'Any existing validation or traction mentioned' },
      industry: { type: 'string', description: 'Primary industry (e.g., fintech, healthtech, saas)' },
      websites: { type: 'string', description: 'URLs or websites the founder wants researched, or empty string if none' },
      assumptions: {
        type: 'array',
        items: { type: 'string' },
        description: '2-5 key assumptions the founder is making — things that must be true for this to work',
      },
      search_queries: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            purpose: { type: 'string', description: 'What this query aims to find (e.g., TAM data, competitors, benchmarks)' },
            query: { type: 'string', description: 'The actual search query' },
          },
          required: ['purpose', 'query'],
        },
        description: '3-5 purpose-tagged search queries for Research and Competitor agents',
      },
      // 031-PCE: Structured problem extraction for sharper report Section 1
      problem_structured: {
        type: 'object',
        description: 'Structured problem breakdown: WHO has the problem, PAIN quantified, TODAY\'S FIX and why it fails',
        properties: {
          who: { type: 'string', description: 'Specific buyer role with authority, company type, size, and budget context' },
          pain: { type: 'string', description: 'Quantified cost: hours wasted, dollars lost, delays caused per time period' },
          todays_fix: { type: 'string', description: 'Current workaround tools AND their structural failure reason' },
          evidence_tier: { type: 'string', description: 'Evidence quality: A=revenue/data, B=prototype/beta, C=surveys, D=desk research' },
        },
        required: ['who', 'pain', 'todays_fix'],
      },
      // CORE-06: Idea quality filters (Paul Graham, Why Now, Tarpit)
      idea_quality: {
        type: 'object',
        description: 'Idea quality assessment using founder framework filters',
        properties: {
          well_or_crater: { type: 'string', description: '"well" or "crater"' },
          schlep_factor: { type: 'string', description: '"high", "medium", or "low"' },
          organic_or_manufactured: { type: 'string', description: '"organic" | "manufactured" | "unclear"' },
          why_now: {
            type: 'object',
            properties: {
              trigger: { type: 'string' },
              category: { type: 'string', description: 'technology | regulatory | behavioral | market_gap | cost_reduction | none' },
              confidence: { type: 'string', description: 'strong | moderate | weak | none' },
            },
            required: ['trigger', 'category', 'confidence'],
          },
          tarpit_flag: { type: 'boolean' },
          tarpit_reasoning: { type: 'string' },
        },
        required: ['well_or_crater', 'schlep_factor', 'organic_or_manufactured', 'why_now', 'tarpit_flag', 'tarpit_reasoning'],
      },
      // 032-CUC: Structured customer use case for sharper report Section 2
      customer_structured: {
        type: 'object',
        description: 'Structured customer persona with before/after workflow and quantified impact',
        properties: {
          persona_name: { type: 'string', description: 'Realistic first name + role (e.g., Sarah Chen, Production Manager)' },
          role_context: { type: 'string', description: 'Job title + company type + team size + responsibilities' },
          workflow_without: { type: 'string', description: 'Step-by-step current broken workflow with time/friction/consequences' },
          workflow_with: { type: 'string', description: 'Same task with the product — specific changes and improvements' },
          quantified_impact: { type: 'string', description: 'Time saved, cost reduced, quality improved — with numbers' },
        },
        required: ['persona_name', 'role_context', 'workflow_without', 'workflow_with', 'quantified_impact'],
      },
    },
    required: ['idea', 'problem', 'customer', 'solution', 'differentiation', 'alternatives', 'validation', 'industry', 'websites', 'assumptions', 'search_queries', 'problem_structured', 'customer_structured'],
  },

  research: {
    type: 'object',
    properties: {
      tam: { type: 'number', description: 'Total Addressable Market in USD' },
      sam: { type: 'number', description: 'Serviceable Addressable Market in USD' },
      som: { type: 'number', description: 'Serviceable Obtainable Market in USD' },
      methodology: { type: 'string', description: 'Brief explanation of calculation methodology' },
      growth_rate: { type: 'number', description: 'Annual growth rate percentage' },
      sources: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            title: { type: 'string' },
            url: { type: 'string' },
          },
          required: ['title', 'url'],
        },
      },
      // CORE-06: Value theory + cross-validation + trend analysis
      value_theory_tam: { type: 'number', description: 'TAM via value theory method' },
      sizing_cross_validation: {
        type: 'object',
        properties: {
          bottom_up: { type: 'number' },
          top_down: { type: 'number' },
          value_theory: { type: 'number' },
          max_discrepancy_factor: { type: 'number' },
          primary_estimate: { type: 'string' },
        },
        required: ['bottom_up', 'top_down', 'value_theory', 'max_discrepancy_factor', 'primary_estimate'],
      },
      source_freshness: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            source: { type: 'string' },
            year: { type: 'number' },
            stale_flag: { type: 'boolean' },
          },
          required: ['source', 'year', 'stale_flag'],
        },
      },
      trend_analysis: {
        type: 'object',
        properties: {
          trajectory: { type: 'string', description: 'accelerating | steady | decelerating | declining' },
          adoption_curve_position: { type: 'string', description: 'innovators | early_adopters | early_majority | late_majority | laggards' },
          market_maturity: { type: 'string', description: 'emerging | growing | mature | declining' },
        },
        required: ['trajectory', 'adoption_curve_position', 'market_maturity'],
      },
    },
    required: ['tam', 'sam', 'som', 'methodology', 'growth_rate', 'sources'],
  },

  competitors: {
    type: 'object',
    properties: {
      direct_competitors: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            name: { type: 'string' },
            description: { type: 'string' },
            strengths: { type: 'array', items: { type: 'string' } },
            weaknesses: { type: 'array', items: { type: 'string' } },
            threat_level: { type: 'string', description: 'high, medium, or low' },
            source_url: { type: 'string' },
          },
          required: ['name', 'description', 'strengths', 'weaknesses', 'threat_level'],
        },
      },
      indirect_competitors: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            name: { type: 'string' },
            description: { type: 'string' },
            strengths: { type: 'array', items: { type: 'string' } },
            weaknesses: { type: 'array', items: { type: 'string' } },
            threat_level: { type: 'string' },
            source_url: { type: 'string' },
          },
          required: ['name', 'description', 'strengths', 'weaknesses', 'threat_level'],
        },
      },
      market_gaps: { type: 'array', items: { type: 'string' } },
      sources: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            title: { type: 'string' },
            url: { type: 'string' },
          },
          required: ['title', 'url'],
        },
      },
      // CORE-06: Positioning, battlecard, white space
      positioning: {
        type: 'object',
        properties: {
          competitive_alternatives: { type: 'array', items: { type: 'string' } },
          unique_attributes: { type: 'array', items: { type: 'string' } },
          value_proposition: { type: 'string' },
          target_segment: { type: 'string' },
          market_category: { type: 'string' },
          positioning_statement: { type: 'string' },
        },
        required: ['competitive_alternatives', 'unique_attributes', 'value_proposition', 'target_segment', 'market_category', 'positioning_statement'],
      },
      battlecard: {
        type: 'object',
        properties: {
          competitor_name: { type: 'string' },
          win_themes: { type: 'array', items: { type: 'string' } },
          lose_themes: { type: 'array', items: { type: 'string' } },
          counter_arguments: { type: 'array', items: { type: 'string' } },
          moat_durability: { type: 'string', description: 'defensible | weak | unknown' },
        },
        required: ['competitor_name', 'win_themes', 'lose_themes', 'counter_arguments', 'moat_durability'],
      },
      white_space: { type: 'string', description: 'Single sentence describing the unaddressed positioning gap' },
    },
    required: ['direct_competitors', 'indirect_competitors', 'market_gaps', 'sources'],
  },

  // Scoring schema: LLM provides raw dimension scores + qualitative factors.
  // overall_score, verdict, and factor status are computed deterministically by scoring-math.ts.
  scoring: {
    type: 'object',
    properties: {
      dimension_scores: {
        type: 'object',
        properties: {
          problemClarity: { type: 'number', description: '0-100 score' },
          solutionStrength: { type: 'number', description: '0-100 score' },
          marketSize: { type: 'number', description: '0-100 score' },
          competition: { type: 'number', description: '0-100 score' },
          businessModel: { type: 'number', description: '0-100 score' },
          teamFit: { type: 'number', description: '0-100 score' },
          timing: { type: 'number', description: '0-100 score' },
        },
        required: ['problemClarity', 'solutionStrength', 'marketSize', 'competition', 'businessModel', 'teamFit', 'timing'],
      },
      market_factors: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            name: { type: 'string' },
            score: { type: 'number', description: '1-10 score' },
            description: { type: 'string' },
          },
          required: ['name', 'score', 'description'],
        },
      },
      execution_factors: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            name: { type: 'string' },
            score: { type: 'number', description: '1-10 score' },
            description: { type: 'string' },
          },
          required: ['name', 'score', 'description'],
        },
      },
      highlights: { type: 'array', items: { type: 'string' } },
      red_flags: { type: 'array', items: { type: 'string' } },
      risks_assumptions: { type: 'array', items: { type: 'string' } },
      // CORE-06: Risk queue, bias detection, evidence grading
      risk_queue: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            domain: { type: 'string', description: 'e.g. Problem Risk, Customer Risk' },
            category: { type: 'string', description: 'desirability | viability | feasibility | external' },
            assumption: { type: 'string' },
            impact: { type: 'number', description: '1-10' },
            probability: { type: 'number', description: '1-5' },
            composite_score: { type: 'number', description: 'impact * probability (0-50)' },
            severity: { type: 'string', description: 'fatal | high | medium | low' },
            suggested_experiment: { type: 'string' },
          },
          required: ['domain', 'category', 'assumption', 'impact', 'probability', 'composite_score', 'severity', 'suggested_experiment'],
        },
      },
      bias_flags: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            bias_type: { type: 'string', description: 'confirmation | optimism | sunk_cost | survivorship | anchoring | bandwagon' },
            evidence_phrase: { type: 'string' },
            counter_question: { type: 'string' },
          },
          required: ['bias_type', 'evidence_phrase', 'counter_question'],
        },
      },
      evidence_grades: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            claim: { type: 'string' },
            grade: { type: 'string', description: 'A | B | C | D' },
            source: { type: 'string' },
            signal_level: { type: 'number', description: '1-5' },
          },
          required: ['claim', 'grade', 'source', 'signal_level'],
        },
      },
      highest_signal_level: { type: 'number', description: '1-5 highest evidence signal level' },
    },
    required: ['dimension_scores', 'market_factors', 'execution_factors', 'highlights', 'red_flags', 'risks_assumptions'],
  },

  mvp: {
    type: 'object',
    properties: {
      mvp_scope: { type: 'string', description: 'Clear description of MVP scope' },
      phases: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            phase: { type: 'number' },
            name: { type: 'string' },
            tasks: { type: 'array', items: { type: 'string' } },
          },
          required: ['phase', 'name', 'tasks'],
        },
      },
      next_steps: { type: 'array', items: { type: 'string' } },
      // CORE-06: Experiment cards, founder stage, recommended methods
      experiment_cards: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            risk_domain: { type: 'string' },
            assumption: { type: 'string' },
            hypothesis: { type: 'string' },
            method: { type: 'string' },
            duration: { type: 'string' },
            smart_goal: { type: 'string' },
            pass_threshold: { type: 'string' },
            fail_threshold: { type: 'string' },
            estimated_cost: { type: 'string' },
          },
          required: ['risk_domain', 'assumption', 'hypothesis', 'method', 'duration', 'smart_goal', 'pass_threshold', 'fail_threshold', 'estimated_cost'],
        },
      },
      founder_stage: { type: 'string', description: 'idea_only | problem_validated | demand_validated | presales_confirmed' },
      recommended_methods: { type: 'array', items: { type: 'string' } },
    },
    required: ['mvp_scope', 'phases', 'next_steps'],
  },

  // P02: Expanded composer schema — 14 sections (up from 8)
  // 021-CSP: Retained for reference — production now uses COMPOSER_GROUP_SCHEMAS (below)
  composer: {
    type: 'object',
    properties: {
      // Top-level findings
      highlights: { type: 'array', items: { type: 'string' }, description: '3-5 key strengths of this startup idea' },
      red_flags: { type: 'array', items: { type: 'string' }, description: '3-5 critical concerns or red flags' },
      // Original 8 sections
      summary_verdict: { type: 'string', description: '3-sentence executive summary with score and verdict' },
      problem_clarity: {
        type: 'object',
        properties: {
          who: { type: 'string', description: 'Who has this problem — role, company size, context' },
          pain: { type: 'string', description: 'Daily pain point, quantified if possible' },
          current_fix: { type: 'string', description: 'How they cope today and why it sucks' },
          severity: { type: 'string', description: 'high, medium, or low' },
        },
        required: ['who', 'pain', 'current_fix', 'severity'],
      },
      customer_use_case: {
        type: 'object',
        properties: {
          persona: {
            type: 'object',
            properties: {
              name: { type: 'string' },
              role: { type: 'string' },
              context: { type: 'string' },
            },
            required: ['name', 'role', 'context'],
          },
          without: { type: 'string', description: 'A day without the product' },
          with: { type: 'string', description: 'A day with the product' },
          time_saved: { type: 'string', description: 'Concrete time/money saved' },
        },
        required: ['persona', 'without', 'with', 'time_saved'],
      },
      market_sizing: {
        type: 'object',
        properties: {
          tam: { type: 'number' },
          sam: { type: 'number' },
          som: { type: 'number' },
          citations: { type: 'array', items: { type: 'string' } },
        },
        required: ['tam', 'sam', 'som', 'citations'],
      },
      competition: {
        type: 'object',
        properties: {
          competitors: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                name: { type: 'string' },
                description: { type: 'string' },
                threat_level: { type: 'string' },
              },
              required: ['name', 'description', 'threat_level'],
            },
          },
          citations: { type: 'array', items: { type: 'string' } },
          // P02 Task 32: Competition deep dive
          swot: {
            type: 'object',
            properties: {
              strengths: { type: 'array', items: { type: 'string' } },
              weaknesses: { type: 'array', items: { type: 'string' } },
              opportunities: { type: 'array', items: { type: 'string' } },
              threats: { type: 'array', items: { type: 'string' } },
            },
            required: ['strengths', 'weaknesses', 'opportunities', 'threats'],
          },
          feature_comparison: {
            type: 'object',
            properties: {
              features: { type: 'array', items: { type: 'string' } },
              competitors: { type: 'array', items: {
                type: 'object',
                properties: {
                  name: { type: 'string' },
                  has_feature: { type: 'array', items: { type: 'boolean' } },
                },
                required: ['name', 'has_feature'],
              }},
            },
            required: ['features', 'competitors'],
          },
          positioning: {
            type: 'object',
            properties: {
              x_axis: { type: 'string', description: 'e.g. Price (low to high)' },
              y_axis: { type: 'string', description: 'e.g. Capability (low to high)' },
              positions: { type: 'array', items: {
                type: 'object',
                properties: {
                  name: { type: 'string' },
                  x: { type: 'number', description: '0-100 position on x axis' },
                  y: { type: 'number', description: '0-100 position on y axis' },
                  is_founder: { type: 'boolean', description: 'true if this is the founders idea' },
                },
                required: ['name', 'x', 'y', 'is_founder'],
              }},
            },
            required: ['x_axis', 'y_axis', 'positions'],
          },
        },
        required: ['competitors', 'citations', 'swot', 'feature_comparison', 'positioning'],
      },
      risks_assumptions: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            assumption: { type: 'string' },
            if_wrong: { type: 'string', description: 'Plain consequence if wrong' },
            severity: { type: 'string', description: 'fatal, risky, or watch' },
            impact: { type: 'string', description: 'high or low' },
            probability: { type: 'string', description: 'high or low' },
            how_to_test: { type: 'string', description: 'Cheapest validation method' },
          },
          required: ['assumption', 'if_wrong', 'severity', 'impact', 'probability', 'how_to_test'],
        },
      },
      mvp_scope: {
        type: 'object',
        properties: {
          one_liner: { type: 'string', description: 'One sentence MVP description' },
          build: { type: 'array', items: { type: 'string' }, description: 'Core features to code' },
          buy: { type: 'array', items: { type: 'string' }, description: 'Services to integrate' },
          skip_for_now: { type: 'array', items: { type: 'string' }, description: 'Features that can wait' },
          tests_assumption: { type: 'string', description: 'The #1 assumption this MVP validates' },
          success_metric: { type: 'string', description: 'Measurable success signal' },
          timeline_weeks: { type: 'number' },
        },
        required: ['one_liner', 'build', 'buy', 'skip_for_now', 'tests_assumption', 'success_metric', 'timeline_weeks'],
      },
      next_steps: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            action: { type: 'string', description: 'Specific action with deliverable' },
            timeframe: { type: 'string', description: 'week_1, month_1, or quarter_1' },
            effort: { type: 'string', description: 'low, medium, or high' },
          },
          required: ['action', 'timeframe', 'effort'],
        },
      },
      // P02: 6 new sections
      technology_stack: {
        type: 'object',
        properties: {
          stack_components: { type: 'array', items: {
            type: 'object',
            properties: { name: { type: 'string' }, choice: { type: 'string' }, rationale: { type: 'string' } },
            required: ['name', 'choice', 'rationale'],
          }},
          feasibility: { type: 'string', description: 'high, medium, or low' },
          feasibility_rationale: { type: 'string' },
          technical_risks: { type: 'array', items: {
            type: 'object',
            properties: { risk: { type: 'string' }, likelihood: { type: 'string' }, mitigation: { type: 'string' } },
            required: ['risk', 'likelihood', 'mitigation'],
          }},
          mvp_timeline_weeks: { type: 'number' },
        },
        required: ['stack_components', 'feasibility', 'feasibility_rationale', 'technical_risks', 'mvp_timeline_weeks'],
      },
      revenue_model: {
        type: 'object',
        properties: {
          recommended_model: { type: 'string' },
          reasoning: { type: 'string' },
          alternatives: { type: 'array', items: {
            type: 'object',
            properties: { model: { type: 'string' }, pros: { type: 'array', items: { type: 'string' } }, cons: { type: 'array', items: { type: 'string' } } },
            required: ['model', 'pros', 'cons'],
          }},
          unit_economics: {
            type: 'object',
            properties: { cac: { type: 'number' }, ltv: { type: 'number' }, ltv_cac_ratio: { type: 'number' }, payback_months: { type: 'number' } },
            required: ['cac', 'ltv', 'ltv_cac_ratio', 'payback_months'],
          },
        },
        required: ['recommended_model', 'reasoning', 'alternatives', 'unit_economics'],
      },
      team_hiring: {
        type: 'object',
        properties: {
          current_gaps: { type: 'array', items: { type: 'string' } },
          mvp_roles: { type: 'array', items: {
            type: 'object',
            properties: { role: { type: 'string' }, priority: { type: 'number' }, rationale: { type: 'string' }, monthly_cost: { type: 'number' } },
            required: ['role', 'priority', 'rationale', 'monthly_cost'],
          }},
          monthly_burn: { type: 'number' },
          advisory_needs: { type: 'array', items: { type: 'string' } },
        },
        required: ['current_gaps', 'mvp_roles', 'monthly_burn', 'advisory_needs'],
      },
      key_questions: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            question: { type: 'string' },
            why_it_matters: { type: 'string' },
            validation_method: { type: 'string' },
            risk_level: { type: 'string', description: 'fatal, important, or minor' },
          },
          required: ['question', 'why_it_matters', 'validation_method', 'risk_level'],
        },
      },
      resources_links: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            category: { type: 'string' },
            links: { type: 'array', items: {
              type: 'object',
              properties: { title: { type: 'string' }, url: { type: 'string' }, description: { type: 'string' } },
              required: ['title', 'url', 'description'],
            }},
          },
          required: ['category', 'links'],
        },
      },
      scores_matrix: {
        type: 'object',
        properties: {
          dimensions: { type: 'array', items: {
            type: 'object',
            properties: { name: { type: 'string' }, score: { type: 'number' }, weight: { type: 'number' } },
            required: ['name', 'score', 'weight'],
          }},
          overall_weighted: { type: 'number' },
        },
        required: ['dimensions', 'overall_weighted'],
      },
      // P02 Tasks 33+35: Financial projections
      financial_projections: {
        type: 'object',
        properties: {
          scenarios: { type: 'array', items: {
            type: 'object',
            properties: {
              name: { type: 'string', description: 'Conservative, Base, or Optimistic' },
              y1_revenue: { type: 'number', description: 'Year 1 revenue in USD' },
              y3_revenue: { type: 'number', description: 'Year 3 revenue in USD' },
              y5_revenue: { type: 'number', description: 'Year 5 revenue in USD' },
              assumptions: { type: 'array', items: { type: 'string' } },
            },
            required: ['name', 'y1_revenue', 'y3_revenue', 'y5_revenue', 'assumptions'],
          }},
          monthly_y1: { type: 'array', items: {
            type: 'object',
            properties: {
              month: { type: 'number' },
              revenue: { type: 'number' },
              users: { type: 'number' },
            },
            required: ['month', 'revenue', 'users'],
          }},
          break_even: {
            type: 'object',
            properties: {
              months: { type: 'number', description: 'Months to break even' },
              revenue_required: { type: 'number', description: 'Monthly revenue needed to break even' },
              assumptions: { type: 'string' },
            },
            required: ['months', 'revenue_required', 'assumptions'],
          },
          key_assumption: { type: 'string', description: 'The one assumption that if wrong changes everything' },
        },
        required: ['scenarios', 'break_even', 'key_assumption'],
      },
    },
    required: [
      'highlights', 'red_flags',
      'summary_verdict', 'problem_clarity', 'customer_use_case', 'market_sizing',
      'competition', 'risks_assumptions', 'mvp_scope', 'next_steps',
      'technology_stack', 'revenue_model', 'team_hiring', 'key_questions',
      'resources_links', 'scores_matrix', 'financial_projections',
    ],
  },
} as const;

// 021-CSP: Per-group schemas — small enough for responseJsonSchema (no extractJSON needed)
export const COMPOSER_GROUP_SCHEMAS = {
  groupA: {
    type: 'object',
    properties: {
      problem_clarity: {
        type: 'object',
        properties: {
          who: { type: 'string', description: 'Who has this problem — role, company size, context' },
          pain: { type: 'string', description: 'Daily pain point, quantified if possible' },
          current_fix: { type: 'string', description: 'How they cope today and why it sucks' },
          severity: { type: 'string', description: 'high, medium, or low' },
        },
        required: ['who', 'pain', 'current_fix', 'severity'],
      },
      customer_use_case: {
        type: 'object',
        properties: {
          persona: {
            type: 'object',
            properties: {
              name: { type: 'string' },
              role: { type: 'string' },
              context: { type: 'string' },
            },
            required: ['name', 'role', 'context'],
          },
          without: { type: 'string', description: 'A day without the product' },
          with: { type: 'string', description: 'A day with the product' },
          time_saved: { type: 'string', description: 'Concrete time/money saved' },
        },
        required: ['persona', 'without', 'with', 'time_saved'],
      },
      key_questions: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            question: { type: 'string' },
            why_it_matters: { type: 'string' },
            validation_method: { type: 'string' },
            risk_level: { type: 'string', description: 'fatal, important, or minor' },
          },
          required: ['question', 'why_it_matters', 'validation_method', 'risk_level'],
        },
      },
    },
    required: ['problem_clarity', 'customer_use_case', 'key_questions'],
  },

  groupB: {
    type: 'object',
    properties: {
      market_sizing: {
        type: 'object',
        properties: {
          tam: { type: 'number' },
          sam: { type: 'number' },
          som: { type: 'number' },
          citations: { type: 'array', items: { type: 'string' } },
        },
        required: ['tam', 'sam', 'som', 'citations'],
      },
      competition: {
        type: 'object',
        properties: {
          competitors: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                name: { type: 'string' },
                description: { type: 'string' },
                // D-05 fix: Add strengths/weaknesses so Gemini generates them for competitor cards
                strengths: { type: 'array', items: { type: 'string' }, description: '2-3 key strengths of this competitor' },
                weaknesses: { type: 'array', items: { type: 'string' }, description: '2-3 key weaknesses or gaps' },
                threat_level: { type: 'string' },
              },
              required: ['name', 'description', 'strengths', 'weaknesses', 'threat_level'],
            },
          },
          citations: { type: 'array', items: { type: 'string' } },
          swot: {
            type: 'object',
            properties: {
              strengths: { type: 'array', items: { type: 'string' } },
              weaknesses: { type: 'array', items: { type: 'string' } },
              opportunities: { type: 'array', items: { type: 'string' } },
              threats: { type: 'array', items: { type: 'string' } },
            },
            required: ['strengths', 'weaknesses', 'opportunities', 'threats'],
          },
          feature_comparison: {
            type: 'object',
            properties: {
              features: { type: 'array', items: { type: 'string' } },
              competitors: { type: 'array', items: {
                type: 'object',
                properties: {
                  name: { type: 'string' },
                  has_feature: { type: 'array', items: { type: 'boolean' } },
                },
                required: ['name', 'has_feature'],
              }},
            },
            required: ['features', 'competitors'],
          },
          positioning: {
            type: 'object',
            properties: {
              x_axis: { type: 'string' },
              y_axis: { type: 'string' },
              positions: { type: 'array', items: {
                type: 'object',
                properties: {
                  name: { type: 'string' },
                  x: { type: 'number' },
                  y: { type: 'number' },
                  is_founder: { type: 'boolean' },
                },
                required: ['name', 'x', 'y', 'is_founder'],
              }},
            },
            required: ['x_axis', 'y_axis', 'positions'],
          },
        },
        required: ['competitors', 'citations', 'swot', 'feature_comparison', 'positioning'],
      },
      scores_matrix: {
        type: 'object',
        properties: {
          dimensions: { type: 'array', items: {
            type: 'object',
            properties: { name: { type: 'string' }, score: { type: 'number' }, weight: { type: 'number' } },
            required: ['name', 'score', 'weight'],
          }},
          overall_weighted: { type: 'number' },
        },
        required: ['dimensions', 'overall_weighted'],
      },
      top_threat: {
        type: 'object',
        properties: {
          assumption: { type: 'string' },
          if_wrong: { type: 'string' },
          severity: { type: 'string', description: 'fatal, risky, or watch' },
          impact: { type: 'string', description: 'high or low' },
          probability: { type: 'string', description: 'high or low' },
          how_to_test: { type: 'string' },
        },
        required: ['assumption', 'if_wrong', 'severity', 'impact', 'probability', 'how_to_test'],
      },
      risks_assumptions: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            assumption: { type: 'string' },
            if_wrong: { type: 'string' },
            severity: { type: 'string', description: 'fatal, risky, or watch' },
            impact: { type: 'string', description: 'high or low' },
            probability: { type: 'string', description: 'high or low' },
            how_to_test: { type: 'string' },
          },
          required: ['assumption', 'if_wrong', 'severity', 'impact', 'probability', 'how_to_test'],
        },
      },
    },
    required: ['market_sizing', 'competition', 'scores_matrix', 'top_threat', 'risks_assumptions'],
  },

  groupC: {
    type: 'object',
    properties: {
      mvp_scope: {
        type: 'object',
        properties: {
          one_liner: { type: 'string' },
          build: { type: 'array', items: { type: 'string' } },
          buy: { type: 'array', items: { type: 'string' } },
          skip_for_now: { type: 'array', items: { type: 'string' } },
          tests_assumption: { type: 'string' },
          success_metric: { type: 'string' },
          timeline_weeks: { type: 'number' },
        },
        required: ['one_liner', 'build', 'buy', 'skip_for_now', 'tests_assumption', 'success_metric', 'timeline_weeks'],
      },
      next_steps: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            action: { type: 'string' },
            timeframe: { type: 'string', description: 'week_1, month_1, or quarter_1' },
            effort: { type: 'string', description: 'low, medium, or high' },
          },
          required: ['action', 'timeframe', 'effort'],
        },
      },
      revenue_model: {
        type: 'object',
        properties: {
          recommended_model: { type: 'string' },
          reasoning: { type: 'string' },
          alternatives: { type: 'array', items: {
            type: 'object',
            properties: { model: { type: 'string' }, pros: { type: 'array', items: { type: 'string' } }, cons: { type: 'array', items: { type: 'string' } } },
            required: ['model', 'pros', 'cons'],
          }},
          unit_economics: {
            type: 'object',
            properties: { cac: { type: 'number' }, ltv: { type: 'number' }, ltv_cac_ratio: { type: 'number' }, payback_months: { type: 'number' } },
            required: ['cac', 'ltv', 'ltv_cac_ratio', 'payback_months'],
          },
        },
        required: ['recommended_model', 'reasoning', 'alternatives', 'unit_economics'],
      },
      financial_projections: {
        type: 'object',
        properties: {
          scenarios: { type: 'array', items: {
            type: 'object',
            properties: {
              name: { type: 'string' },
              y1_revenue: { type: 'number' },
              y3_revenue: { type: 'number' },
              y5_revenue: { type: 'number' },
              assumptions: { type: 'array', items: { type: 'string' } },
            },
            required: ['name', 'y1_revenue', 'y3_revenue', 'y5_revenue', 'assumptions'],
          }},
          break_even: {
            type: 'object',
            properties: {
              months: { type: 'number' },
              revenue_required: { type: 'number' },
              assumptions: { type: 'string' },
            },
            required: ['months', 'revenue_required', 'assumptions'],
          },
          key_assumption: { type: 'string' },
        },
        required: ['scenarios', 'break_even', 'key_assumption'],
      },
      team_hiring: {
        type: 'object',
        properties: {
          current_gaps: { type: 'array', items: { type: 'string' } },
          mvp_roles: { type: 'array', items: {
            type: 'object',
            properties: { role: { type: 'string' }, priority: { type: 'number' }, rationale: { type: 'string' }, monthly_cost: { type: 'number' } },
            required: ['role', 'priority', 'rationale', 'monthly_cost'],
          }},
          monthly_burn: { type: 'number' },
          advisory_needs: { type: 'array', items: { type: 'string' } },
        },
        required: ['current_gaps', 'mvp_roles', 'monthly_burn', 'advisory_needs'],
      },
      technology_stack: {
        type: 'object',
        properties: {
          stack_components: { type: 'array', items: {
            type: 'object',
            properties: { name: { type: 'string' }, choice: { type: 'string' }, rationale: { type: 'string' } },
            required: ['name', 'choice', 'rationale'],
          }},
          feasibility: { type: 'string' },
          feasibility_rationale: { type: 'string' },
          technical_risks: { type: 'array', items: {
            type: 'object',
            properties: { risk: { type: 'string' }, likelihood: { type: 'string' }, mitigation: { type: 'string' } },
            required: ['risk', 'likelihood', 'mitigation'],
          }},
          mvp_timeline_weeks: { type: 'number' },
        },
        required: ['stack_components', 'feasibility', 'feasibility_rationale', 'technical_risks', 'mvp_timeline_weeks'],
      },
      resources_links: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            category: { type: 'string' },
            links: { type: 'array', items: {
              type: 'object',
              properties: { title: { type: 'string' }, url: { type: 'string' }, description: { type: 'string' } },
              required: ['title', 'url', 'description'],
            }},
          },
          required: ['category', 'links'],
        },
      },
    },
    required: ['mvp_scope', 'next_steps', 'revenue_model', 'financial_projections', 'team_hiring', 'technology_stack', 'resources_links'],
  },

  groupD: {
    type: 'object',
    properties: {
      summary_verdict: { type: 'string', description: 'Executive summary narrative (180-220 words): opportunity with numbers, one Imagine scenario, core risk, win/must/fail, and Go/Conditional Go/No-Go verdict' },
      verdict_oneliner: { type: 'string', description: 'Complete sentence with clear stance, e.g. "This is a strong niche play that works if you can acquire clinics at under $200 each."' },
      success_condition: { type: 'string', description: 'Single testable condition with a number or threshold, e.g. "Signing 5 pilot clinics within 60 days at $299/month with 80%+ retention"' },
      biggest_risk: { type: 'string', description: 'Single biggest risk stated so a non-expert understands it, citing specific evidence from the analysis' },
    },
    required: ['summary_verdict', 'verdict_oneliner', 'success_condition', 'biggest_risk'],
  },

  // V3: Dimension detail schema (building block for Group E)
  dimensionDetail: {
    type: 'object',
    properties: {
      composite_score: { type: 'number', description: '0-100 dimension score' },
      sub_scores: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            name: { type: 'string' },
            score: { type: 'number' },
            label: { type: 'string' },
          },
          required: ['name', 'score', 'label'],
        },
      },
      executive_summary: { type: 'string' },
      risk_signals: { type: 'array', items: { type: 'string' } },
      priority_actions: { type: 'array', items: { type: 'string' } },
    },
    required: ['composite_score', 'sub_scores', 'executive_summary', 'risk_signals', 'priority_actions'],
  },
} as const;

export const DIMENSION_SUB_SCORES = {
  problem:     ['pain_intensity', 'frequency', 'economic_impact', 'replacement_urgency'],
  customer:    ['icp_specificity', 'buyer_authority', 'workflow_disruption', 'willingness_to_pay'],
  market:      ['tam_methodology', 'niche_focus', 'growth_trajectory', 'distribution_feasibility'],
  competition: ['differentiation_depth', 'switching_cost', 'replicability_risk', 'competitive_reaction'],
  revenue:     ['pricing_clarity', 'monetization_validation', 'unit_economics', 'margin_sustainability'],
  ai_strategy: ['ai_differentiation', 'data_advantage', 'automation_readiness', 'governance_maturity'],
  execution:   ['capability_match', 'resource_allocation', 'timeline_realism', 'operational_complexity'],
  validation:  ['evidence_tier', 'experiment_count', 'signal_strength', 'assumption_coverage'],
  risk:        ['financial_risk', 'regulatory_risk', 'execution_risk', 'market_volatility', 'dependency_risk'],
} as const;

// ---------------------------------------------------------------------------
// V3 MVP-02: Per-dimension Group E schemas
// Each dimension returns DimensionDetail + headline + diagram data.
// Diagram schemas match frontend v3-report.ts types (camelCase for diagram fields).
// ---------------------------------------------------------------------------

/** Base dimension detail properties — shared across all 9 dimension schemas */
function baseDimensionProps(subScoreNames: readonly string[]) {
  return {
    composite_score: { type: 'number', description: '0-100 dimension score' },
    sub_scores: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          name: { type: 'string', description: `One of: ${subScoreNames.join(', ')}` },
          score: { type: 'number', description: '0-100' },
          label: { type: 'string', description: 'Human-readable label' },
        },
        required: ['name', 'score', 'label'],
      },
    },
    headline: { type: 'string', description: 'One-line assessment (10-15 words)' },
    executive_summary: { type: 'string', description: '2-3 sentence assessment' },
    risk_signals: { type: 'array', items: { type: 'string' }, description: '2-3 key risk signals' },
    priority_actions: { type: 'array', items: { type: 'string' }, description: '2-3 priority actions' },
  };
}

const BASE_REQUIRED = ['composite_score', 'sub_scores', 'headline', 'executive_summary', 'risk_signals', 'priority_actions'];

export const DIMENSION_SCHEMAS: Record<string, Record<string, unknown>> = {
  problem: {
    type: 'object',
    properties: {
      ...baseDimensionProps(DIMENSION_SUB_SCORES.problem),
      diagram: {
        type: 'object',
        description: 'Pain chain: causal flow from trigger → symptom → consequence → cost',
        properties: {
          nodes: { type: 'array', items: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              label: { type: 'string' },
              type: { type: 'string', description: 'trigger | symptom | consequence | cost' },
            },
            required: ['id', 'label', 'type'],
          }},
          edges: { type: 'array', items: {
            type: 'object',
            properties: {
              from: { type: 'string' },
              to: { type: 'string' },
              label: { type: 'string' },
            },
            required: ['from', 'to'],
          }},
        },
        required: ['nodes', 'edges'],
      },
    },
    required: [...BASE_REQUIRED, 'diagram'],
  },

  customer: {
    type: 'object',
    properties: {
      ...baseDimensionProps(DIMENSION_SUB_SCORES.customer),
      diagram: {
        type: 'object',
        description: 'ICP funnel: narrowing customer tiers from broad → narrow',
        properties: {
          tiers: { type: 'array', items: {
            type: 'object',
            properties: {
              label: { type: 'string' },
              count: { type: 'string', description: 'e.g. "~5M companies"' },
              criteria: { type: 'array', items: { type: 'string' } },
            },
            required: ['label', 'count', 'criteria'],
          }},
        },
        required: ['tiers'],
      },
    },
    required: [...BASE_REQUIRED, 'diagram'],
  },

  market: {
    type: 'object',
    properties: {
      ...baseDimensionProps(DIMENSION_SUB_SCORES.market),
      diagram: {
        type: 'object',
        description: 'TAM pyramid: 3-tier market sizing',
        properties: {
          tam: { type: 'object', properties: { value: { type: 'number' }, label: { type: 'string' }, methodology: { type: 'string' } }, required: ['value', 'label'] },
          sam: { type: 'object', properties: { value: { type: 'number' }, label: { type: 'string' }, methodology: { type: 'string' } }, required: ['value', 'label'] },
          som: { type: 'object', properties: { value: { type: 'number' }, label: { type: 'string' }, methodology: { type: 'string' } }, required: ['value', 'label'] },
          growth_rate: { type: 'number' },
          sources: { type: 'array', items: { type: 'string' } },
        },
        required: ['tam', 'sam', 'som'],
      },
    },
    required: [...BASE_REQUIRED, 'diagram'],
  },

  competition: {
    type: 'object',
    properties: {
      ...baseDimensionProps(DIMENSION_SUB_SCORES.competition),
      diagram: {
        type: 'object',
        description: 'Positioning matrix: 2x2 with competitor positions',
        properties: {
          x_axis: { type: 'string' },
          y_axis: { type: 'string' },
          positions: { type: 'array', items: {
            type: 'object',
            properties: {
              name: { type: 'string' },
              x: { type: 'number', description: '0-100' },
              y: { type: 'number', description: '0-100' },
              is_founder: { type: 'boolean' },
            },
            required: ['name', 'x', 'y', 'is_founder'],
          }},
        },
        required: ['x_axis', 'y_axis', 'positions'],
      },
    },
    required: [...BASE_REQUIRED, 'diagram'],
  },

  revenue: {
    type: 'object',
    properties: {
      ...baseDimensionProps(DIMENSION_SUB_SCORES.revenue),
      diagram: {
        type: 'object',
        description: 'Revenue engine: pipeline flow stages + unit economics',
        properties: {
          stages: { type: 'array', items: {
            type: 'object',
            properties: {
              label: { type: 'string' },
              value: { type: 'string' },
              conversion_rate: { type: 'number' },
            },
            required: ['label', 'value'],
          }},
          model: { type: 'string' },
          unit_economics: {
            type: 'object',
            properties: {
              cac: { type: 'number' },
              ltv: { type: 'number' },
              ltv_cac_ratio: { type: 'number' },
              payback_months: { type: 'number' },
            },
            required: ['cac', 'ltv', 'ltv_cac_ratio', 'payback_months'],
          },
        },
        required: ['stages', 'model'],
      },
    },
    required: [...BASE_REQUIRED, 'diagram'],
  },

  'ai-strategy': {
    type: 'object',
    properties: {
      ...baseDimensionProps(DIMENSION_SUB_SCORES.ai_strategy),
      diagram: {
        type: 'object',
        description: 'Capability stack: layered tech capabilities with maturity',
        properties: {
          layers: { type: 'array', items: {
            type: 'object',
            properties: {
              name: { type: 'string' },
              description: { type: 'string' },
              maturity: { type: 'string', description: 'nascent | developing | mature' },
              components: { type: 'array', items: { type: 'string' } },
            },
            required: ['name', 'description', 'maturity'],
          }},
          automation_level: { type: 'string', description: 'assist | copilot | agent' },
          data_strategy: { type: 'string', description: 'owned | borrowed | hybrid' },
        },
        required: ['layers', 'automation_level', 'data_strategy'],
      },
    },
    required: [...BASE_REQUIRED, 'diagram'],
  },

  execution: {
    type: 'object',
    properties: {
      ...baseDimensionProps(DIMENSION_SUB_SCORES.execution),
      diagram: {
        type: 'object',
        description: 'Execution timeline: phased milestones',
        properties: {
          phases: { type: 'array', items: {
            type: 'object',
            properties: {
              name: { type: 'string' },
              duration: { type: 'string' },
              milestones: { type: 'array', items: { type: 'string' } },
              status: { type: 'string', description: 'completed | in-progress | planned' },
            },
            required: ['name', 'duration', 'milestones'],
          }},
          total_duration: { type: 'string' },
        },
        required: ['phases'],
      },
    },
    required: [...BASE_REQUIRED, 'diagram'],
  },

  traction: {
    type: 'object',
    properties: {
      ...baseDimensionProps(DIMENSION_SUB_SCORES.validation),
      diagram: {
        type: 'object',
        description: 'Evidence funnel: validated vs assumed evidence tiers',
        properties: {
          tiers: { type: 'array', items: {
            type: 'object',
            properties: {
              label: { type: 'string' },
              items: { type: 'array', items: {
                type: 'object',
                properties: {
                  claim: { type: 'string' },
                  evidence: { type: 'string' },
                  confidence: { type: 'string', description: 'verified | partial | assumed' },
                },
                required: ['claim', 'evidence', 'confidence'],
              }},
            },
            required: ['label', 'items'],
          }},
          overall_confidence: { type: 'string', description: 'high | medium | low | none' },
        },
        required: ['tiers', 'overall_confidence'],
      },
    },
    required: [...BASE_REQUIRED, 'diagram'],
  },

  risk: {
    type: 'object',
    properties: {
      ...baseDimensionProps(DIMENSION_SUB_SCORES.risk),
      diagram: {
        type: 'object',
        description: 'Risk heat grid: probability vs impact matrix',
        properties: {
          risks: { type: 'array', items: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              label: { type: 'string' },
              category: { type: 'string' },
              probability: { type: 'string', description: 'high | medium | low' },
              impact: { type: 'string', description: 'high | medium | low' },
              mitigation: { type: 'string' },
            },
            required: ['id', 'label', 'category', 'probability', 'impact'],
          }},
          categories: { type: 'array', items: { type: 'string' } },
        },
        required: ['risks', 'categories'],
      },
    },
    required: [...BASE_REQUIRED, 'diagram'],
  },
};
