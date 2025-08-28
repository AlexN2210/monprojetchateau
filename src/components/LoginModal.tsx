import { useState } from 'react';
import { X, User, Lock, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface LoginModalProps {
  onClose: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ onClose }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { login, register } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (isLogin) {
        // Connexion
        const success = await login(formData.email, formData.password);
        if (success) {
          onClose();
        } else {
          setError('Email ou mot de passe incorrect');
        }
      } else {
        // Inscription
        if (formData.password !== formData.confirmPassword) {
          setError('Les mots de passe ne correspondent pas');
          setIsLoading(false);
          return;
        }

        if (formData.password.length < 6) {
          setError('Le mot de passe doit contenir au moins 6 caractères');
          setIsLoading(false);
          return;
        }

        const success = await register(formData.username, formData.email, formData.password);
        if (success) {
          onClose();
        } else {
          setError('Cet email est déjà utilisé');
        }
      }
    } catch (error) {
      setError('Une erreur est survenue. Veuillez réessayer.');
    }

    setIsLoading(false);
  };

  const resetForm = () => {
    setFormData({
      username: '',
      email: '',
      password: '',
      confirmPassword: ''
    });
    setError('');
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    resetForm();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md animate-scale-up">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <User className="h-6 w-6 text-gold" />
            <h2 className="text-xl font-playfair font-semibold text-navy">
              {isLogin ? 'Connexion' : 'Inscription'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-roboto font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-gold transition-colors"
              required
              placeholder="votre@email.com"
            />
          </div>

          {!isLogin && (
            <div>
              <label className="block text-sm font-roboto font-medium text-gray-700 mb-1">
                Nom d'utilisateur
              </label>
              <input
                type="text"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-gold transition-colors"
                required
                placeholder="Votre nom d'utilisateur"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-roboto font-medium text-gray-700 mb-1">
              Mot de passe
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-gold transition-colors"
                required
                placeholder="Votre mot de passe"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {!isLogin && (
            <div>
              <label className="block text-sm font-roboto font-medium text-gray-700 mb-1">
                Confirmer le mot de passe
              </label>
              <input
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-gold transition-colors"
                required
                placeholder="Confirmez votre mot de passe"
              />
            </div>
          )}

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm font-roboto">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full px-4 py-2 bg-gold text-navy rounded-lg hover:bg-gold/90 transition-colors font-roboto font-medium flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-navy border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <>
                <Lock className="h-4 w-4" />
                <span>{isLogin ? 'Se connecter' : 'S\'inscrire'}</span>
              </>
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600 font-roboto text-sm">
            {isLogin ? 'Pas encore de compte ?' : 'Déjà un compte ?'}
            <button
              onClick={toggleMode}
              className="ml-1 text-gold hover:text-gold/80 font-medium transition-colors"
            >
              {isLogin ? 'S\'inscrire' : 'Se connecter'}
            </button>
          </p>
        </div>

        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-blue-700 text-xs font-roboto">
            <strong>Note :</strong> Vos données sont stockées localement sur votre appareil. 
            Pensez à sauvegarder vos informations importantes.
          </p>
        </div>
      </div>
    </div>
  );
};

