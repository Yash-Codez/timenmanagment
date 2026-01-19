import { useMemo } from 'react';
import { useTaskStore } from '@/store/taskStore';
import { TaskItem } from '@/components/tasks/TaskItem';
import { Task } from '@/types/task';
import { Clock, Calendar as CalendarIcon, AlertCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { isOverdue, getRelativeDate } from '@/lib/taskUtils';

interface TodayViewProps {
  onEditTask: (task: Task) => void;
}

export function TodayView({ onEditTask }: TodayViewProps) {
  const tasks = useTaskStore((state) => state.tasks);

  const { todayTasks, overdueTasks, upcomingTasks } = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const nextWeek = new Date(today);
    nextWeek.setDate(nextWeek.getDate() + 7);

    const incomplete = tasks.filter((t) => t.status !== 'completed');

    const overdue = incomplete.filter((task) => isOverdue(task));
    const overdueIds = new Set(overdue.map(t => t.id));

    return {
      todayTasks: incomplete.filter((task) => {
        if (overdueIds.has(task.id)) return false; // Exclude overdue tasks
        if (!task.dueDate) return false;
        const dueDate = new Date(task.dueDate);
        dueDate.setHours(0, 0, 0, 0);
        return dueDate.getTime() === today.getTime();
      }),
      overdueTasks: overdue,
      upcomingTasks: incomplete.filter((task) => {
        if (!task.dueDate) return false;
        const dueDate = new Date(task.dueDate);
        return dueDate >= tomorrow && dueDate < nextWeek;
      }),
    };
  }, [tasks]);

  return (
    <div className="space-y-8">
      {/* Overdue Section */}
      {overdueTasks.length > 0 && (
        <section>
          <div className="flex items-center gap-2 mb-4">
            <AlertCircle className="w-5 h-5 text-destructive" />
            <h2 className="text-lg font-semibold text-destructive">Overdue</h2>
            <Badge variant="destructive">{overdueTasks.length}</Badge>
          </div>
          <div className="space-y-2">
            {overdueTasks.map((task) => (
              <TaskItem key={task.id} task={task} onEdit={onEditTask} />
            ))}
          </div>
        </section>
      )}

      {/* Today Section */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <Clock className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-semibold">Today</h2>
          <Badge>{todayTasks.length}</Badge>
        </div>
        {todayTasks.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground bg-card rounded-xl border border-border/50">
            <p>No tasks due today</p>
            <p className="text-sm mt-1">Enjoy your free time or plan ahead!</p>
          </div>
        ) : (
          <div className="space-y-2">
            {todayTasks.map((task) => (
              <TaskItem key={task.id} task={task} onEdit={onEditTask} />
            ))}
          </div>
        )}
      </section>

      {/* Upcoming Section */}
      {upcomingTasks.length > 0 && (
        <section>
          <div className="flex items-center gap-2 mb-4">
            <CalendarIcon className="w-5 h-5 text-muted-foreground" />
            <h2 className="text-lg font-semibold text-muted-foreground">Upcoming This Week</h2>
            <Badge variant="secondary">{upcomingTasks.length}</Badge>
          </div>
          <div className="space-y-2">
            {upcomingTasks.map((task) => (
              <TaskItem key={task.id} task={task} onEdit={onEditTask} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
