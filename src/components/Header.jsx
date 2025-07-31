import { PiggyBank, Home, CreditCard } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

function Header({ user, onLogout }) {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="w-full mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className='flex items-center justify-center'>
            <PiggyBank className="w-12 h-12 text-blue-900 p-2" />
            <h1 className="text-2xl font-bold text-blue-900">AhorrApp</h1>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            <button
              onClick={() => navigate('/home')}
              className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
                isActive('/home') 
                  ? 'bg-blue-100 text-blue-700 font-medium' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <Home className="w-4 h-4 mr-2" />
              Dashboard
            </button>
            <button
              onClick={() => navigate('/gastos')}
              className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
                isActive('/gastos') 
                  ? 'bg-blue-100 text-blue-700 font-medium' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <CreditCard className="w-4 h-4 mr-2" />
              Gastos
            </button>
          </nav>

          {/* User section */}
          <div className="flex items-center space-x-4">
            <span className="text-gray-700 hidden sm:block">Hola, {user?.name}</span>
            <button
              onClick={onLogout}
              className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
            >
              Cerrar Sesión
            </button>
          </div>
        </div>

        {/* Mobile navigation */}
        <nav className="md:hidden pb-4">
          <div className="flex space-x-1">
            <button
              onClick={() => navigate('/home')}
              className={`flex items-center px-3 py-2 rounded-lg transition-colors text-sm ${
                isActive('/home') 
                  ? 'bg-blue-100 text-blue-700 font-medium' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <Home className="w-4 h-4 mr-2" />
              Dashboard
            </button>
            <button
              onClick={() => navigate('/gastos')}
              className={`flex items-center px-3 py-2 rounded-lg transition-colors text-sm ${
                isActive('/gastos') 
                  ? 'bg-blue-100 text-blue-700 font-medium' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <CreditCard className="w-4 h-4 mr-2" />
              Gastos
            </button>
          </div>
        </nav>
      </div>
    </header>
  );
}

export default Header;