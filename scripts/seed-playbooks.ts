import * as fs from 'fs';
import * as path from 'path';
import { createClient } from '@supabase/supabase-js';

// Configuration
const JSON_FILE = path.resolve(process.cwd(), 'supabase/seeds/industry-playbooks.json');
const SUPABASE_URL = process.env.SUPABASE_URL || '';
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment variables.');
    process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

async function main() {
    console.log('Seeding industry playbooks from JSON...');

    const data = JSON.parse(fs.readFileSync(JSON_FILE, 'utf-8'));

    for (const playbook of data) {
        console.log(`Seeding ${playbook.display_name} (${playbook.industry_id})...`);

        const { error } = await supabase
            .from('industry_playbooks')
            .upsert({
                industry_id: playbook.industry_id,
                display_name: playbook.display_name,
                narrative_arc: playbook.narrative_arc,
                investor_expectations: playbook.investor_expectations,
                failure_patterns: playbook.failure_patterns,
                success_stories: playbook.success_stories,
                benchmarks: playbook.benchmarks,
                terminology: playbook.terminology,
                gtm_patterns: playbook.gtm_patterns,
                decision_frameworks: playbook.decision_frameworks,
                investor_questions: playbook.investor_questions,
                warning_signs: playbook.warning_signs,
                stage_checklists: playbook.stage_checklists,
                slide_emphasis: playbook.slide_emphasis,
                version: 3, // Incrementing version to indicate verified high-depth data
                is_active: true,
                source: 'expert_markdown'
            }, {
                onConflict: 'industry_id'
            });

        if (error) {
            console.error(`  Error seeding ${playbook.industry_id}:`, error.message);
        } else {
            console.log(`  ✓ Success`);
        }
    }

    console.log('\nSeeding complete.');
}

main().catch(err => {
    console.error('Fatal error:', err);
    process.exit(1);
});
