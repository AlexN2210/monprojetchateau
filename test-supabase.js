// Script de test pour vérifier la connexion Supabase
// Exécutez avec: node test-supabase.js

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://adveiddumizjbtwjzafc.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFkdmVpZGR1bWl6amJ0d2p6YWZjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYzNDAyMTksImV4cCI6MjA3MTkxNjIxOX0.SXpAzzJZjx9jdcA0AlDNA5Sf3fsf-vpjeqcvo_4Ojpg'

const supabase = createClient(supabaseUrl, supabaseKey)

async function testSupabase() {
  console.log('🔍 Test de connexion Supabase...')
  
  try {
    // Test 1: Vérifier la session
    console.log('\n1. Test de session...')
    const { data: { session }, error: sessionError } = await supabase.auth.getSession()
    if (sessionError) {
      console.error('❌ Erreur de session:', sessionError.message)
    } else {
      console.log('✅ Session OK:', session ? 'Connecté' : 'Non connecté')
    }

    // Test 2: Vérifier les tables
    console.log('\n2. Test des tables...')
    const { data: properties, error: propertiesError } = await supabase
      .from('properties')
      .select('count')
      .limit(1)
    
    if (propertiesError) {
      console.error('❌ Erreur table properties:', propertiesError.message)
    } else {
      console.log('✅ Table properties accessible')
    }

    const { data: simulations, error: simulationsError } = await supabase
      .from('simulations')
      .select('count')
      .limit(1)
    
    if (simulationsError) {
      console.error('❌ Erreur table simulations:', simulationsError.message)
    } else {
      console.log('✅ Table simulations accessible')
    }

    // Test 3: Test d'inscription (avec un email de test)
    console.log('\n3. Test d\'inscription...')
    const testEmail = `test-${Date.now()}@example.com`
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email: testEmail,
      password: 'testpassword123',
      options: {
        data: {
          username: 'testuser'
        }
      }
    })

    if (signUpError) {
      console.error('❌ Erreur d\'inscription:', signUpError.message)
    } else {
      console.log('✅ Inscription test réussie:', signUpData.user?.email)
      
      // Nettoyer le compte de test
      if (signUpData.user) {
        await supabase.auth.admin.deleteUser(signUpData.user.id)
        console.log('🧹 Compte de test supprimé')
      }
    }

  } catch (error) {
    console.error('❌ Erreur générale:', error.message)
  }
}

testSupabase()
