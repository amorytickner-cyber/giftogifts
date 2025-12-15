import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface Message {
  id: string;
  parent_name: string;
  parent_email: string;
  child_age: number;
  message: string;
  status: 'new' | 'replied' | 'archived';
  reply: string | null;
  created_at: string;
  replied_at: string | null;
}
