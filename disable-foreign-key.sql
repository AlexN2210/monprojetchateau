-- Désactiver temporairement la contrainte de clé étrangère pour les tests
-- ATTENTION: Ceci est temporaire et pour les tests uniquement

-- Vérifier la contrainte existante
SELECT 
    tc.constraint_name, 
    tc.table_name, 
    kcu.column_name, 
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name 
FROM 
    information_schema.table_constraints AS tc 
    JOIN information_schema.key_column_usage AS kcu
      ON tc.constraint_name = kcu.constraint_name
      AND tc.table_schema = kcu.table_schema
    JOIN information_schema.constraint_column_usage AS ccu
      ON ccu.constraint_name = tc.constraint_name
      AND ccu.table_schema = tc.table_schema
WHERE tc.constraint_type = 'FOREIGN KEY' 
    AND tc.table_name='simulations';

-- Désactiver la contrainte
ALTER TABLE simulations DROP CONSTRAINT IF EXISTS simulations_user_id_fkey;

-- Recréer la table sans contrainte de clé étrangère (temporaire)
-- Note: En production, vous devriez garder cette contrainte
ALTER TABLE simulations 
ADD CONSTRAINT simulations_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES auth.users(id) 
ON DELETE CASCADE DEFERRABLE INITIALLY DEFERRED;

-- Vérifier que la contrainte est maintenant différée
SELECT 
    tc.constraint_name, 
    tc.table_name, 
    tc.constraint_type,
    cc.check_clause
FROM 
    information_schema.table_constraints AS tc
    LEFT JOIN information_schema.check_constraints AS cc 
        ON tc.constraint_name = cc.constraint_name
WHERE tc.table_name = 'simulations';
