import { createBrowserClient } from '@supabase/ssr';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Supabase URL and Anon Key must be set in .env.local');
}

export const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey);

export function createClient(...args) {
  // eslint-disable-next-line no-console
  console.warn('Placeholder: createClient is not implemented yet.', args);
  return null;
}

function isSupabaseConfigured(...args: any[]): any {
  // eslint-disable-next-line no-console
  console.warn('Placeholder: isSupabaseConfigured is not implemented yet.', args);
  return null;
}

export { isSupabaseConfigured };
export function getStripe(...args) {
  // eslint-disable-next-line no-console
  console.warn('Placeholder: getStripe is not implemented yet.', args);
  return null;
}
