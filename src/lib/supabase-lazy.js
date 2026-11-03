// Public pages load the Supabase client only when they need fresh data,
// keeping it out of the first JavaScript download.
export const hasSupabase = Boolean(import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY)

let client
export const loadSupabase = () => (client ??= import('./supabase').then(m => m.supabase))
