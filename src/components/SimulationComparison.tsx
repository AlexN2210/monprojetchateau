import React, { useState, useEffect } from 'react';
import { X, Trophy, TrendingUp, Calculator, Target, Zap } from 'lucide-react';
import { SavedSimulation } from '../types';

interface SimulationComparisonProps {
  simulations: SavedSimulation[];
  onClose: () => void;
}

export const SimulationComparison: React.FC<SimulationComparisonProps> = ({ simulations, onClose }) => {
  const [showWinner, setShowWinner] = useState(false);
  const [winner, setWinner] = useState<SavedSimulation | null>(null);

  useEffect(() => {
    if (simulations.length >= 2) {
      // Calculer la meilleure simulation basée sur plusieurs critères
      const bestSimulation = calculateBestSimulation(simulations);
      setWinner(bestSimulation);
    }
  }, [simulations]);

  const calculateBestSimulation = (sims: SavedSimulation[]): SavedSimulation => {
    // Système de scoring multi-critères
    return sims.reduce((best, current) => {
      const bestScore = calculateScore(best);
      const currentScore = calculateScore(current);
      return currentScore > bestScore ? current : best;
    });
  };

  const calculateScore = (simulation: SavedSimulation): number => {
    // Score basé sur la rentabilité réelle et l'efficacité de l'investissement
    
    // 1. ROI (Return on Investment) - 40% du score
    const roiScore = Math.max(0, simulation.results.roi) * 0.4;
    
    // 2. Cashflow mensuel positif - 30% du score
    const cashflowScore = Math.max(0, simulation.results.monthlyCashflow) * 0.3;
    
    // 3. Cap Rate (taux de capitalisation) - 20% du score
    const capRateScore = Math.max(0, simulation.results.capRate) * 0.2;
    
    // 4. Efficacité de l'apport (cashflow/apport) - 10% du score
    const downPaymentEfficiency = simulation.downPayment > 0 
      ? (Math.max(0, simulation.results.monthlyCashflow) / simulation.downPayment) * 100
      : 0;
    const efficiencyScore = Math.min(downPaymentEfficiency, 20) * 0.1; // Limité à 20% max
    
    // Score total normalisé (0-100)
    const totalScore = roiScore + cashflowScore + capRateScore + efficiencyScore;
    
    return totalScore;
  };

  const getSimulationRank = (simulation: SavedSimulation): number => {
    const sortedSims = [...simulations].sort((a, b) => calculateScore(b) - calculateScore(a));
    return sortedSims.findIndex(sim => sim.id === simulation.id) + 1;
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return '🥇';
      case 2: return '🥈';
      case 3: return '🥉';
      default: return `${rank}`;
    }
  };

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1: return 'from-yellow-400 to-yellow-600 text-white';
      case 2: return 'from-gray-300 to-gray-500 text-white';
      case 3: return 'from-orange-400 to-orange-600 text-white';
      default: return 'from-gray-400 to-gray-600 text-white';
    }
  };

  const revealWinner = () => {
    setShowWinner(true);
  };

  if (simulations.length < 2) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 text-center">
          <Calculator className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-playfair font-semibold text-navy mb-2">
            Comparaison impossible
          </h2>
          <p className="text-gray-600 font-roboto mb-4">
            Vous devez avoir au moins 2 simulations sauvegardées pour pouvoir les comparer.
          </p>
          <button
            onClick={onClose}
            className="px-6 py-3 bg-navy text-white rounded-lg hover:bg-navy/90 transition-colors font-roboto font-medium"
          >
            Fermer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <Calculator className="h-6 w-6 text-purple-600" />
            <h2 className="text-xl font-playfair font-semibold text-navy">
              Comparaison des Simulations
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6">
          {/* Explication de la méthode de comparaison */}
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h3 className="text-lg font-playfair font-semibold text-blue-800 mb-3 flex items-center space-x-2">
              <Calculator className="h-5 w-5" />
              <span>Comment nous comparons vos simulations</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-700 font-roboto">
              <div>
                <p className="font-semibold mb-2">🎯 Critères de rentabilité :</p>
                <ul className="space-y-1">
                  <li>• <strong>ROI</strong> : 40% du score (retour sur investissement)</li>
                  <li>• <strong>Cashflow mensuel</strong> : 30% du score (revenus nets)</li>
                  <li>• <strong>Cap Rate</strong> : 20% du score (taux de capitalisation)</li>
                  <li>• <strong>Efficacité apport</strong> : 10% du score (rentabilité de l'apport)</li>
                </ul>
              </div>
              <div>
                <p className="font-semibold mb-2">📊 Méthode de calcul :</p>
                <ul className="space-y-1">
                  <li>• Seuls les <strong>cashflows positifs</strong> sont comptabilisés</li>
                  <li>• Score <strong>normalisé de 0 à 100</strong></li>
                  <li>• <strong>Plus le score est élevé</strong>, plus l'investissement est rentable</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Bouton pour révéler le gagnant */}
          {!showWinner && (
            <div className="text-center mb-8">
              <button
                onClick={revealWinner}
                className="px-8 py-4 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg hover:from-purple-700 hover:to-purple-800 transition-all transform hover:scale-105 font-roboto font-bold text-lg flex items-center space-x-3 mx-auto"
              >
                <Zap className="h-6 w-6" />
                <span>Révéler la Meilleure Simulation !</span>
              </button>
            </div>
          )}

          {/* Grille des simulations */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {simulations.map((simulation) => {
              const rank = getSimulationRank(simulation);
              const isWinner = winner && simulation.id === winner.id;
              
              return (
                <div
                  key={simulation.id}
                  className={`relative rounded-lg p-6 border-2 transition-all duration-1000 ${
                    showWinner && isWinner
                      ? 'border-yellow-400 bg-gradient-to-br from-yellow-50 to-yellow-100 scale-105 shadow-2xl'
                      : 'border-gray-200 bg-white hover:shadow-lg'
                  }`}
                >
                  {/* Badge de classement */}
                  <div className={`absolute -top-3 -right-3 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${getRankColor(rank)}`}>
                    {getRankIcon(rank)}
                  </div>

                  {/* Animation du gagnant */}
                  {showWinner && isWinner && (
                    <div className="absolute -top-4 -left-4 animate-bounce">
                      <Trophy className="h-8 w-8 text-yellow-500" />
                    </div>
                  )}

                  <div className="text-center mb-4">
                    <h3 className="text-lg font-playfair font-semibold text-navy mb-2">
                      {simulation.name}
                    </h3>
                    <p className="text-sm text-gray-600 font-roboto">
                      {simulation.type.charAt(0).toUpperCase() + simulation.type.slice(1)}
                    </p>
                  </div>

                  {/* Métriques clés */}
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 font-roboto">Prix</span>
                      <span className="font-semibold text-navy">
                        {simulation.price.toLocaleString('fr-FR')} €
                      </span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 font-roboto">Loyer mensuel</span>
                      <span className="font-semibold text-green-600">
                        {simulation.monthlyRent.toLocaleString('fr-FR')} €
                      </span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 font-roboto">Cashflow</span>
                      <span className={`font-semibold ${simulation.results.monthlyCashflow >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {simulation.results.monthlyCashflow >= 0 ? '+' : ''}{simulation.results.monthlyCashflow.toLocaleString('fr-FR')} €
                      </span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 font-roboto">ROI</span>
                      <span className={`font-semibold ${simulation.results.roi >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {simulation.results.roi >= 0 ? '+' : ''}{simulation.results.roi.toFixed(2)}%
                      </span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 font-roboto">Cap Rate</span>
                      <span className="font-semibold text-blue-600">
                        {simulation.results.capRate.toFixed(2)}%
                      </span>
                    </div>
                  </div>

                  {/* Score et classement */}
                  <div className="mt-4 pt-3 border-t border-gray-200">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 font-roboto">Score rentabilité</span>
                      <span className="font-bold text-purple-600">
                        {calculateScore(simulation).toFixed(1)}/100
                      </span>
                    </div>
                    <div className="text-center mt-2">
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                        rank === 1 ? 'bg-yellow-100 text-yellow-800' :
                        rank === 2 ? 'bg-gray-100 text-gray-800' :
                        rank === 3 ? 'bg-orange-100 text-orange-800' :
                        'bg-gray-100 text-gray-600'
                      }`}>
                        {rank === 1 ? '🥇 Gagnant' : 
                         rank === 2 ? '🥈 2ème place' : 
                         rank === 3 ? '🥉 3ème place' : 
                         `${rank}ème place`}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Résumé du gagnant */}
          {showWinner && winner && (
            <div className="mt-8 p-6 bg-gradient-to-r from-yellow-50 to-yellow-100 border-2 border-yellow-300 rounded-lg text-center animate-fade-in">
              <div className="flex items-center justify-center space-x-3 mb-4">
                <Trophy className="h-8 w-8 text-yellow-600" />
                <h3 className="text-2xl font-playfair font-bold text-yellow-800">
                  🎉 Simulation Gagnante ! 🎉
                </h3>
              </div>
              <p className="text-lg font-roboto text-yellow-700 mb-2">
                <strong>{winner.name}</strong> est votre meilleure option d'investissement !
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                <div className="bg-white p-3 rounded-lg">
                  <p className="text-sm text-gray-600 font-roboto">Cashflow mensuel</p>
                  <p className="text-xl font-bold text-green-600">
                    {winner.results.monthlyCashflow >= 0 ? '+' : ''}{winner.results.monthlyCashflow.toLocaleString('fr-FR')} €
                  </p>
                </div>
                <div className="bg-white p-3 rounded-lg">
                  <p className="text-sm text-gray-600 font-roboto">ROI</p>
                  <p className="text-xl font-bold text-green-600">
                    {winner.results.roi >= 0 ? '+' : ''}{winner.results.roi.toFixed(2)}%
                  </p>
                </div>
                <div className="bg-white p-3 rounded-lg">
                  <p className="text-sm text-gray-600 font-roboto">Cap Rate</p>
                  <p className="text-xl font-bold text-blue-600">
                    {winner.results.capRate.toFixed(2)}%
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
