import { createClient } from '@supabase/supabase-js';

// Configuration Supabase
const supabaseUrl = 'https://adveiddumizjbtwjzafc.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFkdmVpZGR1bWl6amJ0d2p6YWZjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYzNDAyMTksImV4cCI6MjA3MTkxNjIxOX0.SXpAzzJZjx9jdcA0AlDNA5Sf3fsf-vpjeqcvo_4Ojpg';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testSimulations() {
  console.log('🧪 Test des opérations sur la table simulations...\n');

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

    // 2. Compter les simulations existantes
    console.log('\n2️⃣ Comptage des simulations existantes...');
    const { count, error: countError } = await supabase
      .from('simulations')
      .select('*', { count: 'exact', head: true });

    if (countError) {
      console.log('❌ Erreur lors du comptage:', countError.message);
    } else {
      console.log(`📊 Nombre de simulations dans la base: ${count}`);
    }

    // 3. Tester l'insertion d'une simulation de test
    console.log('\n3️⃣ Test d\'insertion d\'une simulation...');
    const testSimulation = {
      user_id: '00000000-0000-0000-0000-000000000000', // ID de test
      name: 'Test Simulation',
      type: 'appartement',
      price: 200000,
      down_payment: 40000,
      monthly_rent: 1200,
      loan_rate: 3.5,
      loan_duration: 20,
      monthly_charges: 200,
      property_tax: 1200,
      insurance: 600,
      maintenance: 1200,
      renovation_cost: 10000,
      vacancy_rate: 5,
      loan_amount: 160000,
      monthly_payment: 800,
      monthly_cashflow: 200,
      annual_cashflow: 2400,
      total_annual_income: 14400,
      total_annual_expenses: 12000,
      roi: 6.0,
      cap_rate: 7.2,
      cash_on_cash_return: 6.0,
      break_even_rent: 1000,
      cumulative_net_worth: 200000,
      cumulative_monthly_income: 1200
    };

    const { data: insertData, error: insertError } = await supabase
      .from('simulations')
      .insert(testSimulation)
      .select()
      .single();

    if (insertError) {
      console.log('❌ Erreur lors de l\'insertion:', insertError.message);
      console.log('🔍 Détails:', insertError.details, insertError.hint);
    } else {
      console.log('✅ Simulation de test insérée avec succès !');
      console.log('🆔 ID généré:', insertData.id);
      
      // 4. Supprimer la simulation de test
      console.log('\n4️⃣ Suppression de la simulation de test...');
      const { error: deleteError } = await supabase
        .from('simulations')
        .delete()
        .eq('id', insertData.id);

      if (deleteError) {
        console.log('❌ Erreur lors de la suppression:', deleteError.message);
      } else {
        console.log('✅ Simulation de test supprimée avec succès !');
      }
    }

  } catch (error) {
    console.error('💥 Erreur générale:', error);
  }
}

// Exécuter le test
testSimulations();
