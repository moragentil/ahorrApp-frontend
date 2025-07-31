import { PiggyBank } from 'lucide-react';

function Header({ user, onLogout }) {
  return (
    <header className="bg-white shadow-sm border-b">
      <div className="w-full mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className='flex items-center justify-center'>
            <PiggyBank className="w-12 h-12 text-blue-900 p-2" />
            <h1 className="text-2xl font-bold text-blue-900">AhorrApp</h1>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-gray-700">Hola, {user?.name}</span>
            <button
              onClick={onLogout}
              className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
            >
              Cerrar Sesión
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;