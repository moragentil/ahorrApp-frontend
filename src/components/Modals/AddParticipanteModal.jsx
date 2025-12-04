import React from "react";
import BtnLoading from "../BtnLoading";

export default function AddParticipanteModal({
    isOpen,
    onClose,
    newParticipanteNombre,
    setNewParticipanteNombre,
    newParticipanteEmail,
    setNewParticipanteEmail,
    handleAddParticipante,
    addParticipanteLoading,
}){
    if (!isOpen) return null;

    const handleClose = () => {
        setNewParticipanteNombre('');
        setNewParticipanteEmail('');
        onClose();
    };

    return(
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-card rounded-lg shadow-xl max-w-md w-full p-6">
                <h2 className="text-xl font-semibold text-foreground mb-4">Agregar Participante</h2>
                <p className="text-sm text-muted-foreground mb-4">
                    Agrega a alguien que compartirá gastos (no necesita ser usuario)
                </p>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-foreground mb-1">
                            Nombre *
                        </label>
                        <input
                            type="text"
                            value={newParticipanteNombre}
                            onChange={e => setNewParticipanteNombre(e.target.value)}
                            className="w-full px-3 py-2 border border-border bg-input text-foreground rounded-md"
                            placeholder="Nombre del participante"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-foreground mb-1">
                            Email (opcional)
                        </label>
                        <input
                            type="email"
                            value={newParticipanteEmail}
                            onChange={e => setNewParticipanteEmail(e.target.value)}
                            className="w-full px-3 py-2 border border-border bg-input text-foreground rounded-md"
                            placeholder="email@ejemplo.com"
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                            Si agregas un email, podrás invitarlo después como usuario registrado
                        </p>
                    </div>
                </div>
                <div className="flex gap-3 mt-6">
                    <button
                        onClick={handleClose}
                        className="flex-1 bg-muted text-foreground py-2 rounded-md hover:bg-muted/80 "
                        disabled={addParticipanteLoading}
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={handleAddParticipante}
                        disabled={!newParticipanteNombre.trim() || addParticipanteLoading}
                        className="flex-1 bg-primary text-primary-foreground py-2 rounded-md hover:bg-primary/90 disabled:opacity-50 "
                    >
                        {addParticipanteLoading ? <BtnLoading text="Agregando..." /> : 'Agregar'}
                    </button>
                </div>
            </div>
        </div>
    )
}