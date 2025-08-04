import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, Plus, Edit, Trash2, Calendar } from 'lucide-react';
import { gastosService } from '../services/gastosService';

function GastosScreen({ user, onLogout }) {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Todas");
  const [viewMode, setViewMode] = useState("cards");
  const [expenses, setExpenses] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  useEffect(() => {
    gastosService.getAll().then(setExpenses);
  }, []);

  const months = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  // Si tu backend usa otros nombres de campos, mapea aquí
  const categories = ["Todas", ...Array.from(new Set(expenses.map(e => e.category || e.categoria?.nombre)))];

  const getCategoryColor = (category) => {
    const colors = {
      Alimentación: "bg-blue-100 text-blue-800",
      Transporte: "bg-green-100 text-green-800",
      Entretenimiento: "bg-purple-100 text-purple-800",
      Salud: "bg-red-100 text-red-800",
      Servicios: "bg-yellow-100 text-yellow-800",
    };
    return colors[category] || "bg-gray-100 text-gray-800";
  };

  // Filtrar gastos por mes y año seleccionados
  const filteredExpenses = expenses.filter((expense) => {
    const desc = expense.description || expense.descripcion || '';
    const cat = expense.category || expense.categoria?.nombre || '';
    const matchesSearch = desc.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "Todas" || cat === selectedCategory;
    const fecha = expense.fecha || expense.date;
    if (!fecha) return false;
    const [year, month] = fecha.split('-');
    const matchesMonth = Number(month) - 1 === selectedMonth;
    const matchesYear = Number(year) === selectedYear;
    return matchesSearch && matchesCategory && matchesMonth && matchesYear;
  });

  const totalAmount = filteredExpenses.reduce(
    (sum, expense) => sum + (Number(expense.amount) || Number(expense.monto) || 0),
    0
  );

  const averageAmount =
    filteredExpenses.length > 0 ? (totalAmount / filteredExpenses.length).toFixed(2) : "0.00";

  const handleNewExpense = () => {
    navigate('/gastos/nuevo');
  };

  function formatDate(dateString) {
    if (!dateString) return "";
    const date = new Date(dateString);
    const days = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
    const day = days[date.getUTCDay()];
    const dd = String(date.getUTCDate()).padStart(2, "0");
    const mm = String(date.getUTCMonth() + 1).padStart(2, "0");
    const yyyy = date.getUTCFullYear();
    return `${day}, ${dd}/${mm}/${yyyy}`;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <main className="max-w-7xl mx-auto p-4 lg:p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Mis Gastos</h1>
            <p className="text-gray-600">Gestiona y revisa todos tus gastos</p>
          </div>
          <button 
            onClick={handleNewExpense}
            className="bg-blue-900 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Nuevo Gasto
          </button>
        </div>

        {/* Selector de mes y año */}
        <div className="mb-4 flex gap-2 items-center">
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
        </div>

        {/* Filters and Search */}
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar gastos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none "
              />
            </div>
          </div>
          <div className="flex gap-2">
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
            <button
              onClick={() => setViewMode("cards")}
              className={`px-4 py-2 rounded-md ${viewMode === "cards" ? "bg-blue-900 text-white" : "bg-white text-blue-900"}`}
            >
              Tarjetas
            </button>
            <button
              onClick={() => setViewMode("table")}
              className={`px-4 py-2 rounded-md ${viewMode === "table" ? "bg-blue-900 text-white" : "bg-white text-blue-900"}`}
            >
              Tabla
            </button>
          </div>
        </div>


        {/* Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg shadow-md px-3 py-2">
            <div className="text-2xl font-bold text-blue-900">{filteredExpenses.length}</div>
            <p className="text-sm text-gray-700">Gastos encontrados</p>
          </div>
          <div className="bg-white rounded-lg shadow-md px-3 py-2">
            <div className="text-2xl font-bold text-blue-900">${totalAmount.toFixed(2)}</div>
            <p className="text-sm text-gray-700">Total filtrado</p>
          </div>
          <div className="bg-white rounded-lg shadow-md px-3 py-2">
            <div className="text-2xl font-bold text-blue-900">${averageAmount}</div>
            <p className="text-sm text-gray-700">Promedio por gasto</p>
          </div>
        </div>

        {/* Expenses List */}
        {viewMode === "cards" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredExpenses.map((expense) => (
              <div
                key={expense.id}
                className="bg-white rounded-lg shadow-md p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{expense.descripcion}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <Calendar className="w-3 h-3 text-gray-400" />
                      <span className="text-sm text-gray-600">{formatDate(expense.fecha)}</span>
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
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(expense.categoria?.nombre)}`}>
                    {expense.categoria?.nombre}
                  </span>
                  <span className="text-lg font-bold text-gray-900">
                    ${Number(expense.monto ?? 0).toFixed(2)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
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
                  {filteredExpenses.map((expense) => (
                    <tr key={expense.id} className="border-b hover:bg-gray-50">
                      <td className="p-4 text-gray-900">{expense.descripcion}</td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(expense.categoria?.nombre)}`}>
                          {expense.categoria?.nombre}
                        </span>
                      </td>
                      <td className="p-4 text-gray-600">{formatDate(expense.fecha)}</td>
                      <td className="p-4 text-right font-semibold text-gray-900">
                        ${Number(expense.monto ?? 0).toFixed(2)}
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
          </div>
        )}

        {filteredExpenses.length === 0 && (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <div className="text-6xl mb-4">💸</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No se encontraron gastos</h3>
            <p className="text-gray-600 mb-4">Intenta ajustar los filtros o agregar un nuevo gasto</p>
            <button 
              onClick={handleNewExpense}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2 mx-auto"
            >
              <Plus className="w-4 h-4" />
              Agregar Gasto
            </button>
          </div>
        )}
      </main>
    </div>
  );
}

export default GastosScreen;