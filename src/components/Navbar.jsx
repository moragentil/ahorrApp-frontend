import { PiggyBank, Home, CreditCard, Tag, Plus, LogOut, Menu, X, Target, BanknoteArrowUp } from 'lucide-react';
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { authService } from '../services/authService';
import ConfirmDeleteModal from './Modals/ConfirmDeleteModal';

const menuItems = [
  { id: '/home', label: 'Dashboard', icon: Home },
  { id: '/gastos', label: 'Gastos', icon: CreditCard },
  { id: '/gastos/nuevo', label: 'Nuevo Gasto', icon: Plus },
  { id: '/ingresos', label: 'Ingresos', icon: BanknoteArrowUp },
  { id: '/categorias', label: 'Categorías', icon: Tag },
  { id: '/ahorros', label: 'Ahorros', icon: Target },
];

function Navbar({ user, onLogout }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [loadingLogout, setLoadingLogout] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigate = (path) => {
    navigate(path);
    setIsMobileMenuOpen(false);
  };

  const handleLogoutClick = () => {
    setShowLogoutModal(true);
    setIsMobileMenuOpen(false);
  };

  const confirmLogout = async () => {
    setLoadingLogout(true);
    await authService.logout();
    if (onLogout) onLogout();
    setLoadingLogout(false);
    setShowLogoutModal(false);
    navigate('/login');
  };

  return (
    <>
      {/* Confirm Logout Modal */}
      <ConfirmDeleteModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={confirmLogout}
        loading={loadingLogout}
        accionTitulo="cerrar sesión"
        accion="Cerrar Sesión"
        pronombre=""
        entidad=""
        accionando="Cerrando sesión"
      />
      {/* Mobile Menu Button */}
      <div className={`${isMobileMenuOpen ? "hidden" : "lg:hidden fixed top-0 left-0 w-full h-16 bg-card border-b border-border z-50 flex items-center justify-between px-4"}`}>
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="bg-card rounded-lg p-2 text-primary"
        >
          {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
        <span className="font-bold text-primary text-2xl flex items-center">
          <PiggyBank className="inline-block w-6 h-6 mr-1" />
          AhorrApp</span>
        <div className="w-10" />
      </div>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed left-0 top-0 h-full w-64 bg-card border-r border-border shadow-lg z-50
          transform transition-transform duration-300 ease-in-out
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0 overflow-y-auto
        `}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-4 lg:p-6 border-b border-border">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-primary rounded-full flex items-center justify-center">
                <PiggyBank className="w-7 h-7 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-primary">AhorrApp</h1>
                <p className="text-sm text-muted-foreground">Gestor de finanzas</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-2 lg:p-4 space-y-1 lg:space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavigate(item.id)}
                  className={`lg:text-base text-sm w-full flex items-center gap-3 h-12 rounded-lg px-3 text-left transition-colors ${
                    isActive
                      ? 'bg-primary/20 text-primary font-medium'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* User Section */}
          <div className="p-4 border-t border-border">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-sm font-bold">
                {user?.name?.slice(0, 2).toUpperCase() || 'US'}
              </div>
              <div className="flex-1 min-w-0">
                <button
                  type="button"
                  onClick={() => handleNavigate('/configuracion')}
                  className="font-medium text-foreground truncate text-left w-full hover:underline"
                  title="Editar perfil"
                >
                  {user?.name}
                </button>
                <p className="text-sm text-muted-foreground truncate">{user?.email}</p>
              </div>
            </div>
            <button
              onClick={handleLogoutClick}
              className="w-full flex items-center gap-3 text-destructive hover:text-destructive/90 hover:bg-destructive/10 bg-transparent px-3 py-2 rounded-lg"
            >
              <LogOut className="w-4 h-4" />
              Cerrar Sesión
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}

export default Navbar;