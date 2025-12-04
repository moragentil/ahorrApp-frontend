import { useState, useEffect } from 'react';
import { PiggyBank, Plus, Edit, Trash2, Save, X, TrendingUp, Eye, EyeOff, CheckCircle2, PiggyBankIcon } from 'lucide-react';
import { ahorroService } from '../services/ahorroService';
import BtnLoading from '../components/BtnLoading';
import AddGoalModal from '../components/Modals/AddGoalModal';
import EditGoalModal from '../components/Modals/EditGoalModal';
import AddAmountModal from '../components/Modals/AddAmountModal';
import ConfirmDeleteModal from '../components/Modals/ConfirmDeleteModal';

function AhorrosScreen({ user }) {
  const [goals, setGoals] = useState([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState(null);
  const [newGoalName, setNewGoalName] = useState('');
  const [newGoalTarget, setNewGoalTarget] = useState('');
  const [newGoalDesc, setNewGoalDesc] = useState('');
  const [newGoalDate, setNewGoalDate] = useState('');
  const [newGoalPriority, setNewGoalPriority] = useState('Media');
  const [newGoalEstado, setNewGoalEstado] = useState('Activo');
  const [addAmount, setAddAmount] = useState('');
  const [addGoalId, setAddGoalId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleteGoalId, setDeleteGoalId] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [showAllGoals, setShowAllGoals] = useState(false);
  const [completeLoadingId, setCompleteLoadingId] = useState(null);
  const [newGoalColor, setNewGoalColor] = useState("#3b82f6"); // color por defecto

  const colorOptions = [
    "#3b82f6", "#10b981", "#8b5cf6", "#ef4444", "#f59e0b",
    "#06b6d4", "#ec4899", "#84cc16", "#f97316", "#6366f1",
  ];

  useEffect(() => {
    ahorroService.getAll().then(data => {
      setGoals(data);
      setLoading(false);
    });
  }, []);

  const totalSaved = goals.reduce((sum, g) => sum + (Number(g.monto_actual) || 0), 0);
  const totalTarget = goals.reduce((sum, g) => sum + (Number(g.monto_objetivo) || 0), 0);
  const percentTotal = totalTarget > 0 ? ((totalSaved / totalTarget) * 100).toFixed(1) : 0;

  const handleAddGoal = async () => {
    if (newGoalName.trim() && newGoalTarget > 0) {
      const newGoal = await ahorroService.create({
        user_id: user.id,
        nombre: newGoalName.trim(),
        descripcion: newGoalDesc,
        monto_objetivo: Number(newGoalTarget),
        monto_actual: 0,
        fecha_limite: newGoalDate || null,
        prioridad: newGoalPriority,
        estado: "Activo",
        color: newGoalColor,
      });
      setGoals([...goals, newGoal]);
      setNewGoalName('');
      setNewGoalTarget('');
      setNewGoalDesc('');
      setNewGoalDate('');
      setNewGoalPriority('Media');
      setNewGoalEstado('Activo');
      setNewGoalColor("#3b82f6");
      setIsAddDialogOpen(false);
    }
  };

  const handleEditGoal = async () => {
    if (editingGoal && newGoalName.trim() && newGoalTarget > 0) {
      const updated = await ahorroService.update(editingGoal.id, {
        nombre: newGoalName.trim(),
        descripcion: newGoalDesc,
        monto_objetivo: Number(newGoalTarget),
        fecha_limite: newGoalDate || null,
        prioridad: newGoalPriority,
        estado: newGoalEstado,
        color: newGoalColor,
      });
      setGoals(goals.map(g => g.id === editingGoal.id ? updated : g));
      setIsEditDialogOpen(false);
      setEditingGoal(null);
      setNewGoalName('');
      setNewGoalTarget('');
      setNewGoalDesc('');
      setNewGoalDate('');
      setNewGoalPriority('Media');
      setNewGoalEstado('Activo');
      setNewGoalColor("#3b82f6");
    }
  };

  const handleDeleteGoal = async (id) => {
    setDeleteLoading(true);
    await ahorroService.delete(id);
    setGoals(goals.filter(g => g.id !== id));
    setDeleteLoading(false);
    setDeleteGoalId(null);
  };

  const openEditDialog = (goal) => {
    setEditingGoal(goal);
    setNewGoalName(goal.nombre);
    setNewGoalTarget(goal.monto_objetivo);
    setNewGoalDesc(goal.descripcion || '');
    setNewGoalDate(goal.fecha_limite ? goal.fecha_limite.split('T')[0] : '');
    setNewGoalPriority(goal.prioridad || 'Media');
    setNewGoalEstado(goal.estado || 'Activo');
    setNewGoalColor(goal.color || "#3b82f6");
    setIsEditDialogOpen(true);
  };

  const openAddAmount = (goalId) => {
    setAddGoalId(goalId);
    setAddAmount('');
  };

  const handleAddAmount = async () => {
    if (addAmount > 0) {
      const goal = goals.find(g => g.id === addGoalId);
      const updated = await ahorroService.update(goal.id, {
        monto_actual: Number(goal.monto_actual) + Number(addAmount)
      });
      setGoals(goals.map(g => g.id === goal.id ? updated : g));
      setAddGoalId(null);
      setAddAmount('');
    }
  };

  // Filtrar objetivos según el estado
  const filteredGoals = showAllGoals
    ? goals
    : goals.filter(g => g.estado === "Activo");

  // Summary stats SOLO de los activos
  const activeGoals = goals.filter(g => g.estado === "Activo");
  const totalActiveSaved = activeGoals.reduce((sum, g) => sum + (Number(g.monto_actual) || 0), 0);
  const totalActiveTarget = activeGoals.reduce((sum, g) => sum + (Number(g.monto_objetivo) || 0), 0);
  const percentActiveTotal = totalActiveTarget > 0 ? ((totalActiveSaved / totalActiveTarget) * 100).toFixed(1) : 0;

  // Función para completar un objetivo
  const handleCompleteGoal = async (goalId) => {
    setCompleteLoadingId(goalId);
    const updated = await ahorroService.update(goalId, { estado: "Completado" });
    setGoals(goals.map(g => g.id === goalId ? updated : g));
    setCompleteLoadingId(null);
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
      {/* MODALS FUERA DEL MAIN */}
      <AddGoalModal
        isOpen={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
        onSave={handleAddGoal}
        newGoalName={newGoalName}
        setNewGoalName={setNewGoalName}
        newGoalTarget={newGoalTarget}
        setNewGoalTarget={setNewGoalTarget}
        newGoalDesc={newGoalDesc}
        setNewGoalDesc={setNewGoalDesc}
        newGoalDate={newGoalDate}
        setNewGoalDate={setNewGoalDate}
        newGoalPriority={newGoalPriority}
        setNewGoalPriority={setNewGoalPriority}
        newGoalColor={newGoalColor}
        setNewGoalColor={setNewGoalColor}
        colorOptions={colorOptions}
        newGoalEstado={newGoalEstado}
        setNewGoalEstado={setNewGoalEstado}
        loading={false}
      />

      <EditGoalModal
        isOpen={isEditDialogOpen}
        onClose={() => setIsEditDialogOpen(false)}
        onSave={handleEditGoal}
        newGoalName={newGoalName}
        setNewGoalName={setNewGoalName}
        newGoalTarget={newGoalTarget}
        setNewGoalTarget={setNewGoalTarget}
        newGoalDesc={newGoalDesc}
        setNewGoalDesc={setNewGoalDesc}
        newGoalDate={newGoalDate}
        setNewGoalDate={setNewGoalDate}
        newGoalPriority={newGoalPriority}
        setNewGoalPriority={setNewGoalPriority}
        newGoalColor={newGoalColor}
        setNewGoalColor={setNewGoalColor}
        colorOptions={colorOptions}
        newGoalEstado={newGoalEstado}
        setNewGoalEstado={setNewGoalEstado}
        loading={false}
      />

      <AddAmountModal
        isOpen={!!addGoalId}
        onClose={() => setAddGoalId(null)}
        onSave={handleAddAmount}
        goal={goals.find(g => g.id === addGoalId)}
        addAmount={addAmount}
        setAddAmount={setAddAmount}
        loading={false}
      />

      <ConfirmDeleteModal
        isOpen={!!deleteGoalId}
        onClose={() => setDeleteGoalId(null)}
        onConfirm={() => handleDeleteGoal(deleteGoalId)}
        loading={deleteLoading}
        accionTitulo="eliminación"
        accion="Eliminar"
        pronombre="el"
        entidad="objetivo"
        accionando="Eliminando"
        nombreElemento={goals.find(g => g.id === deleteGoalId)?.nombre}
      />

      <main className="max-w-7xl mx-auto p-4 lg:p-6 space-y-4 lg:space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-xl lg:text-3xl font-bold text-foreground flex items-center gap-2 mb-1 lg:mb-2">
              Ahorros y Metas
            </h1>
            <p className="text-sm lg:text-base text-muted-foreground">Registra tus objetivos y el dinero ahorrado para cada uno</p>
          </div>
          <div className="flex items-center w-full  lg:justify-end justify-between gap-4">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={showAllGoals}
                onChange={e => setShowAllGoals(e.target.checked)}
                className="accent-primary"
              />
              <span className="text-sm text-foreground">
                Mostrar todos
              </span>
            </label>
            <button
              onClick={() => setIsAddDialogOpen(true)}
              className="bg-primary text-primary-foreground px-2 lg:px-4 py-2 rounded-lg hover:bg-primary/90 flex items-center gap-2 text-sm lg:text-base transition-colors"
            >
              <Plus className="w-4 h-4" />
              Nuevo Objetivo
            </button>
          </div>
        </div>

        {/* Summary Stats SOLO ACTIVOS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 lg:gap-4">
          <div className="bg-card border border-border rounded-lg shadow-sm px-3 py-2">
            <div className="text-xl lg:text-2xl font-bold text-foreground">{activeGoals.length}</div>
            <p className="text-sm lg:text-base text-muted-foreground">Objetivos activos</p>
          </div>
          <div className="bg-card border border-border rounded-lg shadow-sm px-3 py-2">
            <div className="text-xl lg:text-2xl font-bold text-foreground">${totalActiveSaved.toLocaleString()}</div>
            <p className="text-sm lg:text-base text-muted-foreground">Total ahorrado (activos)</p>
          </div>
          <div className="bg-card border border-border rounded-lg shadow-sm px-3 py-2">
            <div className="text-xl lg:text-2xl font-bold text-foreground">{percentActiveTotal}%</div>
            <p className="text-sm lg:text-base text-muted-foreground">Porcentaje global (activos)</p>
          </div>
        </div>

        {/* Goals List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
          {filteredGoals.map(goal => {
            const percent = ((goal.monto_actual / goal.monto_objetivo) * 100).toFixed(1);
            return (
              <div key={goal.id} className="bg-card border border-border rounded-lg shadow-sm p-4 lg:p-6 flex flex-col hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-4 h-4 rounded-full border border-border"
                      style={{ backgroundColor: goal.color || "#e5e7eb" }}
                      title={goal.color}
                    />
                    <h3 className="text-base lg:text-lg font-semibold text-foreground">{goal.nombre}</h3>
                  </div>
                  <div className="flex gap-1">
                    <button
                      onClick={() => openEditDialog(goal)}
                      className="p-1 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setDeleteGoalId(goal.id)}
                      className="p-1 text-destructive/60 hover:text-destructive transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm lg:text-base text-muted-foreground">Meta: ${goal.monto_objetivo.toLocaleString()}</span>
                  <span className="text-sm lg:text-base text-success font-bold flex items-center gap-1">
                    <TrendingUp className="w-4 h-4" />
                    ${goal.monto_actual.toLocaleString()}
                  </span>
                </div>
                <div className="w-full bg-muted rounded-full h-2 mb-2">
                  <div
                    className="h-2 rounded-full transition-all duration-300"
                    style={{ backgroundColor: goal.color, width: `${Math.min(percent, 100)}%` }}
                  />
                </div>
                <p className="text-xs lg:text-sm text-muted-foreground text-center mb-2">{percent}% alcanzado</p>
                <div className="flex gap-2 mt-auto">
                  <button
                    onClick={() => openAddAmount(goal.id)}
                    className="flex-1 bg-primary text-success-foreground py-2 px-2 lg:px-4 rounded-md hover:bg-primary/70 text-sm lg:text-base transition-colors"
                  >
                    Agregar dinero
                  </button>
                  {goal.estado === "Activo" && (
                    <button
                      onClick={() => handleCompleteGoal(goal.id)}
                      disabled={completeLoadingId === goal.id}
                      className="flex-1 bg-muted text-foreground py-2 px-2 lg:px-4 rounded-md hover:bg-muted/80 text-sm lg:text-base flex items-center justify-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      {completeLoadingId === goal.id ? (
                        <BtnLoading text="Completando..." />
                      ) : (
                        <>
                          <CheckCircle2 className="w-4 h-4" />
                          Completar
                        </>
                      )}
                    </button>
                  )}
                  {goal.estado === "Completado" && (
                    <span className="flex-1 bg-success/20 text-success py-2 px-4 rounded-md text-sm lg:text-base flex items-center justify-center gap-1">
                      <CheckCircle2 className="w-4 h-4" />
                      Completado
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Empty State */}
        {filteredGoals.length === 0 && (
          <div className="bg-card border border-border rounded-lg shadow-sm p-8 text-center items-center justify-center flex flex-col">
            <div className="text-muted-foreground mb-4"><PiggyBankIcon size={52} strokeWidth={1.5}/></div>
            <h3 className="text-lg font-semibold text-foreground mb-2">No tienes objetivos de ahorro</h3>
            <p className="text-muted-foreground mb-4">
              Crea tu primer objetivo para empezar a ahorrar
            </p>
            <button
              onClick={() => setIsAddDialogOpen(true)}
              className="bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 flex items-center gap-2 mx-auto transition-colors"
            >
              <Plus className="w-4 h-4" />
              Crear Objetivo
            </button>
          </div>
        )}
      </main>
    </div>
  );
}

export default AhorrosScreen;