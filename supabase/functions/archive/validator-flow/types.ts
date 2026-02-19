/**
 * validator-flow request/response types
 */

export interface FlowStartRequest {
  input_text: string;
  startup_id?: string;
  interview_context?: {
    version: number;
    extracted: Record<string, string>;
    coverage: Record<string, string>;
  };
}

export interface FlowStartResponse {
  success: boolean;
  session_id?: string;
  status?: string;
  error?: string;
}

export interface FlowStatusQuery {
  session_id: string;
}
