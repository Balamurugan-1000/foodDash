// src/supabase.js
import { createClient } from "@supabase/supabase-js";

// Initialize the Supabase client
const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL, // Replace with your Supabase URL
  import.meta.env.VITE_SUPABASE_ANON_KEY, // Replace with your Supabase Anon Key
);

export default supabase;
