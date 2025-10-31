import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Tag, DollarSign, X } from 'lucide-react';
import { categoriasService } from '../services/categoriasService';
import BtnLoading from '../components/BtnLoading';
import AddCategoryModal from '../components/Modals/AddCategoryModal';
import EditCategoryModal from '../components/Modals/EditCategoryModal';
import ConfirmDeleteModal from '../components/Modals/ConfirmDeleteModal';

function CategoriasScreen({ user, onLogout }) {
  const [categories, setCategories] = useState([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategoryColor, setNewCategoryColor] = useState("#3b82f6");
  const [newCategoryType, setNewCategoryType] = useState("gasto");
  const [viewMode, setViewMode] = useState("cards");
  const [loading, setLoading] = useState(true);
  const [deleteCategoryId, setDeleteCategoryId] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [isMd, setIsMd] = useState(window.innerWidth >= 768);

  const colorOptions = [
    "#3b82f6", "#10b981", "#8b5cf6", "#ef4444", "#f59e0b",
    "#06b6d4", "#ec4899", "#84cc16", "#f97316", "#6366f1",
  ];

  useEffect(() => {
    categoriasService.getResumen().then(data => {
      setCategories(data.map(cat => ({
        id: cat.id,
        nombre: cat.nombre,
        tipo: cat.tipo,
        color: cat.color,
        totalSpent: cat.total_gastado,
        transactionCount: cat.total_transacciones,
      })));
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    const handleResize = () => setIsMd(window.innerWidth >= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
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
    setDeleteLoading(true);
    await categoriasService.delete(id);
    setCategories(categories.filter(cat => cat.id !== id));
    setDeleteLoading(false);
    setDeleteCategoryId(null);
  };

  const openEditDialog = (category) => {
    setEditingCategory(category);
    setNewCategoryName(category.nombre);
    setNewCategoryColor(category.color);
    setNewCategoryType(category.tipo || "gasto");
    setIsEditDialogOpen(true);
  };

  const totalSpent = categories
    .filter(cat => cat.tipo === "gasto")
    .reduce((sum, cat) => sum + Number(cat.totalSpent ?? 0), 0);

  const totalIngresado = categories
    .filter(cat => cat.tipo === "ingreso")
    .reduce((sum, cat) => sum + Number(cat.totalSpent ?? 0), 0);

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
        isOpen={!!deleteCategoryId}
        onClose={() => setDeleteCategoryId(null)}
        onConfirm={() => handleDeleteCategory(deleteCategoryId)}
        loading={deleteLoading}
        accionTitulo="eliminación"
        accion="Eliminar"
        pronombre="la"
        entidad="categoría"
        accionando="Eliminando"
        nombreElemento={categories.find(cat => cat.id === deleteCategoryId)?.nombre}
      />
      <AddCategoryModal
        isOpen={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
        onSave={handleAddCategory}
        newCategoryName={newCategoryName}
        setNewCategoryName={setNewCategoryName}
        newCategoryType={newCategoryType}
        setNewCategoryType={setNewCategoryType}
        newCategoryColor={newCategoryColor}
        setNewCategoryColor={setNewCategoryColor}
        colorOptions={colorOptions}
        loading={false}
      />
      <EditCategoryModal
        isOpen={isEditDialogOpen}
        onClose={() => setIsEditDialogOpen(false)}
        onSave={handleEditCategory}
        newCategoryName={newCategoryName}
        setNewCategoryName={setNewCategoryName}
        newCategoryType={newCategoryType}
        setNewCategoryType={setNewCategoryType}
        newCategoryColor={newCategoryColor}
        setNewCategoryColor={setNewCategoryColor}
        colorOptions={colorOptions}
        loading={false}
      />
      <main className="max-w-7xl mx-auto p-4 lg:p-6 space-y-4 lg:space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-xl lg:text-3xl font-bold text-foreground mb-1 lg:mb-2">Gestión de Categorías</h1>
            <p className="text-sm lg:text-base text-muted-foreground">Organiza y personaliza tus categorías de gastos e ingresos</p>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={() => setIsAddDialogOpen(true)}
              className="text-sm lg:text-base bg-primary text-primary-foreground px-2 lg:px-4 py-2 rounded-lg hover:bg-primary/90 flex items-center gap-2 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Nueva Categoría
            </button>
            {isMd && (
              <>
                <button
                  onClick={() => setViewMode("cards")}
                  className={`text-sm lg:text-base px-3 lg:px-4 py-2 rounded-md transition-colors ${viewMode === "cards" ? "bg-primary text-primary-foreground" : "bg-card text-primary border border-border"}`}
                >
                  Tarjetas
                </button>
                <button
                  onClick={() => setViewMode("table")}
                  className={`text-sm lg:text-base px-3 lg:px-4 py-2 rounded-md transition-colors ${viewMode === "table" ? "bg-primary text-primary-foreground" : "bg-card text-primary border border-border"}`}
                >
                  Tabla
                </button>
              </>
            )}
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 lg:gap-4">
          <div className="bg-card border border-border rounded-lg shadow-sm px-3 py-2">
            <div className="text-xl lg:text-2xl font-bold text-primary">{categories.length}</div>
            <p className="text-sm lg:text-base text-muted-foreground">Categorías activas</p>
          </div>
          <div className="bg-card border border-border rounded-lg shadow-sm px-3 py-2">
            <div className="text-xl lg:text-2xl font-bold text-primary">
              ${Number(totalSpent).toFixed(2)}
            </div>
            <p className="text-sm lg:text-base text-muted-foreground">Total gastado</p>
          </div>
          <div className="bg-card border border-border rounded-lg shadow-sm px-3 py-2">
            <div className="text-xl lg:text-2xl font-bold text-primary">
              ${Number(totalIngresado).toFixed(2)}
            </div>
            <p className="text-sm lg:text-base text-muted-foreground">Total ingresado</p>
          </div>
        </div>

        {/* Categories List */}
        {(viewMode === "cards" || !isMd) ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
            {categories.map((category) => {
              let percent = 0;
              if (category.tipo === "gasto" && totalSpent > 0) {
                percent = (category.totalSpent / totalSpent) * 100;
              } else if (category.tipo === "ingreso" && totalIngresado > 0) {
                percent = (category.totalSpent / totalIngresado) * 100;
              }

              return (
                <div
                  key={category.id}
                  className="bg-card border border-border rounded-lg shadow-sm hover:shadow-md transition-shadow p-4 lg:p-6"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: category.color }}
                      />
                      <h3 className="text-lg font-semibold text-foreground">{category.nombre}</h3>
                      <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${category.tipo === "ingreso" ? "bg-success/20 text-success" : "bg-destructive/20 text-destructive"}`}>
                        {category.tipo === "ingreso" ? "Ingreso" : "Gasto"}
                      </span>
                    </div>
                    <div className="flex gap-1">
                      <button 
                        onClick={() => openEditDialog(category)}
                        className="p-1 text-muted-foreground hover:text-foreground"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => setDeleteCategoryId(category.id)}
                        className="p-1 text-destructive/60 hover:text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm lg:text-base text-muted-foreground">
                          {category.tipo === "ingreso" ? "Total ingresado" : "Total gastado"}
                        </span>
                      </div>
                      <span className="font-bold text-foreground">
                        ${Number(category.totalSpent ?? 0).toFixed(2)}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Tag className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm lg:text-base text-muted-foreground">Transacciones</span>
                      </div>
                      <span className="bg-muted text-foreground px-2 py-1 rounded-full text-xs font-medium">
                        {category.transactionCount ?? 0}
                      </span>
                    </div>
                    
                    <div className="w-full bg-muted rounded-full h-2">
                      <div
                        className="h-2 rounded-full transition-all duration-300"
                        style={{
                          backgroundColor: category.color,
                          width: `${Math.min(percent, 100)}%`,
                        }}
                      />
                    </div>
                    
                    <p className="text-xs lg:text-sm text-muted-foreground text-center">
                      {percent.toFixed(1)}% del total
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-card border border-border rounded-lg shadow-sm overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted border-b border-border">
                <tr>
                  <th className="text-left p-4 font-semibold text-foreground">Nombre</th>
                  <th className="text-left p-4 font-semibold text-foreground">Tipo</th>
                  <th className="text-left p-4 font-semibold text-foreground">Color</th>
                  <th className="text-left p-4 font-semibold text-foreground">Total gastado</th>
                  <th className="text-center p-4 font-semibold text-foreground">Transacciones</th>
                  <th className="text-center p-4 font-semibold text-foreground">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((category) => (
                  <tr key={category.id} className="border-b border-border hover:bg-muted/50">
                    <td className="p-4 text-foreground">{category.nombre}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${category.tipo === "ingreso" ? "bg-success/20 text-success" : "bg-destructive/20 text-destructive"}`}>
                        {category.tipo === "ingreso" ? "Ingreso" : "Gasto"}
                      </span>
                    </td>
                    <td className="p-4">
                      <span
                        className="inline-block w-4 h-4 rounded-full border border-border"
                        style={{ backgroundColor: category.color }}
                        title={category.color}
                      />
                    </td>
                    <td className="p-4 text-left font-semibold text-foreground">
                      ${Number(category.totalSpent ?? 0).toFixed(2)}
                    </td>
                    <td className="p-4 text-center">
                      <span className="bg-muted text-foreground px-2 py-1 rounded-full text-xs font-medium">
                        {category.transactionCount}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      <div className="flex justify-center gap-1">
                        <button
                          onClick={() => openEditDialog(category)}
                          className="p-1 text-muted-foreground hover:text-foreground"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteCategoryId(category.id)}
                          className="p-1 text-destructive/60 hover:text-destructive"
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
          <div className="bg-card border border-border rounded-lg shadow-sm p-8 text-center">
            <div className="text-6xl mb-4">🏷️</div>
            <h3 className="text-lg font-semibold text-foreground mb-2">No hay categorías</h3>
            <p className="text-muted-foreground mb-4">
              Crea tu primera categoría para comenzar a organizar tus gastos e ingresos
            </p>
            <button 
              onClick={() => setIsAddDialogOpen(true)}
              className="bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 flex items-center gap-2 mx-auto transition-colors"
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