import React from 'react';
import { AlertTriangle } from 'lucide-react';
import BtnLoading from '../BtnLoading';

export default function ConfirmDeleteModal({
  isOpen,
  onClose,
  onConfirm,
  loading,
  accionTitulo,
  accion,
  pronombre,
  entidad,
  accionando,
  nombreElemento,
  advertencia
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/70 z-50 p-4">
      <div className="bg-card border border-border p-4 lg:p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-lg lg:text-xl font-semibold text-foreground mb-2">
          Confirmar {accionTitulo}
        </h2>
        <p className="text-muted-foreground mb-2 text-sm lg:text-base">
          ¿Estás seguro de que deseas {accion} {pronombre} {entidad}
          {nombreElemento !== undefined ? ':' : '?'}
        </p>
        {nombreElemento !== undefined && (
          <div className="font-semibold mb-2 text-center text-foreground bg-muted px-3 py-2 rounded-lg border border-border text-sm lg:text-base">
            "{nombreElemento}"
          </div>
        )}
        <p className="text-primary text-sm lg:text-base">Esta acción no se puede deshacer.</p>
        {advertencia !== undefined && (
          <div className="mt-2 w-full bg-primary/10 border-l-primary border-l-2 p-2 rounded-md mb-4 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-primary flex-shrink-0" />
            <p className="text-sm lg:text-base text-primary">{advertencia}</p>
          </div>
        )}
        <div className="flex mt-6 justify-end gap-3">
          <button
            onClick={onClose}
            className="lg:text-base text-sm px-3 py-2 bg-muted text-foreground rounded hover:bg-muted/80 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className={`lg:text-base text-sm px-3 py-2 capitalize text-foreground rounded flex items-center justify-center gap-2 transition-colors ${
              loading ? 'bg-primary/50 cursor-not-allowed' : 'bg-primary hover:bg-primary/90'
            }`}
          >
            {loading ? <BtnLoading text={`${accionando}...`} /> : `${accion}`}
          </button>
        </div>
      </div>
    </div>
  );
}