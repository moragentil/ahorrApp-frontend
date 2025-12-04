import { Mail } from "lucide-react";
import BtnLoading from "../BtnLoading";

export default function AssociateEmailModal({
    isOpen,
    onClose,
    setIsAssociateEmailOpen,
    selectedParticipante,
    setSelectedParticipante,
    associateEmail,
    setAssociateEmail,
    associateLoading,   
    handleAssociateEmail,
}){

    if (!isOpen) return null;

    const handleClose = () => {
        setSelectedParticipante(null);
        setAssociateEmail('');
        onClose();
    };


    return(
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                  <div className="bg-card rounded-lg shadow-xl max-w-md w-full p-6">
                    <h2 className="text-xl font-semibold text-foreground mb-4">Asociar Email a Participante</h2>
                    <p className="text-sm text-muted-foreground mb-4">
                      Asocia un email a <span className="font-semibold">{selectedParticipante.nombre}</span> para invitarlo al grupo como usuario registrado
                    </p>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-1">
                          Email del usuario
                        </label>
                        <input
                          type="email"
                          value={associateEmail}
                          onChange={e => setAssociateEmail(e.target.value)}
                          className="w-full px-3 py-2 border border-border bg-input text-foreground rounded-md"
                          placeholder="usuario@ejemplo.com"
                        />
                      </div>
                      <div className="flex flex-col ">
                        <span className="text-xs text-muted-foreground">- Se actualizará el email del participante</span>
                        <span className="text-xs text-muted-foreground">- Se enviará una invitación al email indicado</span>
                        <span className="text-xs text-muted-foreground">- Al aceptar, se vincularán todos los gastos existentes</span>
                      </div>
                    </div>
                    <div className="flex gap-3 mt-6">
                        <button
                        onClick={() => handleClose()}
                        className="flex-1 bg-muted text-foreground py-2 rounded-md hover:bg-muted/80"
                        disabled={associateLoading}
                      >
                        Cancelar
                      </button>
                      <button
                        onClick={handleAssociateEmail}
                        disabled={!associateEmail.trim() || associateLoading}
                        className="flex-1 bg-primary text-primary-foreground py-2 rounded-md hover:bg-primary/90 disabled:opacity-50 flex items-center justify-center gap-2"
                      >
                        {associateLoading ? <BtnLoading text="Enviando..." /> : (
                          <>
                            Asociar Email
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
    )
}