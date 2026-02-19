/**
 * Parse Industry Playbooks from Markdown to JSON
 *
 * Reads markdown playbook files and converts them to structured JSON
 * for seeding into the database.
 *
 * Usage:
 *   npx tsx scripts/parse-playbooks.ts
 *
 * Output:
 *   Creates supabase/seeds/industry-playbooks.json
 */

import * as fs from 'fs';
import * as path from 'path';

// Types matching the database schema
interface InvestorExpectations {
  pre_seed?: StageExpectation;
  seed?: StageExpectation;
  series_a?: StageExpectation;
}

interface StageExpectation {
  focus: string[];
  metrics: string[];
  deal_breakers: string[];
}

interface FailurePattern {
  pattern: string;
  why_fatal: string;
  early_warning: string;
  how_to_avoid: string;
}

interface SuccessStory {
  archetype: string;
  pattern: string;
  key_moves: string[];
  outcome_signal: string;
}

interface BenchmarkMetric {
  metric: string;
  good: string;
  great: string;
  stage: string;
  source: string;
}

interface IndustryTerminology {
  use_phrases: string[];
  avoid_phrases: string[];
  investor_vocabulary: string[];
}

interface GTMPattern {
  name: string;
  description: string;
  stages: string[];
  channels: string[];
  timeline: string;
  best_for: string;
}

interface DecisionFramework {
  decision: string;
  rows: {
    if_condition: string;
    then_action: string;
    because: string;
  }[];
}

interface InvestorQuestion {
  category: string;
  question: string;
  good_answer: string;
  bad_answer: string;
  follow_up: string;
}

interface WarningSign {
  signal: string;
  trigger: string;
  action: string;
  severity: 'critical' | 'warning';
}

interface StageChecklist {
  stage: string;
  tasks: {
    task: string;
    why: string;
    how: string;
    time: string;
    cost: string;
  }[];
}

interface SlideEmphasis {
  slide: string;
  weight: 'critical' | 'important' | 'standard';
  guidance: string;
}

interface IndustryPlaybook {
  industry_id: string;
  display_name: string;
  narrative_arc: string;
  investor_expectations: InvestorExpectations;
  failure_patterns: FailurePattern[];
  success_stories: SuccessStory[];
  benchmarks: BenchmarkMetric[];
  terminology: IndustryTerminology;
  gtm_patterns: GTMPattern[];
  decision_frameworks: DecisionFramework[];
  investor_questions: InvestorQuestion[];
  warning_signs: WarningSign[];
  stage_checklists: StageChecklist[];
  slide_emphasis: SlideEmphasis[];
}

// Directory paths - uses path.resolve for safety
const SCRIPT_DIR = path.dirname(new URL(import.meta.url).pathname);
const PLAYBOOKS_DIR = path.resolve(SCRIPT_DIR, '../tasks/playbooks');
const OUTPUT_FILE = path.resolve(SCRIPT_DIR, '../supabase/seeds/industry-playbooks.json');

/**
 * Parse a markdown playbook file into structured JSON
 */
function parsePlaybook(filePath: string): IndustryPlaybook | null {
  const content = fs.readFileSync(filePath, 'utf-8');
  const fileName = path.basename(filePath, '.md');

  // Skip index file
  if (fileName.startsWith('00-')) return null;

  try {
    // Extract header info
    const industryIdMatch = content.match(/\*\*Industry ID:\*\*\s*`([^`]+)`/);
    const displayNameMatch = content.match(/\*\*Display Name:\*\*\s*(.+)/);
    const narrativeMatch = content.match(/## Narrative Arc\n+([^\n]+)/);

    if (!industryIdMatch) {
      console.warn(`No industry ID found in ${fileName}`);
      return null;
    }

    const playbook: IndustryPlaybook = {
      industry_id: industryIdMatch[1],
      display_name: displayNameMatch?.[1] || fileName.replace(/-/g, ' '),
      narrative_arc: narrativeMatch?.[1] || '',
      investor_expectations: parseInvestorExpectations(content),
      failure_patterns: parseFailurePatterns(content),
      success_stories: parseSuccessStories(content),
      benchmarks: parseBenchmarks(content),
      terminology: parseTerminology(content),
      gtm_patterns: parseGTMPatterns(content),
      decision_frameworks: parseDecisionFrameworks(content),
      investor_questions: parseInvestorQuestions(content),
      warning_signs: parseWarningSigns(content),
      stage_checklists: parseStageChecklists(content),
      slide_emphasis: parseSlideEmphasis(content)
    };

    return playbook;
  } catch (error) {
    console.error(`Error parsing ${fileName}:`, error);
    return null;
  }
}

/**
 * Parse investor expectations section
 */
function parseInvestorExpectations(content: string): InvestorExpectations {
  const expectations: InvestorExpectations = {};

  const section = extractSection(content, '## Investor Expectations');
  if (!section) return expectations;

  // Parse each stage
  const stages = ['Pre-Seed', 'Seed', 'Series A'];
  const stageKeys: ('pre_seed' | 'seed' | 'series_a')[] = ['pre_seed', 'seed', 'series_a'];

  stages.forEach((stage, idx) => {
    const stageSection = extractSubSection(section, `### ${stage}`);
    if (stageSection) {
      expectations[stageKeys[idx]] = {
        focus: extractList(stageSection, '**Focus:**'),
        metrics: extractList(stageSection, '**Metrics:**'),
        deal_breakers: extractList(stageSection, '**Deal Breakers:**')
      };
    }
  });

  return expectations;
}

/**
 * Parse failure patterns section
 */
function parseFailurePatterns(content: string): FailurePattern[] {
  const patterns: FailurePattern[] = [];
  const section = extractSection(content, '## Failure Patterns');
  if (!section) return patterns;

  // Find each numbered pattern
  const patternRegex = /### \d+\.\s+(.+?)\n+\*\*Pattern:\*\*\s*(.+?)\n+\*\*Why Fatal:\*\*\s*(.+?)\n+\*\*Early Warning:\*\*\s*(.+?)\n+\*\*How to Avoid:\*\*\s*(.+?)(?=\n###|\n##|$)/gs;

  let match;
  while ((match = patternRegex.exec(section)) !== null) {
    patterns.push({
      pattern: match[2].trim(),
      why_fatal: match[3].trim(),
      early_warning: match[4].trim(),
      how_to_avoid: match[5].trim()
    });
  }

  return patterns;
}

/**
 * Parse success stories section
 */
function parseSuccessStories(content: string): SuccessStory[] {
  const stories: SuccessStory[] = [];
  const section = extractSection(content, '## Success Stories');
  if (!section) return stories;

  const storyRegex = /### \d+\.\s+(.+?)\n+\*\*Archetype:\*\*\s*(.+?)\n+\*\*Pattern:\*\*\s*(.+?)\n+\*\*Key Moves:\*\*([\s\S]+?)\*\*Outcome Signal:\*\*\s*(.+?)(?=\n###|\n##|$)/gs;

  let match;
  while ((match = storyRegex.exec(section)) !== null) {
    stories.push({
      archetype: match[2].trim(),
      pattern: match[3].trim(),
      key_moves: extractBulletList(match[4]),
      outcome_signal: match[5].trim()
    });
  }

  return stories;
}

/**
 * Parse benchmarks table
 */
function parseBenchmarks(content: string): BenchmarkMetric[] {
  const benchmarks: BenchmarkMetric[] = [];
  const section = extractSection(content, '## Benchmarks');
  if (!section) return benchmarks;

  // Parse markdown table
  const tableRegex = /\|\s*([^|]+)\s*\|\s*([^|]+)\s*\|\s*([^|]+)\s*\|\s*([^|]+)\s*\|\s*([^|]+)\s*\|/g;

  let match;
  let isHeader = true;
  while ((match = tableRegex.exec(section)) !== null) {
    if (isHeader || match[1].includes('---')) {
      isHeader = false;
      continue;
    }

    benchmarks.push({
      metric: match[1].trim(),
      good: match[2].trim(),
      great: match[3].trim(),
      stage: match[4].trim(),
      source: match[5].trim()
    });
  }

  return benchmarks;
}

/**
 * Parse terminology section
 */
function parseTerminology(content: string): IndustryTerminology {
  const section = extractSection(content, '## Terminology');
  if (!section) {
    return { use_phrases: [], avoid_phrases: [], investor_vocabulary: [] };
  }

  return {
    use_phrases: extractBulletList(extractSubSection(section, '### Use These Phrases') || ''),
    avoid_phrases: extractBulletList(extractSubSection(section, '### Avoid These Phrases') || ''),
    investor_vocabulary: extractBulletList(extractSubSection(section, '### Investor Vocabulary') || '')
  };
}

/**
 * Parse GTM patterns section
 */
function parseGTMPatterns(content: string): GTMPattern[] {
  const patterns: GTMPattern[] = [];
  const section = extractSection(content, '## GTM Patterns');
  if (!section) return patterns;

  const patternRegex = /### \d+\.\s+(.+?)\n+\*\*Description:\*\*\s*(.+?)\n+\*\*Stages:\*\*\s*(.+?)\n+\*\*Channels:\*\*([\s\S]+?)\*\*Timeline:\*\*\s*(.+?)\n+\*\*Best For:\*\*\s*(.+?)(?=\n###|\n##|$)/gs;

  let match;
  while ((match = patternRegex.exec(section)) !== null) {
    patterns.push({
      name: match[1].trim(),
      description: match[2].trim(),
      stages: match[3].split(',').map(s => s.trim()),
      channels: extractBulletList(match[4]),
      timeline: match[5].trim(),
      best_for: match[6].trim()
    });
  }

  return patterns;
}

/**
 * Parse decision frameworks section
 */
function parseDecisionFrameworks(content: string): DecisionFramework[] {
  const frameworks: DecisionFramework[] = [];
  const section = extractSection(content, '## Decision Frameworks');
  if (!section) return frameworks;

  const fwRegex = /### \d+\.\s+(.+?)\n+\*\*Decision:\*\*\s*(.+?)\n+([\s\S]+?)(?=\n###|\n##|$)/gs;

  let match;
  while ((match = fwRegex.exec(section)) !== null) {
    const tableContent = match[3];
    const rows: { if_condition: string; then_action: string; because: string }[] = [];

    const rowRegex = /\|\s*([^|]+)\s*\|\s*([^|]+)\s*\|\s*([^|]+)\s*\|/g;
    let rowMatch;
    let isHeader = true;

    while ((rowMatch = rowRegex.exec(tableContent)) !== null) {
      if (isHeader || rowMatch[1].includes('---') || rowMatch[1].includes('If...')) {
        isHeader = false;
        continue;
      }

      rows.push({
        if_condition: rowMatch[1].trim(),
        then_action: rowMatch[2].trim(),
        because: rowMatch[3].trim()
      });
    }

    frameworks.push({
      decision: match[2].trim(),
      rows
    });
  }

  return frameworks;
}

/**
 * Parse investor questions section
 */
function parseInvestorQuestions(content: string): InvestorQuestion[] {
  const questions: InvestorQuestion[] = [];
  const section = extractSection(content, '## Investor Questions');
  if (!section) return questions;

  const questionRegex = /\*\*Q:\s*"([^"]+)"\*\*\s*\n-\s*\*\*Good:\*\*\s*"([^"]+)"\s*\n-\s*\*\*Bad:\*\*\s*"([^"]+)"\s*\n-\s*\*\*Follow-up if weak:\*\*\s*"([^"]+)"/g;

  let match;
  let currentCategory = 'General';

  // Track category from ### headers
  const categoryMatches = section.match(/### (\w+)/g);
  let categoryIdx = 0;

  while ((match = questionRegex.exec(section)) !== null) {
    // Try to determine category from position
    if (categoryMatches && categoryIdx < categoryMatches.length) {
      currentCategory = categoryMatches[categoryIdx].replace('### ', '');
      categoryIdx++;
    }

    questions.push({
      category: currentCategory,
      question: match[1].trim(),
      good_answer: match[2].trim(),
      bad_answer: match[3].trim(),
      follow_up: match[4].trim()
    });
  }

  return questions;
}

/**
 * Parse warning signs table
 */
function parseWarningSigns(content: string): WarningSign[] {
  const signs: WarningSign[] = [];
  const section = extractSection(content, '## Warning Signs');
  if (!section) return signs;

  const rowRegex = /\|\s*([^|]+)\s*\|\s*([^|]+)\s*\|\s*([^|]+)\s*\|\s*([^|]+)\s*\|/g;

  let match;
  let isHeader = true;

  while ((match = rowRegex.exec(section)) !== null) {
    if (isHeader || match[1].includes('---') || match[1].includes('Signal')) {
      isHeader = false;
      continue;
    }

    signs.push({
      signal: match[1].trim(),
      trigger: match[2].trim(),
      action: match[3].trim(),
      severity: match[4].trim().toLowerCase().includes('critical') ? 'critical' : 'warning'
    });
  }

  return signs;
}

/**
 * Parse stage checklists section
 */
function parseStageChecklists(content: string): StageChecklist[] {
  const checklists: StageChecklist[] = [];
  const section = extractSection(content, '## Stage Checklists');
  if (!section) return checklists;

  const stages = ['Before Pre-Seed', 'Before Seed', 'Before Series A'];

  stages.forEach(stage => {
    const stageSection = extractSubSection(section, `### ${stage}`);
    if (!stageSection) return;

    const tasks: { task: string; why: string; how: string; time: string; cost: string }[] = [];

    const rowRegex = /\|\s*([^|]+)\s*\|\s*([^|]+)\s*\|\s*([^|]+)\s*\|\s*([^|]+)\s*\|\s*([^|]+)\s*\|/g;

    let match;
    let isHeader = true;

    while ((match = rowRegex.exec(stageSection)) !== null) {
      if (isHeader || match[1].includes('---') || match[1].includes('Task')) {
        isHeader = false;
        continue;
      }

      tasks.push({
        task: match[1].trim(),
        why: match[2].trim(),
        how: match[3].trim(),
        time: match[4].trim(),
        cost: match[5].trim()
      });
    }

    if (tasks.length > 0) {
      checklists.push({ stage, tasks });
    }
  });

  return checklists;
}

/**
 * Parse slide emphasis table
 */
function parseSlideEmphasis(content: string): SlideEmphasis[] {
  const emphasis: SlideEmphasis[] = [];
  const section = extractSection(content, '## Slide Emphasis');
  if (!section) return emphasis;

  const rowRegex = /\|\s*([^|]+)\s*\|\s*([^|]+)\s*\|\s*([^|]+)\s*\|/g;

  let match;
  let isHeader = true;

  while ((match = rowRegex.exec(section)) !== null) {
    if (isHeader || match[1].includes('---') || match[1].includes('Slide')) {
      isHeader = false;
      continue;
    }

    const weight = match[2].trim().toLowerCase();
    emphasis.push({
      slide: match[1].trim(),
      weight: weight.includes('critical') ? 'critical' : weight.includes('important') ? 'important' : 'standard',
      guidance: match[3].trim()
    });
  }

  return emphasis;
}

// Helper functions
function extractSection(content: string, header: string): string | null {
  const headerEscaped = header.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(`${headerEscaped}\\n+([\\s\\S]+?)(?=\\n## |$)`, 'g');
  const match = regex.exec(content);
  return match ? match[1] : null;
}

function extractSubSection(content: string, header: string): string | null {
  const headerEscaped = header.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(`${headerEscaped}\\n+([\\s\\S]+?)(?=\\n### |\\n## |$)`, 'g');
  const match = regex.exec(content);
  return match ? match[1] : null;
}

function extractList(content: string, marker: string): string[] {
  const markerIdx = content.indexOf(marker);
  if (markerIdx === -1) return [];

  const afterMarker = content.substring(markerIdx + marker.length);
  const lines = afterMarker.split('\n');
  const items: string[] = [];

  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith('-')) {
      items.push(trimmed.substring(1).trim());
    } else if (trimmed.startsWith('**') || trimmed === '') {
      break;
    }
  }

  return items;
}

function extractBulletList(content: string): string[] {
  const lines = content.split('\n');
  const items: string[] = [];

  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith('-')) {
      items.push(trimmed.substring(1).trim().replace(/"/g, ''));
    }
  }

  return items;
}

// Main execution
function main() {
  console.log('Parsing industry playbooks...\n');

  const files = fs.readdirSync(PLAYBOOKS_DIR).filter(f => f.endsWith('.md'));
  const playbooks: IndustryPlaybook[] = [];

  for (const file of files) {
    const filePath = path.join(PLAYBOOKS_DIR, file);
    console.log(`Parsing: ${file}`);

    const playbook = parsePlaybook(filePath);
    if (playbook) {
      playbooks.push(playbook);
      console.log(`  ✓ ${playbook.display_name} (${playbook.industry_id})`);
      console.log(`    - ${playbook.failure_patterns.length} failure patterns`);
      console.log(`    - ${playbook.success_stories.length} success stories`);
      console.log(`    - ${playbook.benchmarks.length} benchmarks`);
      console.log(`    - ${playbook.investor_questions.length} investor questions`);
    }
  }

  // Ensure output directory exists
  const outputDir = path.dirname(OUTPUT_FILE);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // Write output
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(playbooks, null, 2));

  console.log(`\n✓ Parsed ${playbooks.length} playbooks`);
  console.log(`✓ Output: ${OUTPUT_FILE}`);
}

main();
