import { Check } from 'lucide-react';
import BtnLoading from '../BtnLoading';

function ConfirmarPagoModal({ isOpen, onClose, transaccion, onConfirm, loading }) {
  if (!isOpen || !transaccion) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-card rounded-lg shadow-xl max-w-md w-full p-6">
        <h2 className="text-xl font-semibold text-foreground mb-6">Confirmar Pago</h2>
        
        <div className="bg-muted/40 rounded-xl p-4 mb-6 space-y-3">
          <div className="flex items-center justify-center text-sm text-muted-foreground gap-1 flex-wrap">
            <span className="font-semibold text-foreground">{transaccion.de_nombre}</span>
            <span>debe pagar a</span>
            <span className="font-semibold text-foreground">{transaccion.para_nombre}</span>
          </div>

          <div className="text-center text-2xl font-bold text-foreground">
            ${Math.round(parseFloat(transaccion.monto || 0)).toLocaleString('es-ES')}
          </div>
        </div>

        <p className="text-center text-muted-foreground mb-6">
          ¿Confirmas que este pago ya fue realizado?
        </p>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            disabled={loading}
            className="flex-1 bg-muted text-foreground py-2.5 rounded-lg hover:bg-muted/80 transition-colors font-medium"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 bg-primary text-primary-foreground py-2.5 rounded-lg hover:bg-primary/90 disabled:opacity-50 transition-colors flex items-center justify-center gap-2 font-semibold"
          >
            {loading ? (
              <BtnLoading text="Procesando..." />
            ) : (
              <>
                <Check className="w-4 h-4" />
                Confirmar Pago
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmarPagoModal;