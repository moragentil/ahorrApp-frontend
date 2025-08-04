import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Calendar, TrendingUp, TrendingDown, DollarSign, Target, Filter, Search, X } from 'lucide-react';
import { ingresosService } from '../services/ingresosService'; // Debes crear este servicio
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

function IngresosScreen({ user }) {
  const [incomes, setIncomes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todas');
  const [viewMode, setViewMode] = useState('cards');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  useEffect(() => {
    ingresosService.getAll().then(setIncomes);
  }, []);

  const categories = ['Todas', ...Array.from(new Set(incomes.map(i => i.categoria?.nombre || i.category)))];

  const filteredIncomes = incomes.filter((income) => {
    const desc = income.descripcion || income.description || '';
    const cat = income.categoria?.nombre || income.category || '';
    const matchesSearch = desc.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'Todas' || cat === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const totalAmount = filteredIncomes.reduce((sum, income) => sum + (Number(income.monto) || Number(income.amount) || 0), 0);
  const averageAmount = filteredIncomes.length > 0 ? (totalAmount / filteredIncomes.length).toFixed(2) : '0.00';

  // Simulación de tendencia mensual y distribución por categoría
  const monthlyIncomeData = [
    { month: 'Ene', ingresos: 4200, meta: 5000 },
    { month: 'Feb', ingresos: 4800, meta: 5000 },
    { month: 'Mar', ingresos: 5200, meta: 5000 },
    { month: 'Abr', ingresos: 4600, meta: 5000 },
    { month: 'May', ingresos: 5800, meta: 5000 },
    { month: 'Jun', ingresos: 7615, meta: 5000 },
  ];
  const categoryDistribution = [
    { name: 'Salario', value: 4500, percentage: 59.1 },
    { name: 'Freelance', value: 1400, percentage: 18.4 },
    { name: 'Alquiler', value: 1200, percentage: 15.8 },
    { name: 'Inversiones', value: 195, percentage: 2.6 },
    { name: 'Negocio', value: 320, percentage: 4.2 },
  ];

  const getCategoryColor = (category) => {
    const colors = {
      Salario: 'bg-green-100 text-green-800',
      Freelance: 'bg-blue-100 text-blue-800',
      Inversiones: 'bg-purple-100 text-purple-800',
      Negocio: 'bg-orange-100 text-orange-800',
      Alquiler: 'bg-indigo-100 text-indigo-800',
      Otros: 'bg-gray-100 text-gray-800',
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Mis Ingresos</h1>
            <p className="text-gray-600">Gestiona y analiza todos tus ingresos mensuales</p>
          </div>
          <button
            className="bg-blue-900 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
            onClick={() => setIsAddDialogOpen(true)}
          >
            <Plus className="w-4 h-4" />
            Nuevo Ingreso
          </button>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg shadow-sm p-4">
            <p className="text-sm text-gray-600">Ingresos Junio</p>
            <p className="text-2xl font-bold text-gray-900">${totalAmount.toLocaleString()}</p>
            <div className="flex items-center mt-2">
              <TrendingUp className="w-4 h-4 text-green-600 mr-1" />
              <span className="text-sm text-green-600">+12.5% vs mes anterior</span>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4">
            <p className="text-sm text-gray-600">Promedio Mensual</p>
            <p className="text-2xl font-bold text-gray-900">${averageAmount}</p>
            <p className="text-sm text-gray-600 mt-2">Últimos 6 meses</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4">
            <p className="text-sm text-gray-600">Meta Mensual</p>
            <p className="text-2xl font-bold text-gray-900">$5,000</p>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
              <div
                className="bg-green-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${Math.min((totalAmount / 5000) * 100, 100)}%` }}
              />
            </div>
            <p className="text-sm text-gray-600 mt-1">{((totalAmount / 5000) * 100).toFixed(1)}% completado</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4">
            <p className="text-sm text-gray-600">Fuentes Activas</p>
            <p className="text-2xl font-bold text-gray-900">{categories.length - 1}</p>
            <p className="text-sm text-gray-600 mt-2">Categorías de ingresos</p>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-sm p-4">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Tendencia de Ingresos</h2>
            <p className="text-sm text-gray-600 mb-4">Evolución mensual vs meta</p>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlyIncomeData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`$${value}`, ""]} />
                  <Line type="monotone" dataKey="ingresos" stroke="#3b82f6" strokeWidth={3} name="Ingresos" />
                  <Line type="monotone" dataKey="meta" stroke="#10b981" strokeWidth={2} strokeDasharray="5 5" name="Meta" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Distribución por Categoría</h2>
            <p className="text-sm text-gray-600 mb-4">Ingresos del mes actual</p>
            <div className="space-y-4">
              {categoryDistribution.map((category, index) => (
                <div key={category.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-3 flex-1">
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{
                        backgroundColor: ['#3b82f6', '#10b981', '#8b5cf6', '#ef4444', '#f59e0b'][index],
                      }}
                    />
                    <span className="font-medium text-gray-900">{category.name}</span>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-900">${category.value.toLocaleString()}</p>
                    <p className="text-sm text-gray-600">{category.percentage}%</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar ingresos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none"
                />
              </div>
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
            <div className="flex gap-2">
              <button
                onClick={() => setViewMode('cards')}
                className={`px-4 py-2 rounded-md ${viewMode === 'cards' ? 'bg-blue-900 text-white' : 'bg-white text-blue-900'}`}
              >
                Tarjetas
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`px-4 py-2 rounded-md ${viewMode === 'table' ? 'bg-blue-900 text-white' : 'bg-white text-blue-900'}`}
              >
                Tabla
              </button>
            </div>
          </div>
        </div>

        {/* Incomes List */}
        {viewMode === 'cards' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredIncomes.map((income) => (
              <div
                key={income.id}
                className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-4"
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{income.descripcion || income.description}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <Calendar className="w-3 h-3 text-gray-400" />
                      <span className="text-sm text-gray-600">{income.fecha || income.date}</span>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <button className="p-1 text-gray-400 hover:text-gray-600">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button className="p-1 text-red-400 hover:text-red-600">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(income.categoria?.nombre || income.category)}`}>
                    {income.categoria?.nombre || income.category}
                  </span>
                  <span className="text-lg font-bold text-green-600">
                    +${Number(income.monto ?? income.amount ?? 0).toFixed(2)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left p-4 font-semibold text-gray-900">Descripción</th>
                  <th className="text-left p-4 font-semibold text-gray-900">Categoría</th>
                  <th className="text-left p-4 font-semibold text-gray-900">Fecha</th>
                  <th className="text-right p-4 font-semibold text-gray-900">Monto</th>
                  <th className="text-center p-4 font-semibold text-gray-900">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredIncomes.map((income) => (
                  <tr key={income.id} className="border-b hover:bg-gray-50">
                    <td className="p-4 text-gray-900">{income.descripcion || income.description}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(income.categoria?.nombre || income.category)}`}>
                        {income.categoria?.nombre || income.category}
                      </span>
                    </td>
                    <td className="p-4 text-gray-600">{income.fecha || income.date}</td>
                    <td className="p-4 text-right font-semibold text-green-600">
                      +${Number(income.monto ?? income.amount ?? 0).toFixed(2)}
                    </td>
                    <td className="p-4 text-center">
                      <div className="flex justify-center gap-1">
                        <button className="p-1 text-gray-400 hover:text-gray-600">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button className="p-1 text-red-400 hover:text-red-600">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Empty State */}
        {filteredIncomes.length === 0 && (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <div className="text-6xl mb-4 text-gray-400">💰</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No se encontraron ingresos</h3>
            <p className="text-gray-600 mb-4">Intenta ajustar los filtros o agregar un nuevo ingreso</p>
            <button
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2 mx-auto"
              onClick={() => setIsAddDialogOpen(true)}
            >
              <Plus className="w-4 h-4" />
              Agregar Ingreso
            </button>
          </div>
        )}

        {/* Modal para agregar ingreso */}
        {isAddDialogOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-900">Nuevo Ingreso</h2>
                <button
                  onClick={() => setIsAddDialogOpen(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              {/* Formulario de ingreso */}
              {/* ...aquí puedes reutilizar el formulario de NuevoGastoScreen adaptado para ingresos... */}
              {/* Ejemplo: */}
              {/* <NewIncomeForm onSave={() => setIsAddDialogOpen(false)} /> */}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default IngresosScreen;