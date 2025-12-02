import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, UserPlus, ChevronRight, Mail, Trash2, Users as UsersIcon, User, TrendingUp, ArrowRight, Edit, Shield, Copy, Check, MessageCircle, Link, CheckCheck } from 'lucide-react';
import { grupoGastoService } from '../services/grupoGastoService';
import { invitacionGrupoService } from '../services/invitacionGrupoService';
import { participanteService } from '../services/participanteService';
import { gastoCompartidoService } from '../services/gastoCompartidoService';
import BtnLoading from '../components/BtnLoading';
import EditGroupExpenseModal from '../components/Modals/EditGroupExpenseModal';
import GastoDetalleModal from '../components/Modals/GastoDetalleModal';
import ConfirmarPagoModal from '../components/Modals/ConfirmarPagoModal';
import IconSelector from '../components/IconSelector';
import { renderIcon } from '../utils/iconHelper';
import { toast } from 'sonner';


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
  const [newExpenseIcon, setNewExpenseIcon] = useState('Coins');
  const [selectedPagador, setSelectedPagador] = useState('');
  const [selectedParticipantes, setSelectedParticipantes] = useState([]);
  const [addExpenseLoading, setAddExpenseLoading] = useState(false);

  // Invite modal - cambiar a modal de enlace
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [inviteLink, setInviteLink] = useState('');
  const [inviteLinkLoading, setInviteLinkLoading] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);
  const [invitacionesPendientes, setInvitacionesPendientes] = useState([]);

  // Add participant modal
  const [isAddParticipanteOpen, setIsAddParticipanteOpen] = useState(false);
  const [newParticipanteNombre, setNewParticipanteNombre] = useState('');
  const [newParticipanteEmail, setNewParticipanteEmail] = useState('');
  const [addParticipanteLoading, setAddParticipanteLoading] = useState(false);

  // Edit expense modal
  const [isEditExpenseOpen, setIsEditExpenseOpen] = useState(false);
  const [editingGasto, setEditingGasto] = useState(null);
  const [editExpenseDesc, setEditExpenseDesc] = useState('');
  const [editExpenseMonto, setEditExpenseMonto] = useState('');
  const [editExpenseFecha, setEditExpenseFecha] = useState('');
  const [editExpenseIcon, setEditExpenseIcon] = useState('Coins');
  const [editSelectedPagador, setEditSelectedPagador] = useState('');
  const [editSelectedParticipantes, setEditSelectedParticipantes] = useState([]);
  const [editLoading, setEditLoading] = useState(false);

  // Detalle gasto modal
  const [isDetalleGastoOpen, setIsDetalleGastoOpen] = useState(false);
  const [selectedGasto, setSelectedGasto] = useState(null);

  // Nuevo estado para asociar email a participante
  const [isAssociateEmailOpen, setIsAssociateEmailOpen] = useState(false);
  const [selectedParticipante, setSelectedParticipante] = useState(null);
  const [associateEmail, setAssociateEmail] = useState('');
  const [associateLoading, setAssociateLoading] = useState(false);

  // Confirmar pago balance modal
  const [isConfirmarPagoOpen, setIsConfirmarPagoOpen] = useState(false);
  const [selectedTransaccion, setSelectedTransaccion] = useState(null);
  const [pagoLoading, setPagoLoading] = useState(false);


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
        toast.error('Error al cargar los datos del grupo');
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
      toast.error('Por favor completa todos los campos');
      return;
    }

    setAddExpenseLoading(true);
    try {
      await gastoCompartidoService.create({
        grupo_gasto_id: id,
        pagado_por_participante_id: parseInt(selectedPagador),
        descripcion: newExpenseDesc,
        icono: newExpenseIcon,
        monto_total: parseFloat(newExpenseMonto),
        fecha: newExpenseFecha,
        participantes: selectedParticipantes,
      });

      setIsAddExpenseOpen(false);
      setNewExpenseDesc('');
      setNewExpenseMonto('');
      setNewExpenseIcon('Coins');
      setSelectedPagador('');
      setNewExpenseFecha(new Date().toISOString().split('T')[0]);
      await loadGastos();
      toast.success('Gasto agregado correctamente');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error al agregar el gasto');
    }
    setAddExpenseLoading(false);
  };

  const handleEditGasto = (gasto) => {
    setEditingGasto(gasto);
    setEditExpenseDesc(gasto.descripcion);
    setEditExpenseMonto(gasto.monto_total.toString());
    setEditExpenseFecha(gasto.fecha);
    setEditExpenseIcon(gasto.icono || 'Coins');
    setEditSelectedPagador(gasto.pagador?.id || '');
    
    const participantesIds = gasto.aportes?.map(a => parseInt(a.participante_id)) || [];
    setEditSelectedParticipantes(participantesIds);
    setIsEditExpenseOpen(true);
  };

  const handleUpdateExpense = async () => {
    if (!editExpenseDesc.trim() || !editExpenseMonto || !editSelectedPagador || editSelectedParticipantes.length === 0) {
      toast.error('Por favor completa todos los campos y selecciona al menos un participante');
      return;
    }

    setEditLoading(true);
    try {
      const participantesIds = editSelectedParticipantes.map(id => parseInt(id));
      
      const dataToSend = {
        descripcion: editExpenseDesc,
        icono: editExpenseIcon,
        monto_total: parseFloat(editExpenseMonto),
        fecha: editExpenseFecha,
        pagado_por_participante_id: parseInt(editSelectedPagador),
        participantes: participantesIds,
      };
      
      await gastoCompartidoService.update(editingGasto.id, dataToSend);

      setIsEditExpenseOpen(false);
      setEditingGasto(null);
      setEditExpenseDesc('');
      setEditExpenseMonto('');
      setEditExpenseFecha('');
      setEditExpenseIcon('Coins');
      setEditSelectedPagador('');
      setEditSelectedParticipantes([]);
      
      await loadGastos();
      await loadBalances();
      toast.success('Gasto actualizado correctamente');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error al actualizar el gasto');
    }
    setEditLoading(false);
  };

  const toggleParticipante = (participanteId) => {
    if (selectedParticipantes.includes(participanteId)) {
      setSelectedParticipantes(selectedParticipantes.filter(id => id !== participanteId));
    } else {
      setSelectedParticipantes([...selectedParticipantes, participanteId]);
    }
  };

  const toggleEditParticipante = (participanteId) => {
    const id = parseInt(participanteId);
    setEditSelectedParticipantes(prev => {
      const newList = prev.includes(id) 
        ? prev.filter(pid => pid !== id)
        : [...prev, id];
      return newList;
    });
  };

  const handleCloseEditModal = () => {
    setIsEditExpenseOpen(false);
    setEditingGasto(null);
    setEditExpenseDesc('');
    setEditExpenseMonto('');
    setEditExpenseFecha('');
    setEditSelectedPagador('');
    setEditSelectedParticipantes([]);
  };

  const handleGenerarEnlace = async () => {
    setInviteLinkLoading(true);
    try {
      const response = await invitacionGrupoService.generarEnlaceInvitacion(id);
      setInviteLink(response.url);
      await loadInvitacionesPendientes();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error al generar enlace');
    }
    setInviteLinkLoading(false);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(inviteLink);
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 2000);
    toast.success('Enlace copiado al portapapeles');
  };

  const handleOpenInviteModal = async () => {
    setIsInviteModalOpen(true);
    setInviteLink('');
    setLinkCopied(false);
    await handleGenerarEnlace();
  };

  const handleInvitar = async () => {
    if (!inviteEmail.trim()) return;
    setInviteLoading(true);
    try {
      await invitacionGrupoService.enviarInvitacion(id, inviteEmail);
      setInviteEmail('');
      setIsInviteModalOpen(false);
      toast.success('Invitación enviada correctamente');
      await loadInvitacionesPendientes();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error al enviar la invitación');
    }
    setInviteLoading(false);
  };

  const handleCancelarInvitacion = async (invitacionId) => {
    if (!confirm('¿Deseas cancelar esta invitación?')) return;
    try {
      await invitacionGrupoService.cancelar(invitacionId);
      await loadInvitacionesPendientes();
      toast.success('Invitación cancelada');
    } catch (err) {
      toast.error('Error al cancelar la invitación');
    }
  };

  const handleAddParticipante = async () => {
    if (!newParticipanteNombre.trim()) {
      toast.error('El nombre es obligatorio');
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
      toast.success('Participante agregado correctamente');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error al agregar el participante');
    }
    setAddParticipanteLoading(false);
  };

  const handleDeleteParticipante = async (participanteId) => {
    if (!confirm('¿Deseas eliminar este participante?')) return;
    try {
      await participanteService.delete(participanteId);
      await loadParticipantes();
      toast.success('Participante eliminado');
    } catch (err) {
      toast.error('Error al eliminar el participante');
    }
  };

  const handleDeleteGasto = async (gastoId) => {
    if (!confirm('¿Deseas eliminar este gasto?')) return;
    try {
      await gastoCompartidoService.delete(gastoId);
      await loadGastos();
      toast.success('Gasto eliminado');
    } catch (err) {
      toast.error('Error al eliminar el gasto');
    }
  };

  const handleOpenDetalleGasto = (gasto) => {
    setSelectedGasto(gasto);
    setIsDetalleGastoOpen(true);
  };

  const handleCloseDetalleGasto = () => {
    setIsDetalleGastoOpen(false);
    setSelectedGasto(null);
  };

  const handleOpenAssociateEmail = (participante) => {
    setSelectedParticipante(participante);
    setAssociateEmail(participante.email || '');
    setIsAssociateEmailOpen(true);
  };

  const handleAssociateEmail = async () => {
    if (!associateEmail.trim()) {
      toast.error('El email es obligatorio');
      return;
    }

    setAssociateLoading(true);
    try {
      await participanteService.asociarEmail(selectedParticipante.id, associateEmail);
      await invitacionGrupoService.enviarInvitacion(id, associateEmail);
      
      setIsAssociateEmailOpen(false);
      setSelectedParticipante(null);
      setAssociateEmail('');
      
      await loadParticipantes();
      await loadInvitacionesPendientes();
      
      toast.success('Email asociado e invitación enviada correctamente');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error al asociar email');
    }
    setAssociateLoading(false);
  };

  const handleOpenConfirmarPago = (transaccion) => {
    setSelectedTransaccion(transaccion);
    setIsConfirmarPagoOpen(true);
  };

  const handleConfirmarPago = async () => {
    if (!selectedTransaccion) return;

    setPagoLoading(true);
    try {
      await grupoGastoService.registrarPagoBalance(id, {
        de_participante_id: selectedTransaccion.de_participante_id,
        para_participante_id: selectedTransaccion.para_participante_id,
        monto: parseFloat(selectedTransaccion.monto),
      });

      setIsConfirmarPagoOpen(false);
      setSelectedTransaccion(null);
      
      await Promise.all([
        loadBalances(),
        loadGastos()
      ]);
      
      toast.success('Pago registrado correctamente');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error al registrar el pago');
    }
    setPagoLoading(false);
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
      )}

      {/* Invite Link Modal */}
      {isInviteModalOpen && (
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

                <div className="bg-primary/10 border border-primary/30 rounded-lg p-3">
                  <p className="text-xs text-foreground">
                    ℹ️ <strong>Importante:</strong>
                  </p>
                  <ul className="text-xs text-muted-foreground mt-2 space-y-1 ml-4">
                    <li>• El enlace es válido por 30 días</li>
                    <li>• Solo usuarios con cuenta pueden usarlo</li>
                    <li>• Se les vinculará automáticamente como participantes</li>
                  </ul>
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

            <div className="flex gap-3 mt-6">
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

      {/* Edit Expense Modal */}
      {isEditExpenseOpen && editingGasto && (
        <EditGroupExpenseModal
          isOpen={isEditExpenseOpen}
          onClose={handleCloseEditModal}
          participantes={participantes}
          editExpenseDesc={editExpenseDesc}
          setEditExpenseDesc={setEditExpenseDesc}
          editExpenseMonto={editExpenseMonto}
          setEditExpenseMonto={setEditExpenseMonto}
          editExpenseFecha={editExpenseFecha}
          setEditExpenseFecha={setEditExpenseFecha}
          editExpenseIcon={editExpenseIcon}
          setEditExpenseIcon={setEditExpenseIcon}
          editSelectedPagador={editSelectedPagador}
          setEditSelectedPagador={setEditSelectedPagador}
          editSelectedParticipantes={editSelectedParticipantes}
          toggleEditParticipante={toggleEditParticipante}
          handleUpdateExpense={handleUpdateExpense}
          editLoading={editLoading}
        />
      )}
      
      {/* Detalle Gasto Modal */}
      {isDetalleGastoOpen && selectedGasto && (
        <GastoDetalleModal
          isOpen={isDetalleGastoOpen}
          onClose={handleCloseDetalleGasto}
          gasto={selectedGasto}
        />
      )}

      {/* Associate Email Modal */}
      {isAssociateEmailOpen && selectedParticipante && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-lg shadow-xl max-w-md w-full p-6">
            <h2 className="text-xl font-bold text-foreground mb-4">Asociar Email a Participante</h2>
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
              <div className="bg-primary/10 border border-primary/30 rounded-lg p-3">
                <p className="text-xs text-foreground">
                  💡 <strong>¿Qué sucederá?</strong>
                </p>
                <ul className="text-xs text-muted-foreground mt-2 space-y-1 ml-4">
                  <li>• Se actualizará el email del participante</li>
                  <li>• Se enviará una invitación al email indicado</li>
                  <li>• Al aceptar, se vincularán todos los gastos existentes</li>
                </ul>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={handleAssociateEmail}
                disabled={!associateEmail.trim() || associateLoading}
                className="flex-1 bg-primary text-primary-foreground py-2 rounded-lg hover:bg-primary/90 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {associateLoading ? <BtnLoading text="Enviando..." /> : (
                  <>
                    <Mail className="w-4 h-4" />
                    Asociar y Enviar Invitación
                  </>
                )}
              </button>
              <button
                onClick={() => {
                  setIsAssociateEmailOpen(false);
                  setSelectedParticipante(null);
                  setAssociateEmail('');
                }}
                className="flex-1 bg-muted text-foreground py-2 rounded-lg hover:bg-muted/80"
                disabled={associateLoading}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmar Pago Modal */}
      <ConfirmarPagoModal
        isOpen={isConfirmarPagoOpen}
        onClose={() => {
          setIsConfirmarPagoOpen(false);
          setSelectedTransaccion(null);
        }}
        transaccion={selectedTransaccion}
        onConfirm={handleConfirmarPago}
        loading={pagoLoading}
      />

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
            Balances
          </button>
          <button
            onClick={() => setActiveTab('miembros')}
            className={`px-4 py-2 font-medium transition-colors whitespace-nowrap ${
              activeTab === 'miembros'
                ? 'text-primary border-b-2 border-primary'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <div className="flex items-center gap-2">
              <UsersIcon className="w-4 h-4" />
              Miembros
            </div>
          </button>
        </div>

        {/* Content */}
        {activeTab === 'gastos' && (
          <div className="space-y-3">
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
                <div
                  key={gasto.id}
                  className="bg-card border border-border rounded-lg overflow-hidden hover:shadow-md transition-shadow"
                >
                  {/* Tarjeta clickeable */}
                  <div
                    onClick={() => handleOpenDetalleGasto(gasto)}
                    className="p-4 cursor-pointer hover:bg-muted/20 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                            {renderIcon(gasto.icono || 'Coins', 'w-6 h-6 text-primary')}
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-foreground text-lg">
                              {gasto.descripcion}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              Pagado por {gasto.pagador?.nombre}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <p className="text-xl font-bold text-foreground">
                            ${Math.round(parseFloat(gasto.monto_total || 0)).toLocaleString('es-ES')}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(gasto.fecha).toLocaleDateString('es-ES')}
                          </p>
                        </div>
                        <ChevronRight className="w-5 h-5 text-muted-foreground" />
                      </div>
                    </div>
                  </div>

                  {/* Botones de acción */}
                  <div className="border-t border-border px-4 py-2 bg-muted/5 flex gap-2 justify-end">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditGasto(gasto);
                      }}
                      className="text-primary hover:bg-primary/10 px-3 py-1.5 rounded-lg transition-colors text-sm font-medium flex items-center gap-1"
                    >
                      <Edit className="w-4 h-4" />
                      Editar
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteGasto(gasto.id);
                      }}
                      className="text-destructive hover:bg-destructive/10 px-3 py-1.5 rounded-lg transition-colors text-sm font-medium flex items-center gap-1"
                    >
                      <Trash2 className="w-4 h-4" />
                      Eliminar
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'balances' && balances && (
          <div className="space-y-6">
            {/* Transacciones Sugeridas */}
            {balances.transacciones && balances.transacciones.length > 0 && (
              <div className="bg-card border border-border rounded-lg p-4 lg:p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4">
                  Transacciones para Equilibrar
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Estas son las transferencias mínimas necesarias para saldar todas las deudas. Toca una transacción para marcarla como pagada.
                </p>
                <div className="space-y-3">
                  {balances.transacciones.map((transaccion, index) => (
                    <button
                      key={index}
                      onClick={() => handleOpenConfirmarPago(transaccion)}
                      className="w-full flex items-center gap-4 p-4 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer border border-border hover:border-primary/50"
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
                          ${Math.round(parseFloat(transaccion.monto || 0)).toLocaleString('es-ES')}
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
                    </button>
                  ))}
                </div>
              </div>
            )}

            {balances.transacciones && balances.transacciones.length === 0 && (
              <div className="bg-card border border-border w-full flex flex-col justify-center items-center rounded-lg p-8 text-center">
                <div className="text-6xl text-center mb-4"><CheckCheck size={40}/></div>
                <h3 className="text-lg font-semibold text-foreground mb-2">¡Todo equilibrado!</h3>
                <p className="text-muted-foreground">No hay deudas pendientes en este grupo</p>
              </div>
            )}

            {/* Resumen de Balances */}
            <div className="bg-card border border-border rounded-lg p-4 lg:p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Balance por Participante
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {balances.balances?.map(balance => {
                  // Redondear el balance para evitar errores de punto flotante
                  const balanceRedondeado = Math.round(parseFloat(balance.balance || 0));
                  
                  return (
                    <div 
                      key={balance.participante_id}
                      className={`p-4 rounded-lg border ${
                        balanceRedondeado > 0 
                          ? 'bg-success/10 border-success/30' 
                          : balanceRedondeado < 0 
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
                          <span className="font-medium text-foreground">
                            ${Math.round(parseFloat(balance.total_pagado || 0)).toLocaleString('es-ES')}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Debe:</span>
                          <span className="font-medium text-foreground">
                            ${Math.round(parseFloat(balance.total_debe || 0)).toLocaleString('es-ES')}
                          </span>
                        </div>
                        <div className="pt-2 border-t border-border/50 flex justify-between">
                          <span className="font-semibold text-foreground">Balance:</span>
                          <span className={`font-bold ${
                            balanceRedondeado > 0 
                              ? 'text-success' 
                              : balanceRedondeado < 0 
                              ? 'text-destructive'
                              : 'text-muted-foreground'
                          }`}>
                            {balanceRedondeado > 0 ? '+' : ''}${balanceRedondeado.toLocaleString('es-ES')}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'miembros' && (
          <div className="space-y-6">
            {/* Usuarios con Acceso */}
            <div className="bg-card border border-border rounded-lg p-4 lg:p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Usuarios con Acceso al Grupo
                </h3>
                <button
                  onClick={handleOpenInviteModal}
                  className="bg-primary text-primary-foreground px-3 py-2 rounded-lg hover:bg-primary/90 flex items-center gap-2 text-sm"
                >
                  <Link className="w-4 h-4" />
                  Obtener Enlace
                </button>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Usuarios registrados en la aplicación que pueden administrar este grupo
              </p>
              <div className="space-y-2">
                {grupo.miembros?.map(miembro => (
                  <div key={miembro.id} className="flex items-center justify-between p-3 bg-primary/5 border border-primary/20 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold">
                        {miembro.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{miembro.name}</p>
                        <p className="text-sm text-muted-foreground">{miembro.email}</p>
                      </div>
                    </div>
                    {grupo.creador_id === miembro.id && (
                      <span className="text-xs bg-primary text-primary-foreground px-3 py-1 rounded-full font-medium flex items-center gap-1">
                        <Shield className="w-3 h-3" />
                        Creador
                      </span>
                    )}
                  </div>
                ))}
              </div>

              {/* Invitaciones Pendientes */}
              {invitacionesPendientes.length > 0 && (
                <div className="mt-6">
                  <h4 className="text-sm font-semibold text-foreground mb-3">Invitaciones Activas</h4>
                  <div className="space-y-2">
                    {invitacionesPendientes.map(inv => (
                      <div key={inv.id} className="flex items-center justify-between p-3 bg-muted/30 border border-border rounded-lg">
                        <div className="flex-1">
                          {inv.es_enlace ? (
                            <>
                              <p className="font-medium text-foreground flex items-center gap-2">
                                <Link className="w-4 h-4 text-primary" />
                                Enlace de invitación
                              </p>
                              <p className="text-xs text-muted-foreground ml-6">
                                Creado por {inv.invitador?.name} • Expira: {new Date(inv.expira_en).toLocaleDateString('es-ES')}
                              </p>
                            </>
                          ) : (
                            <>
                              <p className="font-medium text-foreground flex items-center gap-2">
                                <Mail className="w-4 h-4 text-muted-foreground" />
                                {inv.email}
                              </p>
                              <p className="text-xs text-muted-foreground ml-6">
                                Invitado por {inv.invitador?.name}
                              </p>
                            </>
                          )}
                        </div>
                        <button
                          onClick={() => handleCancelarInvitacion(inv.id)}
                          className="text-destructive hover:bg-destructive/10 px-3 py-1 rounded-lg transition-colors text-sm"
                        >
                          Cancelar
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Participantes */}
            <div className="bg-card border border-border rounded-lg p-4 lg:p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                  <UsersIcon className="w-5 h-5" />
                  Participantes del Grupo ({participantes.length})
                </h3>
                <button
                  onClick={() => setIsAddParticipanteOpen(true)}
                  className="bg-primary text-primary-foreground px-3 py-2 rounded-lg hover:bg-primary/90 flex items-center gap-2 text-sm"
                >
                  <UserPlus className="w-4 h-4" />
                  Agregar Participante
                </button>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Personas que comparten gastos (pueden ser usuarios registrados o no)
              </p>
              {participantes.length === 0 ? (
                <div className="text-center py-8">
                  <User className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-50" />
                  <p className="text-muted-foreground mb-4">No hay participantes en este grupo</p>
                  <button
                    onClick={() => setIsAddParticipanteOpen(true)}
                    className="bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 inline-flex items-center gap-2"
                  >
                    <UserPlus className="w-4 h-4" />
                    Agregar Primer Participante
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {participantes.map(p => (
                    <div key={p.id} className="bg-muted/30 border border-border rounded-lg hover:bg-muted/40 transition-colors">
                      <div className="flex items-center justify-between p-3">
                        <div className="flex items-center gap-3 flex-1">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                            p.usuario ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                          }`}>
                            {p.nombre.charAt(0).toUpperCase()}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-foreground truncate">{p.nombre}</p>
                            {p.email ? (
                              <p className="text-sm text-muted-foreground truncate">{p.email}</p>
                            ) : (
                              <p className="text-xs text-muted-foreground italic">Sin email asociado</p>
                            )}
                            {p.usuario && (
                              <span className="inline-flex items-center gap-1 text-xs bg-primary/20 text-primary px-2 py-0.5 rounded mt-1">
                                <Shield className="w-3 h-3" />
                                Usuario del sistema
                              </span>
                            )}
                          </div>
                        </div>
                        <button
                          onClick={() => handleDeleteParticipante(p.id)}
                          className="text-destructive hover:bg-destructive/10 p-2 rounded-lg transition-colors ml-2"
                          title="Eliminar participante"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      
                      {/* Botón de asociar email - solo si NO tiene usuario vinculado */}
                      {!p.usuario && (
                        <div className="border-t border-border px-3 py-2 bg-muted/10">
                          <button
                            onClick={() => handleOpenAssociateEmail(p)}
                            className="w-full text-primary hover:bg-primary/10 px-3 py-1.5 rounded-lg transition-colors text-sm font-medium flex items-center justify-center gap-2"
                          >
                            <Mail className="w-4 h-4" />
                            {p.email ? 'Actualizar email e invitar' : 'Asociar email e invitar'}
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Modals */}
      {isEditExpenseOpen && editingGasto && (
        <EditGroupExpenseModal
          isOpen={isEditExpenseOpen}
          onClose={handleCloseEditModal}
          participantes={participantes}
          editExpenseDesc={editExpenseDesc}
          setEditExpenseDesc={setEditExpenseDesc}
          editExpenseMonto={editExpenseMonto}
          setEditExpenseMonto={setEditExpenseMonto}
          editExpenseFecha={editExpenseFecha}
          setEditExpenseFecha={setEditExpenseFecha}
          editExpenseIcon={editExpenseIcon}
          setEditExpenseIcon={setEditExpenseIcon}
          editSelectedPagador={editSelectedPagador}
          setEditSelectedPagador={setEditSelectedPagador}
          editSelectedParticipantes={editSelectedParticipantes}
          toggleEditParticipante={toggleEditParticipante}
          handleUpdateExpense={handleUpdateExpense}
          editLoading={editLoading}
        />
      )}
      
      {isDetalleGastoOpen && selectedGasto && (
        <GastoDetalleModal
          isOpen={isDetalleGastoOpen}
          onClose={handleCloseDetalleGasto}
          gasto={selectedGasto}
        />
      )}
    </div>
  );
}

export default GrupoDetalleScreen;