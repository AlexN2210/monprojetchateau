-- Script de réinitialisation pour Heritage Tracker
-- ATTENTION : Ce script supprime toutes les données existantes !

-- Supprimer les tables existantes
DROP TABLE IF EXISTS simulations CASCADE;
DROP TABLE IF EXISTS properties CASCADE;

-- Supprimer la fonction si elle existe
DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;

-- Maintenant exécutez le script database-schema.sql original
