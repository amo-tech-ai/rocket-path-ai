/**
 * Invoke other Supabase Edge Functions
 * Forwards auth headers; used by validator-flow facade
 */

export interface InvokeOptions {
  functionName: string;
  method: 'GET' | 'POST';
  headers: Headers;
  body?: string;
  searchParams?: Record<string, string>;
}

export async function invokeFunction(options: InvokeOptions): Promise<Response> {
  const supabaseUrl = Deno.env.get('SUPABASE_URL');
  if (!supabaseUrl) {
    throw new Error('Missing SUPABASE_URL');
  }

  const url = new URL(`${supabaseUrl}/functions/v1/${options.functionName}`);
  if (options.searchParams) {
    Object.entries(options.searchParams).forEach(([k, v]) =>
      url.searchParams.set(k, v)
    );
  }

  const anonKey = Deno.env.get('SUPABASE_ANON_KEY');
  const reqHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(anonKey && { apikey: anonKey }),
  };
  const auth = options.headers.get('Authorization');
  if (auth) reqHeaders['Authorization'] = auth;
  const xClient = options.headers.get('x-client-info');
  if (xClient) reqHeaders['x-client-info'] = xClient;

  const res = await fetch(url.toString(), {
    method: options.method,
    headers: reqHeaders,
    body: options.method === 'POST' ? options.body ?? '{}' : undefined,
  });

  return res;
}
