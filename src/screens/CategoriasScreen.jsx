import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Tag, DollarSign, X } from 'lucide-react';
import { categoriasService } from '../services/categoriasService';

function CategoriasScreen({ user, onLogout }) {
  const [categories, setCategories] = useState([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategoryColor, setNewCategoryColor] = useState("#3b82f6");
  const [newCategoryType, setNewCategoryType] = useState("gasto"); // Nuevo estado para tipo
  const [viewMode, setViewMode] = useState("cards");

  const colorOptions = [
    "#3b82f6", "#10b981", "#8b5cf6", "#ef4444", "#f59e0b",
    "#06b6d4", "#ec4899", "#84cc16", "#f97316", "#6366f1",
  ];

  useEffect(() => {
    categoriasService.getResumen().then(data => {
      // Mapea los datos del backend al formato esperado por la UI
      setCategories(data.map(cat => ({
        id: cat.id,
        nombre: cat.nombre,
        tipo: cat.tipo,
        color: cat.color,
        totalSpent: cat.total_gastado,         // <-- usa el campo del backend
        transactionCount: cat.total_transacciones, // <-- usa el campo del backend
      })));
    });
  }, []);

  const handleAddCategory = async () => {
    if (newCategoryName.trim()) {
      const newCategory = {
        id: Math.max(...categories.map((c) => c.id)) + 1,
        nombre: newCategoryName.trim(),
        tipo: newCategoryType,
        color: newCategoryColor,
        totalSpent: 0,
        transactionCount: 0,
      };
      setCategories([...categories, newCategory]);
      setNewCategoryName("");
      setNewCategoryColor("#3b82f6");
      setNewCategoryType("gasto");
      setIsAddDialogOpen(false);

      await categoriasService.create({
        user_id: user.id,
        nombre: newCategoryName,
        tipo: newCategoryType,
        color: newCategoryColor
      });
    }
  };

  const handleEditCategory = async () => {
    if (editingCategory && newCategoryName.trim()) {
      setCategories(
        categories.map((cat) =>
          cat.id === editingCategory.id
            ? { ...cat, nombre: newCategoryName.trim(), tipo: newCategoryType, color: newCategoryColor }
            : cat
        )
      );
      setIsEditDialogOpen(false);
      setEditingCategory(null);
      setNewCategoryName("");
      setNewCategoryColor("#3b82f6");
      setNewCategoryType("gasto");

      await categoriasService.update(editingCategory.id, {
        nombre: newCategoryName,
        tipo: newCategoryType,
        color: newCategoryColor
      });
    }
  };

  const handleDeleteCategory = async (id) => {
    setCategories(categories.filter((cat) => cat.id !== id));
    await categoriasService.delete(id);
  };

  const openEditDialog = (category) => {
    setEditingCategory(category);
    setNewCategoryName(category.nombre);
    setNewCategoryColor(category.color);
    setNewCategoryType(category.tipo || "gasto");
    setIsEditDialogOpen(true);
  };

  // Calcula el total gastado solo para categorías de tipo "gasto"
  const totalSpent = categories
    .filter(cat => cat.tipo === "gasto")
    .reduce((sum, cat) => sum + Number(cat.totalSpent ?? 0), 0);

  // Calcula el total ingresado solo para categorías de tipo "ingreso"
  const totalIngresado = categories
    .filter(cat => cat.tipo === "ingreso")
    .reduce((sum, cat) => sum + Number(cat.totalSpent ?? 0), 0);

  return (
    <div className="min-h-screen bg-gray-100">
       {/* Add Category Modal */}
        {isAddDialogOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-xl font-semibold text-gray-900">Crear Nueva Categoría</h2>
                <button 
                  onClick={() => setIsAddDialogOpen(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <p className="text-gray-600 text-sm mb-4">Agrega una nueva categoría para organizar mejor tus gastos</p>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 ">
                    Nombre de la categoría
                  </label>
                  <input
                    type="text"
                    placeholder="Ej: Mascotas, Viajes, etc."
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 ">
                    Tipo de categoría
                  </label>
                  <select
                    value={newCategoryType}
                    onChange={e => setNewCategoryType(e.target.value)}
                    className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none"
                  >
                    <option value="gasto">Gasto</option>
                    <option value="ingreso">Ingreso</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Color de la categoría
                  </label>
                  <div className="flex gap-2 flex-wrap">
                    {colorOptions.map((color) => (
                      <button
                        key={color}
                        className={`w-8 h-8 rounded-full border-2 ${
                          newCategoryColor === color ? "border-gray-900" : "border-gray-300"
                        }`}
                        style={{ backgroundColor: color }}
                        onClick={() => setNewCategoryColor(color)}
                      />
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setIsAddDialogOpen(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleAddCategory}
                  disabled={!newCategoryName.trim()}
                  className="flex-1 px-4 py-2 bg-blue-900 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Crear Categoría
                </button>
              </div>
            </div>
          </div>
        )}
        {/* Edit Category Modal */}
        {isEditDialogOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-xl font-semibold text-gray-900">Editar Categoría</h2>
                <button 
                  onClick={() => setIsEditDialogOpen(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <p className="text-gray-600 mb-4 text-sm">Modifica el nombre y color de la categoría</p>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 ">
                    Nombre de la categoría
                  </label>
                  <input
                    type="text"
                    placeholder="Nombre de la categoría"
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 ">
                    Tipo de categoría
                  </label>
                  <select
                    value={newCategoryType}
                    onChange={e => setNewCategoryType(e.target.value)}
                    className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none"
                  >
                    <option value="gasto">Gasto</option>
                    <option value="ingreso">Ingreso</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Color de la categoría
                  </label>
                  <div className="flex gap-2 flex-wrap">
                    {colorOptions.map((color) => (
                      <button
                        key={color}
                        className={`w-8 h-8 rounded-full border-2 ${
                          newCategoryColor === color ? "border-gray-900" : "border-gray-300"
                        }`}
                        style={{ backgroundColor: color }}
                        onClick={() => setNewCategoryColor(color)}
                      />
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setIsEditDialogOpen(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleEditCategory}
                  disabled={!newCategoryName.trim()}
                  className="flex-1 px-4 py-2 bg-blue-900 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Guardar Cambios
                </button>
              </div>
            </div>
          </div>
        )}
      <main className="max-w-7xl mx-auto p-4 lg:p-6 space-y-4">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Gestión de Categorías</h1>
            <p className="text-gray-600">Organiza y personaliza tus categorías de gastos</p>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={() => setIsAddDialogOpen(true)}
              className="bg-blue-900 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Nueva Categoría
            </button>
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

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg shadow-sm px-3 py-2">
            <div className="text-2xl font-bold text-blue-900">{categories.length}</div>
            <p className="text-sm text-gray-700">Categorías activas</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm px-3 py-2">
            <div className="text-2xl font-bold text-blue-900">
              ${Number(totalSpent).toFixed(2)}
            </div>
            <p className="text-sm text-gray-700">Total gastado</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm px-3 py-2">
            <div className="text-2xl font-bold text-blue-900">
              ${Number(totalIngresado).toFixed(2)}
            </div>
            <p className="text-sm text-gray-700">Total ingresado</p>
          </div>
        </div>

        {/* Categories List */}
        {viewMode === "cards" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category) => {
              // Calcula el porcentaje para la barra según el tipo
              let percent = 0;
              if (category.tipo === "gasto" && totalSpent > 0) {
                percent = (category.totalSpent / totalSpent) * 100;
              } else if (category.tipo === "ingreso" && totalIngresado > 0) {
                percent = (category.totalSpent / totalIngresado) * 100;
              }

              return (
                <div
                  key={category.id}
                  className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-6"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: category.color }}
                      />
                      <h3 className="text-lg font-semibold text-gray-900">{category.nombre}</h3>
                      <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${category.tipo === "ingreso" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                        {category.tipo === "ingreso" ? "Ingreso" : "Gasto"}
                      </span>
                    </div>
                    <div className="flex gap-1">
                      <button 
                        onClick={() => openEditDialog(category)}
                        className="p-1 text-gray-400 hover:text-gray-600"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDeleteCategory(category.id)}
                        className="p-1 text-red-400 hover:text-red-600"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-600">
                          {category.tipo === "ingreso" ? "Total ingresado" : "Total gastado"}
                        </span>
                      </div>
                      <span className="font-bold text-gray-900">
                        ${Number(category.totalSpent ?? 0).toFixed(2)}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Tag className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-600">Transacciones</span>
                      </div>
                      <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs font-medium">
                        {category.transactionCount ?? 0}
                      </span>
                    </div>
                    
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="h-2 rounded-full transition-all duration-300"
                        style={{
                          backgroundColor: category.color,
                          width: `${Math.min(percent, 100)}%`,
                        }}
                      />
                    </div>
                    
                    <p className="text-xs text-gray-600 text-center">
                      {percent.toFixed(1)}% del total
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left p-4 font-semibold text-gray-900">Nombre</th>
                  <th className="text-left p-4 font-semibold text-gray-900">Tipo</th>
                  <th className="text-left p-4 font-semibold text-gray-900">Color</th>
                  <th className="text-right p-4 font-semibold text-gray-900">Total gastado</th>
                  <th className="text-center p-4 font-semibold text-gray-900">Transacciones</th>
                  <th className="text-center p-4 font-semibold text-gray-900">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((category) => (
                  <tr key={category.id} className="border-b hover:bg-gray-50">
                    <td className="p-4 text-gray-900">{category.nombre}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${category.tipo === "ingreso" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                        {category.tipo === "ingreso" ? "Ingreso" : "Gasto"}
                      </span>
                    </td>
                    <td className="p-4">
                      <span
                        className="inline-block w-4 h-4 rounded-full border border-gray-300"
                        style={{ backgroundColor: category.color }}
                        title={category.color}
                      />
                    </td>
                    <td className="p-4 text-right font-semibold text-gray-900">
                      ${Number(category.totalSpent ?? 0).toFixed(2)}
                    </td>
                    <td className="p-4 text-center">
                      <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs font-medium">
                        {category.transactionCount}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      <div className="flex justify-center gap-1">
                        <button
                          onClick={() => openEditDialog(category)}
                          className="p-1 text-gray-400 hover:text-gray-600"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteCategory(category.id)}
                          className="p-1 text-red-400 hover:text-red-600"
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
        {categories.length === 0 && (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <div className="text-6xl mb-4">🏷️</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No hay categorías</h3>
            <p className="text-gray-600 mb-4">
              Crea tu primera categoría para comenzar a organizar tus gastos
            </p>
            <button 
              onClick={() => setIsAddDialogOpen(true)}
              className="bg-blue-900 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2 mx-auto"
            >
              <Plus className="w-4 h-4" />
              Crear Primera Categoría
            </button>
          </div>
        )}

       

        
      </main>
    </div>
  );
}

export default CategoriasScreen;