import { useState, useEffect } from 'react';
import { BrowserRouter, useLocation } from 'react-router-dom';
import AppRoutes from './routes/AppRoutes';
import { authService } from './services/authService';
import Navbar from './components/Navbar';
import { Toaster } from './components/ui/sonner';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verificar si hay un usuario autenticado al cargar la app
    const currentUser = authService.getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
    }
    setLoading(false);
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    setUser(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-xl">Cargando...</div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <div className="flex min-h-screen bg-gray-100">
        <Toaster position="top-right" richColors />
        {user && <Navbar user={user} onLogout={handleLogout} />}
        <main className={`flex-1 ${user ? 'ml-0 lg:ml-64' : ''}`}>
          <AppRoutes 
            user={user} 
            onLogin={handleLogin} 
            onLogout={handleLogout} 
          />
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;