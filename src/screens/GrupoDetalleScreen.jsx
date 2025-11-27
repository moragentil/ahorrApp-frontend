import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, UserPlus, Mail, Trash2, Users as UsersIcon, User, TrendingUp, ArrowRight } from 'lucide-react';
import { grupoGastoService } from '../services/grupoGastoService';
import { invitacionGrupoService } from '../services/invitacionGrupoService';
import { participanteService } from '../services/participanteService';
import { gastoCompartidoService } from '../services/gastoCompartidoService';
import BtnLoading from '../components/BtnLoading';

function GrupoDetalleScreen({ user }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [grupo, setGrupo] = useState(null);
  const [participantes, setParticipantes] = useState([]);
  const [gastosCompartidos, setGastosCompartidos] = useState([]);
  const [balances, setBalances] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('gastos');
  
  // Add expense modal
  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false);
  const [newExpenseDesc, setNewExpenseDesc] = useState('');
  const [newExpenseMonto, setNewExpenseMonto] = useState('');
  const [newExpenseFecha, setNewExpenseFecha] = useState(new Date().toISOString().split('T')[0]);
  const [selectedPagador, setSelectedPagador] = useState('');
  const [selectedParticipantes, setSelectedParticipantes] = useState([]);
  const [addExpenseLoading, setAddExpenseLoading] = useState(false);

  // Invite modal
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteLoading, setInviteLoading] = useState(false);
  const [invitacionesPendientes, setInvitacionesPendientes] = useState([]);

  // Add participant modal
  const [isAddParticipanteOpen, setIsAddParticipanteOpen] = useState(false);
  const [newParticipanteNombre, setNewParticipanteNombre] = useState('');
  const [newParticipanteEmail, setNewParticipanteEmail] = useState('');
  const [addParticipanteLoading, setAddParticipanteLoading] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        await Promise.all([
          loadGrupo(),
          loadParticipantes(),
          loadGastos(),
          loadBalances()
        ]);
      } catch (err) {
        console.error('Error al cargar datos:', err);
        alert('Error al cargar los datos del grupo');
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, [id]);

  useEffect(() => {
    if (activeTab === 'miembros') {
      loadInvitacionesPendientes();
    }
  }, [activeTab]);

  const loadGrupo = async () => {
    const data = await grupoGastoService.getById(id);
    setGrupo(data);
  };

  const loadParticipantes = async () => {
    try {
      const data = await participanteService.getAll(id);
      console.log('Participantes cargados:', data); // Para debug
      setParticipantes(data);
      // Seleccionar todos por defecto
      if (data && data.length > 0) {
        setSelectedParticipantes(data.map(p => p.id));
      }
    } catch (err) {
      console.error('Error al cargar participantes:', err);
    }
  };

  const loadGastos = async () => {
    try {
      const data = await gastoCompartidoService.getAll(id);
      console.log('Gastos cargados:', data); // Para debug
      setGastosCompartidos(data);
    } catch (err) {
      console.error('Error al cargar gastos:', err);
    }
  };

  const loadBalances = async () => {
    try {
      const data = await grupoGastoService.getBalances(id);
      setBalances(data);
    } catch (err) {
      console.error('Error al cargar balances:', err);
    }
  };

  // Recargar balances cuando cambian los gastos
  useEffect(() => {
    if (activeTab === 'balances') {
      loadBalances();
    }
  }, [activeTab, gastosCompartidos]);

  const loadInvitacionesPendientes = async () => {
    try {
      const data = await invitacionGrupoService.invitacionesPendientes(id);
      setInvitacionesPendientes(data);
    } catch (err) {
      console.error('Error al cargar invitaciones:', err);
    }
  };

  const handleAddExpense = async () => {
    if (!newExpenseDesc.trim() || !newExpenseMonto || !selectedPagador || selectedParticipantes.length === 0) {
      alert('Por favor completa todos los campos');
      return;
    }

    setAddExpenseLoading(true);
    try {
      await gastoCompartidoService.create({
        grupo_gasto_id: id,
        pagado_por_participante_id: parseInt(selectedPagador),
        descripcion: newExpenseDesc,
        monto_total: parseFloat(newExpenseMonto),
        fecha: newExpenseFecha,
        participantes: selectedParticipantes,
      });

      setIsAddExpenseOpen(false);
      setNewExpenseDesc('');
      setNewExpenseMonto('');
      setSelectedPagador('');
      setNewExpenseFecha(new Date().toISOString().split('T')[0]);
      await loadGastos();
      alert('Gasto agregado correctamente');
    } catch (err) {
      alert(err.response?.data?.message || 'Error al agregar el gasto');
    }
    setAddExpenseLoading(false);
  };

  const toggleParticipante = (participanteId) => {
    if (selectedParticipantes.includes(participanteId)) {
      setSelectedParticipantes(selectedParticipantes.filter(id => id !== participanteId));
    } else {
      setSelectedParticipantes([...selectedParticipantes, participanteId]);
    }
  };

  const handleInvitar = async () => {
    if (!inviteEmail.trim()) return;
    setInviteLoading(true);
    try {
      await invitacionGrupoService.enviarInvitacion(id, inviteEmail);
      setInviteEmail('');
      setIsInviteModalOpen(false);
      alert('Invitación enviada correctamente');
      await loadInvitacionesPendientes();
    } catch (err) {
      alert(err.response?.data?.message || 'Error al enviar la invitación');
    }
    setInviteLoading(false);
  };

  const handleCancelarInvitacion = async (invitacionId) => {
    if (!confirm('¿Deseas cancelar esta invitación?')) return;
    try {
      await invitacionGrupoService.cancelar(invitacionId);
      await loadInvitacionesPendientes();
    } catch (err) {
      alert('Error al cancelar la invitación');
    }
  };

  const handleAddParticipante = async () => {
    if (!newParticipanteNombre.trim()) {
      alert('El nombre es obligatorio');
      return;
    }

    setAddParticipanteLoading(true);
    try {
      await participanteService.create({
        grupo_gasto_id: id,
        nombre: newParticipanteNombre,
        email: newParticipanteEmail || null,
      });

      setIsAddParticipanteOpen(false);
      setNewParticipanteNombre('');
      setNewParticipanteEmail('');
      await loadParticipantes();
      alert('Participante agregado correctamente');
    } catch (err) {
      alert(err.response?.data?.message || 'Error al agregar el participante');
    }
    setAddParticipanteLoading(false);
  };

  const handleDeleteParticipante = async (participanteId) => {
    if (!confirm('¿Deseas eliminar este participante?')) return;
    try {
      await participanteService.delete(participanteId);
      await loadParticipantes();
      alert('Participante eliminado');
    } catch (err) {
      alert('Error al eliminar el participante');
    }
  };

  const handleDeleteGasto = async (gastoId) => {
    if (!confirm('¿Deseas eliminar este gasto?')) return;
    try {
      await gastoCompartidoService.delete(gastoId);
      await loadGastos();
      alert('Gasto eliminado');
    } catch (err) {
      alert('Error al eliminar el gasto');
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
      )}

      {/* Invite Modal */}
      {isInviteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-lg shadow-xl max-w-md w-full p-6">
            <h2 className="text-xl font-bold text-foreground mb-4">Invitar Usuario</h2>
            <p className="text-sm text-muted-foreground mb-4">
              Invita a un usuario registrado para que pueda ver y gestionar el grupo
            </p>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  Email del usuario
                </label>
                <input
                  type="email"
                  value={inviteEmail}
                  onChange={e => setInviteEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-border bg-input text-foreground rounded-md"
                  placeholder="usuario@ejemplo.com"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={handleInvitar}
                disabled={!inviteEmail.trim() || inviteLoading}
                className="flex-1 bg-primary text-primary-foreground py-2 rounded-lg hover:bg-primary/90 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {inviteLoading ? <BtnLoading text="Enviando..." /> : (
                  <>
                    <Mail className="w-4 h-4" />
                    Enviar Invitación
                  </>
                )}
              </button>
              <button
                onClick={() => {
                  setIsInviteModalOpen(false);
                  setInviteEmail('');
                }}
                className="flex-1 bg-muted text-foreground py-2 rounded-lg hover:bg-muted/80"
                disabled={inviteLoading}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Participant Modal */}
      {isAddParticipanteOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-lg shadow-xl max-w-md w-full p-6">
            <h2 className="text-xl font-bold text-foreground mb-4">Agregar Participante</h2>
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
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={handleAddParticipante}
                disabled={!newParticipanteNombre.trim() || addParticipanteLoading}
                className="flex-1 bg-primary text-primary-foreground py-2 rounded-lg hover:bg-primary/90 disabled:opacity-50"
              >
                {addParticipanteLoading ? <BtnLoading text="Agregando..." /> : 'Agregar'}
              </button>
              <button
                onClick={() => {
                  setIsAddParticipanteOpen(false);
                  setNewParticipanteNombre('');
                  setNewParticipanteEmail('');
                }}
                className="flex-1 bg-muted text-foreground py-2 rounded-lg hover:bg-muted/80"
                disabled={addParticipanteLoading}
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
            <span className="hidden sm:inline">Nuevo Gasto</span>
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 border-b border-border overflow-x-auto">
          <button
            onClick={() => setActiveTab('gastos')}
            className={`px-4 py-2 font-medium transition-colors whitespace-nowrap ${
              activeTab === 'gastos'
                ? 'text-primary border-b-2 border-primary'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Gastos
          </button>
          <button
            onClick={() => setActiveTab('balances')}
            className={`px-4 py-2 font-medium transition-colors whitespace-nowrap ${
              activeTab === 'balances'
                ? 'text-primary border-b-2 border-primary'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Balances
            </div>
          </button>
          <button
            onClick={() => setActiveTab('participantes')}
            className={`px-4 py-2 font-medium transition-colors whitespace-nowrap ${
              activeTab === 'participantes'
                ? 'text-primary border-b-2 border-primary'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Participantes
          </button>
          <button
            onClick={() => setActiveTab('miembros')}
            className={`px-4 py-2 font-medium transition-colors whitespace-nowrap ${
              activeTab === 'miembros'
                ? 'text-primary border-b-2 border-primary'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Usuarios
          </button>
        </div>

        {/* Content */}
        {activeTab === 'gastos' && (
          <div className="space-y-4">
            {gastosCompartidos.length === 0 ? (
              <div className="bg-card border border-border rounded-lg p-8 text-center">
                <p className="text-muted-foreground mb-4">No hay gastos registrados</p>
                <button
                  onClick={() => setIsAddExpenseOpen(true)}
                  className="bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 inline-flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Agregar primer gasto
                </button>
              </div>
            ) : (
              gastosCompartidos.map(gasto => (
                <div key={gasto.id} className="bg-card border border-border rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground">{gasto.descripcion}</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        Pagado por: {gasto.pagador?.nombre}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(gasto.fecha).toLocaleDateString('es-ES')}
                      </p>
                      <div className="mt-2">
                        <p className="text-xs text-muted-foreground">
                          Dividido entre: {gasto.aportes?.map(a => a.participante?.nombre).join(', ')}
                        </p>
                      </div>
                    </div>
                    <div className="text-right flex flex-col items-end gap-2">
                      <p className="text-xl font-bold text-foreground">
                        ${parseFloat(gasto.monto_total).toFixed(2)}
                      </p>
                      <button
                        onClick={() => handleDeleteGasto(gasto.id)}
                        className="text-destructive hover:underline text-sm"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  
                  {/* Mostrar aportes */}
                  {gasto.aportes && gasto.aportes.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-border">
                      <p className="text-sm font-medium text-foreground mb-2">Aportes:</p>
                      <div className="grid grid-cols-2 gap-2">
                        {gasto.aportes.map(aporte => (
                          <div key={aporte.id} className="text-sm">
                            <span className="text-foreground">{aporte.participante?.nombre}:</span>{' '}
                            <span className={`font-medium ${
                              aporte.estado === 'pagado' ? 'text-success' : 'text-muted-foreground'
                            }`}>
                              ${parseFloat(aporte.monto_asignado).toFixed(2)}
                              {aporte.estado === 'pagado' && ' ✓'}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'balances' && balances && (
          <div className="space-y-6">
            {/* Resumen de Balances */}
            <div className="bg-card border border-border rounded-lg p-4 lg:p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Balance por Participante
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {balances.balances?.map(balance => (
                  <div 
                    key={balance.participante_id}
                    className={`p-4 rounded-lg border ${
                      balance.balance > 0 
                        ? 'bg-success/10 border-success/30' 
                        : balance.balance < 0 
                        ? 'bg-destructive/10 border-destructive/30'
                        : 'bg-muted/30 border-border'
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        balance.es_usuario ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                      }`}>
                        {balance.nombre.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-foreground">{balance.nombre}</p>
                        {balance.email && (
                          <p className="text-xs text-muted-foreground">{balance.email}</p>
                        )}
                      </div>
                    </div>
                    
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Pagó:</span>
                        <span className="font-medium text-foreground">${balance.total_pagado.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Debe:</span>
                        <span className="font-medium text-foreground">${balance.total_debe.toFixed(2)}</span>
                      </div>
                      <div className="pt-2 border-t border-border/50 flex justify-between">
                        <span className="font-semibold text-foreground">Balance:</span>
                        <span className={`font-bold ${
                          balance.balance > 0 
                            ? 'text-success' 
                            : balance.balance < 0 
                            ? 'text-destructive'
                            : 'text-muted-foreground'
                        }`}>
                          {balance.balance > 0 ? '+' : ''}${balance.balance.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Transacciones Sugeridas */}
            {balances.transacciones && balances.transacciones.length > 0 && (
              <div className="bg-card border border-border rounded-lg p-4 lg:p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4">
                  Transacciones para Equilibrar
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Estas son las transferencias mínimas necesarias para saldar todas las deudas:
                </p>
                <div className="space-y-3">
                  {balances.transacciones.map((transaccion, index) => (
                    <div 
                      key={index}
                      className="flex items-center gap-4 p-4 bg-muted/30 rounded-lg"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-destructive/20 text-destructive flex items-center justify-center text-sm font-medium">
                            {transaccion.de_nombre.charAt(0).toUpperCase()}
                          </div>
                          <span className="font-medium text-foreground">
                            {transaccion.de_nombre}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <ArrowRight className="w-5 h-5 text-muted-foreground" />
                        <div className="bg-primary text-primary-foreground px-3 py-1 rounded-full font-bold">
                          ${transaccion.monto.toFixed(2)}
                        </div>
                        <ArrowRight className="w-5 h-5 text-muted-foreground" />
                      </div>

                      <div className="flex-1 flex justify-end">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-foreground">
                            {transaccion.para_nombre}
                          </span>
                          <div className="w-8 h-8 rounded-full bg-success/20 text-success flex items-center justify-center text-sm font-medium">
                            {transaccion.para_nombre.charAt(0).toUpperCase()}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {balances.transacciones && balances.transacciones.length === 0 && (
              <div className="bg-card border border-border rounded-lg p-8 text-center">
                <div className="text-6xl mb-4">✅</div>
                <h3 className="text-lg font-semibold text-foreground mb-2">¡Todo equilibrado!</h3>
                <p className="text-muted-foreground">No hay deudas pendientes en este grupo</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'participantes' && (
          <div className="space-y-4">
            <button
              onClick={() => setIsAddParticipanteOpen(true)}
              className="w-full bg-primary text-primary-foreground py-3 rounded-lg hover:bg-primary/90 flex items-center justify-center gap-2"
            >
              <UserPlus className="w-5 h-5" />
              Agregar Participante
            </button>

            <div className="bg-card border border-border rounded-lg p-4">
              <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                <User className="w-5 h-5" />
                Participantes ({participantes.length})
              </h3>
              {participantes.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">No hay participantes</p>
              ) : (
                <div className="space-y-2">
                  {participantes.map(p => (
                    <div key={p.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          p.usuario ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                        }`}>
                          {p.nombre.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{p.nombre}</p>
                          {p.email && (
                            <p className="text-sm text-muted-foreground">{p.email}</p>
                          )}
                          {p.usuario && (
                            <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded">
                              Usuario del sistema
                            </span>
                          )}
                        </div>
                      </div>
                      <button
                        onClick={() => handleDeleteParticipante(p.id)}
                        className="text-destructive hover:bg-destructive/10 p-2 rounded transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'miembros' && (
          <div className="space-y-4">
            <button
              onClick={() => setIsInviteModalOpen(true)}
              className="w-full bg-primary text-primary-foreground py-3 rounded-lg hover:bg-primary/90 flex items-center justify-center gap-2"
            >
              <Mail className="w-5 h-5" />
              Invitar Usuario
            </button>

            <div className="bg-card border border-border rounded-lg p-4">
              <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                <UsersIcon className="w-5 h-5" />
                Usuarios con Acceso
              </h3>
              <div className="space-y-2">
                {grupo.miembros?.map(miembro => (
                  <div key={miembro.id} className="flex items-center justify-between p-2 bg-muted/30 rounded">
                    <div>
                      <p className="font-medium text-foreground">{miembro.name}</p>
                      <p className="text-sm text-muted-foreground">{miembro.email}</p>
                    </div>
                    {grupo.creador_id === miembro.id && (
                      <span className="text-xs bg-primary text-primary-foreground px-2 py-1 rounded">
                        Creador
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {invitacionesPendientes.length > 0 && (
              <div className="bg-card border border-border rounded-lg p-4">
                <h3 className="font-semibold text-foreground mb-3">Invitaciones Pendientes</h3>
                <div className="space-y-2">
                  {invitacionesPendientes.map(inv => (
                    <div key={inv.id} className="flex items-center justify-between p-2 bg-muted/30 rounded">
                      <div>
                        <p className="font-medium text-foreground">{inv.email}</p>
                        <p className="text-xs text-muted-foreground">
                          Invitado por {inv.invitador?.name}
                        </p>
                      </div>
                      <button
                        onClick={() => handleCancelarInvitacion(inv.id)}
                        className="text-destructive hover:underline text-sm"
                      >
                        Cancelar
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

export default GrupoDetalleScreen;