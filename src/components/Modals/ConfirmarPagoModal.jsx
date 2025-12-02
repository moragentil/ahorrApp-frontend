import { ArrowRight, Check } from 'lucide-react';
import BtnLoading from '../BtnLoading';
import { renderIcon } from '../../utils/iconHelper';

function ConfirmarPagoModal({ isOpen, onClose, transaccion, onConfirm, loading }) {
  if (!isOpen || !transaccion) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-card rounded-lg shadow-xl max-w-md w-full p-6">
        <h2 className="text-xl font-bold text-foreground mb-4">Confirmar Pago</h2>
        
        <div className="bg-muted/30 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-destructive/20 text-destructive flex items-center justify-center font-bold text-lg">
                {transaccion.de_nombre.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="font-semibold text-foreground">{transaccion.de_nombre}</p>
                <p className="text-sm text-muted-foreground">Debe pagar</p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center gap-2 my-4">
            <ArrowRight className="w-5 h-5 text-muted-foreground" />
            <div className="bg-primary text-primary-foreground px-4 py-2 rounded-full font-bold text-lg">
              ${Math.round(parseFloat(transaccion.monto || 0)).toLocaleString('es-ES')}
            </div>
            <ArrowRight className="w-5 h-5 text-muted-foreground" />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-success/20 text-success flex items-center justify-center font-bold text-lg">
                {transaccion.para_nombre.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="font-semibold text-foreground">{transaccion.para_nombre}</p>
                <p className="text-sm text-muted-foreground">Recibirá el pago</p>
              </div>
            </div>
          </div>
        </div>

        <p className="text-center text-foreground mb-6">
          ¿Confirmas que {transaccion.de_nombre} ya pagó ${Math.round(parseFloat(transaccion.monto || 0)).toLocaleString('es-ES')} a {transaccion.para_nombre}?
        </p>

        <div className="flex gap-3">
          <button
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 bg-success text-white py-2.5 rounded-lg hover:bg-success/90 disabled:opacity-50 font-medium flex items-center justify-center gap-2"
          >
            {loading ? (
              <BtnLoading text="Procesando..." />
            ) : (
              <>
                <Check className="w-5 h-5" />
                Confirmar Pago
              </>
            )}
          </button>
          <button
            onClick={onClose}
            disabled={loading}
            className="flex-1 bg-muted text-foreground py-2.5 rounded-lg hover:bg-muted/80 font-medium"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmarPagoModal;