import { z } from 'zod';

export const step1Schema = z.object({
  company_name: z
    .string()
    .min(1, 'Company name is required')
    .max(100, 'Company name must be less than 100 characters'),
  description: z
    .string()
    .min(1, 'Description is required')
    .max(2000, 'Description must be less than 2000 characters'),
  target_market: z
    .string()
    .min(10, 'Target market must be at least 10 characters')
    .max(200, 'Target market must be less than 200 characters'),
  stage: z
    .string()
    .min(1, 'Please select a stage'),
  business_model: z
    .array(z.string())
    .min(1, 'Please select at least one business model'),
  industry: z
    .array(z.string())
    .min(1, 'Please select at least one industry'),
  // Optional fields
  website_url: z.string().url('Please enter a valid URL').optional().or(z.literal('')),
  linkedin_url: z.string().url('Please enter a valid LinkedIn URL').optional().or(z.literal('')),
});

export type Step1FormData = z.infer<typeof step1Schema>;

export interface Step1ValidationErrors {
  company_name?: string;
  description?: string;
  target_market?: string;
  stage?: string;
  business_model?: string;
  industry?: string;
  website_url?: string;
  linkedin_url?: string;
}

export function validateStep1(data: Partial<Step1FormData>): {
  isValid: boolean;
  errors: Step1ValidationErrors;
} {
  const result = step1Schema.safeParse({
    company_name: data.company_name || '',
    description: data.description || '',
    target_market: data.target_market || '',
    stage: data.stage || '',
    business_model: data.business_model || [],
    industry: Array.isArray(data.industry) ? data.industry : (data.industry ? [data.industry] : []),
    website_url: data.website_url || '',
    linkedin_url: data.linkedin_url || '',
  });

  if (result.success) {
    return { isValid: true, errors: {} };
  }

  const errors: Step1ValidationErrors = {};
  result.error.errors.forEach((err) => {
    const field = err.path[0] as keyof Step1ValidationErrors;
    if (field && !errors[field]) {
      errors[field] = err.message;
    }
  });

  return { isValid: false, errors };
}

export function getMissingFields(errors: Step1ValidationErrors): string[] {
  const fieldLabels: Record<keyof Step1ValidationErrors, string> = {
    company_name: 'Company name',
    description: 'Description',
    target_market: 'Target market',
    stage: 'Stage',
    business_model: 'Business model',
    industry: 'Industry',
    website_url: 'Website URL',
    linkedin_url: 'LinkedIn URL',
  };

  return Object.keys(errors)
    .filter((key) => errors[key as keyof Step1ValidationErrors])
    .map((key) => fieldLabels[key as keyof Step1ValidationErrors]);
}
