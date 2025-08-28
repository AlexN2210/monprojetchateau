import { createClient } from '@supabase/supabase-js';

// Configuration Supabase
const supabaseUrl = 'https://adveiddumizjbtwjzafc.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFkdmVpZGR1bWl6amJ0d2p6YWZjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYzNDAyMTksImV4cCI6MjA3MTkxNjIxOX0.SXpAzzJZjx9jdcA0AlDNA5Sf3fsf-vpjeqcvo_4Ojpg';

const supabase = createClient(supabaseUrl, supabaseKey);

async function diagnoseSimulations() {
  console.log('🔍 Diagnostic complet de la table simulations...\n');

  try {
    // 1. Vérifier si la table existe
    console.log('1️⃣ Vérification de l\'existence de la table simulations...');
    const { data: tableCheck, error: tableError } = await supabase
      .from('simulations')
      .select('count')
      .limit(1);
    
    if (tableError) {
      console.log('❌ Table simulations non trouvée ou erreur:', tableError.message);
      console.log('💡 Vous devez d\'abord exécuter le script SQL pour créer la table');
      return;
    }
    
    console.log('✅ Table simulations trouvée !');

    // 2. Vérifier la structure exacte de la table
    console.log('\n2️⃣ Vérification de la structure de la table...');
    const { data: columns, error: columnsError } = await supabase
      .rpc('get_table_columns', { table_name: 'simulations' });

    if (columnsError) {
      console.log('⚠️ Impossible de récupérer la structure avec RPC, essayons une autre méthode...');
      
      // Méthode alternative : essayer d'insérer une ligne vide pour voir les erreurs
      console.log('\n3️⃣ Test d\'insertion avec une ligne minimale...');
      const { data: insertData, error: insertError } = await supabase
        .from('simulations')
        .insert({
          user_id: '00000000-0000-0000-0000-000000000000',
          name: 'Test',
          type: 'appartement',
          price: 100000,
          down_payment: 20000,
          monthly_rent: 800,
          loan_rate: 3.5,
          loan_duration: 20
        })
        .select()
        .single();

      if (insertError) {
        console.log('❌ Erreur lors de l\'insertion minimale:', insertError.message);
        console.log('🔍 Détails:', insertError.details, insertError.hint);
        
        // Analyser l'erreur pour comprendre le problème
        if (insertError.message.includes('column')) {
          console.log('💡 Le problème semble être lié aux colonnes manquantes');
          console.log('📋 Exécutez le script recreate-simulations-table.sql dans Supabase');
        }
      } else {
        console.log('✅ Insertion minimale réussie !');
        console.log('🆔 ID généré:', insertData.id);
        
        // Supprimer la ligne de test
        await supabase.from('simulations').delete().eq('id', insertData.id);
        console.log('🗑️ Ligne de test supprimée');
      }
    } else {
      console.log('📊 Colonnes trouvées:', columns);
    }

  } catch (error) {
    console.error('💥 Erreur générale:', error);
  }
}

// Exécuter le diagnostic
diagnoseSimulations();
