import { useState } from 'react';
import { PiggyBank, Plus, Edit, Trash2, Save, X, TrendingUp } from 'lucide-react';

function AhorrosScreen({ user }) {
  const [goals, setGoals] = useState([
    { id: 1, name: "Vacaciones", target: 5000, saved: 2500 },
    { id: 2, name: "Auto Nuevo", target: 20000, saved: 15000 },
    { id: 3, name: "Fondo Emergencia", target: 10000, saved: 3000 },
  ]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState(null);
  const [newGoalName, setNewGoalName] = useState('');
  const [newGoalTarget, setNewGoalTarget] = useState('');
  const [addAmount, setAddAmount] = useState('');
  const [addGoalId, setAddGoalId] = useState(null);

  const totalSaved = goals.reduce((sum, g) => sum + g.saved, 0);
  const totalTarget = goals.reduce((sum, g) => sum + g.target, 0);
  const percentTotal = totalTarget > 0 ? ((totalSaved / totalTarget) * 100).toFixed(1) : 0;

  const handleAddGoal = () => {
    if (newGoalName.trim() && newGoalTarget > 0) {
      setGoals([
        ...goals,
        {
          id: Math.max(0, ...goals.map(g => g.id)) + 1,
          name: newGoalName.trim(),
          target: Number(newGoalTarget),
          saved: 0,
        },
      ]);
      setNewGoalName('');
      setNewGoalTarget('');
      setIsAddDialogOpen(false);
    }
  };

  const handleEditGoal = () => {
    if (editingGoal && newGoalName.trim() && newGoalTarget > 0) {
      setGoals(goals.map(g =>
        g.id === editingGoal.id
          ? { ...g, name: newGoalName.trim(), target: Number(newGoalTarget) }
          : g
      ));
      setIsEditDialogOpen(false);
      setEditingGoal(null);
      setNewGoalName('');
      setNewGoalTarget('');
    }
  };

  const handleDeleteGoal = (id) => {
    setGoals(goals.filter(g => g.id !== id));
  };

  const openEditDialog = (goal) => {
    setEditingGoal(goal);
    setNewGoalName(goal.name);
    setNewGoalTarget(goal.target);
    setIsEditDialogOpen(true);
  };

  const openAddAmount = (goalId) => {
    setAddGoalId(goalId);
    setAddAmount('');
  };

  const handleAddAmount = () => {
    if (addAmount > 0) {
      setGoals(goals.map(g =>
        g.id === addGoalId
          ? { ...g, saved: g.saved + Number(addAmount) }
          : g
      ));
      setAddGoalId(null);
      setAddAmount('');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <main className="max-w-7xl mx-auto p-4 lg:p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <PiggyBank className="w-7 h-7 text-blue-900" />
              Ahorros y Metas
            </h1>
            <p className="text-gray-600">Registra tus objetivos y el dinero ahorrado para cada uno</p>
          </div>
          <button
            onClick={() => setIsAddDialogOpen(true)}
            className="bg-blue-900 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Nuevo Objetivo
          </button>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg shadow-sm px-3 py-2">
            <div className="text-2xl font-bold text-blue-900">{goals.length}</div>
            <p className="text-sm text-gray-700">Objetivos activos</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm px-3 py-2">
            <div className="text-2xl font-bold text-blue-900">${totalSaved.toLocaleString()}</div>
            <p className="text-sm text-gray-700">Total ahorrado</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm px-3 py-2">
            <div className="text-2xl font-bold text-blue-900">{percentTotal}%</div>
            <p className="text-sm text-gray-700">Porcentaje global</p>
          </div>
        </div>

        {/* Goals List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {goals.map(goal => {
            const percent = ((goal.saved / goal.target) * 100).toFixed(1);
            return (
              <div key={goal.id} className="bg-white rounded-lg shadow-sm p-6 flex flex-col">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">{goal.name}</h3>
                  <div className="flex gap-1">
                    <button
                      onClick={() => openEditDialog(goal)}
                      className="p-1 text-gray-400 hover:text-gray-600"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteGoal(goal.id)}
                      className="p-1 text-red-400 hover:text-red-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-600">Meta: ${goal.target.toLocaleString()}</span>
                  <span className="text-sm text-green-700 font-bold flex items-center gap-1">
                    <TrendingUp className="w-4 h-4" />
                    ${goal.saved.toLocaleString()}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
                  <div
                    className="h-3 rounded-full transition-all duration-300 bg-blue-600"
                    style={{ width: `${percent}%` }}
                  />
                </div>
                <p className="text-xs text-gray-600 text-center mb-2">{percent}% alcanzado</p>
                <div className="flex gap-2 mt-auto">
                  <button
                    onClick={() => openAddAmount(goal.id)}
                    className="flex-1 bg-green-600 text-white py-1 px-2 rounded-md hover:bg-green-700 text-sm"
                  >
                    Agregar dinero
                  </button>
                </div>
                {/* Modal para agregar dinero */}
                {addGoalId === goal.id && (
                  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg p-6 w-full max-w-xs">
                      <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-semibold text-gray-900">Agregar dinero</h2>
                        <button
                          onClick={() => setAddGoalId(null)}
                          className="text-gray-400 hover:text-gray-600"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                      <p className="text-gray-600 mb-2">¿Cuánto quieres agregar a <span className="font-bold">{goal.name}</span>?</p>
                      <input
                        type="number"
                        min="1"
                        value={addAmount}
                        onChange={e => setAddAmount(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none mb-4"
                        placeholder="Monto"
                      />
                      <button
                        onClick={handleAddAmount}
                        disabled={!addAmount || addAmount <= 0}
                        className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Save className="w-4 h-4 inline mr-1" />
                        Guardar
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Empty State */}
        {goals.length === 0 && (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <div className="text-6xl mb-4">🐷</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No tienes objetivos de ahorro</h3>
            <p className="text-gray-600 mb-4">
              Crea tu primer objetivo para empezar a ahorrar
            </p>
            <button
              onClick={() => setIsAddDialogOpen(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2 mx-auto"
            >
              <Plus className="w-4 h-4" />
              Crear Objetivo
            </button>
          </div>
        )}

        {/* Add Goal Modal */}
        {isAddDialogOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-900">Nuevo Objetivo de Ahorro</h2>
                <button
                  onClick={() => setIsAddDialogOpen(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre del objetivo
                  </label>
                  <input
                    type="text"
                    placeholder="Ej: Viaje, Auto, Fondo Emergencia..."
                    value={newGoalName}
                    onChange={e => setNewGoalName(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Monto objetivo
                  </label>
                  <input
                    type="number"
                    min="1"
                    placeholder="Ej: 5000"
                    value={newGoalTarget}
                    onChange={e => setNewGoalTarget(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none"
                  />
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setIsAddDialogOpen(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleAddGoal}
                  disabled={!newGoalName.trim() || !newGoalTarget || newGoalTarget <= 0}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Crear Objetivo
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Edit Goal Modal */}
        {isEditDialogOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-900">Editar Objetivo</h2>
                <button
                  onClick={() => setIsEditDialogOpen(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre del objetivo
                  </label>
                  <input
                    type="text"
                    value={newGoalName}
                    onChange={e => setNewGoalName(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Monto objetivo
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={newGoalTarget}
                    onChange={e => setNewGoalTarget(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none"
                  />
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setIsEditDialogOpen(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleEditGoal}
                  disabled={!newGoalName.trim() || !newGoalTarget || newGoalTarget <= 0}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Guardar Cambios
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default AhorrosScreen;