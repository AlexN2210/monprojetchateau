import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://adveiddumizjbtwjzafc.supabase.co'
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFkdmVpZGR1bWl6amJ0d2p6YWZjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYzNDAyMTksImV4cCI6MjA3MTkxNjIxOX0.SXpAzzJZjx9jdcA0AlDNA5Sf3fsf-vpjeqcvo_4Ojpg'

console.log('Configuration Supabase:', { supabaseUrl, supabaseKey: supabaseKey.substring(0, 20) + '...' })

export const supabase = createClient(supabaseUrl, supabaseKey)

// Test de connexion
supabase.auth.getSession().then(({ data: { session }, error }) => {
  if (error) {
    console.error('Erreur de session Supabase:', error)
  } else {
    console.log('Session Supabase:', session ? 'Connecté' : 'Non connecté')
  }
})
