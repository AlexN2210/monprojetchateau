import React from 'react';
import { DivideIcon as LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string;
  icon: typeof LucideIcon;
  color: 'navy' | 'gold' | 'mint' | 'green' | 'orange' | 'gray';
  onClick?: () => void;
  isClickable?: boolean;
  details?: {
    realIncome?: number;
    simulatedIncome?: number;
  };
}

export const StatsCard: React.FC<StatsCardProps> = ({ title, value, icon: Icon, color, onClick, isClickable, details }) => {
  const colorClasses = {
    navy: 'from-navy to-navy/80 text-white',
    gold: 'from-gold to-gold/80 text-navy',
    mint: 'from-mint to-mint/80 text-white',
    green: 'from-green-500 to-green-600 text-white',
    orange: 'from-orange-500 to-orange-600 text-white',
    gray: 'from-gray-500 to-gray-600 text-white',
  };

  const iconClasses = {
    navy: 'text-gold',
    gold: 'text-navy',
    mint: 'text-white',
    green: 'text-white',
    orange: 'text-white',
    gray: 'text-white',
  };

  const baseClasses = `p-6 rounded-lg bg-gradient-to-br ${colorClasses[color]} shadow-md transition-shadow animate-slide-up`;
  const clickableClasses = isClickable 
    ? `${baseClasses} hover:shadow-lg cursor-pointer hover:scale-105 transform transition-all duration-200` 
    : `${baseClasses} hover:shadow-lg`;

  return (
    <div 
      className={clickableClasses}
      onClick={isClickable ? onClick : undefined}
      role={isClickable ? "button" : undefined}
      tabIndex={isClickable ? 0 : undefined}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm opacity-90 font-roboto">{title}</p>
          <p className="text-2xl font-playfair font-bold mt-1">{value}</p>
        </div>
        <Icon className={`h-8 w-8 ${iconClasses[color]}`} />
      </div>
      
      {/* Détails des revenus */}
      {details && (details.realIncome !== undefined || details.simulatedIncome !== undefined) && (
        <div className="mt-4 pt-3 border-t border-navy/30">
          <div className="text-xs font-roboto mb-2 font-bold text-navy">Détail des revenus</div>
          {details.realIncome !== undefined && details.realIncome > 0 && (
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-roboto text-navy">Biens réels</span>
              <span className="text-sm font-bold text-navy bg-white/90 px-2 py-1 rounded">
                {details.realIncome.toLocaleString('fr-FR')} €
              </span>
            </div>
          )}
          {details.simulatedIncome !== undefined && details.simulatedIncome > 0 && (
            <div className="flex items-center justify-between">
              <span className="text-xs font-roboto text-navy">Simulations</span>
              <span className="text-sm font-bold text-purple-800 bg-white/90 px-2 py-1 rounded">
                {details.simulatedIncome.toLocaleString('fr-FR')} €
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};