import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://tswieklnhrlbvhuqbfev.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRzd2lla2xuaHJsYnZodXFiZmV2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY2OTk5NjksImV4cCI6MjA2MjI3NTk2OX0.biRiZe2Z6Bwfwn8Suval6SUmg_f3tJKPaMvaqWFuy-Y";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);