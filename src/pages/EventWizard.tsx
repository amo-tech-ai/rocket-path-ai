import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, X, Check, Sparkles, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import DashboardLayout from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useCreateEvent } from '@/hooks/useEvents';

import WizardStepContext from '@/components/events/wizard/WizardStepContext';
import WizardStepStrategy from '@/components/events/wizard/WizardStepStrategy';
import WizardStepLogistics from '@/components/events/wizard/WizardStepLogistics';
import WizardStepReview from '@/components/events/wizard/WizardStepReview';
import WizardAIPanel from '@/components/events/wizard/WizardAIPanel';

const STORAGE_KEY = 'event-wizard-progress';

export interface WizardData {
  // Step 1: Context
  name: string;
  event_type: string;
  reference_url: string;
  description: string;
  // Step 2: Strategy
  goals: string[];
  target_audience: string;
  expected_attendees: number;
  budget: number;
  success_metrics: string[];
  // Step 3: Logistics
  event_date: string;
  event_time: string;
  duration_hours: number;
  location_type: 'in_person' | 'virtual' | 'hybrid';
  venue_name: string;
  venue_city: string;
  timezone: string;
}

const initialData: WizardData = {
  name: '',
  event_type: '',
  reference_url: '',
  description: '',
  goals: [],
  target_audience: '',
  expected_attendees: 50,
  budget: 5000,
  success_metrics: [],
  event_date: '',
  event_time: '18:00',
  duration_hours: 3,
  location_type: 'in_person',
  venue_name: '',
  venue_city: '',
  timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
};

const steps = [
  { id: 1, name: 'Context', description: 'Event basics' },
  { id: 2, name: 'Strategy', description: 'Goals & audience' },
  { id: 3, name: 'Logistics', description: 'When & where' },
  { id: 4, name: 'Review', description: 'Confirm & create' },
];

export default function EventWizard() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const createEvent = useCreateEvent();

  const [currentStep, setCurrentStep] = useState(1);
  const [data, setData] = useState<WizardData>(initialData);
  const [isCreating, setIsCreating] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);

  // Load progress from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setData(parsed.data || initialData);
        setCurrentStep(parsed.step || 1);
      } catch {
        localStorage.removeItem(STORAGE_KEY);
      }
    }
  }, []);

  // Save progress to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ data, step: currentStep }));
  }, [data, currentStep]);

  const updateData = (updates: Partial<WizardData>) => {
    setData(prev => ({ ...prev, ...updates }));
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return data.name.trim() !== '' && data.event_type !== '';
      case 2:
        return data.goals.length > 0 && data.expected_attendees > 0;
      case 3:
        return data.event_date !== '';
      case 4:
        return true;
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleCreate = async () => {
    setIsCreating(true);
    try {
      // Combine date and time
      const eventDateTime = data.event_date && data.event_time
        ? new Date(`${data.event_date}T${data.event_time}`).toISOString()
        : new Date().toISOString();

      const result = await createEvent.mutateAsync({
        title: data.name,
        name: data.name,
        event_type: data.event_type as any,
        description: data.description,
        start_date: eventDateTime,
        location_type: data.location_type,
        capacity: data.expected_attendees,
        budget: data.budget,
        status: 'scheduled',
        timezone: data.timezone,
      });

      // Clear wizard progress
      localStorage.removeItem(STORAGE_KEY);

      toast({
        title: 'Event created!',
        description: `${data.name} has been created successfully.`,
      });

      // Navigate to the new event
      navigate(`/app/events/${result.id}`);
    } catch (error) {
      console.error('Error creating event:', error);
      toast({
        title: 'Error creating event',
        description: 'Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsCreating(false);
    }
  };

  const handleCancel = () => {
    if (window.confirm('Are you sure? Your progress will be saved.')) {
      navigate('/app/events');
    }
  };

  return (
    <DashboardLayout>
      <div className="flex h-full bg-background">
        {/* Main Wizard Content */}
        <div className="flex-1 overflow-auto">
          {/* Header */}
          <div className="border-b bg-card/30">
            <div className="px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={handleCancel}>
                  <X className="h-5 w-5" />
                </Button>
                <div>
                  <h1 className="text-xl font-semibold">Create New Event</h1>
                  <p className="text-sm text-muted-foreground">
                    {steps[currentStep - 1].description}
                  </p>
                </div>
              </div>
            </div>

            {/* Progress Indicator */}
            <div className="px-6 pb-4">
              <div className="flex items-center gap-2">
                {steps.map((step, index) => (
                  <div key={step.id} className="flex items-center">
                    <div
                      className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium transition-colors ${
                        step.id < currentStep
                          ? 'bg-primary text-primary-foreground'
                          : step.id === currentStep
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted text-muted-foreground'
                      }`}
                    >
                      {step.id < currentStep ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        step.id
                      )}
                    </div>
                    <span
                      className={`ml-2 text-sm font-medium hidden sm:block ${
                        step.id === currentStep
                          ? 'text-foreground'
                          : 'text-muted-foreground'
                      }`}
                    >
                      {step.name}
                    </span>
                    {index < steps.length - 1 && (
                      <div
                        className={`w-12 h-0.5 mx-3 ${
                          step.id < currentStep ? 'bg-primary' : 'bg-muted'
                        }`}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Step Content */}
          <div className="p-6 max-w-2xl mx-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
              >
                {currentStep === 1 && (
                  <WizardStepContext data={data} updateData={updateData} />
                )}
                {currentStep === 2 && (
                  <WizardStepStrategy data={data} updateData={updateData} />
                )}
                {currentStep === 3 && (
                  <WizardStepLogistics data={data} updateData={updateData} />
                )}
                {currentStep === 4 && (
                  <WizardStepReview data={data} />
                )}
              </motion.div>
            </AnimatePresence>

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between mt-8 pt-6 border-t">
              <Button
                variant="outline"
                onClick={handleBack}
                disabled={currentStep === 1}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>

              {currentStep < 4 ? (
                <Button onClick={handleNext} disabled={!canProceed()}>
                  Next
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              ) : (
                <Button
                  onClick={handleCreate}
                  disabled={isCreating || !canProceed()}
                  className="gap-2"
                >
                  {isCreating ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4" />
                      Create Event
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Right Panel - AI Assistant */}
        <div className="w-[340px] border-l bg-card/50 hidden lg:block overflow-auto">
          <WizardAIPanel
            currentStep={currentStep}
            data={data}
            suggestions={aiSuggestions}
          />
        </div>
      </div>
    </DashboardLayout>
  );
}
