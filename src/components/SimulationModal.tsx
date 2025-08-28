import { useState } from 'react';
import { X, Calculator, TrendingUp, AlertTriangle, DollarSign, Percent, Home, BarChart3, Save } from 'lucide-react';
import { SimulationData, SimulationResults, Property, SavedSimulation } from '../types';

interface SimulationModalProps {
  onClose: () => void;
  currentNetWorth: number;
  currentMonthlyIncome: number;
  onSaveSimulation?: (simulation: Omit<SavedSimulation, 'id' | 'createdAt'>) => Promise<void>;
}

export const SimulationModal: React.FC<SimulationModalProps> = ({ onClose, currentNetWorth, currentMonthlyIncome, onSaveSimulation }) => {
  const [formData, setFormData] = useState<SimulationData>({
    name: '',
    type: 'château',
    price: 0,
    downPayment: 0,
    monthlyRent: 0,
    loanRate: 3.5,
    loanDuration: 20,
    monthlyCharges: 0,
    propertyTax: 0,
    insurance: 0,
    maintenance: 0,
    renovationCost: 0,
    vacancyRate: 5,
  });

  const [showResults, setShowResults] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowResults(true);
  };

  const calculateResults = (): SimulationResults => {
    const loanAmount = formData.price - formData.downPayment;
    const monthlyRate = formData.loanRate / 100 / 12;
    const totalPayments = formData.loanDuration * 12;
    
    // Calcul de la mensualité de crédit
    const monthlyPayment = loanAmount > 0 
      ? (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, totalPayments)) / 
        (Math.pow(1 + monthlyRate, totalPayments) - 1)
      : 0;

    // Calcul des revenus nets (avec taux de vacance)
    const effectiveMonthlyRent = formData.monthlyRent * (1 - formData.vacancyRate / 100);
    
    // Calcul des charges mensuelles totales
    const totalMonthlyExpenses = monthlyPayment + 
      formData.monthlyCharges + 
      (formData.propertyTax / 12) + 
      (formData.insurance / 12) + 
      (formData.maintenance / 12);

    // Cashflow mensuel
    const monthlyCashflow = effectiveMonthlyRent - totalMonthlyExpenses;
    const annualCashflow = monthlyCashflow * 12;

    // Métriques de rentabilité
    const totalAnnualIncome = effectiveMonthlyRent * 12;
    const totalAnnualExpenses = totalMonthlyExpenses * 12;
    
    // ROI (Return on Investment) - basé sur l'apport + travaux
    const totalInvestment = formData.downPayment + formData.renovationCost;
    const roi = totalInvestment > 0 ? (annualCashflow / totalInvestment) * 100 : 0;
    
    // Cap Rate (taux de capitalisation) - basé sur le prix d'achat + travaux
    const totalPropertyValue = formData.price + formData.renovationCost;
    const capRate = totalPropertyValue > 0 ? (totalAnnualIncome / totalPropertyValue) * 100 : 0;
    
    // Cash-on-Cash Return (même que ROI)
    const cashOnCashReturn = roi;
    
    // Loyer de rentabilité (break-even)
    const breakEvenRent = totalMonthlyExpenses;

    // Vue cumulative
    const cumulativeNetWorth = currentNetWorth + (formData.price + formData.renovationCost - loanAmount);
    const cumulativeMonthlyIncome = currentMonthlyIncome + effectiveMonthlyRent;

    return {
      loanAmount,
      monthlyPayment,
      monthlyCashflow,
      annualCashflow,
      totalAnnualIncome,
      totalAnnualExpenses,
      roi,
      capRate,
      cashOnCashReturn,
      breakEvenRent,
      cumulativeNetWorth,
      cumulativeMonthlyIncome,
    };
  };

  const results = showResults ? calculateResults() : null;
  const missingAmount = formData.downPayment - currentNetWorth;
  const canAfford = formData.downPayment === 0 || missingAmount <= 0;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-4xl animate-scale-up max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <Calculator className="h-6 w-6 text-gold" />
            <h2 className="text-xl font-playfair font-semibold text-navy">
              Simulation d'investissement immobilier
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Formulaire */}
          <div>
            <h3 className="text-lg font-playfair font-semibold text-navy mb-4 flex items-center space-x-2">
              <Home className="h-5 w-5" />
              <span>Informations du bien</span>
            </h3>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-roboto font-medium text-gray-700 mb-1">
                    Nom du bien
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-gold transition-colors"
                    required
                    placeholder="Ex: Château de Versailles"
                  />
                </div>

                <div>
                  <label className="block text-sm font-roboto font-medium text-gray-700 mb-1">
                    Type de bien
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as Property['type'] })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-gold transition-colors"
                  >
                    <option value="château">Château</option>
                    <option value="maison">Maison</option>
                    <option value="appartement">Appartement</option>
                    <option value="terrain">Terrain</option>
                    <option value="immeuble">Immeuble</option>
                    <option value="autre">Autre</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-roboto font-medium text-gray-700 mb-1">
                    Prix d'achat (€)
                  </label>
                  <input
                    type="number"
                    value={formData.price === 0 ? '0' : formData.price || ''}
                    onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-gold transition-colors"
                    required
                    min="0"
                    step="1000"
                  />
                </div>

                <div>
                  <label className="block text-sm font-roboto font-medium text-gray-700 mb-1">
                    Apport personnel (€)
                  </label>
                  <input
                    type="number"
                    value={formData.downPayment === 0 ? '0' : formData.downPayment || ''}
                    onChange={(e) => setFormData({ ...formData, downPayment: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-gold transition-colors"
                    min="0"
                    max={formData.price}
                    step="1000"
                    placeholder="0 pour crédit à 100%"
                  />
                  <div className="text-xs text-gray-500 font-roboto mt-1">
                    Peut être 0€ pour un crédit à 100%
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-roboto font-medium text-gray-700 mb-1">
                    Loyer mensuel (€)
                  </label>
                  <input
                    type="number"
                    value={formData.monthlyRent === 0 ? '0' : formData.monthlyRent || ''}
                    onChange={(e) => setFormData({ ...formData, monthlyRent: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-gold transition-colors"
                    min="0"
                    step="50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-roboto font-medium text-gray-700 mb-1">
                    Taux de vacance (%)
                  </label>
                  <input
                    type="number"
                    value={formData.vacancyRate}
                    onChange={(e) => setFormData({ ...formData, vacancyRate: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-gold transition-colors"
                    min="0"
                    max="100"
                    step="0.1"
                  />
                </div>
              </div>

              <h4 className="text-md font-playfair font-semibold text-navy mt-6 mb-3 flex items-center space-x-2">
                <DollarSign className="h-4 w-4" />
                <span>Financement</span>
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-roboto font-medium text-gray-700 mb-1">
                    Taux d'emprunt (%)
                  </label>
                  <input
                    type="number"
                    value={formData.loanRate}
                    onChange={(e) => setFormData({ ...formData, loanRate: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-gold transition-colors"
                    min="0"
                    max="20"
                    step="0.1"
                  />
                </div>

                <div>
                  <label className="block text-sm font-roboto font-medium text-gray-700 mb-1">
                    Durée (années)
                  </label>
                  <select
                    value={formData.loanDuration}
                    onChange={(e) => setFormData({ ...formData, loanDuration: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-gold transition-colors"
                  >
                    <option value={5}>5 ans</option>
                    <option value={7}>7 ans</option>
                    <option value={10}>10 ans</option>
                    <option value={12}>12 ans</option>
                    <option value={15}>15 ans</option>
                    <option value={17}>17 ans</option>
                    <option value={20}>20 ans</option>
                    <option value={22}>22 ans</option>
                    <option value={25}>25 ans</option>
                    <option value={27}>27 ans</option>
                    <option value={30}>30 ans</option>
                  </select>
                </div>
              </div>

              <div className="mt-6">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-md font-playfair font-semibold text-navy flex items-center space-x-2">
                    <BarChart3 className="h-4 w-4" />
                    <span>Charges et coûts (optionnel)</span>
                  </h4>
                  <div className="text-xs text-gray-500 font-roboto">
                    Laissez vide si inconnu
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-roboto font-medium text-gray-700 mb-1">
                      Charges mensuelles (€)
                    </label>
                    <input
                      type="number"
                      value={formData.monthlyCharges === 0 ? '0' : formData.monthlyCharges || ''}
                      onChange={(e) => setFormData({ ...formData, monthlyCharges: parseFloat(e.target.value) || 0 })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-gold transition-colors"
                      min="0"
                      step="10"
                      placeholder="Ex: 150"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-roboto font-medium text-gray-700 mb-1">
                      Taxe foncière annuelle (€)
                    </label>
                    <input
                      type="number"
                      value={formData.propertyTax === 0 ? '0' : formData.propertyTax || ''}
                      onChange={(e) => setFormData({ ...formData, propertyTax: parseFloat(e.target.value) || 0 })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-gold transition-colors"
                      min="0"
                      step="100"
                      placeholder="Ex: 1200"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div>
                    <label className="block text-sm font-roboto font-medium text-gray-700 mb-1">
                      Assurance annuelle (€)
                    </label>
                    <input
                      type="number"
                      value={formData.insurance === 0 ? '0' : formData.insurance || ''}
                      onChange={(e) => setFormData({ ...formData, insurance: parseFloat(e.target.value) || 0 })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-gold transition-colors"
                      min="0"
                      step="50"
                      placeholder="Ex: 600"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-roboto font-medium text-gray-700 mb-1">
                      Maintenance annuelle (€)
                    </label>
                    <input
                      type="number"
                      value={formData.maintenance === 0 ? '0' : formData.maintenance || ''}
                      onChange={(e) => setFormData({ ...formData, maintenance: parseFloat(e.target.value) || 0 })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-gold transition-colors"
                      min="0"
                      step="100"
                      placeholder="Ex: 2000"
                    />
                  </div>
                </div>

                <div className="mt-4">
                  <label className="block text-sm font-roboto font-medium text-gray-700 mb-1">
                    Coût des travaux (€)
                  </label>
                  <input
                    type="number"
                    value={formData.renovationCost === 0 ? '0' : formData.renovationCost || ''}
                    onChange={(e) => setFormData({ ...formData, renovationCost: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-gold transition-colors"
                    min="0"
                    step="1000"
                    placeholder="Ex: 50000"
                  />
                  <div className="text-xs text-gray-500 font-roboto mt-1">
                    Rénovation, rénovation énergétique, aménagements...
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="w-full px-4 py-2 bg-gold text-navy rounded-lg hover:bg-gold/90 transition-colors font-roboto font-medium flex items-center justify-center space-x-2 mt-6"
              >
                <Calculator className="h-4 w-4" />
                <span>Calculer la rentabilité</span>
              </button>
            </form>
          </div>

          {/* Résultats */}
          {showResults && results && (
            <div className="space-y-6">
              <h3 className="text-lg font-playfair font-semibold text-navy mb-4 flex items-center space-x-2">
                <TrendingUp className="h-5 w-5" />
                <span>Analyse de rentabilité</span>
              </h3>

              {/* Faisabilité */}
              <div className="p-4 bg-light-gray rounded-lg">
                <h4 className="font-playfair font-semibold text-navy mb-3">Faisabilité du projet</h4>
                
                {/* Coût total de l'investissement */}
                <div className="mb-3 p-3 bg-white rounded-lg border border-gray-200">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600 font-roboto">Prix d'achat</span>
                      <span className="font-semibold text-navy">
                        {formData.price.toLocaleString('fr-FR')} €
                      </span>
                    </div>
                    {formData.renovationCost > 0 && (
                      <div className="flex justify-between">
                        <span className="text-gray-600 font-roboto">Coût des travaux</span>
                        <span className="font-semibold text-orange-600">
                          +{formData.renovationCost.toLocaleString('fr-FR')} €
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between border-t pt-2">
                      <span className="text-gray-600 font-roboto">Valeur totale</span>
                      <span className="font-bold text-navy">
                        {(formData.price + formData.renovationCost).toLocaleString('fr-FR')} €
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 font-roboto">Apport nécessaire</span>
                      <span className="font-semibold text-gold">
                        {formData.downPayment.toLocaleString('fr-FR')} €
                      </span>
                    </div>
                  </div>
                </div>

                {canAfford ? (
                  <div className="flex items-center justify-between p-3 bg-mint/20 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-mint rounded-full"></div>
                      <span className="font-roboto font-medium text-mint">
                        {formData.downPayment === 0 ? 'Crédit à 100% possible' : 'Projet réalisable !'}
                      </span>
                    </div>
                    <span className="font-semibold text-mint">
                      {formData.downPayment === 0 
                        ? 'Aucun apport requis' 
                        : `Surplus: ${Math.abs(missingAmount).toLocaleString('fr-FR')} €`
                      }
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <AlertTriangle className="w-4 h-4 text-red-500" />
                      <span className="font-roboto font-medium text-red-600">Capital insuffisant</span>
                    </div>
                    <span className="font-semibold text-red-600">
                      Manque: {missingAmount.toLocaleString('fr-FR')} €
                    </span>
                  </div>
                )}
              </div>

              {/* Métriques financières */}
              <div className="grid grid-cols-1 gap-4">
                <div className="p-4 bg-white border border-gray-200 rounded-lg">
                  <h4 className="font-playfair font-semibold text-navy mb-3 flex items-center space-x-2">
                    <DollarSign className="h-4 w-4" />
                    <span>Cashflow</span>
                  </h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600 font-roboto">Mensuel</span>
                      <span className={`font-semibold ${results.monthlyCashflow >= 0 ? 'text-mint' : 'text-red-600'}`}>
                        {results.monthlyCashflow.toLocaleString('fr-FR')} €
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 font-roboto">Annuel</span>
                      <span className={`font-semibold ${results.annualCashflow >= 0 ? 'text-mint' : 'text-red-600'}`}>
                        {results.annualCashflow.toLocaleString('fr-FR')} €
                      </span>
                    </div>
                    {formData.monthlyCharges === 0 && formData.propertyTax === 0 && formData.insurance === 0 && formData.maintenance === 0 && (
                      <div className="text-xs text-gray-500 font-roboto mt-2 p-2 bg-yellow-50 rounded">
                        ⚠️ Cashflow estimé sans charges détaillées
                      </div>
                    )}
                  </div>
                </div>

                <div className="p-4 bg-white border border-gray-200 rounded-lg">
                  <h4 className="font-playfair font-semibold text-navy mb-3 flex items-center space-x-2">
                    <Percent className="h-4 w-4" />
                    <span>Rentabilité</span>
                  </h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600 font-roboto">ROI (Cash-on-Cash)</span>
                      <span className={`font-semibold ${results.roi >= 0 ? 'text-mint' : 'text-red-600'}`}>
                        {results.roi.toFixed(2)}%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 font-roboto">Cap Rate</span>
                      <span className="font-semibold text-navy">
                        {results.capRate.toFixed(2)}%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 font-roboto">Loyer break-even</span>
                      <span className="font-semibold text-gold">
                        {results.breakEvenRent.toLocaleString('fr-FR')} €/mois
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-white border border-gray-200 rounded-lg">
                  <h4 className="font-playfair font-semibold text-navy mb-3 flex items-center space-x-2">
                    <TrendingUp className="h-4 w-4" />
                    <span>Vue cumulative</span>
                  </h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600 font-roboto">Capital net total</span>
                      <span className="font-semibold text-navy">
                        {results.cumulativeNetWorth.toLocaleString('fr-FR')} €
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 font-roboto">Revenus mensuels totaux</span>
                      <span className="font-semibold text-gold">
                        {results.cumulativeMonthlyIncome.toLocaleString('fr-FR')} €/mois
                      </span>
                    </div>
                  </div>
                </div>

                {/* Bouton de sauvegarde */}
                {onSaveSimulation && (
                  <div className="mt-6 p-4 bg-purple-50 border border-purple-200 rounded-lg">
                    <div className="text-center">
                      <h4 className="font-playfair font-semibold text-purple-800 mb-3 flex items-center justify-center space-x-2">
                        <Save className="h-5 w-5" />
                        <span>Sauvegarder cette simulation</span>
                      </h4>
                      <p className="text-sm text-purple-600 font-roboto mb-4">
                        Enregistrez cette simulation pour la comparer avec vos biens réels et suivre vos projets
                      </p>
                      <button
                        onClick={async () => {
                          if (onSaveSimulation) {
                            const simulationToSave = {
                              name: formData.name,
                              type: formData.type,
                              price: formData.price,
                              downPayment: formData.downPayment,
                              monthlyRent: formData.monthlyRent,
                              loanRate: formData.loanRate,
                              loanDuration: formData.loanDuration,
                              monthlyCharges: formData.monthlyCharges,
                              propertyTax: formData.propertyTax,
                              insurance: formData.insurance,
                              maintenance: formData.maintenance,
                              renovationCost: formData.renovationCost,
                              vacancyRate: formData.vacancyRate,
                              results: results!
                            };
                            await onSaveSimulation(simulationToSave);
                            onClose();
                          }
                        }}
                        className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-roboto font-medium flex items-center space-x-2 mx-auto"
                      >
                        <Save className="h-4 w-4" />
                        <span>Sauvegarder la simulation</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};