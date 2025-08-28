-- Schéma de base de données pour Heritage Tracker
-- À exécuter dans l'éditeur SQL de Supabase

-- Table des propriétés
CREATE TABLE properties (
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

-- Table des simulations (optionnel, pour garder un historique)
CREATE TABLE simulations (
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

-- Activer Row Level Security (RLS)
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE simulations ENABLE ROW LEVEL SECURITY;

-- Politiques de sécurité pour les propriétés
CREATE POLICY "Users can view their own properties" ON properties
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own properties" ON properties
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own properties" ON properties
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own properties" ON properties
  FOR DELETE USING (auth.uid() = user_id);

-- Politiques de sécurité pour les simulations
CREATE POLICY "Users can view their own simulations" ON simulations
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own simulations" ON simulations
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own simulations" ON simulations
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own simulations" ON simulations
  FOR DELETE USING (auth.uid() = user_id);

-- Fonction pour mettre à jour updated_at automatiquement
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger pour properties
CREATE TRIGGER update_properties_updated_at 
  BEFORE UPDATE ON properties 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Index pour améliorer les performances
CREATE INDEX idx_properties_user_id ON properties(user_id);
CREATE INDEX idx_simulations_user_id ON simulations(user_id);
CREATE INDEX idx_properties_created_at ON properties(created_at);
CREATE INDEX idx_simulations_created_at ON simulations(created_at);
