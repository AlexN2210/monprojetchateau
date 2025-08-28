export interface Property {
  id: string;
  name: string;
  type: 'maison' | 'appartement' | 'château' | 'terrain' | 'immeuble' | 'autre';
  value: number;
  remainingCredit: number;
  monthlyRent: number;
  monthlyCharges?: number; // Charges mensuelles (taxes, assurance, maintenance, etc.)
  createdAt: Date;
}



export interface SimulationData {
  name: string;
  type: Property['type'];
  price: number;
  downPayment: number;
  monthlyRent: number;
  loanRate: number;
  loanDuration: number;
  monthlyCharges: number;
  propertyTax: number;
  insurance: number;
  maintenance: number;
  renovationCost: number;
  vacancyRate: number;
}

export interface SimulationResults {
  loanAmount: number;
  monthlyPayment: number;
  monthlyCashflow: number;
  annualCashflow: number;
  totalAnnualIncome: number;
  totalAnnualExpenses: number;
  roi: number;
  capRate: number;
  cashOnCashReturn: number;
  breakEvenRent: number;
  cumulativeNetWorth: number;
  cumulativeMonthlyIncome: number;
}

export interface SavedSimulation {
  id: string;
  name: string;
  type: Property['type'];
  price: number;
  downPayment: number;
  monthlyRent: number;
  loanRate: number;
  loanDuration: number;
  monthlyCharges: number;
  propertyTax: number;
  insurance: number;
  maintenance: number;
  renovationCost: number;
  vacancyRate: number;
  results: SimulationResults;
  createdAt: Date;
}

export interface User {
  id: string;
  username: string;
  email: string;
  createdAt: Date;
  rentalGoal?: number; // Objectif de rente mensuelle personnalisé
  monthlySalaries?: number[]; // Salaires mensuels nets (utilisateur + conjoint/co-emprunteurs)
}

export interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<boolean>;
  register: (username: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}