import React from 'react';
import { X } from 'lucide-react';

export default function EditExpenseModal({
  isOpen,
  onClose,
  onSave,
  editForm,
  setEditForm,
  loading,
  categorias
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-4 lg:p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-lg lg:text-xl font-semibold text-gray-900">Editar Gasto</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <p className="text-gray-600 mb-4 text-sm lg:text-base">Modifica los datos del gasto</p>
        <div className="space-y-2">
          <div>
            <label className="block text-sm lg:text-base font-medium text-gray-700 ">
              Categoría
            </label>
            <select
              value={editForm.categoria_id}
              onChange={e => setEditForm(f => ({ ...f, categoria_id: e.target.value }))}
              className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none"
            >
              <option value="">Selecciona una categoría</option>
              {categorias.map(cat => (
                <option key={cat.id} value={cat.id}>
                  {cat.nombre}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm lg:text-base font-medium text-gray-700 ">
              Descripción
            </label>
            <input
              type="text"
              value={editForm.descripcion}
              onChange={e => setEditForm(f => ({ ...f, descripcion: e.target.value }))}
              className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm lg:text-base font-medium text-gray-700 ">
              Monto
            </label>
            <input
              type="number"
              min="0"
              value={editForm.monto}
              onChange={e => setEditForm(f => ({ ...f, monto: e.target.value }))}
              className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm lg:text-base font-medium text-gray-700 ">
              Fecha
            </label>
            <input
              type="date"
              value={editForm.fecha}
              onChange={e => setEditForm(f => ({ ...f, fecha: e.target.value }))}
              className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none"
            />
          </div>
        </div>
        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            className="lg:text-base text-sm flex-1 px-1 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Cancelar
          </button>
          <button
            onClick={onSave}
            disabled={
              !editForm.categoria_id ||
              !editForm.descripcion.trim() ||
              !editForm.monto ||
              !editForm.fecha ||
              loading
            }
            className="lg:text-base text-sm  flex-1 px-2 py-2 bg-blue-900 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Guardar Cambios
          </button>
        </div>
      </div>
    </div>
  );
}