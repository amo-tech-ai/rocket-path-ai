/**
 * Universal Industry Categories with Sub-categories
 * Broad, scalable categories for startup classification
 */

export interface SubCategory {
  id: string;
  label: string;
}

export interface IndustryOption {
  id: string;
  label: string;
  icon: string;
  subcategories?: SubCategory[];
}

export const UNIVERSAL_INDUSTRIES: IndustryOption[] = [
  { 
    id: 'saas_software', 
    label: 'SaaS & Software', 
    icon: '💻',
    subcategories: [
      { id: 'horizontal_saas', label: 'Horizontal SaaS' },
      { id: 'vertical_saas', label: 'Vertical SaaS' },
      { id: 'developer_tools', label: 'Developer Tools' },
      { id: 'infrastructure', label: 'Infrastructure' },
      { id: 'productivity', label: 'Productivity' },
    ]
  },
  { 
    id: 'ai_data', 
    label: 'Artificial Intelligence & Data', 
    icon: '🤖',
    subcategories: [
      { id: 'ml_platforms', label: 'ML Platforms' },
      { id: 'generative_ai', label: 'Generative AI' },
      { id: 'ai_infrastructure', label: 'AI Infrastructure' },
      { id: 'data_analytics', label: 'Data & Analytics' },
      { id: 'computer_vision', label: 'Computer Vision' },
      { id: 'nlp', label: 'NLP & Language Models' },
    ]
  },
  { 
    id: 'fintech_payments', 
    label: 'FinTech & Payments', 
    icon: '💳',
    subcategories: [
      { id: 'payments', label: 'Payments' },
      { id: 'lending', label: 'Lending' },
      { id: 'banking', label: 'Banking & Neobanks' },
      { id: 'insurance', label: 'InsurTech' },
      { id: 'wealth_management', label: 'Wealth Management' },
      { id: 'crypto_blockchain', label: 'Crypto & Blockchain' },
    ]
  },
  { 
    id: 'ecommerce_marketplaces', 
    label: 'E-commerce & Marketplaces', 
    icon: '🛒',
    subcategories: [
      { id: 'b2c_ecommerce', label: 'B2C E-commerce' },
      { id: 'b2b_marketplaces', label: 'B2B Marketplaces' },
      { id: 'social_commerce', label: 'Social Commerce' },
      { id: 'commerce_infrastructure', label: 'Commerce Infrastructure' },
      { id: 'd2c_brands', label: 'D2C Brands' },
    ]
  },
  { 
    id: 'healthcare_life_sciences', 
    label: 'Healthcare & Life Sciences', 
    icon: '🏥',
    subcategories: [
      { id: 'digital_health', label: 'Digital Health' },
      { id: 'biotech', label: 'Biotech' },
      { id: 'medtech', label: 'MedTech & Devices' },
      { id: 'health_insurance', label: 'Health Insurance' },
      { id: 'mental_health', label: 'Mental Health' },
      { id: 'clinical_trials', label: 'Clinical Trials' },
    ]
  },
  { 
    id: 'education_learning', 
    label: 'Education & Learning', 
    icon: '📚',
    subcategories: [
      { id: 'k12', label: 'K-12 Education' },
      { id: 'higher_ed', label: 'Higher Education' },
      { id: 'corporate_training', label: 'Corporate Training' },
      { id: 'edtech_tools', label: 'EdTech Tools' },
      { id: 'online_courses', label: 'Online Courses' },
    ]
  },
  { 
    id: 'media_content_creator', 
    label: 'Media, Content & Creator Economy', 
    icon: '🎬',
    subcategories: [
      { id: 'creator_tools', label: 'Creator Tools' },
      { id: 'streaming', label: 'Streaming & Video' },
      { id: 'podcasting', label: 'Podcasting & Audio' },
      { id: 'newsletters', label: 'Newsletters & Publishing' },
      { id: 'social_media', label: 'Social Media' },
    ]
  },
  { 
    id: 'enterprise_b2b', 
    label: 'Enterprise & B2B Solutions', 
    icon: '🏢',
    subcategories: [
      { id: 'enterprise_software', label: 'Enterprise Software' },
      { id: 'hr_tech', label: 'HR Tech' },
      { id: 'sales_tools', label: 'Sales & CRM' },
      { id: 'marketing_tech', label: 'Marketing Tech' },
      { id: 'security', label: 'Cybersecurity' },
    ]
  },
  { 
    id: 'consumer_apps', 
    label: 'Consumer Apps & Platforms', 
    icon: '📱',
    subcategories: [
      { id: 'social_apps', label: 'Social Apps' },
      { id: 'dating', label: 'Dating' },
      { id: 'fitness', label: 'Fitness & Wellness' },
      { id: 'productivity_apps', label: 'Productivity Apps' },
      { id: 'finance_apps', label: 'Personal Finance' },
    ]
  },
  { 
    id: 'logistics_mobility', 
    label: 'Logistics, Supply Chain & Mobility', 
    icon: '🚚',
    subcategories: [
      { id: 'delivery', label: 'Delivery & Last-mile' },
      { id: 'fleet_management', label: 'Fleet Management' },
      { id: 'warehouse', label: 'Warehousing' },
      { id: 'ev_mobility', label: 'EV & Mobility' },
      { id: 'supply_chain', label: 'Supply Chain Tech' },
    ]
  },
  { 
    id: 'real_estate', 
    label: 'Real Estate', 
    icon: '🏠',
    subcategories: [
      { id: 'proptech', label: 'PropTech' },
      { id: 'property_management', label: 'Property Management' },
      { id: 'real_estate_investing', label: 'RE Investing' },
      { id: 'construction_tech', label: 'Construction Tech' },
    ]
  },
  { 
    id: 'gaming_entertainment', 
    label: 'Gaming & Entertainment', 
    icon: '🎮',
    subcategories: [
      { id: 'gaming', label: 'Gaming' },
      { id: 'esports', label: 'Esports' },
      { id: 'vr_ar', label: 'VR/AR' },
      { id: 'metaverse', label: 'Metaverse' },
      { id: 'sports_tech', label: 'Sports Tech' },
    ]
  },
];

// Industry-specific questions (8 per category)
export const INDUSTRY_QUESTIONS: Record<string, string[]> = {
  saas_software: [
    "What's your current MRR/ARR?",
    "What's your monthly churn rate?",
    "What's your average contract value (ACV)?",
    "How long is your typical sales cycle?",
    "What's your customer acquisition cost (CAC)?",
    "What's your lifetime value (LTV)?",
    "How many paying customers do you have?",
    "What's your net revenue retention (NRR)?",
  ],
  ai_data: [
    "What proprietary data or models do you have?",
    "How do you ensure model accuracy and reduce hallucinations?",
    "What's your inference cost per query?",
    "How do you handle data privacy and compliance?",
    "What's your model training infrastructure?",
    "Do you have any published research or patents?",
    "How do you differentiate from foundation model providers?",
    "What's your time to value for customers?",
  ],
  fintech_payments: [
    "What licenses or regulatory approvals do you have?",
    "What's your total payment volume (TPV)?",
    "How do you handle fraud and risk?",
    "What's your take rate / revenue per transaction?",
    "Who are your banking partners?",
    "What compliance frameworks do you follow (PCI-DSS, SOC2)?",
    "How long is your onboarding process for merchants?",
    "What's your default rate (for lending)?",
  ],
  ecommerce_marketplaces: [
    "What's your gross merchandise value (GMV)?",
    "What's your take rate?",
    "How do you solve the chicken-and-egg problem?",
    "What's your supply and demand liquidity?",
    "How do you prevent disintermediation?",
    "What's your repeat purchase rate?",
    "How do you handle fulfillment and logistics?",
    "What's your unit economics per transaction?",
  ],
  healthcare_life_sciences: [
    "What clinical validation or studies do you have?",
    "What regulatory approvals (FDA, CE) do you have or are pursuing?",
    "How do you ensure HIPAA compliance?",
    "What's your reimbursement strategy?",
    "Who are your key opinion leaders (KOLs)?",
    "What's your evidence generation plan?",
    "How do you integrate with existing EMR/EHR systems?",
    "What's your patient acquisition cost?",
  ],
  education_learning: [
    "What learning outcomes can you demonstrate?",
    "What's your completion rate?",
    "How do you measure engagement?",
    "What's your student acquisition cost?",
    "How do you work with schools/institutions?",
    "What accreditation or certifications do you offer?",
    "How do you personalize the learning experience?",
    "What's your revenue per student?",
  ],
  media_content_creator: [
    "How many active creators use your platform?",
    "What's your creator retention rate?",
    "How do you help creators monetize?",
    "What's your average revenue per creator?",
    "How do you handle content moderation?",
    "What distribution channels do you leverage?",
    "How do you compete with large platforms (YouTube, TikTok)?",
    "What's your user-generated content volume?",
  ],
  enterprise_b2b: [
    "Who are your champion buyers (title/role)?",
    "What's your average deal size?",
    "How long is your implementation cycle?",
    "What integrations do you support?",
    "What's your logo churn rate?",
    "How do you expand within accounts?",
    "What security certifications do you have (SOC2, ISO27001)?",
    "What's your gross margin?",
  ],
  consumer_apps: [
    "What's your DAU/MAU ratio?",
    "What's your Day 1, Day 7, Day 30 retention?",
    "How do you acquire users?",
    "What's your viral coefficient (K-factor)?",
    "How do you monetize?",
    "What's your average session length?",
    "What's your ARPU?",
    "How do you compete with incumbent apps?",
  ],
  logistics_mobility: [
    "What's your cost per delivery/mile?",
    "What's your on-time delivery rate?",
    "How do you manage fleet utilization?",
    "What's your route optimization approach?",
    "How do you handle last-mile challenges?",
    "What's your driver/partner retention?",
    "What's your average order value?",
    "How do you ensure sustainability/reduce emissions?",
  ],
  real_estate: [
    "What's your transaction volume?",
    "How do you acquire properties or leads?",
    "What's your occupancy or fill rate?",
    "How do you differentiate from traditional brokers?",
    "What's your average property value?",
    "How do you handle property management?",
    "What's your take rate on transactions?",
    "How do you ensure regulatory compliance?",
  ],
  gaming_entertainment: [
    "What's your DAU/MAU?",
    "What's your session length?",
    "How do you monetize (in-app, ads, subscriptions)?",
    "What's your ARPDAU?",
    "What's your user acquisition cost?",
    "How do you retain players long-term?",
    "What platforms do you support?",
    "What's your content update cadence?",
  ],
};

// Mapping from enum ID to display label
export const INDUSTRY_LABELS: Record<string, string> = Object.fromEntries(
  UNIVERSAL_INDUSTRIES.map(ind => [ind.id, ind.label])
);

// Get industry by ID
export function getIndustryById(id: string): IndustryOption | undefined {
  return UNIVERSAL_INDUSTRIES.find(ind => ind.id === id);
}

// Get label by ID (with fallback)
export function getIndustryLabel(id: string): string {
  return INDUSTRY_LABELS[id] || id;
}

// Get subcategories for an industry
export function getSubcategories(industryId: string): SubCategory[] {
  const industry = getIndustryById(industryId);
  return industry?.subcategories || [];
}

// Get questions for an industry
export function getIndustryQuestions(industryId: string): string[] {
  return INDUSTRY_QUESTIONS[industryId] || [];
}
