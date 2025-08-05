import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Calendar, TrendingUp, TrendingDown, DollarSign, Target, Filter, Search, X } from 'lucide-react';
import { ingresosService } from '../services/ingresosService';
import { categoriasService } from '../services/categoriasService';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { parseISO } from 'date-fns';
import BtnLoading from '../components/BtnLoading';
import AddIncomeModal from '../components/Modals/AddIncomeModal';
import EditIncomeModal from '../components/Modals/EditIncomeModal';
import ConfirmDeleteModal from '../components/Modals/ConfirmDeleteModal';

function IngresosScreen({ user }) {
  const [incomes, setIncomes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todas');
  const [viewMode, setViewMode] = useState('cards');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [categoriasIngreso, setCategoriasIngreso] = useState([]);
  const [estadisticas, setEstadisticas] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  // Formulario de ingreso
  const [form, setForm] = useState({
    categoria_id: '',
    descripcion: '',
    monto: '',
    fecha: '',
  });

  const [editingIncome, setEditingIncome] = useState(null);

  // Loading state
  const [loading, setLoading] = useState(true);
  const [deleteIncomeId, setDeleteIncomeId] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Cargar ingresos y categorías del backend
  useEffect(() => {
    Promise.all([
      categoriasService.getIngresoCategorias().then(setCategoriasIngreso),
      ingresosService.getAll().then(setIncomes),
      ingresosService.getEstadisticas({ month: selectedMonth, year: selectedYear }).then(setEstadisticas)
    ]).finally(() => setLoading(false));
    // eslint-disable-next-line
  }, [selectedMonth, selectedYear]);

  // Obtener categorías únicas del backend
  const categories = [
    'Todas',
    ...Array.from(new Set(incomes.map(i => i.categoria?.nombre).filter(Boolean))),
  ];

  // Filtrar ingresos
  const filteredIncomes = incomes.filter((income) => {
    const desc = income.descripcion || '';
    const cat = income.categoria?.nombre || '';
    const matchesSearch = desc.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'Todas' || cat === selectedCategory;
    const fecha = income.fecha;
    if (!fecha) return false;
    const [year, month] = fecha.split('-');
    const matchesMonth = Number(month) - 1 === selectedMonth;
    const matchesYear = Number(year) === selectedYear;
    return matchesSearch && matchesCategory && matchesMonth && matchesYear;
  });

  const totalAmount = filteredIncomes.reduce((sum, income) => sum + (Number(income.monto) || 0), 0);
  const averageAmount = filteredIncomes.length > 0 ? (totalAmount / filteredIncomes.length).toFixed(2) : '0.00';

  // Cantidad de fuentes activas (categorías únicas en los ingresos filtrados)
  // Obtiene el nombre de la categoría, usando categoriasIngreso si es necesario
  function getCategoriaNombre(income) {
    if (income.categoria?.nombre) return income.categoria.nombre;
    const cat = categoriasIngreso.find(c => c.id === income.categoria_id);
    return cat ? cat.nombre : undefined;
  }

  console.log("Filtered Incomes:", filteredIncomes);

  const fuentesActivas = new Set(
    filteredIncomes
      .map(getCategoriaNombre)
      .filter(Boolean)
  ).size;

  // Acciones CRUD
  const handleAddIncome = async () => {
    if (!form.categoria_id || !form.descripcion.trim() || !form.monto || !form.fecha) return;
    const newIncome = await ingresosService.create({
      user_id: user.id,
      categoria_id: form.categoria_id,
      descripcion: form.descripcion,
      monto: Number(form.monto),
      fecha: form.fecha,
    });
    setIncomes([...incomes, newIncome]);
    setIsAddDialogOpen(false);
    setForm({ categoria_id: '', descripcion: '', monto: '', fecha: '' });
  };

  const handleDeleteIncome = async (id) => {
    setDeleteLoading(true);
    await ingresosService.delete(id);
    setIncomes(incomes.filter(i => i.id !== id));
    setDeleteLoading(false);
    setDeleteIncomeId(null);
  };

  const openEditDialog = (income) => {
    setEditingIncome(income);
    setForm({
      categoria_id: income.categoria_id,
      descripcion: income.descripcion,
      monto: income.monto,
      fecha: income.fecha.split('T')[0], // formato yyyy-mm-dd
    });
    setIsEditDialogOpen(true);
  };

  const handleEditIncome = async () => {
    if (!editingIncome || !form.categoria_id || !form.descripcion.trim() || !form.monto || !form.fecha) return;
    const updated = await ingresosService.update(editingIncome.id, {
      categoria_id: form.categoria_id,
      descripcion: form.descripcion,
      monto: Number(form.monto),
      fecha: form.fecha,
    });
    setIncomes(incomes.map(i => i.id === editingIncome.id ? updated : i));
    setIsEditDialogOpen(false);
    setEditingIncome(null);
    setForm({ categoria_id: '', descripcion: '', monto: '', fecha: '' });
  };

  // Colores de categoría
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

  // Colores de categoría para el chart
  const getCategoryHexColor = (categoryName) => {
    // Busca el color en las categorías cargadas desde el backend
    const cat = categoriasIngreso.find(c => c.nombre === categoryName);
    return cat?.color || "#e5e7eb";
  };

  // Datos de ejemplo para los gráficos (puedes reemplazar por datos reales si lo deseas)
  const monthlyIncomeData = [
    { month: "Ene", ingresos: 4200, meta: 5000 },
    { month: "Feb", ingresos: 4800, meta: 5000 },
    { month: "Mar", ingresos: 5200, meta: 5000 },
    { month: "Abr", ingresos: 4600, meta: 5000 },
    { month: "May", ingresos: 5800, meta: 5000 },
    { month: "Jun", ingresos: 7615, meta: 5000 },
  ];

  const categoryDistribution = [
    { name: "Salario", value: 4500, percentage: 59.1 },
    { name: "Freelance", value: 1400, percentage: 18.4 },
    { name: "Alquiler", value: 1200, percentage: 15.8 },
    { name: "Inversiones", value: 195, percentage: 2.6 },
    { name: "Negocio", value: 320, percentage: 4.2 },
  ];

  const months = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  // Función para formatear fecha a dd/mm/yyyy usando parseISO
  function formatFecha(fechaStr) {
    if (!fechaStr) return '';
    // Extrae solo la parte de fecha si viene con hora
    const [datePart] = fechaStr.split('T');
    const [year, month, day] = datePart.split('-');
    return `${day}/${month}/${year}`;
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <BtnLoading color="#1e3a8a" height={40} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 ">
      <ConfirmDeleteModal
        isOpen={!!deleteIncomeId}
        onClose={() => setDeleteIncomeId(null)}
        onConfirm={() => handleDeleteIncome(deleteIncomeId)}
        loading={deleteLoading}
        accionTitulo="eliminación"
        accion="Eliminar"
        pronombre="el"
        entidad="ingreso"
        accionando="Eliminando"
        nombreElemento={incomes.find(i => i.id === deleteIncomeId)?.descripcion}
      />
      <AddIncomeModal
        isOpen={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
        onSave={handleAddIncome}
        form={form}
        setForm={setForm}
        categoriasIngreso={categoriasIngreso}
        loading={false}
      />
      <EditIncomeModal
        isOpen={isEditDialogOpen}
        onClose={() => setIsEditDialogOpen(false)}
        onSave={handleEditIncome}
        form={form}
        setForm={setForm}
        categoriasIngreso={categoriasIngreso}
        loading={false}
      />
      <div className="max-w-7xl mx-auto p-4 lg:p-6 space-y-6">
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

        {/* Selector de mes y año  */}
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

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg shadow-sm p-4">
            <p className="text-sm text-gray-600">Ingresos Totales</p>
            <p className="text-2xl font-bold text-gray-900">${totalAmount.toLocaleString()}</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4">
            <p className="text-sm text-gray-600">Promedio</p>
            <p className="text-2xl font-bold text-gray-900">${averageAmount}</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4">
            <p className="text-sm text-gray-600">Fuentes Activas</p>
            <p className="text-2xl font-bold text-gray-900">{fuentesActivas}</p>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Monthly Trend */}
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="mb-2">
              <h2 className="text-lg font-semibold text-gray-900">Tendencia de Ingresos</h2>
              <p className="text-sm text-gray-600">Evolución mensual</p>
            </div>
            <div className="h-80">
              <ResponsiveContainer width="100%" height={320}>
                <LineChart
                  data={estadisticas?.tendencia_ingresos ?? []}
                  margin={{ top: 20, right: 30, left: 30, bottom: 20 }} // aumenta los márgenes
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="mes" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`$${value}`, ""]} />
                  <Line
                    type="monotone"
                    dataKey="total"
                    stroke="#1e3a8a"
                    strokeWidth={3}
                    name="Ingresos"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Category Distribution */}
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Distribución por Categoría</h2>
              <p className="text-sm text-gray-600">Ingresos del mes seleccionado</p>
            </div>
            <div className="space-y-6">
              {(estadisticas?.distribucion_categoria ?? []).map((cat, index) => (
                <div key={cat.categoria} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-4 h-4 rounded-full border border-gray-300"
                      style={{ backgroundColor: getCategoryHexColor(cat.categoria) }}
                      title={cat.categoria}
                    />
                    <span className=" font-medium text-gray-900">{cat.categoria}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-lg font-bold text-gray-900">
                      ${cat.total.toLocaleString()}
                    </span>
                    <span className="text-sm text-gray-500">
                      ({cat.porcentaje}%)
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Filters and Search */}
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar ingresos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-1 border border-gray-300 rounded-md focus:outline-none"
                />
              </div>
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                className={`px-3 py-1 rounded-md ${viewMode === 'cards' ? 'bg-blue-900 text-white' : 'bg-white text-blue-900'}`}
              >
                Tarjetas
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`px-3 py-1 rounded-md ${viewMode === 'table' ? 'bg-blue-900 text-white' : 'bg-white text-blue-900'}`}
              >
                Tabla
              </button>
            </div>
          </div>

        {/* Incomes List */}
        {viewMode === 'cards' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredIncomes.map((income) => (
              <div
                key={income.id}
                className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-4"
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{income.descripcion}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <Calendar className="w-3 h-3 text-gray-400" />
                      <span className="text-sm text-gray-600">{formatFecha(income.fecha)}</span>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <button className="p-1 text-gray-400 hover:text-gray-600" onClick={() => openEditDialog(income)}>
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      className="p-1 text-red-400 hover:text-red-600"
                      onClick={() => setDeleteIncomeId(income.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                  <span
                    className="inline-block w-4 h-4 rounded-full border border-gray-300 "
                    style={{ backgroundColor: income.categoria?.color || "#e5e7eb" }}
                    title={income.categoria?.nombre}
                  />
                  <span className="px-2 py-1 rounded-full text-xs font-medium">
                    {income.categoria?.nombre}
                  </span>
                  </div>
                  <span className="text-lg font-bold text-green-600">
                    +${Number(income.monto ?? 0).toFixed(2)}
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
                  <th className="text-left p-4 font-semibold text-gray-900">Monto</th>
                  <th className="text-center p-4 font-semibold text-gray-900">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredIncomes.map((income) => (
                  <tr key={income.id} className="border-b hover:bg-gray-50">
                    <td className="p-4 text-gray-900">{income.descripcion}</td>
                    <td className="p-4 items-center flex">
                      <span
                        className="inline-block w-4 h-4 rounded-full border border-gray-300 "
                        style={{ backgroundColor: income.categoria?.color || "#e5e7eb" }}
                        title={income.categoria?.nombre}
                      />
                      <span className="px-2 py-1 rounded-full text-xs font-medium">
                        {income.categoria?.nombre}
                      </span>
                    </td>
                    <td className="p-4 text-gray-600">{formatFecha(income.fecha)}</td>
                    <td className="p-4 text-left font-semibold text-green-600">
                      +${Number(income.monto ?? 0).toFixed(2)}
                    </td>
                    <td className="p-4 text-center">
                      <div className="flex justify-center gap-1">
                        <button className="p-1 text-gray-400 hover:text-gray-600" onClick={() => openEditDialog(income)}>
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          className="p-1 text-red-400 hover:text-red-600"
                          onClick={() => setDeleteIncomeId(income.id)}
                        >
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
              className="bg-blue-900 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2 mx-auto"
              onClick={() => setIsAddDialogOpen(true)}
            >
              <Plus className="w-4 h-4" />
              Agregar Ingreso
            </button>
          </div>
        )}

        
      </div>
    </div>
  );
}

export default IngresosScreen;