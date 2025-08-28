import React, { useState } from 'react';
import { X, DollarSign, Save, Calculator, Plus, Trash2, Home } from 'lucide-react';
import { User, Property } from '../types';

interface SettingsModalProps {
  user: User;
  properties: Property[];
  onClose: () => void;
  onSaveSalary: (salaries: number[]) => Promise<void>;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ user, properties, onClose, onSaveSalary }) => {
  const [salaries, setSalaries] = useState<number[]>(user.monthlySalaries || [0]);
  const [includeRentalIncome, setIncludeRentalIncome] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const addSalary = () => {
    setSalaries([...salaries, 0]);
  };

  const removeSalary = (index: number) => {
    if (salaries.length > 1) {
      setSalaries(salaries.filter((_, i) => i !== index));
    }
  };

  const updateSalary = (index: number, value: number) => {
    const newSalaries = [...salaries];
    newSalaries[index] = value;
    setSalaries(newSalaries);
  };

  const totalMonthlySalary = salaries.reduce((sum, salary) => sum + salary, 0);
  
  // Calculer les revenus locatifs réels (70% des loyers selon les critères bancaires)
  const totalRentalIncome = properties.reduce((sum, p) => sum + p.monthlyRent, 0);
  const bankRentalIncome = totalRentalIncome * 0.7; // 70% des loyers selon les critères bancaires
  
  // Revenus totaux incluant ou non les loyers
  const totalMonthlyIncome = includeRentalIncome ? totalMonthlySalary + bankRentalIncome : totalMonthlySalary;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (salaries.some(salary => salary < 0)) return;

    setIsSaving(true);
    try {
      await onSaveSalary(salaries);
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
            <DollarSign className="h-6 w-6 text-gold" />
            <h2 className="text-xl font-playfair font-semibold text-navy">
              Paramètres financiers
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
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-roboto font-medium text-gray-700">
                Salaires mensuels nets (€)
              </label>
              <button
                type="button"
                onClick={addSalary}
                className="p-2 bg-gold text-navy rounded-lg hover:bg-gold/90 transition-colors"
                title="Ajouter un salaire (conjoint, co-emprunteur...)"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
            
            {salaries.map((salary, index) => (
              <div key={index} className="mb-4">
                <div className="flex items-center space-x-3">
                  <div className="flex-1 relative">
                    <input
                      type="number"
                      value={salary}
                      onChange={(e) => updateSalary(index, Number(e.target.value))}
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
                  {salaries.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeSalary(index)}
                      className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                      title="Supprimer ce salaire"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
                <p className="text-sm text-gray-500 mt-1 font-roboto">
                  {index === 0 ? 'Votre salaire mensuel net' : `Salaire du co-emprunteur ${index}`}
                </p>
              </div>
            ))}
            
            <p className="text-sm text-gray-500 mt-2 font-roboto">
              Ajoutez le salaire de votre conjoint ou co-emprunteur pour calculer le taux d'endettement du couple
            </p>
          </div>

          {/* Section des revenus locatifs */}
          {properties.length > 0 && (
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-roboto font-medium text-blue-800 flex items-center space-x-2">
                  <Home className="h-4 w-4" />
                  <span>Revenus locatifs réels</span>
                </h3>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={includeRentalIncome}
                    onChange={(e) => setIncludeRentalIncome(e.target.checked)}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                  />
                  <span className="text-sm font-roboto text-blue-700">Inclure dans le calcul</span>
                </label>
              </div>
              
              <div className="text-sm text-blue-700 font-roboto space-y-2">
                <div className="flex justify-between">
                  <span>Loyers totaux mensuels :</span>
                  <span className="font-semibold">{totalRentalIncome.toLocaleString('fr-FR')} €/mois</span>
                </div>
                <div className="flex justify-between">
                  <span>Revenus locatifs bancaires (70%) :</span>
                  <span className="font-semibold">{bankRentalIncome.toLocaleString('fr-FR')} €/mois</span>
                </div>
                <div className="text-xs text-blue-600 mt-2 p-2 bg-blue-100 rounded">
                  <strong>Note :</strong> Les banques prennent en compte 70% des loyers pour calculer votre capacité d'emprunt
                </div>
              </div>
            </div>
          )}

          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-sm font-roboto font-medium text-gray-700 mb-2">Calculs financiers</h3>
            <div className="text-sm text-gray-600 font-roboto space-y-2">
              <div className="flex items-center space-x-2">
                <Calculator className="h-4 w-4 text-navy" />
                <p>Revenus totaux mensuels : <span className="font-semibold text-navy">{totalMonthlyIncome.toLocaleString('fr-FR')} €/mois</span></p>
                {includeRentalIncome && totalRentalIncome > 0 && (
                  <span className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded">
                    +{bankRentalIncome.toLocaleString('fr-FR')}€ loyers
                  </span>
                )}
              </div>
              <div className="flex items-center space-x-2">
                <Calculator className="h-4 w-4 text-navy" />
                <p>Revenus totaux annuels : <span className="font-semibold text-navy">{(totalMonthlyIncome * 12).toLocaleString('fr-FR')} €/an</span></p>
              </div>
              <div className="flex items-center space-x-2">
                <Calculator className="h-4 w-4 text-navy" />
                <p>Taux d'endettement max (33%) : <span className="font-semibold text-navy">{(totalMonthlyIncome * 0.33).toLocaleString('fr-FR')} €/mois</span></p>
              </div>
              <div className="flex items-center space-x-2">
                <Calculator className="h-4 w-4 text-navy" />
                <p>Capacité d'emprunt estimée : <span className="font-semibold text-navy">{(totalMonthlyIncome * 0.33 * 12 * 20).toLocaleString('fr-FR')} €</span></p>
              </div>
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
              disabled={isSaving || salaries.some(salary => salary < 0)}
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
