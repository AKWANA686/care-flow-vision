// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://pizabgpzaleciuicvptc.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBpemFiZ3B6YWxlY2l1aWN2cHRjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgwNjEyMzEsImV4cCI6MjA2MzYzNzIzMX0.g4QbiDX9ewARQM2z3h156gdMe1uA19UJFjopKVU7vH0";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);