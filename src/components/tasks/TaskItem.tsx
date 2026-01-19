import { useState, useEffect } from 'react';
import { Task } from '@/types/task';
import { useTaskStore } from '@/store/taskStore';
import { 
  CheckCircle2, 
  Circle, 
  Clock, 
  Play, 
  Pause,
  MoreHorizontal,
  Trash2,
  Edit2,
  Flag
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { 
  PRIORITY_LABELS, 
  CATEGORY_LABELS, 
  formatDuration, 
  formatTime, 
  getRelativeDate,
  isOverdue 
} from '@/lib/taskUtils';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';

interface TaskItemProps {
  task: Task;
  onEdit: (task: Task) => void;
}

export function TaskItem({ task, onEdit }: TaskItemProps) {
  const { toggleTaskStatus, startTimer, stopTimer, deleteTask } = useTaskStore();
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  useEffect(() => {
    if (!task.isTimerRunning || !task.timerStartedAt) {
      setElapsedSeconds(0);
      return;
    }

    const calculateElapsed = () => {
      const start = new Date(task.timerStartedAt!).getTime();
      const now = new Date().getTime();
      return Math.floor((now - start) / 1000);
    };

    setElapsedSeconds(calculateElapsed());

    const interval = setInterval(() => {
      setElapsedSeconds(calculateElapsed());
    }, 1000);

    return () => clearInterval(interval);
  }, [task.isTimerRunning, task.timerStartedAt]);

  const handleTimerClick = () => {
    if (task.isTimerRunning) {
      stopTimer(task.id);
    } else {
      startTimer(task.id);
    }
  };

  const priorityClasses = {
    1: 'text-priority-1 bg-priority-1/10 border-priority-1/30',
    2: 'text-priority-2 bg-priority-2/10 border-priority-2/30',
    3: 'text-priority-3 bg-priority-3/10 border-priority-3/30',
    4: 'text-priority-4 bg-priority-4/10 border-priority-4/30',
  };

  const categoryClasses = {
    work: 'bg-category-work/10 text-category-work',
    personal: 'bg-category-personal/10 text-category-personal',
    health: 'bg-category-health/10 text-category-health',
    learning: 'bg-category-learning/10 text-category-learning',
  };

  const isTaskOverdue = isOverdue(task);

  return (
    <div 
      className={cn(
        "task-item group animate-fade-in",
        task.status === 'completed' && "opacity-60",
        task.isTimerRunning && "ring-2 ring-primary/20 animate-timer-pulse"
      )}
    >
      <div className="flex items-start gap-3">
        {/* Checkbox */}
        <button 
          onClick={() => toggleTaskStatus(task.id)}
          className={cn(
            "mt-0.5 flex-shrink-0 transition-colors",
            task.status === 'completed' ? "text-success" : priorityClasses[task.priority].split(' ')[0]
          )}
        >
          {task.status === 'completed' ? (
            <CheckCircle2 className="w-5 h-5" />
          ) : (
            <Circle className="w-5 h-5" />
          )}
        </button>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1">
              <h3 className={cn(
                "font-medium text-foreground",
                task.status === 'completed' && "line-through text-muted-foreground"
              )}>
                {task.title}
              </h3>
              {task.description && (
                <p className="text-sm text-muted-foreground mt-0.5 line-clamp-2">
                  {task.description}
                </p>
              )}
            </div>

            {/* Timer / Actions */}
            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button
                variant="ghost"
                size="icon"
                onClick={handleTimerClick}
                disabled={task.status === 'completed'}
                className={cn(
                  "h-8 w-8",
                  task.isTimerRunning && "text-primary"
                )}
              >
                {task.isTimerRunning ? (
                  <Pause className="w-4 h-4" />
                ) : (
                  <Play className="w-4 h-4" />
                )}
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => onEdit(task)}>
                    <Edit2 className="w-4 h-4 mr-2" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => deleteTask(task.id)}
                    className="text-destructive"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Meta */}
          <div className="flex flex-wrap items-center gap-2 mt-2">
            <Badge variant="outline" className={categoryClasses[task.category]}>
              {CATEGORY_LABELS[task.category]}
            </Badge>

            <Badge 
              variant="outline" 
              className={cn("gap-1", priorityClasses[task.priority])}
            >
              <Flag className="w-3 h-3" />
              {PRIORITY_LABELS[task.priority]}
            </Badge>

            {task.dueDate && (
              <span className={cn(
                "text-xs flex items-center gap-1",
                isTaskOverdue ? "text-destructive" : "text-muted-foreground"
              )}>
                <Clock className="w-3 h-3" />
                {getRelativeDate(new Date(task.dueDate))}
              </span>
            )}

            {(task.actualTimeMinutes > 0 || task.isTimerRunning) && (
              <span className={cn(
                "text-xs flex items-center gap-1 ml-auto",
                task.isTimerRunning && "text-primary font-medium"
              )}>
                <Clock className="w-3 h-3" />
                {task.isTimerRunning 
                  ? formatTime(elapsedSeconds)
                  : formatDuration(task.actualTimeMinutes)
                }
                {task.estimatedTimeMinutes > 0 && !task.isTimerRunning && (
                  <span className="text-muted-foreground">
                    / {formatDuration(task.estimatedTimeMinutes)}
                  </span>
                )}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
