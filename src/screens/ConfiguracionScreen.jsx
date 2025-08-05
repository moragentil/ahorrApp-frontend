import { useState } from 'react';
import { User, Mail, Save, Lock } from 'lucide-react';
import { authService } from '../services/authService';
import BtnLoading from '../components/BtnLoading';

function ConfiguracionScreen({ user, onLogout }) {
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess('');
    setError('');
    try {
      const data = { name, email };
      if (password) {
        if (password.length < 6) {
          setError('La contraseña debe tener al menos 6 caracteres');
          setLoading(false);
          return;
        }
        if (password !== passwordConfirm) {
          setError('Las contraseñas no coinciden');
          setLoading(false);
          return;
        }
        data.password = password;
        data.password_confirmation = passwordConfirm;
      }
      await authService.updateProfile(data);
      setSuccess('Perfil actualizado correctamente');
      setPassword('');
      setPasswordConfirm('');
    } catch (err) {
      setError('Error al actualizar el perfil');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 mt-14 lg:mt-0">
      <main className="max-w-lg mx-auto p-4 lg:p-8">
        <h1 className="text-xl lg:text-3xl font-bold text-gray-900 mb-2">Configuración de Perfil</h1>
        <p className="text-sm lg:text-base text-gray-600 mb-6">Edita tus datos personales y preferencias</p>
        <form className="bg-white rounded-lg shadow-md p-4 lg:p-6 space-y-4" onSubmit={handleSave}>
          <div>
            <label className="block text-sm lg:text-base font-medium text-gray-700 mb-1">
              <User className="inline w-4 h-4 mr-1 text-blue-900" />
              Nombre
            </label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none"
              required
            />
          </div>
          <div>
            <label className="block text-sm lg:text-base font-medium text-gray-700 mb-1">
              <Mail className="inline w-4 h-4 mr-1 text-blue-900" />
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none"
              required
            />
          </div>
          <div>
            <label className="block text-sm lg:text-base font-medium text-gray-700 mb-1">
              <Lock className="inline w-4 h-4 mr-1 text-blue-900" />
              Nueva Contraseña
            </label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none"
              placeholder="••••••••"
            />
            <p className="text-xs lg:text-sm text-gray-500 mt-1">Deja en blanco para no cambiarla</p>
          </div>
          {password && (
            <div>
              <label className="block text-sm lg:text-base font-medium text-gray-700 mb-1">
                Confirmar Contraseña
              </label>
              <input
                type="password"
                value={passwordConfirm}
                onChange={e => setPasswordConfirm(e.target.value)}
                className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none"
                placeholder="••••••••"
              />
            </div>
          )}
          <button
            type="submit"
            className="w-full bg-blue-900 text-white py-2 px-4 rounded-md hover:bg-blue-700 flex items-center justify-center gap-2 disabled:opacity-50 text-sm lg:text-base"
            disabled={loading}
          >
            {loading ? <BtnLoading color="white" /> : <><Save className="w-4 h-4" /> Guardar Cambios</>}
          </button>
          {success && <div className="text-green-600 text-sm lg:text-base mt-2">{success}</div>}
          {error && <div className="text-red-600 text-sm lg:text-base mt-2">{error}</div>}
        </form>
      </main>
    </div>
  );
}

export default ConfiguracionScreen;