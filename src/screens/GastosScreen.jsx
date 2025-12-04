import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, Plus, Edit, Trash2, Calendar, X, BanknoteArrowDown } from 'lucide-react';
import { gastosService } from '../services/gastosService';
import BtnLoading from '../components/BtnLoading';
import EditExpenseModal from '../components/Modals/EditExpenseModal';
import ConfirmDeleteModal from '../components/Modals/ConfirmDeleteModal';

function GastosScreen({ user, onLogout }) {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Todas");
  const [viewMode, setViewMode] = useState("cards");
  const [expenses, setExpenses] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [loading, setLoading] = useState(true);
  const [deleteExpenseId, setDeleteExpenseId] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [editForm, setEditForm] = useState({
    categoria_id: '',
    descripcion: '',
    monto: '',
    fecha: '',
  });

  const [isLg, setIsLg] = useState(window.innerWidth > 768);

  useEffect(() => {
    gastosService.getAll().then(data => {
      setExpenses(data);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    const handleResize = () => setIsLg(window.innerWidth >= 1024);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const months = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

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

  const handleDeleteExpense = async (id) => {
    setDeleteLoading(true);
    await gastosService.delete(id);
    setExpenses(expenses.filter(e => e.id !== id));
    setDeleteLoading(false);
    setDeleteExpenseId(null);
  };

  const openEditDialog = (expense) => {
    setEditingExpense(expense);
    setEditForm({
      categoria_id: expense.categoria_id,
      descripcion: expense.descripcion,
      monto: expense.monto,
      fecha: expense.fecha ? expense.fecha.split('T')[0] : '',
    });
    setIsEditDialogOpen(true);
  };

  const handleEditExpense = async () => {
    if (!editingExpense || !editForm.categoria_id || !editForm.descripcion.trim() || !editForm.monto || !editForm.fecha) return;
    const updated = await gastosService.update(editingExpense.id, {
      categoria_id: editForm.categoria_id,
      descripcion: editForm.descripcion,
      monto: Number(editForm.monto),
      fecha: editForm.fecha,
    });
    setExpenses(expenses.map(e => e.id === editingExpense.id ? updated : e));
    setIsEditDialogOpen(false);
    setEditingExpense(null);
    setEditForm({ categoria_id: '', descripcion: '', monto: '', fecha: '' });
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

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <BtnLoading height={40} />
      </div>
    );
  }

  const categoriasUnicas = expenses
    .map(e => e.categoria)
    .filter((cat, idx, arr) => cat && arr.findIndex(c => c?.id === cat?.id) === idx);

  return (
    <div className="min-h-screen bg-background mt-14 lg:mt-0">
      <ConfirmDeleteModal
        isOpen={!!deleteExpenseId}
        onClose={() => setDeleteExpenseId(null)}
        onConfirm={() => handleDeleteExpense(deleteExpenseId)}
        loading={deleteLoading}
        accionTitulo="eliminación"
        accion="Eliminar"
        pronombre="el"
        entidad="gasto"
        accionando="Eliminando"
        nombreElemento={expenses.find(e => e.id === deleteExpenseId)?.descripcion}
      />
      <EditExpenseModal
        isOpen={isEditDialogOpen}
        onClose={() => setIsEditDialogOpen(false)}
        onSave={handleEditExpense}
        editForm={editForm}
        setEditForm={setEditForm}
        loading={false}
        categorias={categoriasUnicas}
      />
      <main className="max-w-7xl mx-auto p-4 lg:p-6 space-y-4 lg:space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-xl lg:text-3xl font-bold text-foreground mb-1 lg:mb-2">
              Mis Gastos
            </h1>
            <p className="lg:text-base text-sm text-muted-foreground">
              Gestiona y revisa todos tus gastos
            </p>
          </div>
          <button 
            onClick={handleNewExpense}
            className="text-sm lg:text-base bg-primary text-primary-foreground px-2 text-center justify-center lg:px-4 py-2 w-1/2 md:w-fit rounded-lg hover:bg-primary/90 flex items-center gap-2 transition-colors"
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
            className="lg:text-base text-sm border border-border rounded-md px-2 py-1 bg-input text-foreground"
          >
            {months.map((m, idx) => (
              <option key={m} value={idx}>{m}</option>
            ))}
          </select>
          <select
            value={selectedYear}
            onChange={e => setSelectedYear(Number(e.target.value))}
            className="lg:text-base text-sm border border-border rounded-md px-2 py-1 bg-input text-foreground"
          >
            {[2023, 2024, 2025].map(y => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>

        {/* Filters and Search */}
        <div className="flex flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Buscar gastos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-8 pr-4 py-1 border border-border bg-input text-foreground rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          </div>
          <div className="flex gap-2">
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
            {isLg && (
              <>
                <button
                  onClick={() => setViewMode("cards")}
                  className={`px-3 py-1 rounded-md transition-colors ${viewMode === "cards" ? "bg-primary text-primary-foreground" : "bg-card text-primary border border-border"}`}
                >
                  Tarjetas
                </button>
                <button
                  onClick={() => setViewMode("table")}
                  className={`px-3 py-1 rounded-md transition-colors ${viewMode === "table" ? "bg-primary text-primary-foreground" : "bg-card text-primary border border-border"}`}
                >
                  Tabla
                </button>
              </>
            )}
          </div>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-card border border-border rounded-lg shadow-sm px-3 py-2">
            <div className="text-xl lg:text-2xl font-bold text-foreground">{filteredExpenses.length}</div>
            <p className="text-sm text-muted-foreground">Gastos encontrados</p>
          </div>
          <div className="bg-card border border-border rounded-lg shadow-sm px-3 py-2">
            <div className="text-xl lg:text-2xl font-bold text-foreground">${totalAmount.toFixed(2)}</div>
            <p className="text-sm text-muted-foreground">Total filtrado</p>
          </div>
          <div className="bg-card border border-border rounded-lg shadow-sm px-3 py-2">
            <div className="text-xl lg:text-2xl font-bold text-foreground">${averageAmount}</div>
            <p className="text-sm text-muted-foreground">Promedio por gasto</p>
          </div>
        </div>

        {/* Expenses List */}
        {viewMode === "cards" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredExpenses.map((expense) => (
              <div
                key={expense.id}
                className="bg-card border border-border rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground">{expense.descripcion}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <Calendar className="w-3 h-3 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">{formatDate(expense.fecha)}</span>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <button
                      className="p-1 text-muted-foreground hover:text-foreground transition-colors"
                      onClick={() => openEditDialog(expense)}
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      className="p-1 text-destructive/60 hover:text-destructive transition-colors"
                      onClick={() => setDeleteExpenseId(expense.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <div className='flex items-center gap-2'>
                    <span className="inline-block w-4 h-4 rounded-full border border-border"
                      style={{ backgroundColor: expense.categoria?.color || "#e5e7eb" }}
                      title={expense.categoria?.nombre}
                    />
                    <span className="rounded-full text-xs font-medium text-foreground">
                      {expense.categoria?.nombre}
                    </span>
                  </div>
                  <span className="text-lg font-bold text-foreground">
                    ${Number(expense.monto ?? 0).toFixed(2)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-card border border-border rounded-lg shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
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
                  {filteredExpenses.map((expense) => (
                    <tr key={expense.id} className="border-b border-border hover:bg-muted/50 transition-colors">
                      <td className="p-4 text-foreground">{expense.descripcion}</td>
                      <td className="p-4 flex items-center">
                        <span className="inline-block w-4 h-4 rounded-full border border-border"
                          style={{ backgroundColor: expense.categoria?.color || "#e5e7eb" }}
                          title={expense.categoria?.nombre}
                        />
                        <span className="px-2 py-1 rounded-full text-xs font-medium text-foreground">
                          {expense.categoria?.nombre}
                        </span>
                      </td>
                      <td className="p-4 text-muted-foreground">{formatDate(expense.fecha)}</td>
                      <td className="p-4 text-left font-semibold text-foreground">
                        ${Number(expense.monto ?? 0).toFixed(2)}
                      </td>
                      <td className="p-4 text-center">
                        <div className="flex justify-center gap-1">
                          <button
                            className="p-1 text-muted-foreground hover:text-foreground transition-colors"
                            onClick={() => openEditDialog(expense)}
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            className="p-1 text-destructive/60 hover:text-destructive transition-colors"
                            onClick={() => setDeleteExpenseId(expense.id)}
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
          </div>
        )}

        {filteredExpenses.length === 0 && (
          <div className="bg-card border border-border rounded-lg shadow-sm p-8 text-center items-center justify-center flex flex-col">
            <div className="text-muted-foreground mb-4"><BanknoteArrowDown size={52} strokeWidth={1.5} /></div>
            <h3 className="text-lg font-semibold text-foreground mb-2">No se encontraron gastos</h3>
            <p className="text-muted-foreground mb-4">Intenta ajustar los filtros o agregar un nuevo gasto</p>
            <button 
              onClick={handleNewExpense}
              className="bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 flex items-center gap-2 mx-auto transition-colors"
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