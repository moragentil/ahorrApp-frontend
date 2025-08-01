import { useState } from 'react';
import { User, Mail, Save, Lock } from 'lucide-react';

function ConfiguracionScreen({ user, onLogout }) {
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [password, setPassword] = useState('');
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleSave = (e) => {
    e.preventDefault();
    // Simulación de guardado
    setSuccess('Perfil actualizado correctamente');
    setError('');
    setPassword('');
    // Aquí podrías actualizar el usuario en el backend/localStorage
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <main className="max-w-lg mx-auto p-4 lg:p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Configuración de Perfil</h1>
        <p className="text-gray-600 mb-6">Edita tus datos personales y preferencias</p>
        <form className="bg-white rounded-lg shadow-md p-6 space-y-4" onSubmit={handleSave}>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <User className="inline w-4 h-4 mr-1 text-blue-900" />
              Nombre
            </label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <Mail className="inline w-4 h-4 mr-1 text-blue-900" />
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <Lock className="inline w-4 h-4 mr-1 text-blue-900" />
              Nueva Contraseña
            </label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none"
              placeholder="••••••••"
            />
            <p className="text-xs text-gray-500 mt-1">Deja en blanco para no cambiarla</p>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-900 text-white py-2 px-4 rounded-md hover:bg-blue-700 flex items-center justify-center gap-2"
          >
            <Save className="w-4 h-4" />
            Guardar Cambios
          </button>
          {success && <div className="text-green-600 text-sm mt-2">{success}</div>}
          {error && <div className="text-red-600 text-sm mt-2">{error}</div>}
        </form>
      </main>
    </div>
  );
}

export default ConfiguracionScreen;