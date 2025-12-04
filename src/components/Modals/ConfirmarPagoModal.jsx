import { ArrowRight, Check } from 'lucide-react';
import BtnLoading from '../BtnLoading';
import { renderIcon } from '../../utils/iconHelper';

function ConfirmarPagoModal({ isOpen, onClose, transaccion, onConfirm, loading }) {
  if (!isOpen || !transaccion) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-card rounded-lg shadow-xl max-w-md w-full p-4">
        <h2 className="text-xl font-semibold text-foreground mb-4">Confirmar Pago</h2>
        
        <div className="bg-muted/30 rounded-lg p-2 mb-6 flex justify-between items-center">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-destructive/20 text-destructive flex items-center justify-center font-bold ">
                {transaccion.de_nombre.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="font-semibold text-foreground text-sm">{transaccion.de_nombre}</p>
                <p className="text-xs text-muted-foreground">Debe pagar</p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center gap-1 ">
            <ArrowRight className="w-4 h-4 text-muted-foreground" />
            <div className="bg-primary text-primary-foreground px-2 py-1 rounded-full font-bold ">
              ${Math.round(parseFloat(transaccion.monto || 0)).toLocaleString('es-ES')}
            </div>
            <ArrowRight className="w-4 h-4 text-muted-foreground" />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-success/20 text-success flex items-center justify-center font-bold ">
                {transaccion.para_nombre.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="font-semibold text-foreground text-sm">{transaccion.para_nombre}</p>
                <p className="text-xs text-muted-foreground">Recibirá el pago</p>
              </div>
            </div>
          </div>
        </div>

        <p className="text-center text-foreground mb-6">
          ¿Confirmas que {transaccion.de_nombre} ya pagó ${Math.round(parseFloat(transaccion.monto || 0)).toLocaleString('es-ES')} a {transaccion.para_nombre}?
        </p>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            disabled={loading}
            className="flex-1 bg-muted text-foreground py-2.5 rounded-md hover:bg-muted/80 "
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 bg-primary text-white py-2.5 rounded-md hover:bg-primary/80 disabled:opacity-50  flex items-center justify-center gap-2"
          >
            {loading ? (
              <BtnLoading text="Procesando..." />
            ) : (
              <>
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