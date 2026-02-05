/**
 * Documents Agent - Main Handler
 * Orchestrates all document AI operations
 * Actions: generate_document, analyze_document, improve_section,
 *          search_documents, summarize_document, compare_versions
 */

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Use environment variables (set automatically by Supabase)
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY")!;
const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY");

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type SupabaseClient = any;

interface RequestBody {
  action: string;
  startup_id?: string;
  document_id?: string;
  template_type?: string;
  instructions?: string;
  section?: string;
  query?: string;
  version_a?: string;
  version_b?: string;
  document_ids?: string[];
  category?: string;
  report_month?: string;
  highlights?: string[];
}

// ===== Document Templates =====

const DOCUMENT_TEMPLATES: Record<string, { title: string; sections: string[] }> = {
  executive_summary: {
    title: "Executive Summary",
    sections: ["Company Overview", "Problem & Solution", "Market Opportunity", "Business Model", "Traction", "Team", "Ask"],
  },
  business_plan: {
    title: "Business Plan",
    sections: ["Executive Summary", "Company Description", "Market Analysis", "Organization", "Product/Service", "Marketing Strategy", "Financial Projections"],
  },
  one_pager: {
    title: "One-Pager",
    sections: ["Problem", "Solution", "Market Size", "Business Model", "Traction", "Team", "Contact"],
  },
  investor_update: {
    title: "Investor Update",
    sections: ["Highlights", "Key Metrics", "Product Updates", "Team Updates", "Challenges", "Asks", "Next Steps"],
  },
  meeting_notes: {
    title: "Meeting Notes",
    sections: ["Attendees", "Agenda", "Discussion Points", "Decisions Made", "Action Items", "Next Meeting"],
  },
};

// ===== AI Utilities =====

async function callGemini(
  prompt: string,
  systemInstruction?: string
): Promise<string> {
  if (!GEMINI_API_KEY) {
    console.error("[documents-agent] GEMINI_API_KEY not set");
    throw new Error("AI service not configured");
  }

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${GEMINI_API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        systemInstruction: systemInstruction
          ? { parts: [{ text: systemInstruction }] }
          : undefined,
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 4096,
        },
      }),
    }
  );

  if (!response.ok) {
    const error = await response.text();
    console.error("[documents-agent] Gemini error:", error);
    throw new Error("AI generation failed");
  }

  const data = await response.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text || "";
}

function extractJSON<T>(text: string): T | null {
  try {
    const jsonMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[1].trim());
    }
    return JSON.parse(text);
  } catch {
    const objectMatch = text.match(/\{[\s\S]*\}/);
    const arrayMatch = text.match(/\[[\s\S]*\]/);
    const match = objectMatch || arrayMatch;
    if (match) {
      try {
        return JSON.parse(match[0]);
      } catch {
        return null;
      }
    }
    return null;
  }
}

// ===== Action Handlers =====

async function generateDocument(
  supabase: SupabaseClient,
  userId: string,
  startupId: string,
  templateType: string,
  instructions?: string
): Promise<{ success: boolean; document_id?: string; content?: string; content_json?: Record<string, unknown>; error?: string }> {
  console.log(`[documents-agent] generateDocument type ${templateType} for startup ${startupId}`);

  const template = DOCUMENT_TEMPLATES[templateType];
  if (!template) {
    return { success: false, error: `Unknown template type: ${templateType}` };
  }

  // Get startup context
  const { data: startup } = await supabase
    .from("startups")
    .select("*")
    .eq("id", startupId)
    .single();

  if (!startup) {
    return { success: false, error: "Startup not found" };
  }

  const prompt = `Generate a professional ${template.title} document for this startup.

STARTUP CONTEXT:
- Name: ${startup.name}
- Description: ${startup.description || 'Not provided'}
- Industry: ${startup.industry || 'Not specified'}
- Stage: ${startup.stage || 'Early stage'}
- Tagline: ${startup.tagline || 'Not provided'}
- Business Model: ${startup.business_model || 'Not specified'}
- Traction: ${JSON.stringify(startup.traction_data) || 'Not provided'}

DOCUMENT SECTIONS:
${template.sections.map((s, i) => `${i + 1}. ${s}`).join('\n')}

${instructions ? `ADDITIONAL INSTRUCTIONS: ${instructions}` : ''}

Return JSON with this structure:
{
  "title": "${template.title}",
  "sections": [
    { "heading": "Section Name", "content": "Section content..." },
    ...
  ],
  "summary": "One paragraph executive summary"
}

Write professional, investor-ready content. Be specific and data-driven where possible.`;

  try {
    const response = await callGemini(
      prompt,
      "You are an expert startup document writer with experience creating investor-ready materials."
    );
    
    const contentJson = extractJSON<{ title: string; sections: Array<{ heading: string; content: string }>; summary: string }>(response);

    if (!contentJson) {
      return { success: false, error: "Failed to parse AI response" };
    }

    // Convert to plain text content
    const plainContent = contentJson.sections
      .map(s => `## ${s.heading}\n\n${s.content}`)
      .join('\n\n---\n\n');

    // Create document in database
    const { data: document, error } = await supabase
      .from("documents")
      .insert({
        startup_id: startupId,
        title: contentJson.title,
        type: templateType,
        content: plainContent,
        content_json: contentJson,
        status: "draft",
        ai_generated: true,
        created_by: userId,
        version: 1,
      })
      .select()
      .single();

    if (error) throw error;

    return {
      success: true,
      document_id: document.id,
      content: plainContent,
      content_json: contentJson,
    };
  } catch (error) {
    console.error("[documents-agent] generateDocument error:", error);
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" };
  }
}

async function analyzeDocument(
  supabase: SupabaseClient,
  userId: string,
  startupId: string,
  documentId: string
): Promise<{ success: boolean; score?: number; completeness?: number; suggestions?: string[]; error?: string }> {
  console.log(`[documents-agent] analyzeDocument ${documentId}`);

  const { data: document } = await supabase
    .from("documents")
    .select("*")
    .eq("id", documentId)
    .single();

  if (!document) {
    return { success: false, error: "Document not found" };
  }

  const content = document.content || JSON.stringify(document.content_json);

  const prompt = `Analyze this startup document for quality and completeness.

DOCUMENT TYPE: ${document.type}
TITLE: ${document.title}

CONTENT:
${content.substring(0, 3000)}...

Analyze for:
1. Completeness (are all key sections present?)
2. Clarity (is the message clear?)
3. Investor-readiness (would this impress investors?)
4. Data-richness (are there specific numbers/metrics?)

Return JSON:
{
  "score": 0-100,
  "completeness": 0-100,
  "clarity_score": 0-100,
  "data_score": 0-100,
  "suggestions": ["suggestion1", "suggestion2", "suggestion3"],
  "strengths": ["strength1", "strength2"],
  "missing_sections": ["section1", "section2"]
}`;

  try {
    const response = await callGemini(prompt, "You are a startup document quality analyst.");
    const result = extractJSON<{ 
      score: number; 
      completeness: number; 
      suggestions: string[];
      strengths: string[];
      missing_sections: string[];
    }>(response);

    if (!result) {
      return { success: false, error: "Failed to parse AI response" };
    }

    // Update document metadata with analysis
    await supabase
      .from("documents")
      .update({
        metadata: {
          ...document.metadata,
          quality_score: result.score,
          completeness: result.completeness,
          last_analyzed_at: new Date().toISOString(),
        },
      })
      .eq("id", documentId);

    return {
      success: true,
      score: result.score,
      completeness: result.completeness,
      suggestions: result.suggestions,
    };
  } catch (error) {
    console.error("[documents-agent] analyzeDocument error:", error);
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" };
  }
}

async function improveSection(
  supabase: SupabaseClient,
  userId: string,
  startupId: string,
  documentId: string,
  section: string,
  instructions: string
): Promise<{ success: boolean; improved_text?: string; error?: string }> {
  console.log(`[documents-agent] improveSection for document ${documentId}`);

  const { data: document } = await supabase
    .from("documents")
    .select("*")
    .eq("id", documentId)
    .single();

  if (!document) {
    return { success: false, error: "Document not found" };
  }

  const { data: startup } = await supabase
    .from("startups")
    .select("name, industry, stage, description")
    .eq("id", startupId)
    .single();

  const prompt = `Improve this section of a startup document.

STARTUP: ${startup?.name || 'Unknown'} (${startup?.industry || 'Unknown industry'}, ${startup?.stage || 'Unknown stage'})

DOCUMENT TYPE: ${document.type}
SECTION TO IMPROVE:
${section}

IMPROVEMENT INSTRUCTIONS: ${instructions}

Write an improved version that is:
- More compelling and investor-ready
- Data-driven where possible
- Clear and concise
- Professional in tone

Return ONLY the improved text, no JSON wrapper.`;

  try {
    const response = await callGemini(
      prompt,
      "You are an expert startup document editor. Improve content to be investor-ready."
    );

    return {
      success: true,
      improved_text: response.trim(),
    };
  } catch (error) {
    console.error("[documents-agent] improveSection error:", error);
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" };
  }
}

async function searchDocuments(
  supabase: SupabaseClient,
  userId: string,
  startupId: string,
  query: string
): Promise<{ success: boolean; results?: Array<{ id: string; title: string; relevance: number; snippet: string }>; error?: string }> {
  console.log(`[documents-agent] searchDocuments query: ${query}`);

  const { data: documents } = await supabase
    .from("documents")
    .select("id, title, content, type")
    .eq("startup_id", startupId);

  if (!documents || documents.length === 0) {
    return { success: true, results: [] };
  }

  // Simple keyword search with relevance scoring
  const queryWords = query.toLowerCase().split(/\s+/);
  
  type DocType = { id: string; title: string; content?: string; type: string };
  type ResultType = { id: string; title: string; relevance: number; snippet: string };
  
  const results: ResultType[] = (documents as DocType[])
    .map((doc) => {
      const content = (doc.content || '').toLowerCase();
      const title = doc.title.toLowerCase();
      
      let relevance = 0;
      let matchedSnippet = '';

      queryWords.forEach(word => {
        if (title.includes(word)) relevance += 30;
        const contentMatches = (content.match(new RegExp(word, 'gi')) || []).length;
        relevance += Math.min(contentMatches * 5, 50);
        
        // Extract snippet around first match
        if (!matchedSnippet && content.includes(word)) {
          const index = content.indexOf(word);
          const start = Math.max(0, index - 50);
          const end = Math.min(content.length, index + 100);
          matchedSnippet = '...' + (doc.content || '').substring(start, end) + '...';
        }
      });

      return {
        id: doc.id,
        title: doc.title,
        relevance: Math.min(relevance, 100),
        snippet: matchedSnippet || (doc.content?.substring(0, 150) + '...') || 'No content',
      };
    })
    .filter((r) => r.relevance > 0)
    .sort((a, b) => b.relevance - a.relevance)
    .slice(0, 10);

  return { success: true, results };
}

async function summarizeDocument(
  supabase: SupabaseClient,
  userId: string,
  startupId: string,
  documentId: string
): Promise<{ success: boolean; summary?: string; key_points?: string[]; error?: string }> {
  console.log(`[documents-agent] summarizeDocument ${documentId}`);

  const { data: document } = await supabase
    .from("documents")
    .select("*")
    .eq("id", documentId)
    .single();

  if (!document) {
    return { success: false, error: "Document not found" };
  }

  const content = document.content || JSON.stringify(document.content_json);

  const prompt = `Summarize this startup document.

DOCUMENT TYPE: ${document.type}
TITLE: ${document.title}

CONTENT:
${content.substring(0, 4000)}

Return JSON:
{
  "summary": "2-3 sentence executive summary",
  "key_points": ["key point 1", "key point 2", "key point 3", "key point 4", "key point 5"],
  "audience": "who this document is for",
  "main_ask": "if there's a call to action, what is it"
}`;

  try {
    const response = await callGemini(prompt, "You are a document summarization expert.");
    const result = extractJSON<{ summary: string; key_points: string[]; audience: string; main_ask: string }>(response);

    if (!result) {
      return { success: false, error: "Failed to parse AI response" };
    }

    return {
      success: true,
      summary: result.summary,
      key_points: result.key_points,
    };
  } catch (error) {
    console.error("[documents-agent] summarizeDocument error:", error);
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" };
  }
}

async function compareVersions(
  supabase: SupabaseClient,
  userId: string,
  documentId: string,
  versionA: string,
  versionB: string
): Promise<{ success: boolean; diff?: string; changes_summary?: string; error?: string }> {
  console.log(`[documents-agent] compareVersions ${versionA} vs ${versionB}`);

  const { data: versions } = await supabase
    .from("document_versions")
    .select("*")
    .eq("document_id", documentId)
    .in("id", [versionA, versionB]);

  if (!versions || versions.length !== 2) {
    return { success: false, error: "One or both versions not found" };
  }

  type VersionType = { id: string; version_number: number; content_json: unknown };
  const [v1, v2] = (versions as VersionType[]).sort((a, b) => a.version_number - b.version_number);

  const prompt = `Compare these two versions of a document and summarize the changes.

VERSION ${v1.version_number}:
${JSON.stringify(v1.content_json).substring(0, 2000)}

VERSION ${v2.version_number}:
${JSON.stringify(v2.content_json).substring(0, 2000)}

Return JSON:
{
  "changes_summary": "Brief summary of what changed",
  "additions": ["what was added"],
  "removals": ["what was removed"],
  "modifications": ["what was modified"],
  "significance": "minor/moderate/major"
}`;

  try {
    const response = await callGemini(prompt, "You are a document comparison analyst.");
    const result = extractJSON<{ 
      changes_summary: string; 
      additions: string[]; 
      removals: string[]; 
      modifications: string[];
      significance: string;
    }>(response);

    if (!result) {
      return { success: false, error: "Failed to parse AI response" };
    }

    return {
      success: true,
      diff: JSON.stringify({ additions: result.additions, removals: result.removals, modifications: result.modifications }),
      changes_summary: result.changes_summary,
    };
  } catch (error) {
    console.error("[documents-agent] compareVersions error:", error);
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" };
  }
}

// ===== Data Room Builder =====

async function createDataRoom(
  supabase: SupabaseClient,
  userId: string,
  startupId: string
): Promise<{ success: boolean; checklist?: Array<{ category: string; documents: string[]; status: string }>; recommendations?: string[]; error?: string }> {
  console.log(`[documents-agent] createDataRoom for startup ${startupId}`);

  // Get startup info including stage
  const { data: startup } = await supabase
    .from("startups")
    .select("name, stage, industry")
    .eq("id", startupId)
    .single();

  // Get existing documents
  const { data: existingDocs } = await supabase
    .from("documents")
    .select("id, title, type, status")
    .eq("startup_id", startupId);

  const stage = startup?.stage || "pre_seed";

  // Stage-specific data room requirements
  const dataRoomRequirements: Record<string, { categories: Record<string, string[]> }> = {
    pre_seed: {
      categories: {
        "Company Overview": ["Executive Summary", "One-Pager", "Pitch Deck"],
        "Business Model": ["Lean Canvas", "Revenue Model"],
        "Team": ["Founder Bios", "Team Overview"],
        "Market": ["Market Analysis", "Competitive Landscape"]
      }
    },
    seed: {
      categories: {
        "Company Overview": ["Executive Summary", "One-Pager", "Pitch Deck", "Company Fact Sheet"],
        "Business & Strategy": ["Business Plan", "Lean Canvas", "Go-to-Market Strategy"],
        "Financials": ["Financial Model", "Cap Table", "Use of Funds"],
        "Legal": ["Articles of Incorporation", "Shareholder Agreement", "Term Sheet Template"],
        "Traction": ["Metrics Dashboard", "Customer Case Studies", "Testimonials"]
      }
    },
    series_a: {
      categories: {
        "Company Overview": ["Executive Summary", "Pitch Deck", "Company Fact Sheet", "Investment Memo"],
        "Business & Strategy": ["Business Plan", "Go-to-Market Strategy", "Product Roadmap"],
        "Financials": ["Financial Model", "Cap Table", "Historical Financials", "Revenue Projections"],
        "Legal": ["All Corporate Documents", "IP Assignment Agreements", "Material Contracts", "Compliance Docs"],
        "Traction & Market": ["Monthly Investor Updates", "Customer Case Studies", "Market Analysis", "Competitive Intelligence"],
        "Team": ["Org Chart", "Key Hire Plan", "Advisor Agreements"]
      }
    }
  };

  const requirements = dataRoomRequirements[stage] || dataRoomRequirements.pre_seed;
  type DocType = { id: string; title: string; type: string; status: string };
  const existingDocTypes = new Set((existingDocs as DocType[] || []).map((d: DocType) => d.type));

  const checklist = Object.entries(requirements.categories).map(([category, documents]) => ({
    category,
    documents: documents,
    status: documents.every(doc => 
      existingDocTypes.has(doc.toLowerCase().replace(/\s+/g, '_'))
    ) ? 'complete' : 'incomplete'
  }));

  // Generate AI recommendations
  const existingTitles = (existingDocs as DocType[] || []).map((d: DocType) => d.title).join(', ') || 'None';
  const prompt = `For a ${stage.replace('_', ' ')} stage ${startup?.industry || ''} startup, analyze their data room readiness.

EXISTING DOCUMENTS: ${existingTitles}
REQUIRED CATEGORIES: ${JSON.stringify(Object.keys(requirements.categories))}

Provide 3-5 specific recommendations for completing their investor data room.

Return JSON:
{
  "recommendations": ["recommendation 1", "recommendation 2", ...],
  "priority_document": "Most important missing document",
  "readiness_score": 0-100
}`;

  try {
    const response = await callGemini(prompt, "You are a fundraising advisor helping founders prepare investor data rooms.");
    const result = extractJSON<{ recommendations: string[]; priority_document: string; readiness_score: number }>(response);

    return {
      success: true,
      checklist,
      recommendations: result?.recommendations || ["Add your pitch deck", "Include financial projections", "Document your team"],
    };
  } catch (error) {
    console.error("[documents-agent] createDataRoom error:", error);
    return {
      success: true,
      checklist,
      recommendations: ["Complete your pitch deck", "Add team bios", "Include financial model"],
    };
  }
}

async function organizeDataRoom(
  supabase: SupabaseClient,
  userId: string,
  startupId: string,
  documentIds: string[],
  category: string
): Promise<{ success: boolean; organized_count?: number; error?: string }> {
  console.log(`[documents-agent] organizeDataRoom ${documentIds.length} docs into ${category}`);

  try {
    // Update document metadata with category
    const { data, error } = await supabase
      .from("documents")
      .update({
        metadata: { data_room_category: category, organized_at: new Date().toISOString() },
        updated_at: new Date().toISOString(),
      })
      .in("id", documentIds)
      .eq("startup_id", startupId)
      .select();

    if (error) throw error;

    return {
      success: true,
      organized_count: data?.length || 0,
    };
  } catch (error) {
    console.error("[documents-agent] organizeDataRoom error:", error);
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" };
  }
}

// ===== Investor Update Generator =====

async function generateInvestorUpdate(
  supabase: SupabaseClient,
  userId: string,
  startupId: string,
  reportMonth?: string,
  highlights?: string[]
): Promise<{ success: boolean; document_id?: string; content?: string; content_json?: Record<string, unknown>; error?: string }> {
  console.log(`[documents-agent] generateInvestorUpdate for ${startupId}`);

  // Get startup with traction data
  const { data: startup } = await supabase
    .from("startups")
    .select("*")
    .eq("id", startupId)
    .single();

  if (!startup) {
    return { success: false, error: "Startup not found" };
  }

  // Get recent activities
  const { data: recentActivities } = await supabase
    .from("activities")
    .select("title, description, activity_type, created_at")
    .eq("startup_id", startupId)
    .order("created_at", { ascending: false })
    .limit(10);

  // Get recent deals from CRM
  const { data: deals } = await supabase
    .from("deals")
    .select("name, stage, amount, expected_close")
    .eq("startup_id", startupId)
    .eq("is_active", true)
    .limit(5);

  // Get recent tasks completed
  const { data: completedTasks } = await supabase
    .from("tasks")
    .select("title, completed_at")
    .eq("startup_id", startupId)
    .eq("status", "completed")
    .order("completed_at", { ascending: false })
    .limit(5);

  const month = reportMonth || new Date().toLocaleString('default', { month: 'long', year: 'numeric' });

  const prompt = `Generate a professional monthly investor update for ${startup.name}.

STARTUP CONTEXT:
- Name: ${startup.name}
- Industry: ${startup.industry || 'Tech'}
- Stage: ${startup.stage || 'Early Stage'}
- Description: ${startup.description || 'Not provided'}

TRACTION DATA:
${JSON.stringify(startup.traction_data || {})}

RECENT ACTIVITIES:
${(recentActivities as Array<{ title: string }>)?.map((a: { title: string }) => `- ${a.title}`).join('\n') || 'No recent activities'}

ACTIVE DEALS/PIPELINE:
${(deals as Array<{ name: string; stage: string; amount?: number }>)?.map((d: { name: string; stage: string; amount?: number }) => `- ${d.name}: ${d.stage} ($${d.amount || 'TBD'})`).join('\n') || 'No active deals'}

COMPLETED MILESTONES:
${(completedTasks as Array<{ title: string }>)?.map((t: { title: string }) => `- ${t.title}`).join('\n') || 'No recent completions'}

USER HIGHLIGHTS:
${highlights?.join('\n') || 'None specified'}

REPORT MONTH: ${month}

Generate a structured investor update with these sections:
1. TL;DR (3 bullet executive summary)
2. Key Metrics (with changes if available)
3. Product Updates
4. Team Updates  
5. Fundraising/Pipeline
6. Challenges & Asks
7. Next Month Goals

Return JSON:
{
  "title": "Investor Update - ${month}",
  "sections": [
    { "heading": "Section Name", "content": "Section content..." }
  ],
  "key_metrics": [
    { "name": "Metric", "value": "Value", "change": "+X%" }
  ],
  "asks": ["Specific asks from investors"]
}`;

  try {
    const response = await callGemini(
      prompt,
      "You are an expert at writing concise, data-driven investor updates that keep investors engaged and informed."
    );
    
    const contentJson = extractJSON<{ 
      title: string; 
      sections: Array<{ heading: string; content: string }>; 
      key_metrics: Array<{ name: string; value: string; change?: string }>;
      asks: string[];
    }>(response);

    if (!contentJson) {
      return { success: false, error: "Failed to parse AI response" };
    }

    // Convert to plain text
    const plainContent = contentJson.sections
      .map(s => `## ${s.heading}\n\n${s.content}`)
      .join('\n\n---\n\n');

    // Create document
    const { data: document, error } = await supabase
      .from("documents")
      .insert({
        startup_id: startupId,
        title: contentJson.title,
        type: "investor_update",
        content: plainContent,
        content_json: contentJson,
        status: "draft",
        ai_generated: true,
        created_by: userId,
        version: 1,
        metadata: { report_month: month, generated_at: new Date().toISOString() },
      })
      .select()
      .single();

    if (error) throw error;

    // Log activity
    await supabase.from("activities").insert({
      startup_id: startupId,
      title: `Generated investor update for ${month}`,
      description: `AI-generated monthly investor update`,
      activity_type: "document_created",
      document_id: document.id,
      is_system_generated: true,
    });

    return {
      success: true,
      document_id: document.id,
      content: plainContent,
      content_json: contentJson,
    };
  } catch (error) {
    console.error("[documents-agent] generateInvestorUpdate error:", error);
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" };
  }
}

// ===== Competitive Analysis Generator =====

async function generateCompetitiveAnalysis(
  supabase: SupabaseClient,
  userId: string,
  startupId: string
): Promise<{ success: boolean; document_id?: string; content?: string; competitors?: Array<{ name: string; strengths: string[]; weaknesses: string[] }>; error?: string }> {
  console.log(`[documents-agent] generateCompetitiveAnalysis for ${startupId}`);

  // Get startup context
  const { data: startup } = await supabase
    .from("startups")
    .select("*")
    .eq("id", startupId)
    .single();

  if (!startup) {
    return { success: false, error: "Startup not found" };
  }

  // Get industry pack for context
  const { data: industryPack } = await supabase
    .from("industry_packs")
    .select("competitive_intel, key_players, market_context")
    .eq("industry", startup.industry)
    .eq("is_active", true)
    .single();

  const prompt = `Generate a comprehensive competitive analysis for this startup.

STARTUP:
- Name: ${startup.name}
- Industry: ${startup.industry || 'Technology'}
- Description: ${startup.description || 'Not provided'}
- Value Proposition: ${startup.tagline || 'Not provided'}
- Business Model: ${startup.business_model || 'Not specified'}

INDUSTRY CONTEXT:
${industryPack ? `Key Players: ${JSON.stringify(industryPack.key_players || [])}
Competitive Intel: ${JSON.stringify(industryPack.competitive_intel || {})}
Market Context: ${JSON.stringify(industryPack.market_context || {})}` : 'No industry pack available'}

Generate a detailed competitive analysis including:
1. Market Landscape Overview
2. Direct Competitors (3-5 companies)
3. Indirect Competitors
4. Competitive Positioning Matrix
5. Key Differentiators
6. Threats & Opportunities
7. Strategic Recommendations

Return JSON:
{
  "title": "Competitive Analysis - ${startup.name}",
  "sections": [
    { "heading": "Section Name", "content": "Detailed section content..." }
  ],
  "competitors": [
    { "name": "Competitor Name", "category": "direct/indirect", "strengths": ["str1"], "weaknesses": ["weak1"], "threat_level": "high/medium/low" }
  ],
  "positioning": {
    "unique_advantages": ["advantage1"],
    "vulnerabilities": ["vulnerability1"],
    "opportunities": ["opportunity1"]
  }
}`;

  try {
    const response = await callGemini(
      prompt,
      "You are a strategic analyst with expertise in competitive intelligence and market positioning for startups."
    );
    
    const contentJson = extractJSON<{ 
      title: string; 
      sections: Array<{ heading: string; content: string }>; 
      competitors: Array<{ name: string; category: string; strengths: string[]; weaknesses: string[]; threat_level: string }>;
      positioning: { unique_advantages: string[]; vulnerabilities: string[]; opportunities: string[] };
    }>(response);

    if (!contentJson) {
      return { success: false, error: "Failed to parse AI response" };
    }

    // Convert to plain text
    const plainContent = contentJson.sections
      .map(s => `## ${s.heading}\n\n${s.content}`)
      .join('\n\n---\n\n');

    // Create document
    const { data: document, error } = await supabase
      .from("documents")
      .insert({
        startup_id: startupId,
        title: contentJson.title,
        type: "competitive_analysis",
        content: plainContent,
        content_json: contentJson,
        status: "draft",
        ai_generated: true,
        created_by: userId,
        version: 1,
        metadata: { generated_at: new Date().toISOString() },
      })
      .select()
      .single();

    if (error) throw error;

    return {
      success: true,
      document_id: document.id,
      content: plainContent,
      competitors: contentJson.competitors?.map(c => ({
        name: c.name,
        strengths: c.strengths,
        weaknesses: c.weaknesses,
      })),
    };
  } catch (error) {
    console.error("[documents-agent] generateCompetitiveAnalysis error:", error);
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" };
  }
}

// ===== Main Handler =====

function getSupabaseClient(authHeader: string | null): SupabaseClient {
  return createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    global: {
      headers: authHeader ? { Authorization: authHeader } : {},
    },
  });
}

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("authorization");
    const supabase = getSupabaseClient(authHeader);

    // Get user from JWT
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: "Unauthorized", message: "Invalid or missing authentication" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const body: RequestBody = await req.json();
    const { action, startup_id, document_id } = body;

    console.log(`[documents-agent] Action: ${action}, User: ${user.id}`);

    let result;

    switch (action) {
      case "generate_document":
        if (!startup_id || !body.template_type) throw new Error("startup_id and template_type are required");
        result = await generateDocument(supabase, user.id, startup_id, body.template_type, body.instructions);
        break;

      case "analyze_document":
        if (!startup_id || !document_id) throw new Error("startup_id and document_id are required");
        result = await analyzeDocument(supabase, user.id, startup_id, document_id);
        break;

      case "improve_section":
        if (!startup_id || !document_id || !body.section) throw new Error("startup_id, document_id, and section are required");
        result = await improveSection(supabase, user.id, startup_id, document_id, body.section, body.instructions || "Make it more compelling");
        break;

      case "search_documents":
        if (!startup_id || !body.query) throw new Error("startup_id and query are required");
        result = await searchDocuments(supabase, user.id, startup_id, body.query);
        break;

      case "summarize_document":
        if (!startup_id || !document_id) throw new Error("startup_id and document_id are required");
        result = await summarizeDocument(supabase, user.id, startup_id, document_id);
        break;

      case "compare_versions":
        if (!document_id || !body.version_a || !body.version_b) throw new Error("document_id, version_a, and version_b are required");
        result = await compareVersions(supabase, user.id, document_id, body.version_a, body.version_b);
        break;

      case "create_data_room":
        if (!startup_id) throw new Error("startup_id is required");
        result = await createDataRoom(supabase, user.id, startup_id);
        break;

      case "organize_data_room":
        if (!startup_id || !body.document_ids || !body.category) throw new Error("startup_id, document_ids, and category are required");
        result = await organizeDataRoom(supabase, user.id, startup_id, body.document_ids, body.category);
        break;

      case "generate_investor_update":
        if (!startup_id) throw new Error("startup_id is required");
        result = await generateInvestorUpdate(supabase, user.id, startup_id, body.report_month, body.highlights);
        break;

      case "generate_competitive_analysis":
        if (!startup_id) throw new Error("startup_id is required");
        result = await generateCompetitiveAnalysis(supabase, user.id, startup_id);
        break;

      default:
        throw new Error(`Unknown action: ${action}`);
    }

    return new Response(
      JSON.stringify(result),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("[documents-agent] Error:", error);
    return new Response(
      JSON.stringify({
        error: "Internal Server Error",
        message: error instanceof Error ? error.message : "Unknown error",
      }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
