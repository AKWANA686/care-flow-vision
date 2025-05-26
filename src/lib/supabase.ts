import { createClient } from '@supabase/supabase-js';

// Debug environment variables
console.log('Environment variables:', {
  url: import.meta.env.VITE_SUPABASE_URL,
  key: import.meta.env.VITE_SUPABASE_ANON_KEY
});

const supabaseUrl = 'https://pizabgpzaleciuicvptc.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBpemFiZ3B6YWxlY2l1aWN2cHRjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgwNjEyMzEsImV4cCI6MjA2MzYzNzIzMX0.g4QbiDX9ewARQM2z3h156gdMe1uA19UJFjopKVU7vH0';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});
