import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { dashboardService } from '../services/dashboardService';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { RefreshCw, DollarSign, CreditCard, TrendingUp, TrendingDown, Target } from 'lucide-react';
import BtnLoading from '../components/BtnLoading';

function HomeScreen({ user, onLogout }) {
  const navigate = useNavigate();
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [dashboard, setDashboard] = useState(null);

  useEffect(() => {
    dashboardService.getHomeData({ month: selectedMonth, year: selectedYear }).then(setDashboard);
  }, [selectedMonth, selectedYear]);

  const months = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  const handleLogout = () => {
    authService.logout();
    onLogout();
    navigate('/login');
  };

  const handleRefresh = () => {
    setSelectedMonth(new Date().getMonth());
    setSelectedYear(new Date().getFullYear());
  };

  if (!dashboard) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <BtnLoading text="Cargando datos..." />
      </div>
    );
  }

  // Datos del backend
  const balance = dashboard.balance_total.valor;
  const balancePercent = dashboard.balance_total.porcentaje_vs_mes_anterior;
  const monthlyIncome = dashboard.ingresos_mes;
  const totalExpenses = dashboard.gastos_mes.valor;
  const expensesPercent = dashboard.gastos_mes.porcentaje_vs_mes_anterior;
  const savingsGoalPercent = dashboard.meta_ahorro.porcentaje;
  const savingsCurrent = dashboard.meta_ahorro.total_ahorrado;
  const savingsTarget = dashboard.meta_ahorro.total_objetivo;
  const expenseData = dashboard.distribucion_categoria.map(cat => ({
    name: cat.categoria,
    value: cat.porcentaje,
    color: cat.color
  }));
  const monthlyData = dashboard.tendencia_mensual.map(m => ({
    month: m.mes,
    gastos: m.gastos,
    ingresos: m.ingresos
  }));
  const movimientosRecientes = dashboard.movimientos_recientes;
  const objetivosAhorro = dashboard.objetivos_ahorro;

  // Solo mostrar los últimos 5 movimientos y objetivos activos
  const movimientosRecientesLimit = movimientosRecientes.slice(0, 5);
  const objetivosAhorroActivos = objetivosAhorro.filter(obj => obj.estado === "Activo");
  const objetivosAhorroLimit = objetivosAhorroActivos.slice(0, 5);

  return (
    <div className="min-h-screen bg-background mt-14 lg:mt-0">
      <main className="max-w-7xl mx-auto p-4 lg:p-6">
        {/* Selector de mes y año con botón de refresh */}
        <div className="mb-4 flex flex-col md:flex-row md:items-center justify-between">
          <div>
            <h2 className="text-xl lg:text-3xl font-bold text-foreground mb-2">
              Resumen de {months[selectedMonth]} {selectedYear}
            </h2>
            <p className="lg:text-base text-sm text-muted-foreground">Tu estado financiero del mes seleccionado</p>
          </div>
          <div className="flex gap-2 mt-2 md:mt-0 items-center">
            <select
              value={selectedMonth}
              onChange={e => setSelectedMonth(Number(e.target.value))}
              className="lg:text-base text-sm border border-border rounded-md px-2 py-1 bg-input text-foreground"
            >
              {months.map((m, idx) => (
                <option key={m} value={idx}>{m}</option>
              ))}
            </select>
            <select
              value={selectedYear}
              onChange={e => setSelectedYear(Number(e.target.value))}
              className="lg:text-base text-sm border border-border rounded-md px-2 py-1 bg-input text-foreground"
            >
              {[2023, 2024, 2025].map(y => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
            <button
              type="button"
              onClick={handleRefresh}
              className="lg:text-base text-sm border border-border rounded-md px-2 py-1 bg-card text-foreground flex items-center hover:bg-muted transition"
              title="Volver al mes actual"
            >
              <RefreshCw className="w-4 h-4 mr-1" />
              Actual
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2 lg:gap-6 mb-6">
          {/* Balance Total */}
          <div className="bg-card border border-border shadow-sm rounded-lg p-2 lg:p-4">
            <div className="flex flex-row items-center justify-between mb-1 lg:mb-2">
              <span className="text-base lg:text-lg font-medium text-muted-foreground">Balance Total</span>
              <DollarSign className="h-4 w-4 text-primary" />
            </div>
            <div>
              <div className={`text-xl lg:text-2xl font-bold mb-2 ${balance >= 0 ? "text-success" : "text-destructive"}`}>
                ${balance.toLocaleString()}
              </div>
              <p className="text-sm text-muted-foreground flex items-center mt-1">
                {balance >= 0 ? (
                  <TrendingUp className="w-3 h-3 mr-1 text-success" />
                ) : (
                  <TrendingDown className="w-3 h-3 mr-1 text-destructive" />
                )}
                {balance >= 0 ? "+" : ""}
                {((balance / monthlyIncome) * 100).toFixed(1)}% vs mes anterior
              </p>
            </div>
          </div>

          {/* Gastos del Mes */}
          <div className="bg-card border border-border shadow-sm rounded-lg p-2 lg:p-4">
            <div className="flex flex-row items-center justify-between mb-1 lg:mb-2">
              <span className="text-base lg:text-lg font-medium text-muted-foreground">Gastos del Mes</span>
              <CreditCard className="h-4 w-4 text-primary" />
            </div>
            <div>
              <div className="text-xl lg:text-2xl mb-2 font-bold text-foreground">${totalExpenses.toLocaleString()}</div>
              <p className="text-sm text-muted-foreground flex items-center mt-1">
                <TrendingUp className="w-3 h-3 mr-1 text-destructive" />
                +12.5% vs mes anterior
              </p>
            </div>
          </div>

          {/* Ingresos */}
          <div className="bg-card border border-border shadow-sm rounded-lg p-2 lg:p-4">
            <div className="flex flex-row items-center justify-between mb-1 lg:mb-2">
              <span className="text-base lg:text-lg font-medium text-muted-foreground">Ingresos</span>
              <TrendingUp className="h-4 w-4 text-primary" />
            </div>
            <div>
              <div className="text-xl lg:text-2xl font-bold mb-2 text-foreground">${monthlyIncome.toLocaleString()}</div>
              <p className="text-sm text-muted-foreground flex items-center mt-1">
                <TrendingUp className="w-3 h-3 mr-1 text-success" />
                Estable
              </p>
            </div>
          </div>

          {/* Meta de Ahorro */}
          <div className="bg-card border border-border shadow-sm rounded-lg p-2 lg:p-4">
            <div className="flex flex-row items-center justify-between mb-1 lg:mb-2">
              <span className="text-base lg:text-lg font-medium text-muted-foreground">Meta de Ahorro</span>
              <Target className="h-4 w-4 text-primary" />
            </div>
            <div>
              <div className="text-xl lg:text-2xl font-bold mb-2 text-foreground">{savingsGoalPercent}%</div>
              <p className="text-sm text-muted-foreground">
                ${savingsCurrent} de ${savingsTarget} objetivo
              </p>
            </div>
          </div>
        </div>

        {/* Gráficos */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-4 lg:mb-8">
          {/* Gráfico de Torta */}
          <div className="bg-card p-4 lg:p-6 rounded-lg shadow-md border border-border">
            <h2 className="text-lg font-semibold text-foreground mb-1 lg:mb-4">Distribución por Categoría</h2>
            <p className="text-sm text-muted-foreground mb-1 lg:mb-4">Gastos del mes seleccionado</p>
            <div className="h-60 lg:h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={expenseData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {expenseData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value) => [`$${value}`, "Gasto"]}
                    contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', color: 'hsl(var(--foreground))' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Gráfico de Barras */}
          <div className="bg-card p-4 lg:p-6 rounded-lg shadow-md border border-border">
            <h2 className="text-lg font-semibold text-foreground mb-1 lg:mb-4">Tendencia Mensual</h2>
            <p className="text-sm text-muted-foreground mb-2 lg:mb-4">Ingresos vs Gastos últimos 6 meses</p>
            <div className="h-60 lg:h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
                  <YAxis stroke="hsl(var(--muted-foreground))" />
                  <Tooltip 
                    formatter={(value) => [`$${value}`, ""]}
                    contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', color: 'hsl(var(--foreground))' }}
                  />
                  <Bar dataKey="ingresos" fill="hsl(var(--success))" name="Ingresos" />
                  <Bar dataKey="gastos" fill="hsl(var(--primary))" name="Gastos" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Secciones principales */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-8">
          <div className="bg-card p-4 lg:p-6 rounded-lg shadow-md border border-border">
            <h2 className="text-lg font-semibold text-foreground mb-2 lg:mb-4">Movimientos Recientes</h2>
            <div className="space-y-1 lg:space-y-3">
              {movimientosRecientesLimit.map((mov, idx) => (
                <div key={idx} className="flex justify-between items-center py-2 border-b border-border">
                  <div>
                    <p className="lg:text-base text-sm font-medium text-foreground">{mov.descripcion}</p>
                    <p className="text-sm text-muted-foreground">{formatDate(mov.fecha)}</p>
                  </div>
                  <span className={`font-medium ${mov.tipo === "ingreso" ? "text-success" : "text-destructive"}`}>
                    {mov.tipo === "ingreso" ? "+" : "-"}
                    ${Math.abs(mov.monto).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-card p-4 lg:p-6 rounded-lg shadow-md border border-border mb-8 lg:mb-0">
            <h2 className="text-lg font-semibold text-foreground mb-4">Objetivos de Ahorro</h2>
            <div className="space-y-4">
              {objetivosAhorroLimit.map((obj, idx) => (
                <div key={idx}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm lg:text-base font-medium text-foreground">{obj.nombre}</span>
                    <span className="text-xs lg:text-sm text-muted-foreground">${obj.monto_actual} / ${obj.monto_objetivo}</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className="h-2 rounded-full"
                      style={{ width: `${obj.porcentaje}%`, backgroundColor: obj.color }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function formatDate(dateString) {
  if (!dateString) return "";
  const date = new Date(dateString);
  const days = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
  const day = days[date.getUTCDay()];
  const dd = String(date.getUTCDate()).padStart(2, "0");
  const mm = String(date.getUTCMonth() + 1).padStart(2, "0");
  const yyyy = date.getUTCFullYear();
  return `${day}, ${dd}/${mm}/${yyyy}`;
}

export default HomeScreen;