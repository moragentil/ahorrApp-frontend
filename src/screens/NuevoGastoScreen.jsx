import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { DollarSign, FileText, Tag, Save, X, CalendarIcon } from 'lucide-react';
import { gastosService } from '../services/gastosService';
import { categoriasService } from '../services/categoriasService';
import BtnLoading from '../components/BtnLoading';
import AddCategoryModal from '../components/Modals/AddCategoryModal';

function NuevoGastoScreen({ user, onLogout }) {
  const navigate = useNavigate();
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState("");
  const [categorias, setCategorias] = useState([]);
  const [quickActions, setQuickActions] = useState([]);
  const [loadingQuick, setLoadingQuick] = useState(true);
  const [loadingSave, setLoadingSave] = useState(false);
  const [isAddCategoryOpen, setIsAddCategoryOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryType, setNewCategoryType] = useState('gasto');
  const [newCategoryColor, setNewCategoryColor] = useState('#3b82f6');
  const [loadingAddCategory, setLoadingAddCategory] = useState(false);

  const colorOptions = [
    "#3b82f6", "#10b981", "#8b5cf6", "#ef4444", "#f59e0b",
    "#06b6d4", "#ec4899", "#84cc16", "#f97316", "#6366f1",
  ];

  // Traer categorías del backend al montar el componente
  useEffect(() => {
    categoriasService.getGastoCategorias().then(setCategorias);
  }, []);

  // Traer acciones rápidas del backend
  useEffect(() => {
    setLoadingQuick(true);
    gastosService.getTopGastos().then(data => {
      setQuickActions(data);
      setLoadingQuick(false);
    });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoadingSave(true);
    const categoriaObj = categorias.find(c => c.nombre === category);
    if (!categoriaObj) {
      alert('Selecciona una categoría válida');
      setLoadingSave(false);
      return;
    }
    try {
      await gastosService.create({
        user_id: user.id,
        categoria_id: categoriaObj.id,
        descripcion: description,
        monto: parseFloat(amount),
        fecha: date,
      });
      navigate('/gastos');
    } catch (err) {
      alert('Error al guardar el gasto');
      setLoadingSave(false);
    }
  };

  const handleCancel = () => {
    navigate('/gastos');
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit', 
      year: 'numeric'
    });
  };

  const setQuickExpense = (quickExpense) => {
    setDescription(quickExpense.name);
    setAmount(quickExpense.amount);
    setCategory(quickExpense.category);
  };

  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) return;
    setLoadingAddCategory(true);
    console.log('Intentando crear categoría...');
    try {
      const nueva = await categoriasService.create({
        user_id: user.id,
        nombre: newCategoryName.trim(),
        tipo: newCategoryType,
        color: newCategoryColor,
      });
      console.log('Respuesta del backend:', nueva);
      setCategorias([...categorias, nueva]);
      setCategory(nueva.nombre);
      setIsAddCategoryOpen(false);
      setNewCategoryName('');
      setNewCategoryType('gasto');
      setNewCategoryColor('#3b82f6');
    } catch (err) {
      console.error('Error al crear la categoría:', err);
      alert('Error al crear la categoría');
    }
    setLoadingAddCategory(false);
  };

  return (
    <div className="min-h-screen bg-background mt-14 lg:mt-0">
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
      <main className="max-w-7xl mx-auto p-4 lg:p-6 space-y-4">
        {/* Header */}
        <div className="flex items-center">
          <div>
            <h1 className="text-xl lg:text-3xl font-bold text-foreground">Nuevo Gasto</h1>
            <p className="text-sm lg:text-base text-muted-foreground">Registra un nuevo gasto en tu presupuesto</p>
          </div>
        </div>

        {/* Form */}
        <div className="bg-card border border-border rounded-lg shadow-lg p-4 lg:p-6">
          <div className="mb-4">
            <h2 className="text-lg lg:text-xl font-semibold text-foreground flex items-center gap-2 mb-1">
              Detalles del Gasto
            </h2>
            <p className="text-sm lg:text-base text-muted-foreground">Completa la información del gasto que deseas registrar</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Amount */}
            <div>
              <label htmlFor="amount" className="block text-sm lg:text-base font-medium text-foreground">
                Monto *
              </label>
              <div className="relative">
                <DollarSign className="absolute left-2 top-3 h-4 w-4 text-muted-foreground" />
                <input
                  id="amount"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full pl-8 pr-2 py-1 h-10 text-lg border border-border bg-input text-foreground rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                  required
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm lg:text-base font-medium text-foreground">
                Descripción *
              </label>
              <div className="relative">
                <FileText className="absolute left-2 top-3 h-4 w-4 text-muted-foreground" />
                <input
                  id="description"
                  type="text"
                  placeholder="Ej: Supermercado, Gasolina, Cine..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full pl-8 pr-2 py-1 h-10 border border-border bg-input text-foreground rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                  required
                />
              </div>
            </div>

            {/* Category and Date Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Category */}
              <div>
                <label className="block text-sm lg:text-base font-medium text-foreground">Categoría *</label>
                <div className="relative">
                  <Tag className="absolute left-2 top-3 h-4 w-4 text-muted-foreground" />
                  <select
                    value={category}
                    onChange={e => {
                      if (e.target.value === "__add__") {
                        setIsAddCategoryOpen(true);
                      } else {
                        setCategory(e.target.value);
                      }
                    }}
                    className="w-full pl-8 pr-2 py-1 h-10 border border-border bg-input text-foreground rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                    required
                  >
                    <option value="">Selecciona una categoría</option>
                    {categorias.map((cat) => (
                      <option key={cat.id} value={cat.nombre}>{cat.nombre}</option>
                    ))}
                    <option value="__add__">+ Registrar nueva categoría</option>
                  </select>
                </div>
              </div>

              {/* Date */}
              <div>
                <label className="block text-sm lg:text-base font-medium text-foreground">Fecha *</label>
                <div className="relative">
                  <CalendarIcon className="absolute left-2 top-3 h-4 w-4 text-muted-foreground" />
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full pl-8 pr-2 py-1 h-10 border border-border bg-input text-foreground rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Preview */}
            {amount && description && category && (
              <div className="bg-muted/50 border-2 border-dashed border-border rounded-lg p-4">
                <h3 className="font-semibold text-foreground mb-2">Vista previa</h3>
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium text-foreground">{description}</p>
                    <p className="text-sm lg:text-base text-muted-foreground">
                      {category} • {formatDate(date)}
                    </p>
                  </div>
                  <span className="text-xl lg:text-2xl font-bold text-foreground">
                    ${parseFloat(amount || "0").toFixed(2)}
                  </span>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <button
                type="submit"
                disabled={!amount || !description || !category || loadingSave}
                className="flex-1 bg-primary text-primary-foreground py-2 px-4 rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 lg:text-base text-sm transition-colors"
              >
                <Save className="w-4 h-4" />
                {loadingSave ? <BtnLoading text="Guardando..." /> : "Guardar Gasto"}
              </button>
              <button 
                type="button" 
                onClick={handleCancel}
                className="flex-1 bg-muted text-foreground py-2 px-4 rounded-lg hover:bg-muted/80 lg:text-base text-sm transition-colors"
                disabled={loadingSave}
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>

        {/* Quick Actions */}
        <div className="bg-card border border-border rounded-lg shadow-sm p-4 lg:p-6">
          <h3 className="text-lg lg:text-xl font-semibold text-foreground mb-4">Acciones Rápidas</h3>
          {loadingQuick ? (
            <div className="flex justify-center items-center h-20">
              <BtnLoading text="Cargando..." />
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {quickActions.map((quick, index) => (
                <button
                  key={index}
                  onClick={() => setQuickExpense({
                    name: quick.descripcion,
                    amount: quick.total,
                    category: "",
                  })}
                  className="p-3 border border-border rounded-lg hover:bg-muted/50 flex flex-col items-start text-left transition-colors"
                >
                  <span className="font-medium text-foreground">{quick.descripcion}</span>
                  <span className="text-sm lg:text-base text-muted-foreground">${Number(quick.total).toLocaleString()}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default NuevoGastoScreen;