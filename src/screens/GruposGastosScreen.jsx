import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Plus, Trash2, ChevronRight, Mail, Check, X, Clock, UserPlus, Shield } from 'lucide-react';
import { grupoGastoService } from '../services/grupoGastoService';
import { invitacionGrupoService } from '../services/invitacionGrupoService';
import BtnLoading from '../components/BtnLoading';
import ConfirmDeleteModal from '../components/Modals/ConfirmDeleteModal';
import { toast } from 'sonner';

function GruposGastosScreen({ user }) {
  const navigate = useNavigate();
  const [grupos, setGrupos] = useState([]);
  const [invitaciones, setInvitaciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [invitacionesLoading, setInvitacionesLoading] = useState(true);
  const [deleteGrupoId, setDeleteGrupoId] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newGrupoNombre, setNewGrupoNombre] = useState('');
  const [newGrupoDesc, setNewGrupoDesc] = useState('');
  const [participantesExternos, setParticipantesExternos] = useState([]);
  const [nuevoParticipante, setNuevoParticipante] = useState('');
  const [addLoading, setAddLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(null);
  const [isJoinDialogOpen, setIsJoinDialogOpen] = useState(false);
  const [joinLink, setJoinLink] = useState('');
  const [joinLoading, setJoinLoading] = useState(false);

  useEffect(() => {
    loadGrupos();
    loadInvitaciones();
  }, []);

  const loadGrupos = async () => {
    setLoading(true);
    const data = await grupoGastoService.getAll();
    setGrupos(data);
    setLoading(false);
  };

  const loadInvitaciones = async () => {
    setInvitacionesLoading(true);
    try {
      const data = await invitacionGrupoService.misInvitaciones();
      setInvitaciones(data);
    } catch (err) {
      console.error('Error al cargar invitaciones:', err);
    }
    setInvitacionesLoading(false);
  };

  const handleAddParticipante = () => {
    if (nuevoParticipante.trim() && !participantesExternos.includes(nuevoParticipante.trim())) {
      setParticipantesExternos([...participantesExternos, nuevoParticipante.trim()]);
      setNuevoParticipante('');
    }
  };

  const handleRemoveParticipante = (index) => {
    setParticipantesExternos(participantesExternos.filter((_, i) => i !== index));
  };

  const handleAddGrupo = async () => {
    if (!newGrupoNombre.trim()) {
      toast.error('El nombre del grupo es obligatorio');
      return;
    }
    
    setAddLoading(true);
    try {
      const newGrupo = await grupoGastoService.create({
        nombre: newGrupoNombre,
        descripcion: newGrupoDesc,
        participantes_externos: participantesExternos,
      });
      setGrupos([...grupos, newGrupo]);
      setIsAddDialogOpen(false);
      setNewGrupoNombre('');
      setNewGrupoDesc('');
      setParticipantesExternos([]);
      toast.success('Grupo creado correctamente');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error al crear el grupo');
    }
    setAddLoading(false);
  };

  const handleDeleteGrupo = async (id) => {
    setDeleteLoading(true);
    await grupoGastoService.delete(id);
    setGrupos(grupos.filter(g => g.id !== id));
    setDeleteLoading(false);
    setDeleteGrupoId(null);
  };

  const handleAceptarInvitacion = async (token) => {
    setActionLoading(token);
    try {
      await invitacionGrupoService.aceptar(token);
      setInvitaciones(invitaciones.filter(inv => inv.token !== token));
      await loadGrupos();
      toast.success('¡Te has unido al grupo exitosamente!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error al aceptar la invitación');
    }
    setActionLoading(null);
  };

  const handleRechazarInvitacion = async (token) => {
    setActionLoading(token);
    try {
      await invitacionGrupoService.rechazar(token);
      setInvitaciones(invitaciones.filter(inv => inv.token !== token));
    } catch (err) {
      toast.error('Error al rechazar la invitación');
    }
    setActionLoading(null);
  };

  const handleJoinByLink = async () => {
    const trimmed = joinLink.trim();
    if (!trimmed) {
      toast.error('Pegá el enlace o token de invitación');
      return;
    }
    const token = trimmed.split('/').filter(Boolean).pop();
    setJoinLoading(true);
    try {
      await invitacionGrupoService.aceptar(token);
      await loadGrupos();
      setIsJoinDialogOpen(false);
      setJoinLink('');
      toast.success('¡Te has unido al grupo exitosamente!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Enlace o token inválido');
    }
    setJoinLoading(false);
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
      <ConfirmDeleteModal
        isOpen={!!deleteGrupoId}
        onClose={() => setDeleteGrupoId(null)}
        onConfirm={() => handleDeleteGrupo(deleteGrupoId)}
        loading={deleteLoading}
        accionTitulo="eliminación"
        accion="Eliminar"
        pronombre="el"
        entidad="grupo"
        accionando="Eliminando"
        nombreElemento={grupos.find(g => g.id === deleteGrupoId)?.nombre}
      />

      {/* Join Group Modal */}
      {isJoinDialogOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-lg shadow-xl max-w-md w-full p-6">
            <h2 className="text-xl font-bold text-foreground mb-4">Unirme a un grupo</h2>
            <p className="text-sm text-muted-foreground mb-3">
              Pegá el enlace o token de invitación compartido por un integrante del grupo.
            </p>
            <input
              type="text"
              value={joinLink}
              onChange={e => setJoinLink(e.target.value)}
              className="w-full px-3 py-2 border border-border bg-input text-foreground rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="https://app.com/invitaciones/abcdef123 o solo el token"
            />
            <div className="flex gap-3 mt-6">
              <button
                onClick={handleJoinByLink}
                disabled={joinLoading}
                className="flex-1 bg-primary text-primary-foreground py-2 rounded-lg hover:bg-primary/90 disabled:opacity-50 transition-colors"
              >
                {joinLoading ? <BtnLoading text="Uniendo..." /> : 'Unirme'}
              </button>
              <button
                onClick={() => { setIsJoinDialogOpen(false); setJoinLink(''); }}
                className="flex-1 bg-muted text-foreground py-2 rounded-lg hover:bg-muted/80 transition-colors"
                disabled={joinLoading}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Group Modal */}
      {isAddDialogOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-lg shadow-xl max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold text-foreground mb-4">Nuevo Grupo de Gastos</h2>
            <div className="space-y-4">
              {/* Nombre */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  Nombre del Grupo *
                </label>
                <input
                  type="text"
                  value={newGrupoNombre}
                  onChange={e => setNewGrupoNombre(e.target.value)}
                  className="w-full px-3 py-2 border border-border bg-input text-foreground rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Ej: Viaje a la playa"
                />
              </div>

              {/* Participantes */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  Participantes
                </label>
                <p className="text-xs text-muted-foreground mb-3">
                  Agrega los nombres de las personas que compartirán gastos
                </p>

                {/* Usuario actual (siempre visible) */}
                <div className="mb-3 p-3 bg-primary/10 border border-primary/30 rounded-lg">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-semibold">
                      {user?.name?.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground">{user?.name}</p>
                      <p className="text-xs text-muted-foreground">{user?.email}</p>
                    </div>
                    <div className="flex items-center gap-1 text-xs bg-primary text-primary-foreground px-2 py-1 rounded-full font-medium">
                      <Shield className="w-3 h-3" />
                      Tú
                    </div>
                  </div>
                </div>

                {/* Agregar otros participantes */}
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={nuevoParticipante}
                    onChange={e => setNuevoParticipante(e.target.value)}
                    onKeyPress={e => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddParticipante();
                      }
                    }}
                    className="flex-1 px-3 py-2 border border-border bg-input text-foreground rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Nombre del participante"
                  />
                  <button
                    type="button"
                    onClick={handleAddParticipante}
                    className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition-colors flex items-center gap-1"
                  >
                    <Plus className="w-4 h-4" />
                    <span className="hidden sm:inline">Agregar</span>
                  </button>
                </div>
                
                {/* Lista de otros participantes */}
                {participantesExternos.length > 0 && (
                  <div className="space-y-1 mt-3">
                    <p className="text-xs font-medium text-foreground mb-2">
                      Otros participantes ({participantesExternos.length}):
                    </p>
                    <div className="max-h-32 overflow-y-auto space-y-1">
                      {participantesExternos.map((nombre, index) => (
                        <div key={index} className="flex items-center justify-between bg-muted/30 px-3 py-2 rounded-md group">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-full bg-muted text-muted-foreground flex items-center justify-center text-sm font-medium">
                              {nombre.charAt(0).toUpperCase()}
                            </div>
                            <span className="text-sm text-foreground">{nombre}</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleRemoveParticipante(index)}
                            className="text-destructive hover:bg-destructive/10 p-1 rounded transition-colors opacity-0 group-hover:opacity-100"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {participantesExternos.length === 0 && (
                  <p className="text-xs text-muted-foreground mt-2 text-center py-3 bg-muted/20 rounded-md">
                    No hay otros participantes agregados
                  </p>
                )}
              </div>

              {/* Descripción */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  Descripción (Opcional)
                </label>
                <textarea
                  value={newGrupoDesc}
                  onChange={e => setNewGrupoDesc(e.target.value)}
                  className="w-full px-3 py-2 border border-border bg-input text-foreground rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  rows={3}
                  placeholder="Descripción del grupo..."
                />
              </div>
            </div>

            {/* Botones */}
            <div className="flex gap-3 mt-6">
              <button
                onClick={handleAddGrupo}
                disabled={!newGrupoNombre.trim() || addLoading}
                className="flex-1 bg-primary text-primary-foreground py-2 rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {addLoading ? <BtnLoading text="Creando..." /> : 'Crear Grupo'}
              </button>
              <button
                onClick={() => {
                  setIsAddDialogOpen(false);
                  setNewGrupoNombre('');
                  setNewGrupoDesc('');
                  setParticipantesExternos([]);
                  setNuevoParticipante('');
                }}
                className="flex-1 bg-muted text-foreground py-2 rounded-lg hover:bg-muted/80 transition-colors"
                disabled={addLoading}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      <main className="max-w-7xl mx-auto p-4 lg:p-6 space-y-4 lg:space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-xl lg:text-3xl font-bold text-foreground mb-1 lg:mb-2">
              Gastos Compartidos
            </h1>
            <p className="lg:text-base text-sm text-muted-foreground">
              Gestiona gastos con amigos y familia
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 w-full md:w-fit">
            <button
              onClick={() => setIsJoinDialogOpen(true)}
              className="text-sm lg:text-base bg-secondary text-secondary-foreground px-2 lg:px-4 py-2 rounded-lg hover:bg-secondary/90 flex items-center gap-2 transition-colors"
            >
              <UserPlus className="w-4 h-4" />
              Unirme a un grupo
            </button>
            <button
              onClick={() => setIsAddDialogOpen(true)}
              className="text-sm lg:text-base bg-primary text-primary-foreground px-2 text-center justify-center lg:px-4 py-2 rounded-lg hover:bg-primary/90 flex items-center gap-2 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Nuevo Grupo
            </button>
          </div>
        </div>

        {/* Invitaciones Pendientes */}
        {!invitacionesLoading && invitaciones.length > 0 && (
          <div className="bg-card border-2 border-primary/50 rounded-lg shadow-sm p-4 lg:p-6">
            <div className="flex items-center gap-2 mb-4">
              <Mail className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-semibold text-foreground">
                Invitaciones Pendientes ({invitaciones.length})
              </h2>
            </div>
            <div className="space-y-3">
              {invitaciones.map((inv) => (
                <div key={inv.id} className="bg-muted/30 border border-border rounded-lg p-4">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground text-base lg:text-lg">
                        {inv.grupo.nombre}
                      </h3>
                      {inv.grupo.descripcion && (
                        <p className="text-sm text-muted-foreground mt-1">
                          {inv.grupo.descripcion}
                        </p>
                      )}
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 mt-2 text-sm text-muted-foreground">
                        <p>
                          Invitado por: <span className="font-medium text-foreground">{inv.invitador.name}</span>
                        </p>
                        {inv.expira_en && (
                          <p className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            Expira: {new Date(inv.expira_en).toLocaleDateString('es-ES')}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleAceptarInvitacion(inv.token)}
                        disabled={actionLoading === inv.token}
                        className="flex-1 lg:flex-initial bg-success text-success-foreground px-4 py-2 rounded-lg hover:bg-success/90 disabled:opacity-50 flex items-center justify-center gap-2 transition-colors"
                      >
                        {actionLoading === inv.token ? (
                          <BtnLoading text="Aceptando..." />
                        ) : (
                          <>
                            <Check className="w-4 h-4" />
                            Aceptar
                          </>
                        )}
                      </button>
                      <button
                        onClick={() => handleRechazarInvitacion(inv.token)}
                        disabled={actionLoading === inv.token}
                        className="flex-1 lg:flex-initial bg-destructive text-destructive-foreground px-4 py-2 rounded-lg hover:bg-destructive/90 disabled:opacity-50 flex items-center justify-center gap-2 transition-colors"
                      >
                        {actionLoading === inv.token ? (
                          <BtnLoading text="Rechazando..." />
                        ) : (
                          <>
                            <X className="w-4 h-4" />
                            Rechazar
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Mis Grupos */}
        <div>
          <h2 className="text-lg font-semibold text-foreground mb-4">Mis Grupos</h2>
          {grupos.length === 0 ? (
            <div className="bg-card border border-border rounded-lg shadow-sm p-8 text-center flex flex-col items-center justify-center">
              <div className="text-6xl mb-4 text-center"><Users /></div>
              <h3 className="text-lg font-semibold text-foreground mb-2">No tienes grupos</h3>
              <p className="text-muted-foreground mb-4">Crea un grupo para empezar a compartir gastos</p>
              <button
                onClick={() => setIsAddDialogOpen(true)}
                className="bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 flex items-center gap-2 mx-auto transition-colors"
              >
                <Plus className="w-4 h-4" />
                Crear Grupo
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {grupos.map((grupo) => (
                <div
                  key={grupo.id}
                  className="bg-card border border-border rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => navigate(`/grupos-gastos/${grupo.id}`)}
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground text-lg">{grupo.nombre}</h3>
                      {grupo.descripcion && (
                        <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{grupo.descripcion}</p>
                      )}
                    </div>
                    <div className="flex gap-1" onClick={(e) => e.stopPropagation()}>
                      <button
                        className="p-1 text-destructive/60 hover:text-destructive transition-colors"
                        onClick={() => setDeleteGrupoId(grupo.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-3 border-t border-border">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Users className="w-4 h-4" />
                      <span className="text-sm">{grupo.participantes?.length || 0} participantes</span>
                    </div>
                    <ChevronRight className="w-5 h-5 text-muted-foreground" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default GruposGastosScreen;