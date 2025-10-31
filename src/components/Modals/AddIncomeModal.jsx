import React from 'react';
import { X } from 'lucide-react';
import BtnLoading from '../BtnLoading';

export default function AddIncomeModal({
  isOpen,
  onClose,
  onSave,
  form,
  setForm,
  categoriasIngreso,
  loading,
  onAddCategory,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-card border border-border rounded-lg p-4 lg:p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-lg lg:text-xl font-semibold text-foreground">Nuevo Ingreso</h2>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <p className="text-muted-foreground mb-4 text-sm lg:text-base">Agrega un nuevo ingreso</p>
        <div className="space-y-2">
          <div>
            <label className="block text-sm lg:text-base font-medium text-foreground">
              Categoría
            </label>
            <select
              value={form.categoria_id}
              onChange={e => {
                if (e.target.value === "__add__") {
                  onAddCategory?.();
                } else {
                  setForm(f => ({ ...f, categoria_id: e.target.value }));
                }
              }}
              className="w-full px-2 py-1 border border-border bg-input text-foreground rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="">Selecciona una categoría</option>
              {categoriasIngreso.map(cat => (
                <option key={cat.id} value={cat.id}>
                  {cat.nombre}
                </option>
              ))}
              <option value="__add__">+ Registrar nueva categoría</option>
            </select>
          </div>
          <div>
            <label className="block text-sm lg:text-base font-medium text-foreground">
              Descripción
            </label>
            <input
              type="text"
              value={form.descripcion}
              onChange={e => setForm(f => ({ ...f, descripcion: e.target.value }))}
              className="w-full px-2 py-1 border border-border bg-input text-foreground rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <div>
            <label className="block text-sm lg:text-base font-medium text-foreground">
              Monto
            </label>
            <input
              type="number"
              min="0"
              value={form.monto}
              onChange={e => setForm(f => ({ ...f, monto: e.target.value }))}
              className="w-full px-2 py-1 border border-border bg-input text-foreground rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <div>
            <label className="block text-sm lg:text-base font-medium text-foreground">
              Fecha
            </label>
            <input
              type="date"
              value={form.fecha}
              onChange={e => setForm(f => ({ ...f, fecha: e.target.value }))}
              className="w-full px-2 py-1 border border-border bg-input text-foreground rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
        </div>
        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            className="lg:text-base text-sm flex-1 px-1 py-2 border border-border rounded-md text-foreground hover:bg-muted transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={onSave}
            disabled={
              !form.categoria_id ||
              !form.descripcion.trim() ||
              !form.monto ||
              !form.fecha ||
              loading
            }
            className="lg:text-base text-sm flex-1 px-2 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-colors"
          >
            {loading ? <BtnLoading text="Guardando..." /> : "Guardar Ingreso"}
          </button>
        </div>
      </div>
    </div>
  );
}