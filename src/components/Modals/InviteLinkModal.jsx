import { Check, Copy, Mail, MessageCircle } from "lucide-react";
import React from "react";
import BtnLoading from "../BtnLoading";

export default function InviteLinkModal({
    inviteLinkLoading,
    inviteLink,
    handleCopyLink,
    linkCopied,
    grupo,
    setIsInviteModalOpen,
    setInviteLink,
    setLinkCopied,
}){
    return(
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-lg shadow-xl max-w-md w-full p-6">
            <h2 className="text-xl font-bold text-foreground mb-4">Invitar al Grupo</h2>
            <p className="text-sm text-muted-foreground mb-4">
              Comparte este enlace con usuarios registrados para que puedan unirse al grupo
            </p>
            
            {inviteLinkLoading ? (
              <div className="flex justify-center py-8">
                <BtnLoading text="Generando enlace..." />
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Enlace de invitación
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={inviteLink}
                      readOnly
                      className="flex-1 px-3 py-2 border border-border bg-input text-foreground rounded-md text-sm"
                    />
                    <button
                      onClick={handleCopyLink}
                      className="bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 flex items-center gap-2 whitespace-nowrap"
                    >
                      {linkCopied ? (
                        <>
                          <Check className="w-4 h-4" />
                          Copiado
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" />
                          Copiar
                        </>
                      )}
                    </button>
                  </div>
                </div>
                <div className="flex flex-col">
                <span className="text-xs text-gray-400">- El enlace es válido por 30 días</span>
                <span className="text-xs text-gray-400">- Solo usuarios con cuenta pueden usarlo</span>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      window.open(`https://wa.me/?text=${encodeURIComponent('¡Únete a nuestro grupo de gastos! ' + inviteLink)}`, '_blank');
                    }}
                    className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center justify-center gap-2"
                  >
                    <MessageCircle className="w-4 h-4" />
                    WhatsApp
                  </button>
                  <button
                    onClick={() => {
                      window.open(`mailto:?subject=Invitación al grupo ${grupo.nombre}&body=${encodeURIComponent('Te invito a unirte a nuestro grupo de gastos compartidos:\n\n' + inviteLink)}`, '_blank');
                    }}
                    className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2"
                  >
                    <Mail className="w-4 h-4" />
                    Email
                  </button>
                </div>
              </div>
            )}

            <div className="flex gap-3 mt-4">
              <button
                onClick={() => {
                  setIsInviteModalOpen(false);
                  setInviteLink('');
                  setLinkCopied(false);
                }}
                className="flex-1 bg-muted text-foreground py-2 rounded-lg hover:bg-muted/80"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
    )
}