import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Calendar, Search, BanknoteArrowUp } from 'lucide-react';
import { ingresosService } from '../services/ingresosService';
import { categoriasService } from '../services/categoriasService';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import BtnLoading from '../components/BtnLoading';
import AddIncomeModal from '../components/Modals/AddIncomeModal';
import EditIncomeModal from '../components/Modals/EditIncomeModal';
import ConfirmDeleteModal from '../components/Modals/ConfirmDeleteModal';
import AddCategoryModal from '../components/Modals/AddCategoryModal';
import { toast } from 'sonner';

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

  const [form, setForm] = useState({
    categoria_id: '',
    descripcion: '',
    monto: '',
    fecha: '',
  });

  const [editingIncome, setEditingIncome] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleteIncomeId, setDeleteIncomeId] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [isAddCategoryOpen, setIsAddCategoryOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryType, setNewCategoryType] = useState('ingreso');
  const [newCategoryColor, setNewCategoryColor] = useState('#3b82f6');
  const [loadingAddCategory, setLoadingAddCategory] = useState(false);

  const colorOptions = [
    "#3b82f6", "#10b981", "#8b5cf6", "#ef4444", "#f59e0b",
    "#06b6d4", "#ec4899", "#84cc16", "#f97316", "#6366f1",
  ];

  useEffect(() => {
    Promise.all([
      categoriasService.getIngresoCategorias().then(setCategoriasIngreso),
      ingresosService.getAll().then(setIncomes),
      ingresosService.getEstadisticas({ month: selectedMonth, year: selectedYear }).then(setEstadisticas)
    ]).finally(() => setLoading(false));
  }, [selectedMonth, selectedYear]);

  const categories = [
    'Todas',
    ...Array.from(new Set(incomes.map(i => i.categoria?.nombre).filter(Boolean))),
  ];

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

  function getCategoriaNombre(income) {
    if (income.categoria?.nombre) return income.categoria.nombre;
    const cat = categoriasIngreso.find(c => c.id === income.categoria_id);
    return cat ? cat.nombre : undefined;
  }

  const fuentesActivas = new Set(
    filteredIncomes
      .map(getCategoriaNombre)
      .filter(Boolean)
  ).size;

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
      fecha: income.fecha.split('T')[0],
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

  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) return;
    setLoadingAddCategory(true);
    try {
      const nueva = await categoriasService.create({
        user_id: user.id,
        nombre: newCategoryName.trim(),
        tipo: newCategoryType,
        color: newCategoryColor,
      });
      setCategoriasIngreso([...categoriasIngreso, nueva]);
      setForm(f => ({ ...f, categoria_id: nueva.id }));
      setIsAddCategoryOpen(false);
      setNewCategoryName('');
      setNewCategoryType('ingreso');
      setNewCategoryColor('#3b82f6');
    } catch (err) {
      toast.error('Error al crear la categoría');
    }
    setLoadingAddCategory(false);
  };

  const getCategoryHexColor = (categoryName) => {
    const cat = categoriasIngreso.find(c => c.nombre === categoryName);
    return cat?.color || "#e5e7eb";
  };

  const months = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  function formatFecha(fechaStr) {
    if (!fechaStr) return '';
    const [datePart] = fechaStr.split('T');
    const [year, month, day] = datePart.split('-');
    return `${day}/${month}/${year}`;
  }

  const [isMd, setIsMd] = useState(window.innerWidth >= 768);

  useEffect(() => {
    const handleResize = () => setIsMd(window.innerWidth >= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <BtnLoading height={40} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background mt-14 lg:mt-0">
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
      <AddCategoryModal
        isOpen={isAddCategoryOpen}
        onClose={() => setIsAddCategoryOpen(false)}
        onSave={handleAddCategory}
        newCategoryName={newCategoryName}
        setNewCategoryName={setNewCategoryName}
        newCategoryType={newCategoryType}
        setNewCategoryType={setNewCategoryType}
        newCategoryColor={newCategoryColor}
        setNewCategoryColor={setNewCategoryColor}
        colorOptions={colorOptions}
        loading={loadingAddCategory}
      />
      <AddIncomeModal
        isOpen={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
        onSave={handleAddIncome}
        form={form}
        setForm={setForm}
        categoriasIngreso={categoriasIngreso}
        loading={false}
        onAddCategory={() => setIsAddCategoryOpen(true)}
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
      <main className="max-w-7xl mx-auto p-4 lg:p-6 space-y-4 lg:space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-xl lg:text-3xl font-bold text-foreground mb-1 lg:mb-2">Mis Ingresos</h1>
            <p className="text-sm lg:text-base text-muted-foreground">Gestiona y analiza todos tus ingresos mensuales</p>
          </div>
        </div>

        {/* Selector de mes y año */}
        <div className="mb-4 flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-2">
            <select
              value={selectedMonth}
              onChange={e => setSelectedMonth(Number(e.target.value))}
              className="lg:text-base text-sm border border-border rounded-md px-2 py-2 bg-input text-foreground"
            >
              {months.map((m, idx) => (
                <option key={m} value={idx}>{m}</option>
              ))}
            </select>
            <select
              value={selectedYear}
              onChange={e => setSelectedYear(Number(e.target.value))}
              className="lg:text-base text-sm border border-border rounded-md px-2 py-2 bg-input text-foreground"
            >
              {[2023, 2024, 2025].map(y => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>
          <button
            className="ml-auto text-sm lg:text-base bg-primary text-primary-foreground px-3 lg:px-4 py-2 rounded-lg hover:bg-primary/90 flex items-center gap-2 justify-center transition-colors"
            onClick={() => setIsAddDialogOpen(true)}
          >
            <Plus className="w-4 h-4" />
            Nuevo Ingreso
          </button>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-card border border-border rounded-lg shadow-sm px-3 py-2">
            <p className="text-sm lg:text-base text-muted-foreground">Ingresos Totales</p>
            <p className="text-xl lg:text-3xl font-bold text-foreground">${totalAmount.toLocaleString()}</p>
          </div>
          <div className="bg-card border border-border rounded-lg shadow-sm px-3 py-2">
            <p className="text-sm lg:text-base text-muted-foreground">Promedio</p>
            <p className="text-xl lg:text-3xl font-bold text-foreground">${averageAmount}</p>
          </div>
          <div className="bg-card border border-border rounded-lg shadow-sm px-3 py-2">
            <p className="text-sm lg:text-base text-muted-foreground">Fuentes Activas</p>
            <p className="text-xl lg:text-3xl font-bold text-foreground">{fuentesActivas}</p>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-4 lg:mb-8">
          {/* Monthly Trend */}
          <div className="bg-card border border-border rounded-lg shadow-sm p-4 lg:p-6">
            <div className="mb-2">
              <h2 className="text-lg font-semibold text-foreground mb-1 lg:mb-4">Tendencia de Ingresos</h2>
              <p className="text-sm text-muted-foreground mb-1 lg:mb-4">Evolución mensual</p>
            </div>
            <div className="h-60 lg:h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={estadisticas?.tendencia_ingresos ?? []}
                  margin={{ top: 20, right: 30, left: 30, bottom: 20 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="mes" stroke="hsl(var(--muted-foreground))" />
                  <YAxis stroke="hsl(var(--muted-foreground))" />
                  <Tooltip 
                    formatter={(value) => [`$${value}`, ""]}
                    contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', color: 'hsl(var(--foreground))' }}
                  />
                  <Line
                    type="monotone"
                    dataKey="total"
                    stroke="hsl(var(--primary))"
                    strokeWidth={3}
                    name="Ingresos"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Category Distribution */}
          <div className="bg-card border border-border rounded-lg shadow-sm p-4 lg:p-6">
            <div className="mb-4">
              <h2 className="text-lg font-semibold text-foreground mb-1 lg:mb-4">Distribución por Categoría</h2>
              <p className="text-sm text-muted-foreground mb-1 lg:mb-4">Ingresos del mes seleccionado</p>
            </div>
            <div className="space-y-6">
              {(estadisticas?.distribucion_categoria ?? []).map((cat, index) => (
                <div key={cat.categoria} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-4 h-4 rounded-full border border-border"
                      style={{ backgroundColor: getCategoryHexColor(cat.categoria) }}
                      title={cat.categoria}
                    />
                    <span className="font-medium text-foreground">{cat.categoria}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-base lg:text-lg font-bold text-foreground">
                      ${cat.total.toLocaleString()}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      ({cat.porcentaje}%)
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="flex flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Buscar ingresos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-1 border border-border bg-input text-foreground rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          </div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="lg:text-base text-sm px-3 py-1 border border-border bg-input text-foreground rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
          {isMd && (
            <div className="flex gap-2">
              <button
                onClick={() => setViewMode('cards')}
                className={`px-3 py-1 rounded-md transition-colors ${viewMode === 'cards' ? 'bg-primary text-primary-foreground' : 'bg-card text-primary border border-border'}`}
              >
                Tarjetas
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`px-3 py-1 rounded-md transition-colors ${viewMode === 'table' ? 'bg-primary text-primary-foreground' : 'bg-card text-primary border border-border'}`}
              >
                Tabla
              </button>
            </div>
          )}
        </div>

        {/* Incomes List */}
        {(viewMode === 'cards' || !isMd) ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredIncomes.map((income) => (
              <div
                key={income.id}
                className="bg-card border border-border rounded-lg shadow-sm hover:shadow-md transition-shadow p-4"
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground">{income.descripcion}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <Calendar className="w-3 h-3 text-muted-foreground" />
                      <span className="text-sm lg:text-base text-muted-foreground">{formatFecha(income.fecha)}</span>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <button className="p-1 text-muted-foreground hover:text-foreground" onClick={() => openEditDialog(income)}>
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      className="p-1 text-destructive/60 hover:text-destructive"
                      onClick={() => setDeleteIncomeId(income.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <span
                      className="inline-block w-4 h-4 rounded-full border border-border"
                      style={{ backgroundColor: income.categoria?.color || "#e5e7eb" }}
                      title={income.categoria?.nombre}
                    />
                    <span className="px-2 py-1 rounded-full text-xs font-medium text-foreground">
                      {income.categoria?.nombre}
                    </span>
                  </div>
                  <span className="text-base lg:text-2xl font-bold text-success">
                    +${Number(income.monto ?? 0).toFixed(2)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-card border border-border rounded-lg shadow-sm overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted border-b border-border">
                <tr>
                  <th className="text-left p-4 font-semibold text-foreground">Descripción</th>
                  <th className="text-left p-4 font-semibold text-foreground">Categoría</th>
                  <th className="text-left p-4 font-semibold text-foreground">Fecha</th>
                  <th className="text-left p-4 font-semibold text-foreground">Monto</th>
                  <th className="text-center p-4 font-semibold text-foreground">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredIncomes.map((income) => (
                  <tr key={income.id} className="border-b border-border hover:bg-muted/50">
                    <td className="p-4 text-foreground">{income.descripcion}</td>
                    <td className="p-4 items-center flex">
                      <span
                        className="inline-block w-4 h-4 rounded-full border border-border"
                        style={{ backgroundColor: income.categoria?.color || "#e5e7eb" }}
                        title={income.categoria?.nombre}
                      />
                      <span className="px-2 py-1 rounded-full text-xs font-medium text-foreground">
                        {income.categoria?.nombre}
                      </span>
                    </td>
                    <td className="p-4 text-muted-foreground">{formatFecha(income.fecha)}</td>
                    <td className="p-4 text-left font-semibold text-success">
                      +${Number(income.monto ?? 0).toFixed(2)}
                    </td>
                    <td className="p-4 text-center">
                      <div className="flex justify-center gap-1">
                        <button className="p-1 text-muted-foreground hover:text-foreground" onClick={() => openEditDialog(income)}>
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          className="p-1 text-destructive/60 hover:text-destructive"
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
          <div className="bg-card border border-border rounded-lg shadow-sm p-8 text-center items-center justify-center flex flex-col">
            <div className="text-muted-foreground mb-4"><BanknoteArrowUp size={52} strokeWidth={1.5} /></div>
            <h3 className="text-lg font-semibold text-foreground mb-2">No se encontraron ingresos</h3>
            <p className="text-muted-foreground mb-4">Intenta ajustar los filtros o agregar un nuevo ingreso</p>
            <button
              className="bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 flex items-center gap-2 mx-auto transition-colors"
              onClick={() => setIsAddDialogOpen(true)}
            >
              <Plus className="w-4 h-4" />
              Agregar Ingreso
            </button>
          </div>
        )}
      </main>
    </div>
  );
}

export default IngresosScreen;