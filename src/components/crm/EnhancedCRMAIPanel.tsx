/**
 * Enhanced CRM AI Panel
 * Combines investor matching, deal advisor, outreach sequences, and enrichment
 */

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Target, Lightbulb, Sparkles, Users, Mail } from 'lucide-react';
import { InvestorMatcherPanel } from './InvestorMatcherPanel';
import { DealAdvisorPanel } from './DealAdvisorPanel';
import { OutreachSequencePanel } from './OutreachSequencePanel';
import { ScrollArea } from '@/components/ui/scroll-area';
import { motion } from 'framer-motion';

interface EnhancedCRMAIPanelProps {
  startupId?: string;
  contactsCount: number;
  dealsCount: number;
  selectedDeal?: {
    id: string;
    name: string;
    stage: string;
    amount?: number;
    expected_close?: string;
    contact?: { name: string; email?: string } | null;
  } | null;
  selectedContact?: {
    id: string;
    name: string;
    email?: string;
    company?: string;
  } | null;
  onAddContact: (investor: any) => void;
}

export function EnhancedCRMAIPanel({
  startupId,
  contactsCount,
  dealsCount,
  selectedDeal,
  selectedContact,
  onAddContact
}: EnhancedCRMAIPanelProps) {
  const [activeTab, setActiveTab] = useState('matcher');

  return (
    <div className="h-full flex flex-col bg-background">
      {/* Header Stats */}
      <div className="p-4 border-b">
        <h3 className="font-semibold mb-3 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-sage" />
          AI Intelligence
        </h3>
        <div className="grid grid-cols-2 gap-3">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-muted/50 rounded-lg p-3 text-center"
          >
            <Users className="w-5 h-5 mx-auto mb-1 text-muted-foreground" />
            <p className="text-lg font-semibold">{contactsCount}</p>
            <p className="text-xs text-muted-foreground">Contacts</p>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="bg-muted/50 rounded-lg p-3 text-center"
          >
            <Target className="w-5 h-5 mx-auto mb-1 text-muted-foreground" />
            <p className="text-lg font-semibold">{dealsCount}</p>
            <p className="text-xs text-muted-foreground">Active Deals</p>
          </motion.div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs 
        value={activeTab} 
        onValueChange={setActiveTab}
        className="flex-1 flex flex-col"
      >
        <TabsList className="w-full justify-start rounded-none border-b bg-transparent p-0">
          <TabsTrigger 
            value="matcher"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-sage data-[state=active]:bg-transparent text-xs px-2"
          >
            <Target className="w-3.5 h-3.5 mr-1" />
            Match
          </TabsTrigger>
          <TabsTrigger 
            value="outreach"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-sage data-[state=active]:bg-transparent text-xs px-2"
          >
            <Mail className="w-3.5 h-3.5 mr-1" />
            Outreach
          </TabsTrigger>
          <TabsTrigger 
            value="advisor"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-sage data-[state=active]:bg-transparent text-xs px-2"
          >
            <Lightbulb className="w-3.5 h-3.5 mr-1" />
            Advise
          </TabsTrigger>
        </TabsList>

        <TabsContent value="matcher" className="flex-1 m-0">
          <InvestorMatcherPanel 
            startupId={startupId}
            onAddContact={onAddContact}
          />
        </TabsContent>

        <TabsContent value="outreach" className="flex-1 m-0">
          <OutreachSequencePanel 
            startupId={startupId}
            selectedContact={selectedContact}
          />
        </TabsContent>

        <TabsContent value="advisor" className="flex-1 m-0">
          <DealAdvisorPanel deal={selectedDeal || null} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
