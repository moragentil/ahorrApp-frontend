import React from 'react';
import { X } from 'lucide-react';
import BtnLoading from '../BtnLoading';

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
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-card border border-border rounded-lg p-4 lg:p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-lg lg:text-xl font-semibold text-foreground">Editar Objetivo</h2>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="space-y-2">
          <div>
            <label className="block text-sm lg:text-base font-medium text-foreground">
              Nombre del objetivo
            </label>
            <input
              type="text"
              value={newGoalName}
              onChange={e => setNewGoalName(e.target.value)}
              className="w-full px-2 py-1 border border-border bg-input text-foreground rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <div>
            <label className="block text-sm lg:text-base font-medium text-foreground">
              Monto objetivo
            </label>
            <input
              type="number"
              min="1"
              value={newGoalTarget}
              onChange={e => setNewGoalTarget(e.target.value)}
              className="w-full px-2 py-1 border border-border bg-input text-foreground rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <div>
            <label className="block text-sm lg:text-base font-medium text-foreground">
              Descripción
            </label>
            <input
              type="text"
              value={newGoalDesc}
              onChange={e => setNewGoalDesc(e.target.value)}
              className="w-full px-2 py-1 border border-border bg-input text-foreground rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <div>
            <label className="block text-sm lg:text-base font-medium text-foreground">
              Fecha límite
            </label>
            <input
              type="date"
              value={newGoalDate}
              onChange={e => setNewGoalDate(e.target.value)}
              className="w-full px-2 py-1 border border-border bg-input text-foreground rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <div>
            <label className="block text-sm lg:text-base font-medium text-foreground">
              Prioridad
            </label>
            <select
              value={newGoalPriority}
              onChange={e => setNewGoalPriority(e.target.value)}
              className="w-full px-2 py-1 border border-border bg-input text-foreground rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="Media">Media</option>
              <option value="Alta">Alta</option>
              <option value="Baja">Baja</option>
            </select>
          </div>
          <div>
            <label className="block text-sm lg:text-base font-medium text-foreground">
              Estado
            </label>
            <select
              value={newGoalEstado}
              onChange={e => setNewGoalEstado(e.target.value)}
              className="w-full px-2 py-1 border border-border bg-input text-foreground rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="Activo">Activo</option>
              <option value="Inactivo">Inactivo</option>
            </select>
          </div>
          <div>
            <label className="block text-sm lg:text-base font-medium text-foreground mb-2">
              Color del objetivo
            </label>
            <div className="flex gap-2 flex-wrap">
              {colorOptions.map((color) => (
                <button
                  key={color}
                  className={`lg:w-8 lg:h-8 h-7 w-7 rounded-full border-2 transition-colors ${newGoalColor === color ? "border-primary ring-2 ring-ring" : "border-border"}`}
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
            className="flex-1 px-1 lg:px-4 py-2 border border-border rounded-md text-foreground hover:bg-muted transition-colors lg:text-base text-sm"
          >
            Cancelar
          </button>
          <button
            onClick={onSave}
            disabled={!newGoalName.trim() || !newGoalTarget || newGoalTarget <= 0 || loading}
            className="flex-1 px-1 lg:px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-colors lg:text-base text-sm"
          >
            {loading ? <BtnLoading text="Guardando..." /> : "Guardar Cambios"}
          </button>
        </div>
      </div>
    </div>
  );
}