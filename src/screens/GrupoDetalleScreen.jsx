import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, UserPlus, ChevronRight, Mail, Trash2, Users as UsersIcon, User, TrendingUp, ArrowRight, Edit, Shield, Copy, Check, MessageCircle, Link, CheckCheck, Coins } from 'lucide-react';
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
import ConfirmDeleteModal from '../components/Modals/ConfirmDeleteModal';
import AddGroupExpenseModal from '../components/Modals/AddGroupExpenseModal';
import InviteLinkModal from '../components/Modals/InviteLinkModal';
import AddParticipanteModal from '../components/Modals/AddParticipanteModal';
import AssociateEmailModal from '../components/Modals/AssociateEmailModal';


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

  // Confirm delete modal
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    type: null, // 'deleteGasto', 'deleteParticipante', 'cancelInvitacion'
    itemId: null,
    itemName: '',
  });
  const [confirmLoading, setConfirmLoading] = useState(false);

  // Agregar estado para mostrar todas las invitaciones
  const [showAllInvitations, setShowAllInvitations] = useState(false);

  // Estadísticas
  const [estadisticas, setEstadisticas] = useState({
    total_gastos_grupo: 0,
    total_pagado_usuario: 0
  });


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

  useEffect(() => {
    loadGrupo();
    loadParticipantes();
    loadInvitacionesPendientes();
    loadEstadisticas(); 
  }, [id]);

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
        const ids = data.map(p => p.id);
        setSelectedParticipantes(ids);
        // ✅ Preseleccionar al usuario actual como pagador si existe en participantes
        const participanteActual = data.find(
          p =>
            p.usuario?.id === user?.id ||
            p.user_id === user?.id ||
            p.usuario_id === user?.id
        );
        if (participanteActual) {
          setSelectedPagador(participanteActual.id);
        }
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

  // 🔄 Recargar estadísticas cuando cambian los gastos
  useEffect(() => {
    if (gastosCompartidos.length >= 0) {
      loadEstadisticas();
    }
  }, [gastosCompartidos]);

  const loadInvitacionesPendientes = async () => {
    try {
      const data = await invitacionGrupoService.invitacionesPendientes(id);
      setInvitacionesPendientes(data);
    } catch (err) {
      console.error('Error al cargar invitaciones:', err);
    }
  };

  const loadEstadisticas = async () => {
    try {
      const data = await grupoGastoService.getEstadisticas(id);
      setEstadisticas(data);
    } catch (error) {
      console.error('Error al cargar estadísticas:', error);
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
      await loadBalances();
      await loadEstadisticas(); // 🔄 refrescar stats
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
      await loadEstadisticas(); // 🔄 refrescar stats
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

  const handleOpenConfirmDeleteGasto = (gasto) => {
    setConfirmModal({
      isOpen: true,
      type: 'deleteGasto',
      itemId: gasto.id,
      itemName: gasto.descripcion,
    });
  };

  // handleOpenConfirmDeleteParticipante
  const handleOpenConfirmDeleteParticipante = (participante) => {
    const esUsuarioActual =
      participante.usuario?.id === user?.id ||
      participante.user_id === user?.id ||
      participante.usuario_id === user?.id;

    if (esUsuarioActual) {
      toast.info('No podés eliminarte del grupo.');
      return;
    }

    setConfirmModal({
      isOpen: true,
      type: 'deleteParticipante',
      itemId: participante.id,
      itemName: participante.nombre,
    });
  };

  const handleOpenConfirmCancelInvitacion = (invitacion) => {
    setConfirmModal({
      isOpen: true,
      type: 'cancelInvitacion',
      itemId: invitacion.id,
      itemName: invitacion.email || 'Enlace de invitación',
    });
  };

  const handleConfirmAction = async () => {
    if (!confirmModal.itemId || !confirmModal.type) return;

    setConfirmLoading(true);
    try {
      switch (confirmModal.type) {
        case 'deleteGasto':
          await gastoCompartidoService.delete(confirmModal.itemId);
          await Promise.all([loadGastos(), loadBalances(), loadEstadisticas()]); // 🔄 refrescar stats
          toast.success('Gasto eliminado correctamente');
          break;

        case 'deleteParticipante':
          await participanteService.delete(confirmModal.itemId);
          await loadParticipantes();
          toast.success('Participante eliminado correctamente');
          break;

        case 'cancelInvitacion':
          await invitacionGrupoService.cancelar(confirmModal.itemId);
          await loadInvitacionesPendientes();
          toast.success('Invitación cancelada correctamente');
          break;

        default:
          break;
      }

      handleCloseConfirmModal();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error al realizar la acción');
    }
    setConfirmLoading(false);
  };

  const handleCloseConfirmModal = () => {
    setConfirmModal({
      isOpen: false,
      type: null,
      itemId: null,
      itemName: '',
    });
  };

  // Configuración dinámica del modal según el tipo
  const getConfirmModalProps = () => {
    switch (confirmModal.type) {
      case 'deleteGasto':
        return {
          accionTitulo: 'eliminación',
          accion: 'eliminar',
          pronombre: 'el',
          entidad: 'gasto',
          accionando: 'Eliminando',
          nombreElemento: confirmModal.itemName,
        };
      case 'deleteParticipante':
        return {
          accionTitulo: 'eliminación',
          accion: 'eliminar',
          pronombre: 'el',
          entidad: 'participante',
          accionando: 'Eliminando',
          nombreElemento: confirmModal.itemName,
          advertencia: 'Se eliminarán también sus aportes en los gastos.',
        };
      case 'cancelInvitacion':
        return {
          accionTitulo: 'cancelación',
          accion: 'confirmar',
          pronombre: 'la cancelación de la',
          entidad: 'invitación',
          accionando: 'Cancelando',
        };
      default:
        return {
          accionTitulo: 'confirmación',
          accion: 'confirmar',
          pronombre: '',
          entidad: 'acción',
          accionando: 'Procesando',
        };
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

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(associateEmail)) {
      toast.error('Por favor ingresa un email válido');
      return;
    }

    setAssociateLoading(true);
    try {
      // Solo llamar a asociarEmail - el backend se encarga de la invitación
      const response = await participanteService.asociarEmail(selectedParticipante.id, associateEmail);
      
      console.log('Respuesta:', response);
      
      // Cerrar modal y limpiar estados
      setIsAssociateEmailOpen(false);
      setSelectedParticipante(null);
      setAssociateEmail('');
      
      // Recargar datos
      await Promise.all([
        loadParticipantes(),
        loadInvitacionesPendientes()
      ]);
      
      toast.success(response.message || 'Email asociado e invitación enviada correctamente');
    } catch (err) {
      console.error('Error completo:', err);
      console.error('Response:', err.response);
      
      const errorMessage = err.response?.data?.message || err.response?.data?.error || 'Error al asociar email';
      toast.error(errorMessage);
    } finally {
      setAssociateLoading(false);
    }
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
      
      await Promise.all([loadBalances(), loadGastos()]);
      
      toast.success('Pago registrado correctamente');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error al registrar el pago');
    }
    setPagoLoading(false);
  };

  // ...existing functions (handleAddExpense, handleEditGasto, etc.)...

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
        <AddGroupExpenseModal
          isOpen={isAddExpenseOpen}
          onClose={() => setIsAddExpenseOpen(false)}
          newExpenseIcon={newExpenseIcon}
          setNewExpenseIcon={setNewExpenseIcon}
          newExpenseDesc={newExpenseDesc}
          setNewExpenseDesc={setNewExpenseDesc}
          newExpenseMonto={newExpenseMonto}
          setNewExpenseMonto={setNewExpenseMonto}
          newExpenseFecha={newExpenseFecha}
          setNewExpenseFecha={setNewExpenseFecha}
          selectedPagador={selectedPagador}
          setSelectedPagador={setSelectedPagador}
          participantes={participantes}
          selectedParticipantes={selectedParticipantes}
          toggleParticipante={toggleParticipante}
          handleAddExpense={handleAddExpense}
          addExpenseLoading={addExpenseLoading}
          setIsAddExpenseOpen={setIsAddExpenseOpen}
        />
      )}

      {/* Invite Link Modal */}
      {isInviteModalOpen && (
        <InviteLinkModal 
          inviteLinkLoading={inviteLinkLoading}
          inviteLink={inviteLink}
          handleCopyLink={handleCopyLink}
          linkCopied={linkCopied}
          grupo={grupo}
          setIsInviteModalOpen={setIsInviteModalOpen}
          setInviteLink={setInviteLink}
          setLinkCopied={setLinkCopied}
        />
      )}

      {/* Add Participant Modal */}
      {isAddParticipanteOpen && (
        <AddParticipanteModal
          isOpen={isAddParticipanteOpen}
          onClose={() => {
            setIsAddParticipanteOpen(false);
            setNewParticipanteNombre('');
            setNewParticipanteEmail('');
          }}
          newParticipanteNombre={newParticipanteNombre}
          setNewParticipanteNombre={setNewParticipanteNombre}
          newParticipanteEmail={newParticipanteEmail}
          setNewParticipanteEmail={setNewParticipanteEmail}
          handleAddParticipante={handleAddParticipante}
          addParticipanteLoading={addParticipanteLoading}
        />
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

      {/* Confirm Delete Modal */}
      <ConfirmDeleteModal
        isOpen={confirmModal.isOpen}
        onClose={handleCloseConfirmModal}
        onConfirm={handleConfirmAction}
        loading={confirmLoading}
        {...getConfirmModalProps()}
      />

      {/* Associate Email Modal */}
      {isAssociateEmailOpen && selectedParticipante && (
        <AssociateEmailModal
          isOpen={isAssociateEmailOpen}
          onClose={() => {
            setIsAssociateEmailOpen(false);
            setSelectedParticipante(null);
            setAssociateEmail('');
          }}
          setIsAssociateEmailOpen={setIsAssociateEmailOpen}
          selectedParticipante={selectedParticipante}
          setSelectedParticipante={setSelectedParticipante}
          associateEmail={associateEmail}
          setAssociateEmail={setAssociateEmail}
          associateLoading={associateLoading}
          handleAssociateEmail={handleAssociateEmail}
        />
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
            onClick={() => {
              const participanteActual = participantes.find(
                p =>
                  p.usuario?.id === user?.id ||
                  p.user_id === user?.id ||
                  p.usuario_id === user?.id
              );
              if (participanteActual) {
                setSelectedPagador(participanteActual.id);
              }
              setIsAddExpenseOpen(true);
            }}
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
          <div className='flex flex-col gap-4'>
          {/* Estadísticas de Gastos */}
        <div className="flex justify-between items-center gap-4">
          <div className=" px-2 pb-2 flex justify-center text-center items-center gap-3">
            <div>
              <p className="text-sm text-muted-foreground">Mis Gastos</p>
              <p className="text-2xl font-bold text-foreground">
                ${Math.round(estadisticas.total_pagado_usuario || 0).toLocaleString('es-ES')}
              </p>
            </div>
          </div>
          
          <div className="px-2 pb-2 flex justify-center text-center items-center gap-3">
            <div>
              <p className="text-sm text-muted-foreground">Gastos</p>
              <p className="text-2xl font-bold text-foreground">
                ${Math.round(estadisticas.total_gastos_grupo || 0).toLocaleString('es-ES')}
              </p>
            </div>
          </div>
        </div>
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
                        handleOpenConfirmDeleteGasto(gasto); // ✅ Usar nueva función
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
                  Estas son las transferencias mínimas necesarias para saldar todas las deudas.                </p>
                <div className="space-y-3">
                  {balances.transacciones.map((transaccion, index) => (
                    <div
                      key={index}
                      className="w-full bg-muted/40 border border-border rounded-xl p-4 shadow-sm space-y-3"
                    >
                      <div className="flex items-center justify-center text-sm text-muted-foreground gap-1 flex-wrap">
                        <span className="font-semibold text-foreground">{transaccion.de_nombre}</span>
                        <span>debe a</span>
                        <span className="font-semibold text-foreground">{transaccion.para_nombre}</span>
                      </div>

                      <div className="text-center text-2xl font-bold text-foreground">
                        ${Math.round(parseFloat(transaccion.monto || 0)).toLocaleString('es-ES')}
                      </div>

                      <div className="flex w-full">
                        <button
                          onClick={() => handleOpenConfirmarPago(transaccion)}
                          className="w-full flex items-center  justify-center gap-2 bg-primary text-primary-foreground rounded-lg px-3 py-2 text-sm font-semibold hover:bg-primary/90 transition-colors"
                        >
                          <Check className="w-4 h-4" />
                          ¡Está pagado!
                        </button>
                      </div>
                    </div>
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
                      className={`p-4 rounded-lg border min-w-0 ${
                        balanceRedondeado > 0
                          ? 'bg-success/10 border-success/30'
                          : balanceRedondeado < 0
                          ? 'bg-destructive/10 border-destructive/30'
                          : 'bg-muted/30 border-border'
                      }`}
                    >
                      <div className="flex items-center gap-3 mb-3 min-w-0">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          balance.es_usuario ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                        }`}>
                          {balance.nombre.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-foreground truncate">{balance.nombre}</p>
                          {balance.email && (
                            <p className="text-xs text-muted-foreground truncate">{balance.email}</p>
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
                  <span className='hidden sm:inline'>Obtener Enlace</span>
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
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-sm font-semibold text-foreground">
                      Invitaciones Activas ({invitacionesPendientes.length})
                    </h4>
                    {invitacionesPendientes.length > 3 && (
                      <button
                        onClick={() => setShowAllInvitations(!showAllInvitations)}
                        className="text-primary hover:text-primary/80 text-sm font-medium flex items-center gap-1"
                      >
                        {showAllInvitations ? (
                          <>
                            Ver menos
                            <ChevronRight className="w-4 h-4 rotate-90" />
                          </>
                        ) : (
                          <>
                            Ver todas
                            <ChevronRight className="w-4 h-4 -rotate-90" />
                          </>
                        )}
                      </button>
                    )}
                  </div>
                  <div className="space-y-2">
                    {(showAllInvitations 
                      ? invitacionesPendientes 
                      : invitacionesPendientes.slice(0, 3)
                    ).map(inv => (
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
                          onClick={() => handleOpenConfirmCancelInvitacion(inv)}
                          className="text-destructive hover:bg-destructive/10 px-3 py-1 rounded-lg transition-colors text-sm"
                        >
                          Cancelar
                        </button>
                      </div>
                    ))}
                  </div>
                  {!showAllInvitations && invitacionesPendientes.length > 3 && (
                    <p className="text-xs text-muted-foreground text-center mt-2">
                      Mostrando 3 de {invitacionesPendientes.length} invitaciones
                    </p>
                  )}
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
                  Agregar <span className='hidden sm:inline'>Participante</span>
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
                  {participantes.map(p => {
                    const esPropio =
                      p.usuario?.id === user?.id ||
                      p.user_id === user?.id ||
                      p.usuario_id === user?.id;

                    return (
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
                          {!esPropio && (
                            <button
                              onClick={() => handleOpenConfirmDeleteParticipante(p)}
                              className="text-destructive hover:bg-destructive/10 p-2 rounded-lg transition-colors ml-2"
                              title="Eliminar participante"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                        
                        {/* Botón de asociar email - solo si NO tiene usuario vinculado */}
                        {!p.usuario && (
                          <div className="border-t border-border px-3 py-2 bg-muted/10">
                            <button
                              onClick={() => handleOpenAssociateEmail(p)}
                              className="w-full text-primary hover:bg-primary/10 px-3 py-1 rounded-lg transition-colors text-sm font-medium flex items-center justify-center gap-2"
                            >
                              <Mail className="w-4 h-4" />
                              {p.email ? 'Actualizar email e invitar' : 'Asociar email e invitar'}
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })}
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