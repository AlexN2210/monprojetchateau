import { Property } from '../types';
import { supabase } from '../lib/supabase';

export const storageUtils = {
  // Properties
  async getProperties(userId: string): Promise<Property[]> {
    try {
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Erreur lors de la récupération des propriétés:', error);
        return [];
      }

      return data?.map((p: any) => ({
        id: p.id,
        name: p.name,
        type: p.type,
        value: p.value,
        remainingCredit: p.remaining_credit,
        monthlyRent: p.monthly_rent,
        createdAt: new Date(p.created_at)
      })) || [];
    } catch (error) {
      console.error('Erreur lors de la récupération des propriétés:', error);
      return [];
    }
  },

  async saveProperty(userId: string, property: Omit<Property, 'id' | 'createdAt'>): Promise<Property | null> {
    try {
      const { data, error } = await supabase
        .from('properties')
        .insert({
          user_id: userId,
          name: property.name,
          type: property.type,
          value: property.value,
          remaining_credit: property.remainingCredit,
          monthly_rent: property.monthlyRent
        })
        .select()
        .single();

      if (error) {
        console.error('Erreur lors de la sauvegarde de la propriété:', error);
        return null;
      }

      return {
        id: data.id,
        name: data.name,
        type: data.type,
        value: data.value,
        remainingCredit: data.remaining_credit,
        monthlyRent: data.monthly_rent,
        createdAt: new Date(data.created_at)
      };
    } catch (error) {
      console.error('Erreur lors de la sauvegarde de la propriété:', error);
      return null;
    }
  },

  async updateProperty(userId: string, property: Property): Promise<Property | null> {
    try {
      const { data, error } = await supabase
        .from('properties')
        .update({
          name: property.name,
          type: property.type,
          value: property.value,
          remaining_credit: property.remainingCredit,
          monthly_rent: property.monthlyRent
        })
        .eq('id', property.id)
        .eq('user_id', userId)
        .select()
        .single();

      if (error) {
        console.error('Erreur lors de la mise à jour de la propriété:', error);
        return null;
      }

      return {
        id: data.id,
        name: data.name,
        type: data.type,
        value: data.value,
        remainingCredit: data.remaining_credit,
        monthlyRent: data.monthly_rent,
        createdAt: new Date(data.created_at)
      };
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la propriété:', error);
      return null;
    }
  },

  async deleteProperty(userId: string, propertyId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('properties')
        .delete()
        .eq('id', propertyId)
        .eq('user_id', userId);

      if (error) {
        console.error('Erreur lors de la suppression de la propriété:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Erreur lors de la suppression de la propriété:', error);
      return false;
    }
  },

  // User preferences
  async saveUserRentalGoal(userId: string, rentalGoal: number): Promise<boolean> {
    try {
      // Pour l'instant, on stocke dans localStorage en attendant la création d'une table user_preferences
      localStorage.setItem(`heritage_${userId}_rental_goal`, rentalGoal.toString());
      return true;
    } catch (error) {
      console.error('Erreur lors de la sauvegarde de l\'objectif:', error);
      return false;
    }
  },

  async getUserRentalGoal(userId: string): Promise<number> {
    try {
      const goal = localStorage.getItem(`heritage_${userId}_rental_goal`);
      return goal ? Number(goal) : 0; // Valeur par défaut à 0€
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'objectif:', error);
      return 0;
    }
  },

  async saveUserMonthlySalaries(userId: string, monthlySalaries: number[]): Promise<boolean> {
    try {
      localStorage.setItem(`heritage_${userId}_monthly_salaries`, JSON.stringify(monthlySalaries));
      return true;
    } catch (error) {
      console.error('Erreur lors de la sauvegarde des salaires:', error);
      return false;
    }
  },

  async getUserMonthlySalaries(userId: string): Promise<number[]> {
    try {
      const salaries = localStorage.getItem(`heritage_${userId}_monthly_salaries`);
      return salaries ? JSON.parse(salaries) : [0]; // Valeur par défaut : tableau avec un salaire à 0€
    } catch (error) {
      console.error('Erreur lors de la récupération des salaires:', error);
      return [0];
    }
  },

  // Simulations
  async getSavedSimulations(userId: string): Promise<SavedSimulation[]> {
    try {
      console.log('🔍 Tentative de récupération des simulations pour utilisateur:', userId);
      
      const { data, error } = await supabase
        .from('simulations')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('❌ Erreur lors de la récupération des simulations:', error);
        console.error('🔍 Détails de l\'erreur:', error.message, error.details, error.hint);
        return [];
      }

      console.log('📊 Simulations récupérées de Supabase:', data);

      const simulations = data?.map((s: any) => ({
        id: s.id,
        name: s.name,
        type: s.type,
        price: s.price,
        downPayment: s.down_payment,
        monthlyRent: s.monthly_rent,
        loanRate: s.loan_rate,
        loanDuration: s.loan_duration,
        monthlyCharges: s.monthly_charges,
        propertyTax: s.property_tax,
        insurance: s.insurance,
        maintenance: s.maintenance,
        renovationCost: s.renovation_cost,
        vacancyRate: s.vacancy_rate,
        results: {
          loanAmount: s.loan_amount || 0,
          monthlyPayment: s.monthly_payment || 0,
          monthlyCashflow: s.monthly_cashflow || 0,
          annualCashflow: s.annual_cashflow || 0,
          totalAnnualIncome: s.total_annual_income || 0,
          totalAnnualExpenses: s.total_annual_expenses || 0,
          roi: s.roi || 0,
          capRate: s.cap_rate || 0,
          cashOnCashReturn: s.cash_on_cash_return || 0,
          breakEvenRent: s.break_even_rent || 0,
          cumulativeNetWorth: s.cumulative_net_worth || 0,
          cumulativeMonthlyIncome: s.cumulative_monthly_income || 0
        },
        createdAt: new Date(s.created_at)
      })) || [];

      console.log('🔄 Simulations transformées:', simulations);
      return simulations;
    } catch (error) {
      console.error('💥 Erreur exceptionnelle lors de la récupération des simulations:', error);
      return [];
    }
  },

  async saveSimulation(userId: string, simulation: Omit<SavedSimulation, 'id' | 'createdAt'>): Promise<SavedSimulation | null> {
    try {
      console.log('🔄 Tentative de sauvegarde de simulation pour utilisateur:', userId);
      console.log('📊 Données de simulation à sauvegarder:', simulation);

      const simulationData = {
        user_id: userId,
        name: simulation.name,
        type: simulation.type,
        price: simulation.price,
        down_payment: simulation.downPayment,
        monthly_rent: simulation.monthlyRent,
        loan_rate: simulation.loanRate,
        loan_duration: simulation.loanDuration,
        monthly_charges: simulation.monthlyCharges,
        property_tax: simulation.propertyTax,
        insurance: simulation.insurance,
        maintenance: simulation.maintenance,
        renovation_cost: simulation.renovationCost,
        vacancy_rate: simulation.vacancyRate,
        loan_amount: simulation.results.loanAmount,
        monthly_payment: simulation.results.monthlyPayment,
        monthly_cashflow: simulation.results.monthlyCashflow,
        annual_cashflow: simulation.results.annualCashflow,
        total_annual_income: simulation.results.totalAnnualIncome,
        total_annual_expenses: simulation.results.totalAnnualExpenses,
        roi: simulation.results.roi,
        cap_rate: simulation.results.capRate,
        cash_on_cash_return: simulation.results.cashOnCashReturn,
        break_even_rent: simulation.results.breakEvenRent,
        cumulative_net_worth: simulation.results.cumulativeNetWorth,
        cumulative_monthly_income: simulation.results.cumulativeMonthlyIncome
      };

      console.log('🗄️ Données formatées pour Supabase:', simulationData);

      const { data, error } = await supabase
        .from('simulations')
        .insert(simulationData)
        .select()
        .single();

      if (error) {
        console.error('❌ Erreur lors de la sauvegarde de la simulation:', error);
        console.error('🔍 Détails de l\'erreur:', error.message, error.details, error.hint);
        return null;
      }

      console.log('✅ Simulation sauvegardée avec succès:', data);

      const savedSimulation = {
        id: data.id,
        name: data.name,
        type: data.type,
        price: data.price,
        downPayment: data.down_payment,
        monthlyRent: data.monthly_rent,
        loanRate: data.loan_rate,
        loanDuration: data.loan_duration,
        monthlyCharges: data.monthly_charges,
        propertyTax: data.property_tax,
        insurance: data.insurance,
        maintenance: data.maintenance,
        renovationCost: data.renovation_cost,
        vacancyRate: data.vacancy_rate,
        results: {
          loanAmount: data.loan_amount || 0,
          monthlyPayment: data.monthly_payment || 0,
          monthlyCashflow: data.monthly_cashflow || 0,
          annualCashflow: data.annual_cashflow || 0,
          totalAnnualIncome: data.total_annual_income || 0,
          totalAnnualExpenses: data.total_annual_expenses || 0,
          roi: data.roi || 0,
          capRate: data.cap_rate || 0,
          cashOnCashReturn: data.cash_on_cash_return || 0,
          breakEvenRent: data.break_even_rent || 0,
          cumulativeNetWorth: data.cumulative_net_worth || 0,
          cumulativeMonthlyIncome: data.cumulative_monthly_income || 0
        },
        createdAt: new Date(data.created_at)
      };

      console.log('🔄 Simulation transformée:', savedSimulation);
      return savedSimulation;
    } catch (error) {
      console.error('💥 Erreur exceptionnelle lors de la sauvegarde de la simulation:', error);
      return null;
    }
  },

  async deleteSimulation(userId: string, simulationId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('simulations')
        .delete()
        .eq('id', simulationId)
        .eq('user_id', userId);

      if (error) {
        console.error('Erreur lors de la suppression de la simulation:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Erreur lors de la suppression de la simulation:', error);
      return false;
    }
  },

  // Migration pour les utilisateurs existants (sans authentification)
  async migrateLegacyData(userId: string): Promise<void> {
    try {
      const legacyProperties = localStorage.getItem('heritage_properties');
      if (legacyProperties) {
        const properties = JSON.parse(legacyProperties).map((p: any) => ({
          ...p,
          createdAt: new Date(p.createdAt)
        }));

        // Migrer chaque propriété vers Supabase
        for (const property of properties) {
          await this.saveProperty(userId, {
            name: property.name,
            type: property.type,
            value: property.value,
            remainingCredit: property.remainingCredit,
            monthlyRent: property.monthlyRent
          });
        }

        // Supprimer les données legacy
        localStorage.removeItem('heritage_properties');
      }
    } catch (error) {
      console.error('Erreur lors de la migration des données:', error);
    }
  },
};