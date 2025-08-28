-- Solution simple : Recréer complètement la table simulations
-- ATTENTION: Ceci va supprimer toutes les données existantes

-- 1. Supprimer la table existante
DROP TABLE IF EXISTS simulations CASCADE;

-- 2. Créer la nouvelle table avec TOUTES les colonnes nécessaires
CREATE TABLE simulations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID, -- Temporairement sans contrainte de clé étrangère
    name TEXT NOT NULL,
    type TEXT NOT NULL,
    price DECIMAL(12,2) NOT NULL,
    down_payment DECIMAL(12,2) NOT NULL,
    monthly_rent DECIMAL(12,2) NOT NULL,
    loan_rate DECIMAL(5,2) NOT NULL,
    loan_duration INTEGER NOT NULL,
    monthly_charges DECIMAL(10,2) DEFAULT 0,
    property_tax DECIMAL(10,2) DEFAULT 0,
    insurance DECIMAL(10,2) DEFAULT 0,
    maintenance DECIMAL(10,2) DEFAULT 0,
    renovation_cost DECIMAL(10,2) DEFAULT 0,
    vacancy_rate DECIMAL(5,2) DEFAULT 0,
    loan_amount DECIMAL(12,2) DEFAULT 0,
    monthly_payment DECIMAL(10,2) DEFAULT 0,
    monthly_cashflow DECIMAL(10,2) DEFAULT 0,
    annual_cashflow DECIMAL(10,2) DEFAULT 0,
    total_annual_income DECIMAL(12,2) DEFAULT 0,
    total_annual_expenses DECIMAL(12,2) DEFAULT 0,
    roi DECIMAL(8,2) DEFAULT 0,
    cap_rate DECIMAL(8,2) DEFAULT 0,
    cash_on_cash_return DECIMAL(8,2) DEFAULT 0,
    break_even_rent DECIMAL(10,2) DEFAULT 0,
    cumulative_net_worth DECIMAL(12,2) DEFAULT 0,
    cumulative_monthly_income DECIMAL(10,2) DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Désactiver RLS temporairement pour les tests
ALTER TABLE simulations DISABLE ROW LEVEL SECURITY;

-- 4. Vérifier que la table a été créée correctement
SELECT 'Table simulations créée avec succès avec toutes les colonnes' as status;

-- 5. Lister toutes les colonnes pour vérification
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'simulations' 
ORDER BY ordinal_position;
