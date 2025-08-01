import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { DollarSign, FileText, Tag, Save, X, CalendarIcon } from 'lucide-react';
import { gastosService } from '../services/gastosService';
import { categoriasService } from '../services/categoriasService'; // Importa el servicio


function NuevoGastoScreen({ user, onLogout }) {
  const navigate = useNavigate();
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState("");
  const [categorias, setCategorias] = useState([]);

  // Traer categorías del backend al montar el componente
  useEffect(() => {
    categoriasService.getAll().then(setCategorias);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const categoriaObj = categorias.find(c => c.nombre === category);
    if (!categoriaObj) {
      alert('Selecciona una categoría válida');
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

  return (
    <div className="min-h-screen bg-gray-100">

      <main className=" max-w-7xl mx-auto p-4 lg:p-6 space-y-4">
        {/* Header */}
        <div className="flex items-center ">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Nuevo Gasto</h1>
            <p className="text-gray-600">Registra un nuevo gasto en tu presupuesto</p>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="mb-4">
            <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2 mb-1">
              Detalles del Gasto
            </h2>
            <p className="text-gray-600">Completa la información del gasto que deseas registrar</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Amount */}
            <div className="">
              <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
                Monto *
              </label>
              <div className="relative">
                <DollarSign className="absolute left-2 top-3 h-4 w-4 text-gray-400" />
                <input
                  id="amount"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full pl-8 pr-2 py-1 h-10 text-lg border border-gray-300 rounded-md focus:outline-none "
                  required
                />
              </div>
            </div>

            {/* Description */}
            <div className="">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Descripción *
              </label>
              <div className="relative">
                <FileText className="absolute left-2 top-3 h-4 w-4 text-gray-400" />
                <input
                  id="description"
                  type="text"
                  placeholder="Ej: Supermercado, Gasolina, Cine..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full pl-8 pr-2 py-1 h-10 border border-gray-300 rounded-md focus:outline-none "
                  required
                />
              </div>
            </div>

            {/* Category and Date Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Category */}
              <div className="">
                <label className="block text-sm font-medium text-gray-700">Categoría *</label>
                <div className="relative">
                  <Tag className="absolute left-2 top-3 h-4 w-4 text-gray-400" />
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full pl-8 pr-2 py-1 h-10 border border-gray-300 rounded-md focus:outline-none "
                    required
                  >
                    <option value="">Selecciona una categoría</option>
                    {categorias.map((cat) => (
                      <option key={cat.id} value={cat.nombre}>{cat.nombre}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Date */}
              <div className="">
                <label className="block text-sm font-medium text-gray-700">Fecha *</label>
                <div className="relative">
                  <CalendarIcon className="absolute left-2 top-3 h-4 w-4 text-gray-400" />
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full pl-8 pr-2 py-1 h-10 border border-gray-300 rounded-md focus:outline-none "
                    required
                  />
                </div>
              </div>
            </div>

            {/* Notes */}
            <div className="">
              <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
                Notas adicionales
              </label>
              <textarea
                id="notes"
                placeholder="Información adicional sobre este gasto (opcional)"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none min-h-20 resize-none"
                rows="3"
              />
            </div>

            {/* Preview */}
            {amount && description && category && (
              <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-2">Vista previa</h3>
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium text-gray-900">{description}</p>
                    <p className="text-sm text-gray-600">
                      {category} • {formatDate(date)}
                    </p>
                  </div>
                  <span className="text-xl font-bold text-gray-900">
                    ${parseFloat(amount || "0").toFixed(2)}
                  </span>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <button
                type="submit"
                disabled={!amount || !description || !category}
                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <Save className="w-4 h-4" />
                Guardar Gasto
              </button>
              <button 
                type="button" 
                onClick={handleCancel}
                className="flex-1 bg-gray-200 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-300"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Acciones Rápidas</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { name: "Supermercado", amount: "50.00", category: "Alimentación" },
              { name: "Gasolina", amount: "40.00", category: "Transporte" },
              { name: "Café", amount: "5.00", category: "Alimentación" },
              { name: "Parking", amount: "3.00", category: "Transporte" },
            ].map((quick, index) => (
              <button
                key={index}
                onClick={() => setQuickExpense(quick)}
                className="p-3 border border-gray-300 rounded-lg hover:bg-gray-50 flex flex-col items-start text-left"
              >
                <span className="font-medium text-gray-900">{quick.name}</span>
                <span className="text-sm text-gray-600">${quick.amount}</span>
              </button>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

export default NuevoGastoScreen;