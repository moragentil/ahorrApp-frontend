import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import { PiggyBank } from 'lucide-react';
import Logo from '../../public/logo-cerdo.png';

function LoginScreen({ onLogin }) {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const result = await authService.login(formData.email, formData.password);
    if (result.success) {
      const user = authService.getCurrentUser();
      onLogin(user);
      navigate('/home');
    } else {
      setError(result.error);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-2">
      <div className="max-w-md w-full bg-transparent shadow-none border-none sm:bg-card sm:rounded-lg sm:shadow-xl sm:border sm:border-border p-4 sm:px-8 sm:py-4">
        <div className="text-center mb-4">
          <img src={Logo} alt="AhorrApp Logo" className="w-36 mx-auto" />
          <h1 className="text-xl sm:text-3xl font-bold text-primary">AhorrApp</h1>
          <p className="text-foreground mb-1 text-sm sm:text-base font-medium">Gestioná tus finanzas</p>
          <p className="text-muted-foreground text-sm sm:text-base">Inicia sesión en tu cuenta</p>
        </div>

        {error && (
          <div className="bg-destructive/10 border border-destructive text-destructive px-4 py-3 rounded mb-4 text-sm sm:text-base">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-start text-sm sm:text-base font-medium text-foreground">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-2 py-1 bg-input border border-border text-foreground rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent text-sm sm:text-base"
              placeholder="tu@email.com"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-start text-sm sm:text-base font-medium text-foreground">
              Contraseña
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full px-2 py-1 bg-input border border-border text-foreground rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent text-sm sm:text-base"
              placeholder="Tu contraseña"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-primary-foreground py-2 px-4 rounded-md hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base font-medium transition-colors"
          >
            {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
          </button>
        </form>

        <div className="mt-6 text-center text-sm sm:text-base text-muted-foreground">
          <button
            type="button"
            className="underline text-primary hover:text-primary/80 transition-colors"
            onClick={() => navigate('/register')}
          >
            ¿No tienes cuenta? Regístrate
          </button>
        </div>
      </div>
    </div>
  );
}

export default LoginScreen;