import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Property } from '../types';

interface PropertyFormProps {
  property?: Property;
  onSave: (property: Omit<Property, 'id' | 'createdAt'>) => void;
  onCancel: () => void;
}

export const PropertyForm: React.FC<PropertyFormProps> = ({ property, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    type: 'maison' as Property['type'],
    value: '',
    remainingCredit: '',
    monthlyRent: '',
    monthlyCharges: '',
  });

  useEffect(() => {
    if (property) {
      setFormData({
        name: property.name,
        type: property.type,
        value: property.value.toString(),
        remainingCredit: property.remainingCredit.toString(),
        monthlyRent: property.monthlyRent.toString(),
        monthlyCharges: (property.monthlyCharges || 0).toString(),
      });
    }
  }, [property]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      name: formData.name,
      type: formData.type,
      value: parseFloat(formData.value) || 0,
      remainingCredit: parseFloat(formData.remainingCredit) || 0,
      monthlyRent: parseFloat(formData.monthlyRent) || 0,
      monthlyCharges: parseFloat(formData.monthlyCharges) || 0,
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md animate-scale-up">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-playfair font-semibold text-navy">
            {property ? 'Modifier le bien' : 'Ajouter un bien'}
          </h2>
          <button
            onClick={onCancel}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-roboto font-medium text-gray-700 mb-1">
              Nom du bien
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-mint focus:border-mint transition-colors"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-roboto font-medium text-gray-700 mb-1">
              Type
            </label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value as Property['type'] })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-mint focus:border-mint transition-colors"
            >
              <option value="maison">Maison</option>
              <option value="appartement">Appartement</option>
              <option value="château">Château</option>
              <option value="terrain">Terrain</option>
              <option value="immeuble">Immeuble</option>
              <option value="autre">Autre</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-roboto font-medium text-gray-700 mb-1">
              Valeur (€)
            </label>
            <input
              type="number"
              value={formData.value}
              onChange={(e) => setFormData({ ...formData, value: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-mint focus:border-mint transition-colors"
              min="0"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-roboto font-medium text-gray-700 mb-1">
              Crédit restant (€)
            </label>
            <input
              type="number"
              value={formData.remainingCredit}
              onChange={(e) => setFormData({ ...formData, remainingCredit: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-mint focus:border-mint transition-colors"
              min="0"
            />
          </div>

          <div>
            <label className="block text-sm font-roboto font-medium text-gray-700 mb-1">
              Loyer mensuel (€)
            </label>
            <input
              type="number"
              value={formData.monthlyRent}
              onChange={(e) => setFormData({ ...formData, monthlyRent: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-mint focus:border-mint transition-colors"
              min="0"
            />
          </div>

          <div>
            <label className="block text-sm font-roboto font-medium text-gray-700 mb-1">
              Charges mensuelles (€)
            </label>
            <input
              type="number"
              value={formData.monthlyCharges}
              onChange={(e) => setFormData({ ...formData, monthlyCharges: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-mint focus:border-mint transition-colors"
              min="0"
              placeholder="Taxes, assurance, maintenance..."
            />
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-roboto"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-mint text-white rounded-lg hover:bg-mint/90 transition-colors font-roboto"
            >
              {property ? 'Modifier' : 'Ajouter'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};