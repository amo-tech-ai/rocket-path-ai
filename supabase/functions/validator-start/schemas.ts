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
    },
    required: ['idea', 'problem', 'customer', 'solution', 'differentiation', 'alternatives', 'validation', 'industry', 'websites'],
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
    },
    required: ['direct_competitors', 'indirect_competitors', 'market_gaps', 'sources'],
  },

  scoring: {
    type: 'object',
    properties: {
      overall_score: { type: 'number', description: '0-100 overall score' },
      verdict: { type: 'string', description: 'go, caution, or no_go' },
      dimension_scores: {
        type: 'object',
        properties: {
          problemClarity: { type: 'number' },
          solutionStrength: { type: 'number' },
          marketSize: { type: 'number' },
          competition: { type: 'number' },
          businessModel: { type: 'number' },
          teamFit: { type: 'number' },
          timing: { type: 'number' },
        },
        required: ['problemClarity', 'solutionStrength', 'marketSize', 'competition', 'businessModel', 'teamFit', 'timing'],
      },
      market_factors: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            name: { type: 'string' },
            score: { type: 'number' },
            description: { type: 'string' },
            status: { type: 'string', description: 'strong, moderate, or weak' },
          },
          required: ['name', 'score', 'description', 'status'],
        },
      },
      execution_factors: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            name: { type: 'string' },
            score: { type: 'number' },
            description: { type: 'string' },
            status: { type: 'string', description: 'strong, moderate, or weak' },
          },
          required: ['name', 'score', 'description', 'status'],
        },
      },
      highlights: { type: 'array', items: { type: 'string' } },
      red_flags: { type: 'array', items: { type: 'string' } },
      risks_assumptions: { type: 'array', items: { type: 'string' } },
    },
    required: ['overall_score', 'verdict', 'dimension_scores', 'market_factors', 'execution_factors', 'highlights', 'red_flags', 'risks_assumptions'],
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
    },
    required: ['mvp_scope', 'phases', 'next_steps'],
  },

  // P02: Expanded composer schema — 14 sections (up from 8)
  composer: {
    type: 'object',
    properties: {
      // Top-level findings
      highlights: { type: 'array', items: { type: 'string' }, description: '3-5 key strengths of this startup idea' },
      red_flags: { type: 'array', items: { type: 'string' }, description: '3-5 critical concerns or red flags' },
      // Original 8 sections
      summary_verdict: { type: 'string', description: '3-sentence executive summary with score and verdict' },
      problem_clarity: { type: 'string', description: 'Problem clarity, urgency, and customer pain analysis (2-3 paragraphs)' },
      customer_use_case: { type: 'string', description: 'Target customer and use case description (2-3 paragraphs)' },
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
      risks_assumptions: { type: 'array', items: { type: 'string' } },
      mvp_scope: { type: 'string' },
      next_steps: { type: 'array', items: { type: 'string' } },
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
