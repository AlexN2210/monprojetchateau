-- Vérifier la structure de la table simulations
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'simulations' 
ORDER BY ordinal_position;

-- Vérifier les politiques RLS existantes
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies 
WHERE tablename = 'simulations';
