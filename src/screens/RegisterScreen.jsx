import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PiggyBank } from 'lucide-react';
import { authService } from '../services/authService';

function RegisterScreen({ onRegister }) {
  const [formData, setFormData] = useState({
    name: '',
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

    const result = await authService.register(formData.name, formData.email, formData.password);
    if (result.success) {
      navigate('/login');
    } else {
      setError(result.error);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-2">
      <div className="max-w-md w-full bg-card rounded-lg shadow-xl border border-border p-4 sm:p-8">
        <div className="text-center mb-8">
          <PiggyBank className="w-14 h-14 text-primary bg-primary/10 rounded-full p-2 mx-auto mb-2" />
          <h1 className="text-xl sm:text-3xl font-bold text-foreground">AhorrApp</h1>
          <p className="text-primary mb-2 text-base sm:text-lg font-medium">Gestioná tus finanzas</p>
          <p className="text-muted-foreground text-sm sm:text-base">Crea tu cuenta</p>
        </div>

        {error && (
          <div className="bg-destructive/10 border border-destructive text-destructive px-4 py-3 rounded mb-4 text-sm sm:text-base">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-start text-sm sm:text-base font-medium text-foreground">
              Nombre
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-2 py-1 bg-input border border-border text-foreground rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent text-sm sm:text-base"
              placeholder="Tu nombre"
            />
          </div>
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
              placeholder="admin@ahorrapp.com"
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
              placeholder="123456"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-primary-foreground py-2 px-4 rounded-md hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base font-medium transition-colors"
          >
            {loading ? 'Registrando...' : 'Registrarse'}
          </button>
        </form>

        <div className="mt-6 text-center text-sm sm:text-base text-muted-foreground">
          <button
            type="button"
            className="underline text-primary hover:text-primary/80 transition-colors"
            onClick={() => navigate('/login')}
          >
            ¿Ya tienes cuenta? Inicia sesión
          </button>
        </div>
      </div>
    </div>
  );
}

export default RegisterScreen;