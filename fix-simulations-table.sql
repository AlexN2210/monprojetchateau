-- Ajouter les colonnes manquantes à la table simulations
-- Vérifier d'abord quelles colonnes existent déjà

-- Ajouter les colonnes pour les résultats de simulation
ALTER TABLE simulations 
ADD COLUMN IF NOT EXISTS loan_amount DECIMAL(12,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS monthly_payment DECIMAL(10,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS monthly_cashflow DECIMAL(10,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS annual_cashflow DECIMAL(10,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS total_annual_income DECIMAL(12,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS total_annual_expenses DECIMAL(12,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS roi DECIMAL(8,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS cap_rate DECIMAL(8,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS cash_on_cash_return DECIMAL(8,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS break_even_rent DECIMAL(10,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS cumulative_net_worth DECIMAL(12,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS cumulative_monthly_income DECIMAL(10,2) DEFAULT 0;

-- Vérifier la structure finale de la table
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'simulations' 
ORDER BY ordinal_position;
