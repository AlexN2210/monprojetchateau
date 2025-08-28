import React from 'react';
import { Building2, Trash2, TrendingUp, Calculator } from 'lucide-react';
import { SavedSimulation } from '../types';

interface SimulationCardProps {
  simulation: SavedSimulation;
  onDelete: (id: string) => void;
}

export const SimulationCard: React.FC<SimulationCardProps> = ({ simulation, onDelete }) => {
  const getTypeColor = (type: string) => {
    const colors = {
      maison: 'text-blue-600',
      appartement: 'text-green-600',
      château: 'text-purple-600',
      terrain: 'text-yellow-600',
      immeuble: 'text-red-600',
      autre: 'text-gray-600'
    };
    return colors[type as keyof typeof colors] || 'text-gray-600';
  };

  const getTypeIcon = (type: string) => {
    const icons = {
      maison: '🏠',
      appartement: '🏢',
      château: '🏰',
      terrain: '🌱',
      immeuble: '🏢',
      autre: '🏗️'
    };
    return icons[type as keyof typeof icons] || '🏗️';
  };

  return (
    <div className="bg-gradient-to-br from-purple-50 to-purple-100 border-2 border-purple-200 rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <span className="text-2xl">{getTypeIcon(simulation.type)}</span>
          <div>
            <h3 className="text-lg font-playfair font-semibold text-purple-800">
              {simulation.name}
            </h3>
            <p className={`text-sm font-roboto ${getTypeColor(simulation.type)}`}>
              {simulation.type.charAt(0).toUpperCase() + simulation.type.slice(1)}
            </p>
          </div>
        </div>
        <button
          onClick={() => onDelete(simulation.id)}
          className="p-2 text-purple-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
          title="Supprimer cette simulation"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="text-center">
          <p className="text-xs text-purple-600 font-roboto">Prix d'achat</p>
          <p className="text-lg font-bold text-purple-800">
            {simulation.price.toLocaleString('fr-FR')} €
          </p>
        </div>
        <div className="text-center">
          <p className="text-xs text-purple-600 font-roboto">Loyer mensuel</p>
          <p className="text-lg font-bold text-purple-800">
            {simulation.monthlyRent.toLocaleString('fr-FR')} €
          </p>
        </div>
      </div>

      <div className="bg-white rounded-lg p-4 mb-4">
        <h4 className="text-sm font-roboto font-medium text-purple-700 mb-3 flex items-center space-x-2">
          <Calculator className="h-4 w-4" />
          <span>Résultats de la simulation</span>
        </h4>
        
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <p className="text-purple-600 font-roboto">Cashflow mensuel</p>
            <p className={`font-bold ${simulation.results.monthlyCashflow >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {simulation.results.monthlyCashflow >= 0 ? '+' : ''}{simulation.results.monthlyCashflow.toLocaleString('fr-FR')} €
            </p>
          </div>
          <div>
            <p className="text-purple-600 font-roboto">ROI</p>
            <p className={`font-bold ${simulation.results.roi >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {simulation.results.roi >= 0 ? '+' : ''}{simulation.results.roi.toFixed(2)}%
            </p>
          </div>
          <div>
            <p className="text-purple-600 font-roboto">Cap Rate</p>
            <p className="font-bold text-purple-800">
              {simulation.results.capRate.toFixed(2)}%
            </p>
          </div>
          <div>
            <p className="text-purple-600 font-roboto">Cash-on-Cash</p>
            <p className={`font-bold ${simulation.results.cashOnCashReturn >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {simulation.results.cashOnCashReturn >= 0 ? '+' : ''}{simulation.results.cashOnCashReturn.toFixed(2)}%
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between text-xs text-purple-600 font-roboto">
        <span>Simulation créée le {simulation.createdAt.toLocaleDateString('fr-FR')}</span>
        <div className="flex items-center space-x-1">
          <TrendingUp className="h-3 w-3" />
          <span>Simulation</span>
        </div>
      </div>
    </div>
  );
};
