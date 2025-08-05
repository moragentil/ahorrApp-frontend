import React from 'react';
import { X } from 'lucide-react';
import BtnLoading from '../BtnLoading';

export default function AddGoalModal({
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
  loading
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90%] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Nuevo Objetivo de Ahorro</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="space-y-2">
          <div>
            <label className="block text-sm font-medium text-gray-700 ">
              Nombre del objetivo
            </label>
            <input
              type="text"
              placeholder="Ej: Viaje, Auto, Fondo Emergencia..."
              value={newGoalName}
              onChange={e => setNewGoalName(e.target.value)}
              className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 ">
              Monto objetivo
            </label>
            <input
              type="number"
              min="1"
              placeholder="Ej: 5000"
              value={newGoalTarget}
              onChange={e => setNewGoalTarget(e.target.value)}
              className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 ">
              Descripción
            </label>
            <input
              type="text"
              placeholder="Opcional"
              value={newGoalDesc}
              onChange={e => setNewGoalDesc(e.target.value)}
              className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 ">
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
            <label className="block text-sm font-medium text-gray-700 ">
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
            <label className="block text-sm font-medium text-gray-700 ">
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
            disabled={!newGoalName.trim() || !newGoalTarget || newGoalTarget <= 0 || loading}
            className="flex-1 px-4 py-2 bg-blue-900 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? <BtnLoading text="Creando..." /> : "Crear Objetivo"}
          </button>
        </div>
      </div>
    </div>
  );
}