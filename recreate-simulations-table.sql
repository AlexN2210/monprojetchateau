-- Supprimer la table simulations existante et la recréer
DROP TABLE IF EXISTS simulations CASCADE;

-- Créer la table simulations avec toutes les colonnes nécessaires
CREATE TABLE simulations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
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

-- Activer RLS (Row Level Security)
ALTER TABLE simulations ENABLE ROW LEVEL SECURITY;

-- Créer les politiques RLS
CREATE POLICY "Users can view their own simulations" ON simulations
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own simulations" ON simulations
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own simulations" ON simulations
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own simulations" ON simulations
    FOR DELETE USING (auth.uid() = user_id);

-- Vérifier que la table a été créée correctement
SELECT 'Table simulations créée avec succès' as status;
