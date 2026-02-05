# Edge Functions Wizard Patterns

**Document:** 15-wizard-functions.md
**Version:** 1.0
**Date:** January 15, 2026
**Status:** Production-Ready

---

## Overview

This guide covers best practices for implementing multi-step wizard flows in Supabase Edge Functions. Covers data extraction, progressive enhancement, session management, and AI-powered autofill.

---

## Table of Contents

1. [Wizard Architecture](#wizard-architecture)
2. [Session Management](#session-management)
3. [Data Extraction Actions](#data-extraction-actions)
4. [Profile Building](#profile-building)
5. [Smart Autofill](#smart-autofill)
6. [Wizard Completion Flow](#wizard-completion-flow)
7. [Error Recovery](#error-recovery)

---

## Wizard Architecture

### 3-Step Wizard Flow

```
Step 1: Profile & Business    → AI extracts from URL/LinkedIn
Step 2: Traction & Funding    → AI analyzes readiness
Step 3: Review & Insights     → AI generates tasks, saves startup
```

### Edge Function Actions

| Action | Purpose | Agent | Step |
|--------|---------|-------|------|
| `wizard_create_session` | Create new wizard session | - | 0 |
| `wizard_extract_startup` | Extract profile from URLs | ProfileExtractor | 1 |
| `wizard_extract_linkedin` | Extract from LinkedIn | ProfileExtractor | 1 |
| `wizard_analyze_readiness` | Analyze startup readiness | RiskAnalyzer | 2 |
| `wizard_generate_tasks` | Generate initial tasks | TaskGenerator | 3 |
| `wizard_complete` | Save startup and complete | - | 3 |

---

## Session Management

### Create Wizard Session

```typescript
// supabase/functions/ai-helper/wizard/create-session.ts

interface CreateSessionInput {
  userId: string
  existingStartupId?: string  // For editing existing startup
}

interface CreateSessionOutput {
  sessionId: string
  currentStep: number
  formData: Record<string, any>
}

export async function createWizardSession(
  input: CreateSessionInput,
  supabase: SupabaseClient
): Promise<CreateSessionOutput> {
  // Check for existing in-progress session
  const { data: existing } = await supabase
    .from('wizard_sessions')
    .select('*')
    .eq('user_id', input.userId)
    .eq('status', 'in_progress')
    .order('created_at', { ascending: false })
    .limit(1)
    .single()

  if (existing) {
    // Resume existing session
    return {
      sessionId: existing.id,
      currentStep: existing.current_step,
      formData: existing.form_data || {}
    }
  }

  // Load existing startup data if editing
  let formData = {}
  if (input.existingStartupId) {
    const { data: startup } = await supabase
      .from('startups')
      .select('*')
      .eq('id', input.existingStartupId)
      .single()

    if (startup) {
      formData = {
        name: startup.name,
        tagline: startup.tagline,
        description: startup.description,
        industry: startup.industry,
        stage: startup.stage,
        website: startup.website,
        linkedin_url: startup.linkedin_url,
        team_size: startup.team_size,
        founded: startup.founded,
        location: startup.location,
        traction_data: startup.traction_data,
        funding_stage: startup.funding_stage,
        last_funding_amount: startup.last_funding_amount,
      }
    }
  }

  // Create new session
  const { data: session, error } = await supabase
    .from('wizard_sessions')
    .insert({
      user_id: input.userId,
      startup_id: input.existingStartupId,
      current_step: 1,
      status: 'in_progress',
      form_data: formData,
      started_at: new Date().toISOString(),
      last_activity_at: new Date().toISOString(),
    })
    .select()
    .single()

  if (error) throw error

  return {
    sessionId: session.id,
    currentStep: 1,
    formData: session.form_data
  }
}
```

### Update Session Progress

```typescript
// supabase/functions/ai-helper/wizard/update-session.ts

interface UpdateSessionInput {
  sessionId: string
  step?: number
  formData?: Record<string, any>
  diagnosticAnswers?: Record<string, any>
  signals?: string[]
  aiExtractions?: Record<string, any>
}

export async function updateWizardSession(
  input: UpdateSessionInput,
  supabase: SupabaseClient
): Promise<void> {
  const updates: Record<string, any> = {
    last_activity_at: new Date().toISOString()
  }

  if (input.step !== undefined) {
    updates.current_step = input.step
  }

  if (input.formData) {
    // Merge with existing form data
    const { data: current } = await supabase
      .from('wizard_sessions')
      .select('form_data')
      .eq('id', input.sessionId)
      .single()

    updates.form_data = {
      ...(current?.form_data || {}),
      ...input.formData
    }
  }

  if (input.diagnosticAnswers) {
    const { data: current } = await supabase
      .from('wizard_sessions')
      .select('diagnostic_answers')
      .eq('id', input.sessionId)
      .single()

    updates.diagnostic_answers = {
      ...(current?.diagnostic_answers || {}),
      ...input.diagnosticAnswers
    }
  }

  if (input.signals) {
    updates.signals = input.signals
  }

  if (input.aiExtractions) {
    const { data: current } = await supabase
      .from('wizard_sessions')
      .select('ai_extractions')
      .eq('id', input.sessionId)
      .single()

    updates.ai_extractions = {
      ...(current?.ai_extractions || {}),
      ...input.aiExtractions
    }
  }

  // Calculate profile strength
  updates.profile_strength = calculateProfileStrength(updates.form_data || {})

  await supabase
    .from('wizard_sessions')
    .update(updates)
    .eq('id', input.sessionId)
}

function calculateProfileStrength(formData: Record<string, any>): number {
  const fields = [
    'name', 'tagline', 'description', 'industry', 'stage',
    'website', 'linkedin_url', 'team_size', 'founded', 'location',
    'traction_data', 'funding_stage'
  ]

  const filled = fields.filter(f => {
    const value = formData[f]
    if (typeof value === 'object') {
      return Object.keys(value).length > 0
    }
    return value !== undefined && value !== null && value !== ''
  }).length

  return Math.round((filled / fields.length) * 100)
}
```

---

## Data Extraction Actions

### URL Extraction

```typescript
// supabase/functions/ai-helper/wizard/extract-url.ts

import { ProfileExtractorAgent } from '../agents/profile-extractor.ts'

interface ExtractUrlInput {
  sessionId: string
  url: string
}

interface ExtractUrlOutput {
  extracted: StartupProfile
  confidence: number
  fieldsExtracted: string[]
}

export async function extractFromUrl(
  input: ExtractUrlInput,
  context: AgentContext,
  supabase: SupabaseClient
): Promise<ExtractUrlOutput> {
  // Validate URL
  if (!isValidUrl(input.url)) {
    throw new Error('Invalid URL provided')
  }

  // Create extraction record
  const { data: extraction } = await supabase
    .from('wizard_extractions')
    .insert({
      session_id: input.sessionId,
      extraction_type: 'url',
      source_url: input.url,
    })
    .select()
    .single()

  // Run ProfileExtractor agent
  const agent = new ProfileExtractorAgent()
  const result = await agent.execute(
    { url: input.url },
    context
  )

  if (!result.success) {
    // Update extraction with error
    await supabase
      .from('wizard_extractions')
      .update({
        extracted_data: { error: result.error },
        confidence: 0
      })
      .eq('id', extraction.id)

    throw new Error(result.error || 'Extraction failed')
  }

  // Update extraction record
  await supabase
    .from('wizard_extractions')
    .update({
      extracted_data: result.data,
      confidence: result.confidence,
      ai_run_id: context.aiRunId  // If logged
    })
    .eq('id', extraction.id)

  // Merge into session form data
  await updateWizardSession({
    sessionId: input.sessionId,
    formData: flattenProfile(result.data!),
    aiExtractions: {
      url: {
        source: input.url,
        data: result.data,
        confidence: result.confidence,
        extractedAt: new Date().toISOString()
      }
    }
  }, supabase)

  // Identify which fields were extracted
  const fieldsExtracted = Object.keys(result.data || {}).filter(k => {
    const v = (result.data as any)[k]
    return v !== undefined && v !== null && v !== ''
  })

  return {
    extracted: result.data!,
    confidence: result.confidence || 0,
    fieldsExtracted
  }
}

function flattenProfile(profile: StartupProfile): Record<string, any> {
  return {
    name: profile.name,
    tagline: profile.tagline,
    description: profile.description,
    industry: profile.industry,
    stage: profile.stage,
    website: profile.website,
    linkedin_url: profile.linkedinUrl,
    team_size: profile.teamSize,
    founded: profile.founded,
    location: profile.location,
    funding_stage: profile.fundingStage,
    last_funding_amount: profile.lastFundingAmount,
  }
}
```

### LinkedIn Extraction

```typescript
// supabase/functions/ai-helper/wizard/extract-linkedin.ts

interface ExtractLinkedInInput {
  sessionId: string
  linkedinUrl: string
}

export async function extractFromLinkedIn(
  input: ExtractLinkedInInput,
  context: AgentContext,
  supabase: SupabaseClient
): Promise<ExtractUrlOutput> {
  // Validate LinkedIn URL
  if (!input.linkedinUrl.includes('linkedin.com')) {
    throw new Error('Invalid LinkedIn URL')
  }

  // Create extraction record
  const { data: extraction } = await supabase
    .from('wizard_extractions')
    .insert({
      session_id: input.sessionId,
      extraction_type: 'linkedin',
      source_url: input.linkedinUrl,
    })
    .select()
    .single()

  // Run ProfileExtractor with LinkedIn URL
  const agent = new ProfileExtractorAgent()
  const result = await agent.execute(
    { linkedinUrl: input.linkedinUrl },
    context
  )

  if (!result.success) {
    throw new Error(result.error || 'LinkedIn extraction failed')
  }

  // Update extraction and session
  await supabase
    .from('wizard_extractions')
    .update({
      extracted_data: result.data,
      confidence: result.confidence
    })
    .eq('id', extraction.id)

  await updateWizardSession({
    sessionId: input.sessionId,
    formData: {
      linkedin_url: input.linkedinUrl,
      ...flattenProfile(result.data!)
    },
    aiExtractions: {
      linkedin: {
        source: input.linkedinUrl,
        data: result.data,
        confidence: result.confidence
      }
    }
  }, supabase)

  return {
    extracted: result.data!,
    confidence: result.confidence || 0,
    fieldsExtracted: Object.keys(result.data || {})
  }
}
```

### Pitch Deck Extraction

```typescript
// supabase/functions/ai-helper/wizard/extract-pitch-deck.ts

interface ExtractPitchDeckInput {
  sessionId: string
  fileId: string  // file_uploads.id
}

export async function extractFromPitchDeck(
  input: ExtractPitchDeckInput,
  context: AgentContext,
  supabase: SupabaseClient
): Promise<ExtractUrlOutput> {
  // Get file info
  const { data: file } = await supabase
    .from('file_uploads')
    .select('storage_path, bucket, mime_type')
    .eq('id', input.fileId)
    .single()

  if (!file) {
    throw new Error('File not found')
  }

  // Download file from storage
  const { data: fileData, error: downloadError } = await supabase
    .storage
    .from(file.bucket)
    .download(file.storage_path)

  if (downloadError) {
    throw new Error('Failed to download file')
  }

  // Extract text content (depends on mime type)
  let textContent: string
  if (file.mime_type === 'application/pdf') {
    textContent = await extractPdfText(fileData)
  } else if (file.mime_type.includes('presentation')) {
    textContent = await extractPptText(fileData)
  } else {
    throw new Error('Unsupported file type')
  }

  // Create extraction record
  const { data: extraction } = await supabase
    .from('wizard_extractions')
    .insert({
      session_id: input.sessionId,
      extraction_type: 'pitch_deck',
      raw_content: textContent.slice(0, 50000),  // Limit stored content
    })
    .select()
    .single()

  // Run ProfileExtractor
  const agent = new ProfileExtractorAgent()
  const result = await agent.execute(
    { pitchDeckText: textContent },
    context
  )

  // Update file record with AI extraction
  await supabase
    .from('file_uploads')
    .update({
      ai_extracted: true,
      ai_summary: result.data?.description || 'Pitch deck processed'
    })
    .eq('id', input.fileId)

  // Update extraction and session
  await supabase
    .from('wizard_extractions')
    .update({
      extracted_data: result.data,
      confidence: result.confidence
    })
    .eq('id', extraction.id)

  await updateWizardSession({
    sessionId: input.sessionId,
    formData: flattenProfile(result.data!),
    aiExtractions: {
      pitch_deck: {
        fileId: input.fileId,
        data: result.data,
        confidence: result.confidence
      }
    }
  }, supabase)

  return {
    extracted: result.data!,
    confidence: result.confidence || 0,
    fieldsExtracted: Object.keys(result.data || {})
  }
}
```

---

## Profile Building

### Merge Extracted Data

```typescript
// supabase/functions/ai-helper/wizard/merge-extractions.ts

interface MergeInput {
  sessionId: string
  manualOverrides?: Record<string, any>
}

interface MergeOutput {
  mergedProfile: Record<string, any>
  conflictsResolved: Array<{
    field: string
    sources: string[]
    resolvedValue: any
  }>
}

export async function mergeExtractions(
  input: MergeInput,
  supabase: SupabaseClient
): Promise<MergeOutput> {
  // Get session with all extractions
  const { data: session } = await supabase
    .from('wizard_sessions')
    .select('form_data, ai_extractions')
    .eq('id', input.sessionId)
    .single()

  const extractions = session?.ai_extractions || {}
  const mergedProfile: Record<string, any> = {}
  const conflictsResolved: MergeOutput['conflictsResolved'] = []

  // Priority order: manual > pitch_deck > linkedin > url
  const sources = ['url', 'linkedin', 'pitch_deck']

  // Fields to merge
  const fields = [
    'name', 'tagline', 'description', 'industry', 'stage',
    'website', 'linkedin_url', 'team_size', 'founded', 'location',
    'funding_stage', 'last_funding_amount', 'signals'
  ]

  for (const field of fields) {
    const values: Array<{ source: string; value: any; confidence: number }> = []

    // Collect values from all sources
    for (const source of sources) {
      const extraction = extractions[source]
      if (extraction?.data) {
        const value = extraction.data[field] || extraction.data[camelCase(field)]
        if (value !== undefined && value !== null && value !== '') {
          values.push({
            source,
            value,
            confidence: extraction.confidence || 0.5
          })
        }
      }
    }

    // Check for manual override
    if (input.manualOverrides?.[field] !== undefined) {
      mergedProfile[field] = input.manualOverrides[field]
      if (values.length > 0) {
        conflictsResolved.push({
          field,
          sources: values.map(v => v.source),
          resolvedValue: input.manualOverrides[field]
        })
      }
    } else if (values.length > 0) {
      // Use highest confidence value
      values.sort((a, b) => b.confidence - a.confidence)
      mergedProfile[field] = values[0].value

      if (values.length > 1) {
        conflictsResolved.push({
          field,
          sources: values.map(v => v.source),
          resolvedValue: values[0].value
        })
      }
    }
  }

  // Merge signals (combine all)
  const allSignals = new Set<string>()
  for (const source of sources) {
    const signals = extractions[source]?.data?.signals
    if (Array.isArray(signals)) {
      signals.forEach(s => allSignals.add(s))
    }
  }
  mergedProfile.signals = Array.from(allSignals)

  // Update session
  await updateWizardSession({
    sessionId: input.sessionId,
    formData: mergedProfile,
    signals: mergedProfile.signals
  }, supabase)

  return { mergedProfile, conflictsResolved }
}
```

---

## Smart Autofill

### Autofill from Industry Pack

```typescript
// supabase/functions/ai-helper/wizard/autofill-industry.ts

interface AutofillInput {
  sessionId: string
  industry: string
}

interface AutofillOutput {
  industryPack: IndustryPack | null
  suggestedDiagnostics: DiagnosticQuestion[]
  suggestedSignals: string[]
}

export async function autofillFromIndustry(
  input: AutofillInput,
  supabase: SupabaseClient
): Promise<AutofillOutput> {
  // Find matching industry pack
  const { data: pack } = await supabase
    .from('industry_packs')
    .select('*')
    .eq('industry', input.industry.toLowerCase())
    .eq('is_active', true)
    .single()

  if (!pack) {
    return {
      industryPack: null,
      suggestedDiagnostics: [],
      suggestedSignals: []
    }
  }

  // Update session with industry pack
  await supabase
    .from('wizard_sessions')
    .update({ industry_pack_id: pack.id })
    .eq('id', input.sessionId)

  // Extract diagnostic questions from pack
  const diagnostics = (pack.diagnostics || []) as DiagnosticQuestion[]

  // Extract common signals for this industry
  const suggestedSignals = extractCommonSignals(pack)

  return {
    industryPack: pack,
    suggestedDiagnostics: diagnostics.slice(0, 10),  // Top 10 questions
    suggestedSignals
  }
}

function extractCommonSignals(pack: IndustryPack): string[] {
  const signals: string[] = []

  // Extract from mental models
  const mentalModels = pack.mental_models as any[] || []
  for (const model of mentalModels) {
    if (model.signals) {
      signals.push(...model.signals)
    }
  }

  // Extract from benchmarks
  const benchmarks = pack.benchmarks as any[] || []
  for (const benchmark of benchmarks) {
    if (benchmark.indicatorSignal) {
      signals.push(benchmark.indicatorSignal)
    }
  }

  return [...new Set(signals)]
}
```

### Derive Signals from Answers

```typescript
// supabase/functions/ai-helper/wizard/derive-signals.ts

interface DeriveSignalsInput {
  sessionId: string
  diagnosticAnswers: Record<string, any>
}

interface Signal {
  name: string
  category: string
  confidence: number
  derivedFrom: string[]
}

const SIGNAL_RULES: Array<{
  signal: string
  category: string
  condition: (answers: Record<string, any>) => boolean
  derivedFrom: string[]
}> = [
  {
    signal: 'product_led_growth',
    category: 'growth',
    condition: (a) => a.primary_acquisition === 'self_serve' || a.has_free_tier === true,
    derivedFrom: ['primary_acquisition', 'has_free_tier']
  },
  {
    signal: 'enterprise_focus',
    category: 'market',
    condition: (a) => a.target_customer === 'enterprise' || a.deal_size > 50000,
    derivedFrom: ['target_customer', 'deal_size']
  },
  {
    signal: 'b2b_saas',
    category: 'business_model',
    condition: (a) => a.business_model === 'subscription' && a.target_customer !== 'consumer',
    derivedFrom: ['business_model', 'target_customer']
  },
  {
    signal: 'marketplace',
    category: 'business_model',
    condition: (a) => a.business_model === 'marketplace' || a.has_two_sided_network === true,
    derivedFrom: ['business_model', 'has_two_sided_network']
  },
  {
    signal: 'high_burn',
    category: 'financial',
    condition: (a) => a.monthly_burn && a.runway_months && a.runway_months < 12,
    derivedFrom: ['monthly_burn', 'runway_months']
  },
  {
    signal: 'bootstrapped',
    category: 'funding',
    condition: (a) => a.funding_raised === 0 || a.funding_stage === 'bootstrapped',
    derivedFrom: ['funding_raised', 'funding_stage']
  },
  {
    signal: 'vc_backed',
    category: 'funding',
    condition: (a) => a.funding_stage && ['seed', 'series_a', 'series_b', 'series_c'].includes(a.funding_stage),
    derivedFrom: ['funding_stage']
  },
  {
    signal: 'remote_first',
    category: 'operations',
    condition: (a) => a.team_distribution === 'fully_remote',
    derivedFrom: ['team_distribution']
  }
]

export async function deriveSignals(
  input: DeriveSignalsInput,
  supabase: SupabaseClient
): Promise<Signal[]> {
  const signals: Signal[] = []

  for (const rule of SIGNAL_RULES) {
    try {
      if (rule.condition(input.diagnosticAnswers)) {
        signals.push({
          name: rule.signal,
          category: rule.category,
          confidence: 0.9,
          derivedFrom: rule.derivedFrom
        })
      }
    } catch {
      // Skip if condition throws
    }
  }

  // Update session with derived signals
  await updateWizardSession({
    sessionId: input.sessionId,
    signals: signals.map(s => s.name),
    diagnosticAnswers: input.diagnosticAnswers
  }, supabase)

  return signals
}
```

---

## Wizard Completion Flow

### Analyze Readiness (Step 2)

```typescript
// supabase/functions/ai-helper/wizard/analyze-readiness.ts

interface ReadinessInput {
  sessionId: string
}

interface ReadinessOutput {
  overallScore: number
  categoryScores: Record<string, number>
  strengths: string[]
  gaps: string[]
  recommendations: string[]
}

export async function analyzeReadiness(
  input: ReadinessInput,
  context: AgentContext,
  supabase: SupabaseClient
): Promise<ReadinessOutput> {
  // Get session data
  const { data: session } = await supabase
    .from('wizard_sessions')
    .select('form_data, diagnostic_answers, signals, industry_pack_id')
    .eq('id', input.sessionId)
    .single()

  // Build startup context
  const startupContext = {
    ...session?.form_data,
    diagnosticAnswers: session?.diagnostic_answers,
    signals: session?.signals
  }

  // Get industry benchmarks if available
  let benchmarks = null
  if (session?.industry_pack_id) {
    const { data: pack } = await supabase
      .from('industry_packs')
      .select('benchmarks')
      .eq('id', session.industry_pack_id)
      .single()
    benchmarks = pack?.benchmarks
  }

  // Run RiskAnalyzer for readiness assessment
  const agent = new RiskAnalyzerAgent()
  const result = await agent.execute({
    startup: startupContext,
    tractionData: session?.form_data?.traction_data
  }, context)

  // Calculate scores from risk analysis
  const categoryScores: Record<string, number> = {
    market: 80,
    product: 70,
    team: 75,
    financial: 60,
    operational: 65
  }

  // Adjust scores based on identified risks
  if (result.data?.risks) {
    for (const risk of result.data.risks) {
      const severity = risk.severity
      const impact = severity === 'critical' ? 30 : severity === 'high' ? 20 : severity === 'medium' ? 10 : 5
      categoryScores[risk.category] = Math.max(0, categoryScores[risk.category] - impact)
    }
  }

  const overallScore = Math.round(
    Object.values(categoryScores).reduce((a, b) => a + b, 0) / Object.keys(categoryScores).length
  )

  // Identify strengths (scores > 75) and gaps (scores < 60)
  const strengths: string[] = []
  const gaps: string[] = []

  for (const [category, score] of Object.entries(categoryScores)) {
    if (score >= 75) {
      strengths.push(`Strong ${category} foundation`)
    } else if (score < 60) {
      gaps.push(`${category.charAt(0).toUpperCase() + category.slice(1)} needs attention`)
    }
  }

  // Generate recommendations from risks
  const recommendations = result.data?.risks
    ?.filter(r => r.severity === 'high' || r.severity === 'critical')
    .map(r => r.mitigation) || []

  return {
    overallScore,
    categoryScores,
    strengths,
    gaps,
    recommendations: recommendations.slice(0, 5)
  }
}
```

### Complete Wizard (Step 3)

```typescript
// supabase/functions/ai-helper/wizard/complete.ts

interface CompleteWizardInput {
  sessionId: string
  generateTasks: boolean
}

interface CompleteWizardOutput {
  startupId: string
  tasksGenerated: number
  documentsCreated: string[]
}

export async function completeWizard(
  input: CompleteWizardInput,
  context: AgentContext,
  supabase: SupabaseClient
): Promise<CompleteWizardOutput> {
  // Get full session data
  const { data: session } = await supabase
    .from('wizard_sessions')
    .select('*')
    .eq('id', input.sessionId)
    .single()

  if (!session) {
    throw new Error('Session not found')
  }

  // Get user's org
  const { data: profile } = await supabase
    .from('profiles')
    .select('org_id')
    .eq('id', session.user_id)
    .single()

  // Create or update startup
  const startupData = {
    org_id: profile?.org_id,
    name: session.form_data.name,
    tagline: session.form_data.tagline,
    description: session.form_data.description,
    industry: session.form_data.industry,
    stage: session.form_data.stage,
    website: session.form_data.website,
    linkedin_url: session.form_data.linkedin_url,
    team_size: session.form_data.team_size,
    founded: session.form_data.founded,
    location: session.form_data.location,
    traction_data: session.form_data.traction_data || {},
    funding_stage: session.form_data.funding_stage,
    last_funding_amount: session.form_data.last_funding_amount,
    signals: session.signals || [],
    profile_strength: session.profile_strength || 0,
  }

  let startupId: string

  if (session.startup_id) {
    // Update existing
    await supabase
      .from('startups')
      .update(startupData)
      .eq('id', session.startup_id)
    startupId = session.startup_id
  } else {
    // Create new
    const { data: newStartup } = await supabase
      .from('startups')
      .insert(startupData)
      .select('id')
      .single()
    startupId = newStartup!.id
  }

  // Update session as completed
  await supabase
    .from('wizard_sessions')
    .update({
      startup_id: startupId,
      status: 'completed',
      completed_at: new Date().toISOString(),
      current_step: 3
    })
    .eq('id', input.sessionId)

  // Generate initial tasks if requested
  let tasksGenerated = 0
  if (input.generateTasks) {
    const taskAgent = new TaskGeneratorAgent()
    const taskResult = await taskAgent.execute({
      startup: startupData,
      signals: session.signals,
      risks: session.ai_extractions?.risks
    }, { ...context, startupId })

    if (taskResult.success && taskResult.data?.tasks) {
      // Insert tasks
      const tasksToInsert = taskResult.data.tasks.map((t: any) => ({
        startup_id: startupId,
        title: t.title,
        description: t.description,
        priority: t.priority || 'medium',
        status: 'pending',
        due_at: t.dueDate ? new Date(t.dueDate).toISOString() : null,
        tags: t.tags || [],
        ai_generated: true
      }))

      await supabase.from('tasks').insert(tasksToInsert)
      tasksGenerated = tasksToInsert.length
    }
  }

  // Create startup profile document
  const { data: doc } = await supabase
    .from('documents')
    .insert({
      startup_id: startupId,
      wizard_session_id: input.sessionId,
      type: 'startup_profile',
      title: `${startupData.name} - Profile`,
      content_json: {
        profile: startupData,
        signals: session.signals,
        diagnosticAnswers: session.diagnostic_answers,
        aiExtractions: session.ai_extractions
      },
      status: 'final',
      ai_generated: true,
      created_by: session.user_id
    })
    .select('id')
    .single()

  const documentsCreated = doc ? [doc.id] : []

  return {
    startupId,
    tasksGenerated,
    documentsCreated
  }
}
```

---

## Error Recovery

### Session Recovery

```typescript
// supabase/functions/ai-helper/wizard/recover-session.ts

interface RecoverSessionInput {
  userId: string
  sessionId?: string
}

interface RecoveryResult {
  recovered: boolean
  session?: WizardSession
  lastCompletedStep: number
  canResume: boolean
}

export async function recoverSession(
  input: RecoverSessionInput,
  supabase: SupabaseClient
): Promise<RecoveryResult> {
  // Try to find the specific session or most recent
  let query = supabase
    .from('wizard_sessions')
    .select('*')
    .eq('user_id', input.userId)

  if (input.sessionId) {
    query = query.eq('id', input.sessionId)
  } else {
    query = query
      .eq('status', 'in_progress')
      .order('last_activity_at', { ascending: false })
      .limit(1)
  }

  const { data: session } = await query.single()

  if (!session) {
    return {
      recovered: false,
      lastCompletedStep: 0,
      canResume: false
    }
  }

  // Check if session is too old (> 7 days)
  const lastActivity = new Date(session.last_activity_at)
  const daysSinceActivity = (Date.now() - lastActivity.getTime()) / (1000 * 60 * 60 * 24)

  if (daysSinceActivity > 7) {
    // Mark as abandoned
    await supabase
      .from('wizard_sessions')
      .update({ status: 'abandoned' })
      .eq('id', session.id)

    return {
      recovered: false,
      lastCompletedStep: session.current_step - 1,
      canResume: false
    }
  }

  // Session can be resumed
  return {
    recovered: true,
    session,
    lastCompletedStep: session.current_step - 1,
    canResume: true
  }
}
```

### Extraction Retry

```typescript
// supabase/functions/ai-helper/wizard/retry-extraction.ts

interface RetryInput {
  extractionId: string
}

export async function retryExtraction(
  input: RetryInput,
  context: AgentContext,
  supabase: SupabaseClient
): Promise<ExtractUrlOutput> {
  // Get original extraction
  const { data: extraction } = await supabase
    .from('wizard_extractions')
    .select('*')
    .eq('id', input.extractionId)
    .single()

  if (!extraction) {
    throw new Error('Extraction not found')
  }

  // Retry based on type
  switch (extraction.extraction_type) {
    case 'url':
      return await extractFromUrl({
        sessionId: extraction.session_id,
        url: extraction.source_url!
      }, context, supabase)

    case 'linkedin':
      return await extractFromLinkedIn({
        sessionId: extraction.session_id,
        linkedinUrl: extraction.source_url!
      }, context, supabase)

    default:
      throw new Error(`Cannot retry extraction type: ${extraction.extraction_type}`)
  }
}
```

---

## Best Practices Summary

### Wizard Development Checklist

- [ ] Create session on wizard start
- [ ] Store all form data incrementally
- [ ] Track extraction sources with confidence
- [ ] Merge extractions with conflict resolution
- [ ] Calculate profile strength continuously
- [ ] Derive signals from diagnostic answers
- [ ] Generate tasks on completion
- [ ] Create startup profile document
- [ ] Handle session recovery
- [ ] Support extraction retries

### Performance Tips

1. **Batch extractions** - Run URL + LinkedIn in parallel
2. **Cache industry packs** - Load once per session
3. **Incremental saves** - Update after each step
4. **Lightweight step 1** - Only essential fields
5. **Defer task generation** - Run in background

---

## References

- [14-ai-agents.md](./14-ai-agents.md) - AI agent patterns
- [Session Management](../01-new-supabase.md) - Database schema

---

**Last Updated:** January 15, 2026
