import React from 'react';
import { X } from 'lucide-react';

export default function AddCategoryModal({
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-xl font-semibold text-gray-900">Crear Nueva Categoría</h2>
          <button
            onClick={onClose}
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
              onChange={e => setNewCategoryName(e.target.value)}
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
                  className={`w-8 h-8 rounded-full border-2 ${newCategoryColor === color ? "border-gray-900" : "border-gray-300"}`}
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
            className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Cancelar
          </button>
          <button
            onClick={onSave}
            disabled={!newCategoryName.trim() || loading}
            className="flex-1 px-4 py-2 bg-blue-900 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Crear Categoría
          </button>
        </div>
      </div>
    </div>
  );
}