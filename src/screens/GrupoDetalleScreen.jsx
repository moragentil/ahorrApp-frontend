import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, UserPlus, DollarSign, Calculator, CheckCircle } from 'lucide-react';
import { grupoGastoService } from '../services/grupoGastoService';
import BtnLoading from '../components/BtnLoading';

function GrupoDetalleScreen({ user }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [grupo, setGrupo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [balances, setBalances] = useState(null);
  const [pagos, setPagos] = useState([]);
  const [activeTab, setActiveTab] = useState('gastos'); // gastos, balances, pagos
  
  // Add expense modal
  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false);
  const [newExpenseDesc, setNewExpenseDesc] = useState('');
  const [newExpenseMonto, setNewExpenseMonto] = useState('');
  const [newExpenseFecha, setNewExpenseFecha] = useState(new Date().toISOString().split('T')[0]);
  const [selectedParticipantes, setSelectedParticipantes] = useState([]);
  const [addExpenseLoading, setAddExpenseLoading] = useState(false);

  useEffect(() => {
    loadGrupo();
  }, [id]);

  const loadGrupo = async () => {
    setLoading(true);
    const data = await grupoGastoService.getById(id);
    setGrupo(data);
    setSelectedParticipantes(data.miembros?.map(m => m.id) || []);
    setLoading(false);
  };

  const loadBalances = async () => {
    const data = await grupoGastoService.getBalances(id);
    setBalances(data);
  };

  const handleAddExpense = async () => {
    if (!newExpenseDesc.trim() || !newExpenseMonto || selectedParticipantes.length === 0) return;
    setAddExpenseLoading(true);
    try {
      await grupoGastoService.addGasto(id, {
        pagador_id: user.id,
        descripcion: newExpenseDesc,
        monto_total: parseFloat(newExpenseMonto),
        fecha: newExpenseFecha,
        participantes: selectedParticipantes,
      });
      setIsAddExpenseOpen(false);
      setNewExpenseDesc('');
      setNewExpenseMonto('');
      setNewExpenseFecha(new Date().toISOString().split('T')[0]);
      await loadGrupo();
    } catch (err) {
      alert('Error al agregar el gasto');
    }
    setAddExpenseLoading(false);
  };

  const handleGenerarPagos = async () => {
    const generados = await grupoGastoService.generarPagos(id);
    setPagos(generados);
    setActiveTab('pagos');
  };

  const handleCompletarPago = async (pagoId) => {
    await grupoGastoService.completarPago(pagoId);
    const generados = await grupoGastoService.generarPagos(id);
    setPagos(generados);
  };

  const toggleParticipante = (userId) => {
    if (selectedParticipantes.includes(userId)) {
      setSelectedParticipantes(selectedParticipantes.filter(id => id !== userId));
    } else {
      setSelectedParticipantes([...selectedParticipantes, userId]);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <BtnLoading height={40} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background mt-14 lg:mt-0">
      {/* Add Expense Modal */}
      {isAddExpenseOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-lg shadow-xl max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold text-foreground mb-4">Nuevo Gasto Compartido</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  Descripción *
                </label>
                <input
                  type="text"
                  value={newExpenseDesc}
                  onChange={e => setNewExpenseDesc(e.target.value)}
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
                <label className="block text-sm font-medium text-foreground mb-2">
                  Participantes *
                </label>
                <div className="space-y-2">
                  {grupo.miembros?.map(miembro => (
                    <label key={miembro.id} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedParticipantes.includes(miembro.id)}
                        onChange={() => toggleParticipante(miembro.id)}
                        className="w-4 h-4"
                      />
                      <span className="text-foreground">{miembro.name}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={handleAddExpense}
                disabled={!newExpenseDesc.trim() || !newExpenseMonto || selectedParticipantes.length === 0 || addExpenseLoading}
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
      )}

      <main className="max-w-7xl mx-auto p-4 lg:p-6 space-y-4 lg:space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/grupos-gastos')}
            className="p-2 hover:bg-muted rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>
          <div className="flex-1">
            <h1 className="text-xl lg:text-3xl font-bold text-foreground">{grupo.nombre}</h1>
            {grupo.descripcion && (
              <p className="text-sm lg:text-base text-muted-foreground">{grupo.descripcion}</p>
            )}
          </div>
          <button
            onClick={() => setIsAddExpenseOpen(true)}
            className="bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Nuevo Gasto
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 border-b border-border">
          <button
            onClick={() => setActiveTab('gastos')}
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === 'gastos'
                ? 'text-primary border-b-2 border-primary'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Gastos
          </button>
          <button
            onClick={() => {
              setActiveTab('balances');
              loadBalances();
            }}
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === 'balances'
                ? 'text-primary border-b-2 border-primary'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Balances
          </button>
          <button
            onClick={() => setActiveTab('pagos')}
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === 'pagos'
                ? 'text-primary border-b-2 border-primary'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Pagos Sugeridos
          </button>
        </div>

        {/* Content */}
        {activeTab === 'gastos' && (
          <div className="space-y-4">
            {grupo.gastosCompartidos?.length === 0 ? (
              <div className="bg-card border border-border rounded-lg p-8 text-center">
                <p className="text-muted-foreground">No hay gastos registrados</p>
              </div>
            ) : (
              grupo.gastosCompartidos?.map(gasto => (
                <div key={gasto.id} className="bg-card border border-border rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-foreground">{gasto.descripcion}</h3>
                      <p className="text-sm text-muted-foreground">
                        Pagado por {gasto.pagador?.name}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(gasto.fecha).toLocaleDateString('es-ES')}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold text-foreground">
                        ${parseFloat(gasto.monto_total).toFixed(2)}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {gasto.participantes?.length} participantes
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'balances' && (
          <div className="space-y-4">
            {balances ? (
              <>
                {Object.values(balances).map(balance => (
                  <div key={balance.user.id} className="bg-card border border-border rounded-lg p-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-semibold text-foreground">{balance.user.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          Pagó: ${balance.pagado.toFixed(2)} | Debe: ${balance.debe.toFixed(2)}
                        </p>
                      </div>
                      <div className={`text-xl font-bold ${
                        balance.balance > 0 ? 'text-success' : balance.balance < 0 ? 'text-destructive' : 'text-muted-foreground'
                      }`}>
                        {balance.balance > 0 ? '+' : ''}${balance.balance.toFixed(2)}
                      </div>
                    </div>
                  </div>
                ))}
                <button
                  onClick={handleGenerarPagos}
                  className="w-full bg-primary text-primary-foreground py-3 rounded-lg hover:bg-primary/90 flex items-center justify-center gap-2"
                >
                  <Calculator className="w-5 h-5" />
                  Generar Pagos para Equilibrar
                </button>
              </>
            ) : (
              <div className="bg-card border border-border rounded-lg p-8 text-center">
                <BtnLoading text="Cargando balances..." />
              </div>
            )}
          </div>
        )}

        {activeTab === 'pagos' && (
          <div className="space-y-4">
            {pagos.length === 0 ? (
              <div className="bg-card border border-border rounded-lg p-8 text-center">
                <p className="text-muted-foreground">Genera los pagos desde la pestaña de Balances</p>
              </div>
            ) : (
              pagos.map(pago => (
                <div key={pago.id} className="bg-card border border-border rounded-lg p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-semibold text-foreground">
                        {pago.pagador?.name} → {pago.receptor?.name}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Estado: {pago.estado === 'completado' ? 'Completado ✓' : 'Pendiente'}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <p className="text-xl font-bold text-foreground">
                        ${parseFloat(pago.monto).toFixed(2)}
                      </p>
                      {pago.estado === 'pendiente' && (
                        <button
                          onClick={() => handleCompletarPago(pago.id)}
                          className="p-2 bg-success text-success-foreground rounded-lg hover:bg-success/90"
                        >
                          <CheckCircle className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </main>
    </div>
  );
}

export default GrupoDetalleScreen;