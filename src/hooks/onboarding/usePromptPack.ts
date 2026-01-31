/**
 * usePromptPack Hook
 * Handles agentic routing and execution of prompt packs.
 * Connects UI features to relevant AI workflows.
 */

import { useMutation, useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface SearchParams {
    feature: string;
    industry?: string;
    stage?: string;
}

interface RunParams {
    packId: string;
    context: Record<string, any>;
    industry?: string;
    applyTo?: string[];
}

export function usePromptPack() {
    const { toast } = useToast();

    // 1. Search for a pack based on feature context
    const searchPack = async (params: SearchParams) => {
        const { data, error } = await supabase.functions.invoke('prompt-pack', {
            body: {
                action: 'search',
                module: params.feature,
                industry: params.industry,
                stage: params.stage,
            },
        });

        if (error) throw error;
        return data;
    };

    // 2. Execute a pack
    const runPackMutation = useMutation({
        mutationFn: async (params: RunParams) => {
            // 1. Run the pack steps
            const { data: runResult, error: runError } = await supabase.functions.invoke('prompt-pack', {
                body: {
                    action: 'run_pack',
                    pack_id: params.packId,
                    context: params.context,
                    industry: params.industry,
                },
            });

            if (runError) throw runError;

            // 2. If applyTo targets provided, execute the apply engine
            if (params.applyTo && params.applyTo.length > 0) {
                // We take the LAST output if multiple steps, or handle based on logic.
                // For simplicity, we assume the last step contains the final structured output.
                const finalOutput = Array.isArray(runResult.outputs)
                    ? runResult.outputs[runResult.outputs.length - 1]
                    : runResult.outputs;

                const { data: applyResult, error: applyError } = await supabase.functions.invoke('prompt-pack', {
                    body: {
                        action: 'apply',
                        outputs_json: finalOutput,
                        apply_to: params.applyTo,
                        startup_id: params.context.startup_id,
                    },
                });

                if (applyError) throw applyError;
                return { run: runResult, apply: applyResult };
            }

            return { run: runResult };
        },
        onSuccess: () => {
            toast({
                title: 'Strategy Updated',
                description: 'AI insights have been successfully applied to your workspace.',
            });
        },
        onError: (error) => {
            console.error('Prompt pack execution failed:', error);
            toast({
                title: 'Execution Failed',
                description: 'Failed to apply AI insights. Please try again.',
                variant: 'destructive',
            });
        },
    });

    return {
        searchPack,
        runPack: runPackMutation.mutateAsync,
        isExecuting: runPackMutation.isPending,
    };
}
