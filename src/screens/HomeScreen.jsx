import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

function HomeScreen({ user, onLogout }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    authService.logout();
    onLogout();
    navigate('/login');
  };

  // Obtener el mes actual
  const getCurrentMonth = () => {
    const months = [
      'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];
    const currentDate = new Date();
    return `${months[currentDate.getMonth()]} ${currentDate.getFullYear()}`;
  };

  // Datos para el gráfico de torta
  const expenseData = [
    { name: "Alimentación", value: 1200, color: "#8884d8" },
    { name: "Transporte", value: 800, color: "#82ca9d" },
    { name: "Entretenimiento", value: 600, color: "#ffc658" },
    { name: "Servicios", value: 900, color: "#ff7300" },
    { name: "Otros", value: 400, color: "#00ff88" },
  ];

  // Datos para el gráfico de barras
  const monthlyData = [
    { month: "Ene", gastos: 2800, ingresos: 4000 },
    { month: "Feb", gastos: 3200, ingresos: 4000 },
    { month: "Mar", gastos: 2900, ingresos: 4000 },
    { month: "Abr", gastos: 3900, ingresos: 4000 },
    { month: "May", gastos: 3100, ingresos: 4000 },
    { month: "Jun", gastos: 3500, ingresos: 4000 },
  ];

  const colors = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#00ff88'];

  return (
    <div className="min-h-screen bg-gray-100">

      {/* Main Content */}
      <main className="w-full mx-auto px-12 py-6">
        {/* Título del mes */}
        <div className="mb-4">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Resumen de {getCurrentMonth()}</h2>
          <p className="text-gray-600">Tu estado financiero del mes actual</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          {/* Tarjetas de resumen */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-md">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
                </svg>
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-gray-500">Dinero Restante</h3>
                <p className="text-2xl font-semibold text-gray-900">$25,430</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-md">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                </svg>
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-gray-500">Total Gastado</h3>
                <p className="text-2xl font-semibold text-gray-900">$3,240</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-md">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
                </svg>
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-gray-500">Ingresos</h3>
                <p className="text-2xl font-semibold text-gray-900">$1.200.000</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-md">
                <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-gray-500">Objetivos</h3>
                <p className="text-2xl font-semibold text-gray-900">75%</p>
              </div>
            </div>
          </div>
        </div>

        {/* Gráficos */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Gráfico de Torta */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Distribución por Categoría</h2>
            <p className="text-sm text-gray-600 mb-4">Gastos del mes actual</p>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={expenseData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {expenseData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`$${value}`, "Gasto"]} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Gráfico de Barras */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Tendencia Mensual</h2>
            <p className="text-sm text-gray-600 mb-4">Ingresos vs Gastos últimos 6 meses</p>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`$${value}`, ""]} />
                  <Bar dataKey="ingresos" fill="#82ca9d" name="Ingresos" />
                  <Bar dataKey="gastos" fill="#8884d8" name="Gastos" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Secciones principales */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Movimientos Recientes</h2>
            <div className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b">
                <div>
                  <p className="font-medium">Supermercado</p>
                  <p className="text-sm text-gray-500">Hace 2 horas</p>
                </div>
                <span className="text-red-600 font-medium">-$45.30</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b">
                <div>
                  <p className="font-medium">Ahorro Mensual</p>
                  <p className="text-sm text-gray-500">Hace 1 día</p>
                </div>
                <span className="text-green-600 font-medium">+$500.00</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <div>
                  <p className="font-medium">Combustible</p>
                  <p className="text-sm text-gray-500">Hace 2 días</p>
                </div>
                <span className="text-red-600 font-medium">-$80.00</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Objetivos de Ahorro</h2>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Vacaciones</span>
                  <span className="text-sm text-gray-500">$2,500 / $5,000</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full" style={{ width: '50%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Auto Nuevo</span>
                  <span className="text-sm text-gray-500">$15,000 / $20,000</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-600 h-2 rounded-full" style={{ width: '75%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Fondo Emergencia</span>
                  <span className="text-sm text-gray-500">$3,000 / $10,000</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-yellow-600 h-2 rounded-full" style={{ width: '30%' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default HomeScreen;