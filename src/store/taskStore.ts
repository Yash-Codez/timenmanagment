import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Task, Category, Priority, TaskStatus } from '@/types/task';

interface TaskState {
  tasks: Task[];
  activeTimerTaskId: string | null;
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'completedAt' | 'actualTimeMinutes' | 'isTimerRunning' | 'timerStartedAt'>) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  toggleTaskStatus: (id: string) => void;
  startTimer: (id: string) => void;
  stopTimer: (id: string) => void;
  getTasksByStatus: (status: TaskStatus) => Task[];
  getTasksByCategory: (category: Category) => Task[];
  getTasksByPriority: (priority: Priority) => Task[];
  getTodayTasks: () => Task[];
  getCompletedTasks: () => Task[];
}

const generateId = () => Math.random().toString(36).substring(2, 15);

export const useTaskStore = create<TaskState>()(
  persist(
    (set, get) => ({
      tasks: [],
      activeTimerTaskId: null,

      addTask: (taskData) => {
        const newTask: Task = {
          ...taskData,
          id: generateId(),
          createdAt: new Date(),
          completedAt: null,
          actualTimeMinutes: 0,
          isTimerRunning: false,
          timerStartedAt: null,
        };
        set((state) => ({ tasks: [...state.tasks, newTask] }));
      },

      updateTask: (id, updates) => {
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === id ? { ...task, ...updates } : task
          ),
        }));
      },

      deleteTask: (id) => {
        set((state) => ({
          tasks: state.tasks.filter((task) => task.id !== id),
          activeTimerTaskId: state.activeTimerTaskId === id ? null : state.activeTimerTaskId,
        }));
      },

      toggleTaskStatus: (id) => {
        set((state) => ({
          tasks: state.tasks.map((task) => {
            if (task.id !== id) return task;
            
            const newStatus: TaskStatus = 
              task.status === 'pending' ? 'in-progress' : 
              task.status === 'in-progress' ? 'completed' : 'pending';
            
            return {
              ...task,
              status: newStatus,
              completedAt: newStatus === 'completed' ? new Date() : null,
              isTimerRunning: newStatus === 'completed' ? false : task.isTimerRunning,
            };
          }),
        }));
      },

      startTimer: (id) => {
        const { activeTimerTaskId, stopTimer } = get();
        
        if (activeTimerTaskId && activeTimerTaskId !== id) {
          stopTimer(activeTimerTaskId);
        }

        set((state) => ({
          activeTimerTaskId: id,
          tasks: state.tasks.map((task) =>
            task.id === id
              ? { ...task, isTimerRunning: true, timerStartedAt: new Date(), status: 'in-progress' as TaskStatus }
              : task
          ),
        }));
      },

      stopTimer: (id) => {
        set((state) => {
          const task = state.tasks.find((t) => t.id === id);
          if (!task || !task.timerStartedAt) return state;

          const elapsedMinutes = Math.round(
            (new Date().getTime() - new Date(task.timerStartedAt).getTime()) / 60000
          );

          return {
            activeTimerTaskId: null,
            tasks: state.tasks.map((t) =>
              t.id === id
                ? {
                    ...t,
                    isTimerRunning: false,
                    timerStartedAt: null,
                    actualTimeMinutes: t.actualTimeMinutes + elapsedMinutes,
                  }
                : t
            ),
          };
        });
      },

      getTasksByStatus: (status) => get().tasks.filter((t) => t.status === status),
      getTasksByCategory: (category) => get().tasks.filter((t) => t.category === category),
      getTasksByPriority: (priority) => get().tasks.filter((t) => t.priority === priority),
      
      getTodayTasks: () => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        return get().tasks.filter((task) => {
          if (!task.dueDate) return false;
          const dueDate = new Date(task.dueDate);
          return dueDate >= today && dueDate < tomorrow;
        });
      },

      getCompletedTasks: () => get().tasks.filter((t) => t.status === 'completed'),
    }),
    {
      name: 'task-storage',
      partialize: (state) => ({ tasks: state.tasks }),
    }
  )
);
