import React, { useState } from 'react';
import { X, Target, Save } from 'lucide-react';

interface GoalModalProps {
  currentGoal: number;
  onClose: () => void;
  onSaveGoal: (goal: number) => Promise<void>;
}

export const GoalModal: React.FC<GoalModalProps> = ({ currentGoal, onClose, onSaveGoal }) => {
  const [rentalGoal, setRentalGoal] = useState(currentGoal);
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rentalGoal < 0) return;

    setIsSaving(true);
    try {
      await onSaveGoal(rentalGoal);
      onClose();
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <Target className="h-6 w-6 text-gold" />
            <h2 className="text-xl font-playfair font-semibold text-navy">
              Définir l'objectif de rente
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label htmlFor="rentalGoal" className="block text-sm font-roboto font-medium text-gray-700 mb-2">
              Objectif de rente mensuelle (€)
            </label>
            <div className="relative">
              <input
                type="number"
                id="rentalGoal"
                value={rentalGoal}
                onChange={(e) => setRentalGoal(Number(e.target.value))}
                min="0"
                step="100"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent font-roboto text-lg"
                placeholder="0"
                required
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                <span className="text-gray-500 font-roboto">€</span>
              </div>
            </div>
            <p className="text-sm text-gray-500 mt-2 font-roboto">
              Définissez votre objectif de revenus locatifs mensuels
            </p>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-sm font-roboto font-medium text-gray-700 mb-2">Aperçu</h3>
            <div className="text-sm text-gray-600 font-roboto">
              <p>Objectif actuel : <span className="font-semibold text-navy">{rentalGoal.toLocaleString('fr-FR')} €/mois</span></p>
              <p>Objectif annuel : <span className="font-semibold text-navy">{(rentalGoal * 12).toLocaleString('fr-FR')} €/an</span></p>
            </div>
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-roboto font-medium"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={isSaving || rentalGoal < 0}
              className="flex-1 px-4 py-3 bg-gold text-navy rounded-lg hover:bg-gold/90 transition-colors font-roboto font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {isSaving ? (
                <>
                  <div className="w-4 h-4 border-2 border-navy border-t-transparent rounded-full animate-spin"></div>
                  <span>Sauvegarde...</span>
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  <span>Sauvegarder</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
