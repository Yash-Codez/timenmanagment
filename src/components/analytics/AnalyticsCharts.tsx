import { useMemo } from 'react';
import { useTaskStore } from '@/store/taskStore';
import { CATEGORY_LABELS, formatDuration } from '@/lib/taskUtils';
import { Category } from '@/types/task';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend,
} from 'recharts';

const CATEGORY_COLORS: Record<Category, string> = {
  work: 'hsl(217, 91%, 60%)',
  personal: 'hsl(280, 65%, 60%)',
  health: 'hsl(142, 71%, 45%)',
  learning: 'hsl(38, 92%, 50%)',
};

export function AnalyticsCharts() {
  const tasks = useTaskStore((state) => state.tasks);

  const categoryStats = useMemo(() => {
    const stats = tasks.reduce((acc, task) => {
      if (!acc[task.category]) {
        acc[task.category] = { totalMinutes: 0, tasksCount: 0 };
      }
      acc[task.category].totalMinutes += task.actualTimeMinutes;
      acc[task.category].tasksCount += 1;
      return acc;
    }, {} as Record<Category, { totalMinutes: number; tasksCount: number }>);

    return Object.entries(stats).map(([category, data]) => ({
      name: CATEGORY_LABELS[category as Category],
      category: category as Category,
      minutes: data.totalMinutes,
      tasks: data.tasksCount,
    }));
  }, [tasks]);

  const weeklyStats = useMemo(() => {
    const today = new Date();
    const days = [];
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);
      
      const nextDay = new Date(date);
      nextDay.setDate(nextDay.getDate() + 1);

      const dayTasks = tasks.filter((task) => {
        if (!task.completedAt) return false;
        const completedDate = new Date(task.completedAt);
        return completedDate >= date && completedDate < nextDay;
      });

      days.push({
        day: date.toLocaleDateString('en-US', { weekday: 'short' }),
        completed: dayTasks.length,
        minutes: dayTasks.reduce((sum, t) => sum + t.actualTimeMinutes, 0),
      });
    }

    return days;
  }, [tasks]);

  const estimatedVsActual = useMemo(() => {
    const completedTasks = tasks.filter((t) => t.status === 'completed' && t.estimatedTimeMinutes > 0);
    
    return completedTasks.slice(-10).map((task) => ({
      name: task.title.length > 15 ? task.title.slice(0, 15) + '...' : task.title,
      estimated: task.estimatedTimeMinutes,
      actual: task.actualTimeMinutes,
    }));
  }, [tasks]);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-popover border border-border rounded-lg shadow-elevated p-3">
          <p className="font-medium text-foreground">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {entry.name.includes('minutes') || entry.dataKey === 'minutes' 
                ? formatDuration(entry.value)
                : entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Time by Category - Pie Chart */}
      <div className="stat-card">
        <h3 className="text-lg font-semibold mb-4">Time by Category</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={categoryStats}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="minutes"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {categoryStats.map((entry) => (
                  <Cell key={entry.category} fill={CATEGORY_COLORS[entry.category]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Weekly Progress - Bar Chart */}
      <div className="stat-card">
        <h3 className="text-lg font-semibold mb-4">Weekly Progress</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={weeklyStats}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <Tooltip content={<CustomTooltip />} />
              <Bar 
                dataKey="completed" 
                fill="hsl(var(--primary))" 
                radius={[4, 4, 0, 0]}
                name="Tasks Completed"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Estimated vs Actual Time - Line Chart */}
      <div className="stat-card lg:col-span-2">
        <h3 className="text-lg font-semibold mb-4">Estimated vs Actual Time</h3>
        <div className="h-64">
          {estimatedVsActual.length === 0 ? (
            <div className="h-full flex items-center justify-center text-muted-foreground">
              Complete some tasks to see time comparison
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={estimatedVsActual}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={10} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="estimated" 
                  stroke="hsl(var(--chart-2))" 
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  name="Estimated (min)"
                />
                <Line 
                  type="monotone" 
                  dataKey="actual" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  name="Actual (min)"
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
}
