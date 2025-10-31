import React from 'react';
import { X } from 'lucide-react';
import BtnLoading from '../BtnLoading';

export default function EditCategoryModal({
  isOpen,
  onClose,
  onSave,
  newCategoryName,
  setNewCategoryName,
  newCategoryType,
  setNewCategoryType,
  newCategoryColor,
  setNewCategoryColor,
  colorOptions,
  loading
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-card border border-border rounded-lg p-4 lg:p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-lg lg:text-xl font-semibold text-foreground">Editar Categoría</h2>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <p className="text-muted-foreground mb-4 text-sm lg:text-base">Modifica el nombre y color de la categoría</p>
        <div className="space-y-4">
          <div>
            <label className="block text-sm lg:text-base font-medium text-foreground">
              Nombre de la categoría
            </label>
            <input
              type="text"
              placeholder="Nombre de la categoría"
              value={newCategoryName}
              onChange={e => setNewCategoryName(e.target.value)}
              className="w-full px-2 py-1 border border-border bg-input text-foreground rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <div>
            <label className="block text-sm lg:text-base font-medium text-foreground">
              Tipo de categoría
            </label>
            <select
              value={newCategoryType}
              onChange={e => setNewCategoryType(e.target.value)}
              className="w-full px-2 py-1 border border-border bg-input text-foreground rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="gasto">Gasto</option>
              <option value="ingreso">Ingreso</option>
            </select>
          </div>
          <div>
            <label className="block text-sm lg:text-base font-medium text-foreground mb-2">
              Color de la categoría
            </label>
            <div className="flex gap-2 flex-wrap">
              {colorOptions.map((color) => (
                <button
                  key={color}
                  className={`lg:w-8 lg:h-8 h-7 w-7 rounded-full border-2 transition-colors ${newCategoryColor === color ? "border-primary ring-2 ring-ring" : "border-border"}`}
                  style={{ backgroundColor: color }}
                  onClick={() => setNewCategoryColor(color)}
                  type="button"
                />
              ))}
            </div>
          </div>
        </div>
        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 px-1 lg:px-4 py-2 border border-border rounded-md text-foreground hover:bg-muted transition-colors lg:text-base text-sm"
          >
            Cancelar
          </button>
          <button
            onClick={onSave}
            disabled={!newCategoryName.trim() || loading}
            className="flex-1 px-1 lg:px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-colors lg:text-base text-sm"
          >
            {loading ? <BtnLoading text="Guardando..." /> : "Guardar Cambios"}
          </button>
        </div>
      </div>
    </div>
  );
}