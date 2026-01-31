/**
 * PackExecutionDrawer Component
 * Displays the real-time execution progress of an AI Prompt Pack.
 * Multi-step orchestration UI.
 */

import { useState } from 'react';
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, Circle, Loader2 } from "lucide-react";

interface Step {
    id: string;
    title: string;
    status: 'pending' | 'running' | 'completed' | 'failed';
}

interface PackExecutionDrawerProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    packName: string;
    steps: Step[];
    progress: number;
}

export function PackExecutionDrawer({
    open,
    onOpenChange,
    packName,
    steps,
    progress,
}: PackExecutionDrawerProps) {
    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent side="right" className="sm:max-w-md border-l bg-slate-950 text-white">
                <SheetHeader className="space-y-4">
                    <SheetTitle className="text-white flex items-center gap-2">
                        <div className="p-2 rounded-lg bg-blue-500/20 text-blue-400">
                            <Loader2 className="h-5 w-5 animate-spin" />
                        </div>
                        AI Strategist: {packName}
                    </SheetTitle>
                    <SheetDescription className="text-slate-400">
                        Orchestrating multi-step intelligence pack for your industry context.
                    </SheetDescription>
                </SheetHeader>

                <div className="mt-8 space-y-8">
                    {/* Main Progress Bar */}
                    <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                            <span className="text-slate-400 font-medium">Global Completion</span>
                            <span className="text-blue-400 font-bold">{progress}%</span>
                        </div>
                        <Progress value={progress} className="h-2 bg-slate-800" />
                    </div>

                    {/* Stepper logic */}
                    <div className="space-y-6 relative">
                        {/* Timeline line */}
                        <div className="absolute left-[11px] top-2 bottom-2 w-[1px] bg-slate-800" />

                        {steps.map((step) => (
                            <div key={step.id} className="flex items-start gap-4 relative">
                                <div className="mt-1 bg-slate-950 z-10 transition-colors duration-500">
                                    {step.status === 'completed' ? (
                                        <CheckCircle2 className="h-6 w-6 text-green-500 fill-green-500/10" />
                                    ) : step.status === 'running' ? (
                                        <Loader2 className="h-6 w-6 text-blue-500 animate-spin" />
                                    ) : (
                                        <Circle className="h-6 w-6 text-slate-700" />
                                    )}
                                </div>
                                <div className="space-y-1">
                                    <p className={`text-sm font-semibold transition-colors ${step.status === 'running' ? 'text-blue-400' :
                                            step.status === 'completed' ? 'text-slate-200' : 'text-slate-500'
                                        }`}>
                                        {step.title}
                                    </p>
                                    {step.status === 'running' && (
                                        <p className="text-xs text-slate-400 animate-pulse">
                                            Analyzing data models and market benchmarks...
                                        </p>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="p-4 rounded-xl bg-blue-500/5 border border-blue-500/10 text-xs text-blue-300 leading-relaxed italic">
                        "We are currently mapping your unique value proposition against direct competitors in the industry playbook to generate higher-fidelity task recommendations."
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    );
}
