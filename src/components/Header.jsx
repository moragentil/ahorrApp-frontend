import { PiggyBank, Home, CreditCard, Tag } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

function Header({ user, onLogout }) {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <header className="bg-card shadow-sm border-b border-border">
      <div className="w-full mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className='flex items-center justify-center'>
            <PiggyBank className="w-12 h-12 text-primary p-2" />
            <h1 className="text-2xl font-bold text-primary">AhorrApp</h1>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            <button
              onClick={() => navigate('/home')}
              className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
                isActive('/home') 
                  ? 'bg-primary/20 text-primary font-medium' 
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}
            >
              <Home className="w-4 h-4 mr-2" />
              Dashboard
            </button>
            <button
              onClick={() => navigate('/gastos')}
              className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
                isActive('/gastos') || isActive('/gastos/nuevo')
                  ? 'bg-primary/20 text-primary font-medium' 
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}
            >
              <CreditCard className="w-4 h-4 mr-2" />
              Gastos
            </button>
            <button
              onClick={() => navigate('/categorias')}
              className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
                isActive('/categorias') 
                  ? 'bg-primary/20 text-primary font-medium' 
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}
            >
              <Tag className="w-4 h-4 mr-2" />
              Categorías
            </button>
          </nav>

          {/* User section */}
          <div className="flex items-center space-x-4">
            <span className="text-foreground hidden sm:block">Hola, {user?.name}</span>
            <button
              onClick={onLogout}
              className="bg-destructive text-destructive-foreground px-4 py-2 rounded-md hover:bg-destructive/90 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
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
                  ? 'bg-primary/20 text-primary font-medium' 
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}
            >
              <Home className="w-4 h-4 mr-2" />
              Dashboard
            </button>
            <button
              onClick={() => navigate('/gastos')}
              className={`flex items-center px-3 py-2 rounded-lg transition-colors text-sm ${
                isActive('/gastos') || isActive('/gastos/nuevo')
                  ? 'bg-primary/20 text-primary font-medium' 
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}
            >
              <CreditCard className="w-4 h-4 mr-2" />
              Gastos
            </button>
            <button
              onClick={() => navigate('/categorias')}
              className={`flex items-center px-3 py-2 rounded-lg transition-colors text-sm ${
                isActive('/categorias') 
                  ? 'bg-primary/20 text-primary font-medium' 
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}
            >
              <Tag className="w-4 h-4 mr-2" />
              Categorías
            </button>
          </div>
        </nav>
      </div>
    </header>
  );
}

export default Header;