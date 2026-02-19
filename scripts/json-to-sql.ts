import * as fs from 'fs';
import * as path from 'path';

const JSON_FILE = path.resolve(process.cwd(), 'supabase/seeds/industry-playbooks.json');
const SQL_FILE = path.resolve(process.cwd(), 'supabase/seeds/99-industry-expert-verified.sql');

function main() {
    const data = JSON.parse(fs.readFileSync(JSON_FILE, 'utf-8'));

    let sql = `-- Auto-generated verified expert data seed
-- Generated from markdown playbooks via parse-playbooks.ts

INSERT INTO industry_playbooks (
  industry_id, display_name, narrative_arc,
  investor_expectations, failure_patterns, success_stories, benchmarks,
  terminology, gtm_patterns, decision_frameworks, investor_questions,
  warning_signs, stage_checklists, slide_emphasis,
  version, is_active, source
) VALUES 
`;

    const rows = data.map((p: any) => {
        return `(
  ${escapeStr(p.industry_id)},
  ${escapeStr(p.display_name)},
  ${escapeStr(p.narrative_arc)},
  ${escapeJson(p.investor_expectations)},
  ${escapeJson(p.failure_patterns)},
  ${escapeJson(p.success_stories)},
  ${escapeJson(p.benchmarks)},
  ${escapeJson(p.terminology)},
  ${escapeJson(p.gtm_patterns)},
  ${escapeJson(p.decision_frameworks)},
  ${escapeJson(p.investor_questions)},
  ${escapeJson(p.warning_signs)},
  ${escapeJson(p.stage_checklists)},
  ${escapeJson(p.slide_emphasis)},
  3, true, 'expert_markdown'
)`;
    });

    sql += rows.join(',\n') + `
ON CONFLICT (industry_id) DO UPDATE SET
  display_name = EXCLUDED.display_name,
  narrative_arc = EXCLUDED.narrative_arc,
  investor_expectations = EXCLUDED.investor_expectations,
  failure_patterns = EXCLUDED.failure_patterns,
  success_stories = EXCLUDED.success_stories,
  benchmarks = EXCLUDED.benchmarks,
  terminology = EXCLUDED.terminology,
  gtm_patterns = EXCLUDED.gtm_patterns,
  decision_frameworks = EXCLUDED.decision_frameworks,
  investor_questions = EXCLUDED.investor_questions,
  warning_signs = EXCLUDED.warning_signs,
  stage_checklists = EXCLUDED.stage_checklists,
  slide_emphasis = EXCLUDED.slide_emphasis,
  version = EXCLUDED.version,
  source = EXCLUDED.source,
  updated_at = now();
`;

    fs.writeFileSync(SQL_FILE, sql);
    console.log(`✓ Generated ${SQL_FILE}`);
}

function escapeStr(str: string) {
    if (str === null || str === undefined) return 'NULL';
    return `'${str.replace(/'/g, "''")}'`;
}

function escapeJson(obj: any) {
    return `'${JSON.stringify(obj).replace(/'/g, "''")}'::jsonb`;
}

main();
