export type Priority = 1 | 2 | 3 | 4;
export type TaskStatus = 'pending' | 'in-progress' | 'completed';
export type Category = 'work' | 'personal' | 'health' | 'learning';

export interface Task {
  id: string;
  title: string;
  description: string;
  category: Category;
  priority: Priority;
  dueDate: Date | null;
  status: TaskStatus;
  estimatedTimeMinutes: number;
  actualTimeMinutes: number;
  createdAt: Date;
  completedAt: Date | null;
  isTimerRunning: boolean;
  timerStartedAt: Date | null;
}

export interface TimeLog {
  id: string;
  taskId: string;
  startTime: Date;
  endTime: Date | null;
  durationMinutes: number;
}

export interface DailyStats {
  date: string;
  tasksCompleted: number;
  totalMinutes: number;
}

export interface CategoryStats {
  category: Category;
  totalMinutes: number;
  tasksCount: number;
}
