import BtnLoading from '../BtnLoading';
import IconSelector from '../IconSelector';

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
    editExpenseIcon,
    setEditExpenseIcon,
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
            <h2 className="text-xl font-semibold text-foreground mb-4">Editar Gasto</h2>
            <div className="space-y-2">
              <div className="flex gap-2 items-center">
              <IconSelector
                selectedIcon={editExpenseIcon}
                onSelectIcon={setEditExpenseIcon}
              />
              <div>
                <input
                  type="text"
                  value={editExpenseDesc}
                  onChange={e => setEditExpenseDesc(e.target.value)}
                  className="w-full px-3 py-1 border border-border bg-input text-foreground rounded-md"
                  placeholder="Ej: Cena en restaurante"
                />
              </div>
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
                  className="w-full px-3 py-1 border border-border bg-input text-foreground rounded-md"
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
                  className="w-full px-3 py-1 border border-border bg-input text-foreground rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  Pagado por *
                </label>
                <select
                  value={editSelectedPagador}
                  onChange={e => setEditSelectedPagador(e.target.value)}
                  className="w-full px-3 py-1 border border-border bg-input text-foreground rounded-md"
                >
                  <option value="">Seleccionar...</option>
                  {participantes.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.nombre} {p.usuario ? '(Usuario)' : ''}
                    </option>
                  ))}
                </select>
              </div>
              <div className=''>
                <label className="block text-sm font-medium text-foreground mt-43">
                  Dividir entre * ({editSelectedParticipantes.length} seleccionados)
                </label>
                <div className="space-y-1 max-h-40 overflow-y-auto">
                  {participantes.map(p => (
                    <label key={p.id} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={editSelectedParticipantes.includes(p.id)}
                        onChange={() => toggleEditParticipante(p.id)}
                        className="w-3 h-3 accent-primary cursor-pointer"
                      />
                      <span className="text-foreground">
                        {p.nombre} {p.usuario ? '(Usuario)' : ''}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex gap-3 mt-4">
              <button
                onClick={onClose}
                className="flex-1 bg-muted text-foreground py-2 rounded-md hover:bg-muted/80"
                disabled={editLoading}
              >
                Cancelar
              </button>
              <button
                onClick={handleUpdateExpense}
                disabled={editLoading}
                className="flex-1 bg-primary text-primary-foreground py-2 rounded-md hover:bg-primary/90 disabled:opacity-50"
              >
                {editLoading ? <BtnLoading text="Guardando..." /> : 'Guardar Cambios'}
              </button>
            </div>
          </div>
        </div>
    )
};