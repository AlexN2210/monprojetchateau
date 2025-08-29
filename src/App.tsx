import { useState, useEffect } from 'react';
import { Plus, Calculator, Building2, TrendingUp, Wallet, User, Target, Settings } from 'lucide-react';
import { Header } from './components/Header';
import { PropertyCard } from './components/PropertyCard';
import { PropertyForm } from './components/PropertyForm';
import { SimulationModal } from './components/SimulationModal';
import { LoginModal } from './components/LoginModal';
import { SettingsModal } from './components/SettingsModal';
import { GoalModal } from './components/GoalModal';
import { SimulationCard } from './components/SimulationCard';
import { SimulationComparison } from './components/SimulationComparison';
import { StatsCard } from './components/StatsCard';
import { Property, SavedSimulation } from './types';
import { storageUtils } from './utils/storage';
import { useAuth } from './contexts/AuthContext';

function App() {
  const { user, logout, isLoading } = useAuth();
  const [properties, setProperties] = useState<Property[]>([]);
  const [showPropertyForm, setShowPropertyForm] = useState(false);
  const [showSimulation, setShowSimulation] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showGoal, setShowGoal] = useState(false);
  const [editingProperty, setEditingProperty] = useState<Property | undefined>();
  const [savedSimulations, setSavedSimulations] = useState<SavedSimulation[]>([]);
  const [showComparison, setShowComparison] = useState(false);

  useEffect(() => {
    const loadUserData = async () => {
      if (user) {
        // Migrer les données existantes si nécessaire
        await storageUtils.migrateLegacyData(user.id);
        // Charger les propriétés de l'utilisateur
        const [userProperties, userSimulations] = await Promise.all([
          storageUtils.getProperties(user.id),
          storageUtils.getSavedSimulations(user.id)
        ]);
        setProperties(userProperties);
        setSavedSimulations(userSimulations);
      } else {
        setProperties([]);
        setSavedSimulations([]);
      }
    };

    loadUserData();
  }, [user]);

  const saveProperty = async (propertyData: Omit<Property, 'id' | 'createdAt'>) => {
    if (!user) return;

    try {
      if (editingProperty) {
        // Mise à jour d'une propriété existante
        const updatedProperty = { ...editingProperty, ...propertyData };
        const result = await storageUtils.updateProperty(user.id, updatedProperty);
        if (result) {
          const updated = properties.map(p => 
            p.id === editingProperty.id ? result : p
          );
          setProperties(updated);
          setEditingProperty(undefined);
        }
      } else {
        // Création d'une nouvelle propriété
        const result = await storageUtils.saveProperty(user.id, propertyData);
        if (result) {
          setProperties([result, ...properties]);
        }
      }
      setShowPropertyForm(false);
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
    }
  };

  const deleteProperty = async (id: string) => {
    if (!user) return;
    
    if (confirm('Êtes-vous sûr de vouloir supprimer ce bien ?')) {
      try {
        const success = await storageUtils.deleteProperty(user.id, id);
        if (success) {
          const updated = properties.filter(p => p.id !== id);
          setProperties(updated);
        }
      } catch (error) {
        console.error('Erreur lors de la suppression:', error);
      }
    }
  };

  const totalNetWorth = properties.reduce((sum, p) => sum + (p.value - p.remainingCredit), 0);
  const totalRentalIncome = properties.reduce((sum, p) => sum + p.monthlyRent, 0);
  const totalSimulationIncome = savedSimulations.reduce((sum, s) => sum + s.monthlyRent, 0);
  const totalIncome = totalRentalIncome + totalSimulationIncome;
  
  // Calculer le cashflow total (revenus - charges)
  const totalMonthlyCharges = properties.reduce((sum, p) => sum + (p.monthlyCharges || 0), 0);
  const totalCashflow = totalIncome - totalMonthlyCharges;
  
  const rentalGoal = user?.rentalGoal || 0;

  const handleSaveRentalGoal = async (goal: number) => {
    if (!user) return;
    
    try {
      const success = await storageUtils.saveUserRentalGoal(user.id, goal);
      if (success) {
        // Mettre à jour l'utilisateur localement
        user.rentalGoal = goal;
        // Forcer un re-render en mettant à jour l'état
        setProperties([...properties]);
      }
    } catch (error) {
      console.error('Erreur lors de la sauvegarde de l\'objectif:', error);
    }
  };

  const handleSaveMonthlySalaries = async (salaries: number[]) => {
    if (!user) return;
    
    try {
      const success = await storageUtils.saveUserMonthlySalaries(user.id, salaries);
      if (success) {
        // Mettre à jour l'utilisateur localement
        user.monthlySalaries = salaries;
        // Forcer un re-render en mettant à jour l'état
        setProperties([...properties]);
      }
    } catch (error) {
      console.error('Erreur lors de la sauvegarde des salaires:', error);
    }
  };

  const handleSaveSimulation = async (simulation: Omit<SavedSimulation, 'id' | 'createdAt'>) => {
    if (!user) return;
    
    try {
      const savedSimulation = await storageUtils.saveSimulation(user.id, simulation);
      if (savedSimulation) {
        setSavedSimulations([savedSimulation, ...savedSimulations]);
      }
    } catch (error) {
      console.error('Erreur lors de la sauvegarde de la simulation:', error);
    }
  };

  const handleDeleteSimulation = async (id: string) => {
    if (!user) return;
    
    if (confirm('Êtes-vous sûr de vouloir supprimer cette simulation ?')) {
      try {
        const success = await storageUtils.deleteSimulation(user.id, id);
        if (success) {
          setSavedSimulations(savedSimulations.filter(s => s.id !== id));
        }
      } catch (error) {
        console.error('Erreur lors de la suppression de la simulation:', error);
      }
    }
  };

  // Affichage de chargement
  if (isLoading) {
    return (
      <div className="min-h-screen bg-light-gray flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-gold border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-roboto">Chargement...</p>
        </div>
      </div>
    );
  }

  // Affichage de connexion
  if (!user) {
    return (
      <div className="min-h-screen bg-light-gray flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <Building2 className="h-16 w-16 text-gold mx-auto mb-6" />
          <h1 className="text-3xl font-playfair font-bold text-navy mb-4">
            Mon Projet <span>Chateau</span>
          </h1>
          <p className="text-gray-600 font-roboto mb-8">
            Gérez votre patrimoine immobilier en toute simplicité. 
            Connectez-vous pour accéder à vos données personnelles.
          </p>
          <button
            onClick={() => setShowLogin(true)}
            className="px-6 py-3 bg-gold text-navy rounded-lg hover:bg-gold/90 transition-colors font-roboto font-medium flex items-center space-x-2 mx-auto"
          >
            <User className="h-5 w-5" />
            <span>Se connecter</span>
          </button>
        </div>

        {showLogin && (
          <LoginModal onClose={() => setShowLogin(false)} />
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-light-gray">
      <Header 
        totalNetWorth={totalNetWorth} 
        totalRentalIncome={totalCashflow}
        rentalGoal={rentalGoal}
        user={user}
        onLogout={logout}
      />
      
      <div className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard 
            title="Biens immobiliers"
            value={properties.length.toString()}
            icon={Building2}
            color="navy"
          />
          <StatsCard 
            title="Cashflow mensuel"
            value={`${totalCashflow.toLocaleString('fr-FR')} €`}
            icon={TrendingUp}
            color="gold"
            details={{
              realIncome: totalRentalIncome,
              simulatedIncome: totalSimulationIncome
            }}
          />
          <StatsCard 
            title={rentalGoal > 0 ? `Objectif ${rentalGoal.toLocaleString('fr-FR')}€` : "Objectif non défini"}
            value={rentalGoal > 0 ? `${((totalCashflow / rentalGoal) * 100).toFixed(1)}%` : "0%"}
            icon={Target}
            color={rentalGoal > 0 ? (totalCashflow >= rentalGoal ? "green" : "orange") : "gray"}
            onClick={() => setShowGoal(true)}
            isClickable={true}
          />
          <StatsCard 
            title="Capital net"
            value={`${totalNetWorth.toLocaleString('fr-FR')} €`}
            icon={Wallet}
            color="navy"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <button
            onClick={() => setShowPropertyForm(true)}
            className="flex items-center justify-center space-x-2 px-6 py-3 bg-navy text-white rounded-lg hover:bg-navy/90 transition-colors font-roboto shadow-md hover:shadow-lg"
          >
            <Plus className="h-5 w-5" />
            <span>Ajouter un bien</span>
          </button>
          
          <button
            onClick={() => setShowSimulation(true)}
            className="flex items-center justify-center space-x-2 px-6 py-3 bg-gold text-navy rounded-lg hover:bg-gold/90 transition-colors font-roboto font-medium shadow-md hover:shadow-lg"
          >
            <Calculator className="h-5 w-5" />
            <span>Simuler un achat</span>
          </button>

          <button
            onClick={() => setShowSettings(true)}
            className="flex items-center justify-center space-x-2 px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-roboto shadow-md hover:shadow-lg"
          >
            <Settings className="h-5 w-5" />
            <span>Paramètres financiers</span>
          </button>
        </div>

        {/* Properties Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-playfair font-semibold text-navy mb-6">
            Patrimoine Immobilier
          </h2>
          {properties.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
              <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 font-roboto">
                Aucun bien immobilier enregistré.
                <br />
                Commencez par ajouter votre premier bien !
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {properties.map(property => (
                <PropertyCard
                  key={property.id}
                  property={property}
                  onEdit={(p) => {
                    setEditingProperty(p);
                    setShowPropertyForm(true);
                  }}
                  onDelete={deleteProperty}
                />
              ))}
            </div>
          )}
        </div>

        {/* Simulations Section */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-playfair font-semibold text-purple-800 flex items-center space-x-2">
              <Calculator className="h-6 w-6" />
              <span>Simulations Sauvegardées</span>
            </h2>
            
            {/* Bouton de comparaison */}
            {savedSimulations.length >= 2 && (
              <button
                onClick={() => setShowComparison(true)}
                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg hover:from-purple-700 hover:to-purple-800 transition-all transform hover:scale-105 font-roboto font-medium flex items-center space-x-2 shadow-lg"
              >
                <TrendingUp className="h-5 w-5" />
                <span>Comparer les Simulations</span>
              </button>
            )}
          </div>
          {savedSimulations.length === 0 ? (
            <div className="text-center py-12 bg-gradient-to-br from-purple-50 to-purple-100 border-2 border-purple-200 rounded-lg">
              <Calculator className="h-12 w-12 text-purple-400 mx-auto mb-4" />
              <p className="text-purple-600 font-roboto">
                Aucune simulation sauvegardée.
                <br />
                Créez une simulation et sauvegardez-la pour la comparer avec vos biens réels !
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {savedSimulations.map(simulation => (
                <SimulationCard
                  key={simulation.id}
                  simulation={simulation}
                  onDelete={handleDeleteSimulation}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      {showPropertyForm && (
        <PropertyForm
          property={editingProperty}
          onSave={saveProperty}
          onCancel={() => {
            setShowPropertyForm(false);
            setEditingProperty(undefined);
          }}
        />
      )}

      {showSimulation && (
        <SimulationModal
          onClose={() => setShowSimulation(false)}
          currentNetWorth={totalNetWorth}
          currentMonthlyIncome={totalRentalIncome}
          onSaveSimulation={handleSaveSimulation}
        />
      )}

      {showLogin && (
        <LoginModal onClose={() => setShowLogin(false)} />
      )}

      {showSettings && user && (
        <SettingsModal 
          user={user}
          properties={properties}
          onClose={() => setShowSettings(false)}
          onSaveSalary={handleSaveMonthlySalaries}
        />
      )}

      {showGoal && user && (
        <GoalModal 
          currentGoal={rentalGoal}
          onClose={() => setShowGoal(false)}
          onSaveGoal={handleSaveRentalGoal}
        />
      )}

      {/* Modal de comparaison des simulations */}
      {showComparison && (
        <SimulationComparison
          simulations={savedSimulations}
          onClose={() => setShowComparison(false)}
        />
      )}
    </div>
  );
}

export default App;