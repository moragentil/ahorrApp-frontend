import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { RefreshCw, DollarSign, CreditCard, TrendingUp, TrendingDown, Target } from 'lucide-react';

function HomeScreen({ user, onLogout }) {
  const navigate = useNavigate();

  // Mes y año seleccionados
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const months = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  const handleLogout = () => {
    authService.logout();
    onLogout();
    navigate('/login');
  };

  // Simular datos según mes/año (puedes reemplazar por fetch real)
  const getExpenseData = () => [
    { name: "Alimentación", value: 1200 + selectedMonth * 10, color: "#8884d8" },
    { name: "Transporte", value: 800 + selectedMonth * 5, color: "#82ca9d" },
    { name: "Entretenimiento", value: 600, color: "#ffc658" },
    { name: "Servicios", value: 900, color: "#ff7300" },
    { name: "Otros", value: 400, color: "#00ff88" },
  ];

  const getMonthlyData = () => [
    { month: "Ene", gastos: 2800, ingresos: 4000 },
    { month: "Feb", gastos: 3200, ingresos: 4000 },
    { month: "Mar", gastos: 2900, ingresos: 4000 },
    { month: "Abr", gastos: 3900, ingresos: 4000 },
    { month: "May", gastos: 3100, ingresos: 4000 },
    { month: "Jun", gastos: 3500, ingresos: 4000 },
  ];

  const colors = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#00ff88'];

  // Botón para volver al mes actual
  const handleRefresh = () => {
    setSelectedMonth(new Date().getMonth());
    setSelectedYear(new Date().getFullYear());
  };

  // Ejemplo de datos (ajusta según tu lógica)
  const balance = 25430;
  const monthlyIncome = 1200000;
  const totalExpenses = 3240;
  const savingsGoalPercent = 75;
  const savingsCurrent = 600;
  const savingsTarget = 800;

  return (
    <div className="min-h-screen bg-gray-100">
      <main className="w-full mx-auto px-12 py-6">
        {/* Selector de mes y año con botón de refresh */}
        <div className="mb-4 flex flex-col md:flex-row md:items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Resumen de {months[selectedMonth]} {selectedYear}
            </h2>
            <p className="text-gray-600">Tu estado financiero del mes seleccionado</p>
          </div>
          <div className="flex gap-2 mt-2 md:mt-0 items-center">
            <select
              value={selectedMonth}
              onChange={e => setSelectedMonth(Number(e.target.value))}
              className="border border-gray-300 rounded-md px-2 py-1 bg-white text-gray-900"
            >
              {months.map((m, idx) => (
                <option key={m} value={idx}>{m}</option>
              ))}
            </select>
            <select
              value={selectedYear}
              onChange={e => setSelectedYear(Number(e.target.value))}
              className="border border-gray-300 rounded-md px-2 py-1 bg-white text-gray-900"
            >
              {[2023, 2024, 2025].map(y => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
            <button
              type="button"
              onClick={handleRefresh}
              className="border border-gray-300 rounded-md px-2 py-1 bg-white text-gray-900 flex items-center hover:bg-gray-100 transition"
              title="Volver al mes actual"
            >
              <RefreshCw className="w-4 h-4 mr-1" />
              Actual
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          {/* Balance Total */}
          <div className="bg-white border border-gray-200 shadow-sm rounded-lg  p-4 ">
            <div className="flex flex-row items-center justify-between mb-2">
              <span className="text-lg font-medium text-gray-600">Balance Total</span>
              <DollarSign className="h-4 w-4 text-blue-900" />
            </div>
            <div className="">
              <div className={`text-2xl font-bold mb-2 ${balance >= 0 ? "text-green-600" : "text-red-600"}`}>
                ${balance.toLocaleString()}
              </div>
              <p className="text-sm text-gray-600 flex items-center mt-1">
                {balance >= 0 ? (
                  <TrendingUp className="w-3 h-3 mr-1 text-green-600" />
                ) : (
                  <TrendingDown className="w-3 h-3 mr-1 text-red-600" />
                )}
                {balance >= 0 ? "+" : ""}
                {((balance / monthlyIncome) * 100).toFixed(1)}% vs mes anterior
              </p>
            </div>
          </div>

          {/* Gastos del Mes */}
          <div className="bg-white border border-gray-200 shadow-sm rounded-lg  p-4">
            <div className="flex flex-row items-center justify-between mb-2">
              <span className="text-lg font-medium text-gray-600">Gastos del Mes</span>
              <CreditCard className="h-4 w-4 text-blue-900" />
            </div>
            <div className="">
              <div className="text-2xl mb-2 font-bold text-gray-900">${totalExpenses.toLocaleString()}</div>
              <p className="text-sm text-gray-600 flex items-center mt-1">
                <TrendingUp className="w-3 h-3 mr-1 text-red-500" />
                +12.5% vs mes anterior
              </p>
            </div>
          </div>

          {/* Ingresos */}
          <div className="bg-white border border-gray-200 shadow-sm rounded-lg p-4">
            <div className="flex flex-row items-center justify-between mb-2">
              <span className="text-lg font-medium text-gray-600">Ingresos</span>
              <TrendingUp className="h-4 w-4 text-blue-900" />
            </div>
            <div className="">
              <div className="text-2xl font-bold mb-2 text-gray-900">${monthlyIncome.toLocaleString()}</div>
              <p className="text-sm text-gray-600 flex items-center mt-1">
                <TrendingUp className="w-3 h-3 mr-1 text-green-600" />
                Estable
              </p>
            </div>
          </div>

          {/* Meta de Ahorro */}
          <div className="bg-white border border-gray-200 shadow-sm rounded-lg p-4">
            <div className="flex flex-row items-center justify-between mb-2">
              <span className="text-lg font-medium text-gray-600">Meta de Ahorro</span>
              <Target className="h-4 w-4 text-blue-900" />
            </div>
            <div className="">
              <div className="text-2xl font-bold mb-2 text-gray-900">{savingsGoalPercent}%</div>
              <p className="text-sm text-gray-600">
                ${savingsCurrent} de ${savingsTarget} objetivo
              </p>
            </div>
          </div>
        </div>

        {/* Gráficos */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Gráfico de Torta */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Distribución por Categoría</h2>
            <p className="text-sm text-gray-600 mb-4">Gastos del mes seleccionado</p>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={getExpenseData()}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {getExpenseData().map((entry, index) => (
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
                <BarChart data={getMonthlyData()}>
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