import { X } from 'lucide-react';

export default function GastoDetalleModal({ isOpen, onClose, gasto }) {
  if (!isOpen || !gasto) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-card rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-card border-b border-border p-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-foreground">Detalle del Gasto</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-muted rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-foreground" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Información principal */}
          <div className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Descripción</p>
              <p className="text-lg font-semibold text-foreground">{gasto.descripcion}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Monto Total</p>
                <p className="text-2xl font-bold text-primary">
                  ${Math.round(parseFloat(gasto.monto_total || 0)).toLocaleString('es-ES')}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Fecha</p>
                <p className="text-lg font-medium text-foreground">
                  {new Date(gasto.fecha).toLocaleDateString('es-ES', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric'
                  })}
                </p>
              </div>
            </div>

            <div>
              <p className="text-sm text-muted-foreground mb-1">Pagado por</p>
              <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold">
                  {gasto.pagador?.nombre?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="font-medium text-foreground">{gasto.pagador?.nombre}</p>
                  {gasto.pagador?.email && (
                    <p className="text-xs text-muted-foreground">{gasto.pagador.email}</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* División de aportes */}
          {gasto.aportes && gasto.aportes.length > 0 && (
            <div>
              <p className="text-sm font-medium text-foreground mb-3">
                División del Gasto ({gasto.aportes.length} {gasto.aportes.length === 1 ? 'persona' : 'personas'})
              </p>
              <div className="space-y-2">
                {gasto.aportes.map(aporte => (
                  <div
                    key={aporte.id}
                    className={`flex items-center justify-between p-3 rounded-lg border ${
                      aporte.estado === 'pagado'
                        ? 'bg-success/10 border-success/30'
                        : 'bg-muted/30 border-border'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                        aporte.estado === 'pagado'
                          ? 'bg-success text-success-foreground'
                          : 'bg-muted text-muted-foreground'
                      }`}>
                        {aporte.participante?.nombre?.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-medium text-foreground text-sm">
                          {aporte.participante?.nombre}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {aporte.estado === 'pagado' ? 'Pagado' : 'Pendiente'}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-bold ${
                        aporte.estado === 'pagado' ? 'text-success' : 'text-foreground'
                      }`}>
                        ${parseFloat(aporte.monto_asignado).toFixed(2)} 
                      </p>
                      {aporte.monto_pagado > 0 && aporte.monto_pagado < aporte.monto_asignado && (
                        <p className="text-xs text-muted-foreground">
                          Pagó: ${parseFloat(aporte.monto_pagado).toFixed(2)}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}