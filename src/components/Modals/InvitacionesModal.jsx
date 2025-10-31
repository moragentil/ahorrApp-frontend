import { useState, useEffect } from 'react';
import { Mail, X, Check, Clock } from 'lucide-react';
import { invitacionGrupoService } from '../services/invitacionGrupoService';
import BtnLoading from '../BtnLoading';

function InvitacionesModal({ isOpen, onClose, onInvitacionAceptada }) {
  const [invitaciones, setInvitaciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);

  useEffect(() => {
    if (isOpen) {
      loadInvitaciones();
    }
  }, [isOpen]);

  const loadInvitaciones = async () => {
    setLoading(true);
    const data = await invitacionGrupoService.misInvitaciones();
    setInvitaciones(data);
    setLoading(false);
  };

  const handleAceptar = async (token) => {
    setActionLoading(token);
    try {
      await invitacionGrupoService.aceptar(token);
      setInvitaciones(invitaciones.filter(inv => inv.token !== token));
      if (onInvitacionAceptada) onInvitacionAceptada();
    } catch (err) {
      alert('Error al aceptar la invitación');
    }
    setActionLoading(null);
  };

  const handleRechazar = async (token) => {
    setActionLoading(token);
    try {
      await invitacionGrupoService.rechazar(token);
      setInvitaciones(invitaciones.filter(inv => inv.token !== token));
    } catch (err) {
      alert('Error al rechazar la invitación');
    }
    setActionLoading(null);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-card rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-xl font-bold text-foreground">Invitaciones Pendientes</h2>
          <button onClick={onClose} className="p-1 hover:bg-muted rounded">
            <X className="w-5 h-5 text-foreground" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(80vh-80px)]">
          {loading ? (
            <div className="flex justify-center py-8">
              <BtnLoading text="Cargando..." />
            </div>
          ) : invitaciones.length === 0 ? (
            <div className="text-center py-8">
              <Mail className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No tienes invitaciones pendientes</p>
            </div>
          ) : (
            <div className="space-y-4">
              {invitaciones.map((inv) => (
                <div key={inv.id} className="bg-muted/30 border border-border rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-foreground">{inv.grupo.nombre}</h3>
                      {inv.grupo.descripcion && (
                        <p className="text-sm text-muted-foreground mt-1">{inv.grupo.descripcion}</p>
                      )}
                      <p className="text-sm text-muted-foreground mt-2">
                        Invitado por: <span className="font-medium">{inv.invitador.name}</span>
                      </p>
                      {inv.expira_en && (
                        <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          Expira: {new Date(inv.expira_en).toLocaleDateString('es-ES')}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleAceptar(inv.token)}
                      disabled={actionLoading === inv.token}
                      className="flex-1 bg-success text-success-foreground px-4 py-2 rounded-lg hover:bg-success/90 disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {actionLoading === inv.token ? (
                        <BtnLoading text="Aceptando..." />
                      ) : (
                        <>
                          <Check className="w-4 h-4" />
                          Aceptar
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => handleRechazar(inv.token)}
                      disabled={actionLoading === inv.token}
                      className="flex-1 bg-destructive text-destructive-foreground px-4 py-2 rounded-lg hover:bg-destructive/90 disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {actionLoading === inv.token ? (
                        <BtnLoading text="Rechazando..." />
                      ) : (
                        <>
                          <X className="w-4 h-4" />
                          Rechazar
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default InvitacionesModal;