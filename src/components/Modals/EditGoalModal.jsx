import React from 'react';
import { X } from 'lucide-react';

export default function EditGoalModal({
  isOpen,
  onClose,
  onSave,
  newGoalName,
  setNewGoalName,
  newGoalTarget,
  setNewGoalTarget,
  newGoalDesc,
  setNewGoalDesc,
  newGoalDate,
  setNewGoalDate,
  newGoalPriority,
  setNewGoalPriority,
  newGoalEstado,
  setNewGoalEstado,
  loading,
  newGoalColor,
  setNewGoalColor,
  colorOptions
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-4 lg:p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-lg lg:text-xl font-semibold text-gray-900">Editar Objetivo</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="space-y-2">
          <div>
            <label className="block text-sm lg:text-base font-medium text-gray-700 ">
              Nombre del objetivo
            </label>
            <input
              type="text"
              value={newGoalName}
              onChange={e => setNewGoalName(e.target.value)}
              className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm lg:text-base font-medium text-gray-700 ">
              Monto objetivo
            </label>
            <input
              type="number"
              min="1"
              value={newGoalTarget}
              onChange={e => setNewGoalTarget(e.target.value)}
              className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm lg:text-base font-medium text-gray-700 ">
              Descripción
            </label>
            <input
              type="text"
              value={newGoalDesc}
              onChange={e => setNewGoalDesc(e.target.value)}
              className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm lg:text-base font-medium text-gray-700 ">
              Fecha límite
            </label>
            <input
              type="date"
              value={newGoalDate}
              onChange={e => setNewGoalDate(e.target.value)}
              className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm lg:text-base font-medium text-gray-700 ">
              Prioridad
            </label>
            <select
              value={newGoalPriority}
              onChange={e => setNewGoalPriority(e.target.value)}
              className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none"
            >
              <option value="Media">Media</option>
              <option value="Alta">Alta</option>
              <option value="Baja">Baja</option>
            </select>
          </div>
          <div>
            <label className="block text-sm lg:text-base font-medium text-gray-700 ">
              Estado
            </label>
            <select
              value={newGoalEstado}
              onChange={e => setNewGoalEstado(e.target.value)}
              className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none"
            >
              <option value="Activo">Activo</option>
              <option value="Inactivo">Inactivo</option>
            </select>
          </div>
          <div>
            <label className="block text-sm lg:text-base font-medium text-gray-700 mb-2">
              Color del objetivo
            </label>
            <div className="flex gap-2 flex-wrap">
              {colorOptions.map((color) => (
                <button
                  key={color}
                  className={`lg:w-8 lg:h-8 h-7 w-7 rounded-full border-2 ${newGoalColor === color ? "border-gray-900" : "border-gray-300"}`}
                  style={{ backgroundColor: color }}
                  onClick={() => setNewGoalColor(color)}
                  type="button"
                />
              ))}
            </div>
          </div>
        </div>
        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 px-1 lg:px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 lg:text-base text-sm"
          >
            Cancelar
          </button>
          <button
            onClick={onSave}
            disabled={!newGoalName.trim() || !newGoalTarget || newGoalTarget <= 0 || loading}
            className="flex-1 px-1 lg:px-4 py-2 bg-blue-900 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed lg:text-base text-sm"
          >
            Guardar Cambios
          </button>
        </div>
      </div>
    </div>
  );
}