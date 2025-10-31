import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Plus, Trash2, ChevronRight, Mail, Check, X, Clock } from 'lucide-react';
import { grupoGastoService } from '../services/grupoGastoService';
import { invitacionGrupoService } from '../services/invitacionGrupoService';
import BtnLoading from '../components/BtnLoading';
import ConfirmDeleteModal from '../components/Modals/ConfirmDeleteModal';

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
  const [addLoading, setAddLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(null);

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

  const handleAddGrupo = async () => {
    if (!newGrupoNombre.trim()) return;
    setAddLoading(true);
    try {
      const newGrupo = await grupoGastoService.create({
        nombre: newGrupoNombre,
        descripcion: newGrupoDesc,
      });
      setGrupos([...grupos, newGrupo]);
      setIsAddDialogOpen(false);
      setNewGrupoNombre('');
      setNewGrupoDesc('');
    } catch (err) {
      alert('Error al crear el grupo');
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
      await loadGrupos(); // Recargar grupos
      alert('¡Te has unido al grupo exitosamente!');
    } catch (err) {
      alert(err.response?.data?.message || 'Error al aceptar la invitación');
    }
    setActionLoading(null);
  };

  const handleRechazarInvitacion = async (token) => {
    setActionLoading(token);
    try {
      await invitacionGrupoService.rechazar(token);
      setInvitaciones(invitaciones.filter(inv => inv.token !== token));
    } catch (err) {
      alert('Error al rechazar la invitación');
    }
    setActionLoading(null);
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

      {/* Add Group Modal */}
      {isAddDialogOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-lg shadow-xl max-w-md w-full p-6">
            <h2 className="text-xl font-bold text-foreground mb-4">Nuevo Grupo</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  Nombre del Grupo *
                </label>
                <input
                  type="text"
                  value={newGrupoNombre}
                  onChange={e => setNewGrupoNombre(e.target.value)}
                  className="w-full px-3 py-2 border border-border bg-input text-foreground rounded-md"
                  placeholder="Ej: Viaje a la playa"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  Descripción
                </label>
                <textarea
                  value={newGrupoDesc}
                  onChange={e => setNewGrupoDesc(e.target.value)}
                  className="w-full px-3 py-2 border border-border bg-input text-foreground rounded-md"
                  rows={3}
                  placeholder="Descripción opcional..."
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={handleAddGrupo}
                disabled={!newGrupoNombre.trim() || addLoading}
                className="flex-1 bg-primary text-primary-foreground py-2 rounded-lg hover:bg-primary/90 disabled:opacity-50"
              >
                {addLoading ? <BtnLoading text="Creando..." /> : 'Crear Grupo'}
              </button>
              <button
                onClick={() => setIsAddDialogOpen(false)}
                className="flex-1 bg-muted text-foreground py-2 rounded-lg hover:bg-muted/80"
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
          <button
            onClick={() => setIsAddDialogOpen(true)}
            className="text-sm lg:text-base bg-primary text-primary-foreground px-2 text-center justify-center lg:px-4 py-2 w-1/2 md:w-fit rounded-lg hover:bg-primary/90 flex items-center gap-2 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Nuevo Grupo
          </button>
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
            <div className="bg-card border border-border rounded-lg shadow-sm p-8 text-center">
              <div className="text-6xl mb-4">👥</div>
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
                        <p className="text-sm text-muted-foreground mt-1">{grupo.descripcion}</p>
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
                      <span className="text-sm">{grupo.participantes?.length || 0} miembros</span>
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