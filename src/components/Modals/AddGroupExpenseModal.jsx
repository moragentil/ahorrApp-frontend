import React from 'react';
import IconSelector from '../IconSelector';
import BtnLoading from '../BtnLoading';

export default function AddGroupExpenseModal({
    isOpen,
    onClose,
    newExpenseIcon,
    setNewExpenseIcon,
    newExpenseDesc,
    setNewExpenseDesc,
    newExpenseMonto,
    setNewExpenseMonto,
    newExpenseFecha,
    setNewExpenseFecha,
    selectedPagador,
    setSelectedPagador,
    participantes,
    selectedParticipantes,
    toggleParticipante,
    handleAddExpense,
    addExpenseLoading,
    setIsAddExpenseOpen,
}) {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-lg shadow-xl max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold text-foreground mb-4">Nuevo Gasto Compartido</h2>
            <div className="space-y-4">
              <div className="flex gap-2 items-center">
              <IconSelector
                selectedIcon={newExpenseIcon}
                onSelectIcon={setNewExpenseIcon}
              />
              <div>
                <input
                  type="text"
                  value={newExpenseDesc}
                  onChange={e => setNewExpenseDesc(e.target.value)}
                  className="w-full px-3 py-1 border border-border bg-input text-foreground rounded-md"
                  placeholder="Título del gasto"
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
                  value={newExpenseMonto}
                  onChange={e => setNewExpenseMonto(e.target.value)}
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
                  value={newExpenseFecha}
                  onChange={e => setNewExpenseFecha(e.target.value)}
                  className="w-full px-3 py-2 border border-border bg-input text-foreground rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  Pagado por *
                </label>
                <select
                  value={selectedPagador}
                  onChange={e => setSelectedPagador(e.target.value)}
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
                  Dividir entre *
                </label>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {participantes.map(p => (
                    <label key={p.id} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedParticipantes.includes(p.id)}
                        onChange={() => toggleParticipante(p.id)}
                        className="w-4 h-4"
                      />
                      <span className="text-foreground">
                        {p.nombre} {p.usuario ? '(Usuario)' : ''}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={handleAddExpense}
                disabled={addExpenseLoading}
                className="flex-1 bg-primary text-primary-foreground py-2 rounded-lg hover:bg-primary/90 disabled:opacity-50"
              >
                {addExpenseLoading ? <BtnLoading text="Guardando..." /> : 'Agregar Gasto'}
              </button>
              <button
                onClick={() => setIsAddExpenseOpen(false)}
                className="flex-1 bg-muted text-foreground py-2 rounded-lg hover:bg-muted/80"
                disabled={addExpenseLoading}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
    )
}