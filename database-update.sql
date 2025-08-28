-- Script de mise à jour pour Heritage Tracker
-- À exécuter si les tables existent déjà

-- Vérifier et créer la table properties si elle n'existe pas
CREATE TABLE IF NOT EXISTS properties (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('maison', 'appartement', 'château', 'terrain', 'immeuble', 'autre')),
  value DECIMAL(12,2) NOT NULL DEFAULT 0,
  remaining_credit DECIMAL(12,2) NOT NULL DEFAULT 0,
  monthly_rent DECIMAL(10,2) NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Vérifier et créer la table simulations si elle n'existe pas
CREATE TABLE IF NOT EXISTS simulations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('maison', 'appartement', 'château', 'terrain', 'immeuble', 'autre')),
  price DECIMAL(12,2) NOT NULL,
  down_payment DECIMAL(12,2) NOT NULL,
  monthly_rent DECIMAL(10,2) NOT NULL,
  loan_rate DECIMAL(5,2) NOT NULL,
  loan_duration INTEGER NOT NULL,
  monthly_charges DECIMAL(10,2) DEFAULT 0,
  property_tax DECIMAL(10,2) DEFAULT 0,
  insurance DECIMAL(10,2) DEFAULT 0,
  maintenance DECIMAL(10,2) DEFAULT 0,
  renovation_cost DECIMAL(12,2) DEFAULT 0,
  vacancy_rate DECIMAL(5,2) DEFAULT 5,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Activer Row Level Security (RLS) - ne fait rien si déjà activé
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE simulations ENABLE ROW LEVEL SECURITY;

-- Supprimer les politiques existantes si elles existent (pour éviter les conflits)
DROP POLICY IF EXISTS "Users can view their own properties" ON properties;
DROP POLICY IF EXISTS "Users can insert their own properties" ON properties;
DROP POLICY IF EXISTS "Users can update their own properties" ON properties;
DROP POLICY IF EXISTS "Users can delete their own properties" ON properties;

DROP POLICY IF EXISTS "Users can view their own simulations" ON simulations;
DROP POLICY IF EXISTS "Users can insert their own simulations" ON simulations;
DROP POLICY IF EXISTS "Users can update their own simulations" ON simulations;
DROP POLICY IF EXISTS "Users can delete their own simulations" ON simulations;

-- Créer les politiques de sécurité pour les propriétés
CREATE POLICY "Users can view their own properties" ON properties
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own properties" ON properties
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own properties" ON properties
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own properties" ON properties
  FOR DELETE USING (auth.uid() = user_id);

-- Créer les politiques de sécurité pour les simulations
CREATE POLICY "Users can view their own simulations" ON simulations
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own simulations" ON simulations
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own simulations" ON simulations
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own simulations" ON simulations
  FOR DELETE USING (auth.uid() = user_id);

-- Créer la fonction pour updated_at si elle n'existe pas
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Supprimer le trigger existant s'il existe
DROP TRIGGER IF EXISTS update_properties_updated_at ON properties;

-- Créer le trigger pour properties
CREATE TRIGGER update_properties_updated_at 
  BEFORE UPDATE ON properties 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Créer les index s'ils n'existent pas
CREATE INDEX IF NOT EXISTS idx_properties_user_id ON properties(user_id);
CREATE INDEX IF NOT EXISTS idx_simulations_user_id ON simulations(user_id);
CREATE INDEX IF NOT EXISTS idx_properties_created_at ON properties(created_at);
CREATE INDEX IF NOT EXISTS idx_simulations_created_at ON simulations(created_at);
