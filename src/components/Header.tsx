import React from 'react';
import { Building2, User, LogOut } from 'lucide-react';
import { User as UserType } from '../types';

interface HeaderProps {
  totalNetWorth: number;
  totalRentalIncome: number;
  rentalGoal: number;
  user: UserType;
  onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({ totalNetWorth, totalRentalIncome, rentalGoal, user, onLogout }) => {
  const progressPercentage = rentalGoal > 0 ? Math.min((totalRentalIncome / rentalGoal) * 100, 100) : 0;
  const remainingAmount = rentalGoal > 0 ? Math.max(rentalGoal - totalRentalIncome, 0) : 0;
  return (
    <header className="bg-navy text-white shadow-lg">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div className="flex items-center space-x-3 mb-4 md:mb-0">
            <Building2 className="h-8 w-8 text-gold" />
            <h1 className="text-2xl md:text-3xl font-playfair font-bold">
              Mon Projet <span>Chateau</span>
            </h1>
          </div>
          
          <div className="flex flex-col md:flex-row items-center md:items-end space-y-4 md:space-y-0 md:space-x-8">
            {/* Objectif de cashflow mensuel */}
            <div className="text-center md:text-right">
              <div className="text-sm text-gray-300 font-roboto">Objectif Cashflow Mensuel</div>
              {rentalGoal > 0 ? (
                <>
                  <div className="text-lg font-bold text-gold mb-1">
                    {totalRentalIncome.toLocaleString('fr-FR')} € / {rentalGoal.toLocaleString('fr-FR')} €
                  </div>
                  <div className="w-32 bg-gray-600 rounded-full h-2 mb-1">
                    <div 
                      className="bg-gold h-2 rounded-full transition-all duration-300" 
                      style={{ width: `${progressPercentage}%` }}
                    ></div>
                  </div>
                  <div className="text-xs text-gray-300">
                    {progressPercentage.toFixed(1)}% • {remainingAmount.toLocaleString('fr-FR')} € restants
                  </div>
                </>
              ) : (
                <>
                  <div className="text-lg font-bold text-gold mb-1">
                    {totalRentalIncome.toLocaleString('fr-FR')} € / Non défini
                  </div>
                  <div className="w-32 bg-gray-600 rounded-full h-2 mb-1">
                    <div className="bg-gray-400 h-2 rounded-full"></div>
                  </div>
                  <div className="text-xs text-gray-300">
                    Définissez votre objectif dans les paramètres
                  </div>
                </>
              )}
            </div>
            
            <div className="text-center md:text-right">
              <div className="text-sm text-gray-300 font-roboto">Capital Net Total</div>
              <div className="text-xl md:text-2xl font-bold text-gold">
                {totalNetWorth.toLocaleString('fr-FR')} €
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-center">
                <div className="text-sm text-gray-300 font-roboto">Connecté en tant que</div>
                <div className="text-lg font-bold text-white flex items-center space-x-2">
                  <User className="h-4 w-4" />
                  <span>{user.username}</span>
                </div>
              </div>
              
              <button
                onClick={onLogout}
                className="p-2 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                title="Se déconnecter"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};