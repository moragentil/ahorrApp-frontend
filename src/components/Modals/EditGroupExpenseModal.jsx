import BtnLoading from '../BtnLoading';

export default function EditGroupExpenseModal({
    isOpen,
    onClose,
    participantes,
    editExpenseDesc,
    setEditExpenseDesc,
    editExpenseMonto,
    setEditExpenseMonto,
    editExpenseFecha,
    setEditExpenseFecha,
    editSelectedPagador,
    setEditSelectedPagador,
    editSelectedParticipantes,
    editLoading,
    toggleEditParticipante,
    handleUpdateExpense,
}) {
    if (!isOpen) return null;

    return(
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-lg shadow-xl max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold text-foreground mb-4">Editar Gasto Compartido</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  Descripción *
                </label>
                <input
                  type="text"
                  value={editExpenseDesc}
                  onChange={e => setEditExpenseDesc(e.target.value)}
                  className="w-full px-3 py-2 border border-border bg-input text-foreground rounded-md"
                  placeholder="Ej: Cena en restaurante"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  Monto Total *
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={editExpenseMonto}
                  onChange={e => setEditExpenseMonto(e.target.value)}
                  className="w-full px-3 py-2 border border-border bg-input text-foreground rounded-md"
                  placeholder="0.00"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  Fecha *
                </label>
                <input
                  type="date"
                  value={editExpenseFecha}
                  onChange={e => setEditExpenseFecha(e.target.value)}
                  className="w-full px-3 py-2 border border-border bg-input text-foreground rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  Pagado por *
                </label>
                <select
                  value={editSelectedPagador}
                  onChange={e => setEditSelectedPagador(e.target.value)}
                  className="w-full px-3 py-2 border border-border bg-input text-foreground rounded-md"
                >
                  <option value="">Seleccionar...</option>
                  {participantes.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.nombre} {p.usuario ? '(Usuario)' : ''}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Dividir entre * ({editSelectedParticipantes.length} seleccionados)
                </label>
                <div className="space-y-2 max-h-40 overflow-y-auto border border-border rounded-md p-2">
                  {participantes.map(p => (
                    <label key={p.id} className="flex items-center gap-2 cursor-pointer hover:bg-muted/50 p-2 rounded">
                      <input
                        type="checkbox"
                        checked={editSelectedParticipantes.includes(p.id)}
                        onChange={() => toggleEditParticipante(p.id)}
                        className="w-4 h-4"
                      />
                      <span className="text-foreground flex-1">
                        {p.nombre} {p.usuario ? '(Usuario)' : ''}
                      </span>
                    </label>
                  ))}
                </div>
                {editSelectedParticipantes.length > 0 && (
                  <p className="text-sm text-muted-foreground mt-4">
                    Monto por persona: <span className='text-primary font-semibold text-base'>${(parseFloat(editExpenseMonto || 0) / editSelectedParticipantes.length).toFixed(2)}</span>
                  </p>
                )}
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={handleUpdateExpense}
                disabled={editLoading || editSelectedParticipantes.length === 0}
                className="flex-1 bg-primary text-primary-foreground py-2 rounded-lg hover:bg-primary/90 disabled:opacity-50"
              >
                {editLoading ? <BtnLoading text="Guardando..." /> : 'Guardar Cambios'}
              </button>
              <button
                onClick={onClose}
                className="flex-1 bg-muted text-foreground py-2 rounded-lg hover:bg-muted/80"
                disabled={editLoading}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
    )
};