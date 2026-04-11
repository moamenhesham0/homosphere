import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://njergtgoucwagfkijaqu.supabase.co";
const supabaseAnonKey = "sb_publishable_CNyxL8IEY4Qj1j8gdchWNg_A3aOpX3D";

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export { supabase };