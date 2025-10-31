import React from 'react';
import { X, Save } from 'lucide-react';
import BtnLoading from '../BtnLoading';

export default function AddAmountModal({
  isOpen,
  onClose,
  onSave,
  goal,
  addAmount,
  setAddAmount,
  loading
}) {
  if (!isOpen || !goal) return null;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-card border border-border rounded-lg p-6 w-full max-w-xs">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-foreground">Agregar dinero</h2>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <p className="text-muted-foreground mb-2">
          ¿Cuánto quieres agregar a <span className="font-bold text-foreground">{goal.nombre}</span>?
        </p>
        <input
          type="number"
          min="1"
          value={addAmount}
          onChange={e => setAddAmount(e.target.value)}
          className="w-full px-3 py-2 border border-border bg-input text-foreground rounded-md focus:outline-none focus:ring-2 focus:ring-ring mb-4"
          placeholder="Monto"
        />
        <button
          onClick={onSave}
          disabled={!addAmount || addAmount <= 0 || loading}
          className="w-full bg-primary text-foreground py-2 px-4 rounded-md hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-colors"
        >
          <Save className="w-4 h-4" />
          {loading ? <BtnLoading text="Guardando..." /> : "Guardar"}
        </button>
      </div>
    </div>
  );
}