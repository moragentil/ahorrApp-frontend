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

    // Simulación de registro (solo permite el usuario demo)
    if (
      formData.email === 'admin@ahorrapp.com' &&
      formData.password === '123456'
    ) {
      onRegister({ name: formData.name, email: formData.email });
      navigate('/home');
    } else {
      setError('Solo se permite el usuario de prueba para esta demo');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center ">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
        <div className="text-center mb-8">
          <PiggyBank className="w-14 h-14 text-white bg-blue-900 rounded-full p-2 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-blue-900 mb-2">AhorrApp</h1>
          <p className="text-gray-600">Crea tu cuenta</p>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-start text-sm font-medium text-gray-700 ">
              Nombre
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Tu nombre"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-start text-sm font-medium text-gray-700 ">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="admin@ahorrapp.com"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-start text-sm font-medium text-gray-700 ">
              Contraseña
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="123456"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-900 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Registrando...' : 'Registrarse'}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-600">
          <button
            type="button"
            className="underline text-blue-900 hover:text-blue-700"
            onClick={() => navigate('/login')}
          >
            ¿Ya tienes cuenta? Inicia sesión
          </button>
          <div className="mt-2">
            <p>Credenciales de prueba:</p>
            <p>Email: admin@ahorrapp.com</p>
            <p>Contraseña: 123456</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RegisterScreen;