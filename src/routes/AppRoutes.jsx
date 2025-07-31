import { Routes, Route, Navigate } from 'react-router-dom';
import { authService } from '../services/authService';
import LoginScreen from '../screens/LoginScreen';
import HomeScreen from '../screens/HomeScreen';
import GastosScreen from '../screens/GastosScreen';
import NuevoGastoScreen from '../screens/NuevoGastoScreen';

// Componente para proteger rutas que requieren autenticación
function ProtectedRoute({ children }) {
  const isAuthenticated = authService.isAuthenticated();
  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

// Componente para redirigir usuarios autenticados
function PublicRoute({ children }) {
  const isAuthenticated = authService.isAuthenticated();
  return !isAuthenticated ? children : <Navigate to="/home" replace />;
}

function AppRoutes({ user, onLogin, onLogout }) {
  return (
    <Routes>
      {/* Ruta raíz - redirige según el estado de autenticación */}
      <Route 
        path="/" 
        element={
          authService.isAuthenticated() ? 
            <Navigate to="/home" replace /> : 
            <Navigate to="/login" replace />
        } 
      />
      
      {/* Ruta de login - solo accesible si no está autenticado */}
      <Route 
        path="/login" 
        element={
          <PublicRoute>
            <LoginScreen onLogin={onLogin} />
          </PublicRoute>
        } 
      />
      
      {/* Ruta de home - solo accesible si está autenticado */}
      <Route 
        path="/home" 
        element={
          <ProtectedRoute>
            <HomeScreen user={user} onLogout={onLogout} />
          </ProtectedRoute>
        } 
      />

      {/* Ruta de gastos */}
      <Route 
        path="/gastos" 
        element={
          <ProtectedRoute>
            <GastosScreen user={user} onLogout={onLogout} />
          </ProtectedRoute>
        } 
      />

      {/* Nueva ruta para nuevo gasto */}
      <Route 
        path="/gastos/nuevo" 
        element={
          <ProtectedRoute>
            <NuevoGastoScreen user={user} onLogout={onLogout} />
          </ProtectedRoute>
        } 
      />
      
      {/* Rutas futuras para otras pantallas */}
      <Route 
        path="/profile" 
        element={
          <ProtectedRoute>
            <div className="p-8">
              <h1 className="text-2xl font-bold">Perfil de Usuario</h1>
              <p>Página en construcción...</p>
            </div>
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/transactions" 
        element={
          <ProtectedRoute>
            <div className="p-8">
              <h1 className="text-2xl font-bold">Transacciones</h1>
              <p>Página en construcción...</p>
            </div>
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/goals" 
        element={
          <ProtectedRoute>
            <div className="p-8">
              <h1 className="text-2xl font-bold">Objetivos de Ahorro</h1>
              <p>Página en construcción...</p>
            </div>
          </ProtectedRoute>
        } 
      />
      
      {/* Ruta 404 - página no encontrada */}
      <Route 
        path="*" 
        element={
          <div className="min-h-screen bg-gray-100 flex items-center justify-center">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-gray-800 mb-4">404</h1>
              <p className="text-gray-600 mb-4">Página no encontrada</p>
              <button 
                onClick={() => window.history.back()}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
              >
                Volver
              </button>
            </div>
          </div>
        } 
      />
    </Routes>
  );
}

export default AppRoutes;