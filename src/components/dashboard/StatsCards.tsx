import { useMemo } from 'react';
import { useTaskStore } from '@/store/taskStore';
import { 
  CheckCircle2, 
  Clock, 
  Target, 
  Flame,
  TrendingUp,
  Calendar as CalendarIcon
} from 'lucide-react';
import { formatDuration } from '@/lib/taskUtils';
import { cn } from '@/lib/utils';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  trend?: { value: number; isPositive: boolean };
  className?: string;
}

function StatCard({ title, value, subtitle, icon, trend, className }: StatCardProps) {
  return (
    <div className={cn("stat-card animate-fade-in", className)}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-2xl font-bold mt-1 text-foreground">{value}</p>
          {subtitle && (
            <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
          )}
          {trend && (
            <div className={cn(
              "flex items-center gap-1 mt-2 text-xs font-medium",
              trend.isPositive ? "text-success" : "text-destructive"
            )}>
              <TrendingUp className={cn("w-3 h-3", !trend.isPositive && "rotate-180")} />
              <span>{trend.isPositive ? '+' : ''}{trend.value}% vs last week</span>
            </div>
          )}
        </div>
        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
          {icon}
        </div>
      </div>
    </div>
  );
}

export function StatsCards() {
  const tasks = useTaskStore((state) => state.tasks);

  const stats = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const weekAgo = new Date(today);
    weekAgo.setDate(weekAgo.getDate() - 7);

    const completedToday = tasks.filter((task) => {
      if (!task.completedAt) return false;
      const completedDate = new Date(task.completedAt);
      completedDate.setHours(0, 0, 0, 0);
      return completedDate.getTime() === today.getTime();
    }).length;

    const completedThisWeek = tasks.filter((task) => {
      if (!task.completedAt) return false;
      const completedDate = new Date(task.completedAt);
      return completedDate >= weekAgo;
    }).length;

    const totalTimeToday = tasks
      .filter((task) => {
        if (!task.completedAt) return false;
        const completedDate = new Date(task.completedAt);
        completedDate.setHours(0, 0, 0, 0);
        return completedDate.getTime() === today.getTime();
      })
      .reduce((acc, task) => acc + task.actualTimeMinutes, 0);

    const pendingTasks = tasks.filter((t) => t.status !== 'completed').length;
    
    const inProgressTasks = tasks.filter((t) => t.status === 'in-progress').length;

    // Calculate streak (consecutive days with completed tasks)
    let streak = 0;
    let checkDate = new Date(today);
    while (true) {
      const dayStart = new Date(checkDate);
      dayStart.setHours(0, 0, 0, 0);
      const dayEnd = new Date(checkDate);
      dayEnd.setHours(23, 59, 59, 999);
      
      const completedOnDay = tasks.some((task) => {
        if (!task.completedAt) return false;
        const completedDate = new Date(task.completedAt);
        return completedDate >= dayStart && completedDate <= dayEnd;
      });

      if (completedOnDay || (streak === 0 && checkDate.getTime() === today.getTime())) {
        if (completedOnDay) streak++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        break;
      }
    }

    return {
      completedToday,
      completedThisWeek,
      totalTimeToday,
      pendingTasks,
      inProgressTasks,
      streak,
    };
  }, [tasks]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        title="Completed Today"
        value={stats.completedToday}
        subtitle={`${stats.completedThisWeek} this week`}
        icon={<CheckCircle2 className="w-5 h-5" />}
      />
      <StatCard
        title="Time Tracked"
        value={formatDuration(stats.totalTimeToday)}
        subtitle="Today's focus time"
        icon={<Clock className="w-5 h-5" />}
      />
      <StatCard
        title="Pending Tasks"
        value={stats.pendingTasks}
        subtitle={`${stats.inProgressTasks} in progress`}
        icon={<Target className="w-5 h-5" />}
      />
      <StatCard
        title="Current Streak"
        value={`${stats.streak} days`}
        subtitle="Keep it going!"
        icon={<Flame className="w-5 h-5" />}
      />
    </div>
  );
}
