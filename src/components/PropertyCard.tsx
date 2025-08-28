import React from 'react';
import { Home, Building, Castle, MapPin, Trash2, Edit3 } from 'lucide-react';
import { Property } from '../types';

interface PropertyCardProps {
  property: Property;
  onEdit: (property: Property) => void;
  onDelete: (id: string) => void;
}

export const PropertyCard: React.FC<PropertyCardProps> = ({ property, onEdit, onDelete }) => {
  const getIcon = (type: Property['type']) => {
    switch (type) {
      case 'maison': return <Home className="h-5 w-5" />;
      case 'appartement': return <Building className="h-5 w-5" />;
      case 'château': return <Castle className="h-5 w-5" />;
      default: return <MapPin className="h-5 w-5" />;
    }
  };

  const netValue = property.value - property.remainingCredit;

  return (
    <div className="bg-white rounded-lg border border-gold/20 shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1 animate-slide-up">
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-navy/10 text-navy rounded-lg">
              {getIcon(property.type)}
            </div>
            <div>
              <h3 className="font-playfair font-semibold text-lg text-navy">
                {property.name}
              </h3>
              <p className="text-sm text-gray-600 capitalize font-roboto">
                {property.type}
              </p>
            </div>
          </div>
          
          <div className="flex space-x-2">
            <button
              onClick={() => onEdit(property)}
              className="p-2 text-gray-400 hover:text-navy transition-colors"
            >
              <Edit3 className="h-4 w-4" />
            </button>
            <button
              onClick={() => onDelete(property.id)}
              className="p-2 text-gray-400 hover:text-red-500 transition-colors"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-600 font-roboto">Valeur</span>
            <span className="font-semibold text-navy">
              {property.value.toLocaleString('fr-FR')} €
            </span>
          </div>
          
          {property.remainingCredit > 0 && (
            <div className="flex justify-between">
              <span className="text-gray-600 font-roboto">Crédit restant</span>
              <span className="font-semibold text-red-600">
                -{property.remainingCredit.toLocaleString('fr-FR')} €
              </span>
            </div>
          )}
          
          <div className="flex justify-between border-t pt-3">
            <span className="text-gray-600 font-roboto">Valeur nette</span>
            <span className="font-bold text-lg text-mint">
              {netValue.toLocaleString('fr-FR')} €
            </span>
          </div>
          
          {property.monthlyRent > 0 && (
            <div className="flex justify-between">
              <span className="text-gray-600 font-roboto">Loyer mensuel</span>
              <span className="font-semibold text-gold">
                +{property.monthlyRent.toLocaleString('fr-FR')} €/mois
              </span>
            </div>
          )}
          
          {property.monthlyCharges && property.monthlyCharges > 0 && (
            <div className="flex justify-between">
              <span className="text-gray-600 font-roboto">Charges mensuelles</span>
              <span className="font-semibold text-red-600">
                -{property.monthlyCharges.toLocaleString('fr-FR')} €/mois
              </span>
            </div>
          )}
          
          {property.monthlyRent > 0 && (
            <div className="flex justify-between border-t pt-3">
              <span className="text-gray-600 font-roboto">Cashflow mensuel</span>
              <span className={`font-bold text-lg ${(property.monthlyRent - (property.monthlyCharges || 0)) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {(property.monthlyRent - (property.monthlyCharges || 0)) >= 0 ? '+' : ''}{(property.monthlyRent - (property.monthlyCharges || 0)).toLocaleString('fr-FR')} €/mois
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};