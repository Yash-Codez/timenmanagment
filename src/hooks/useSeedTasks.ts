import { useEffect } from 'react';
import { useTaskStore } from '@/store/taskStore';
import { Task, Category, Priority } from '@/types/task';

const sampleTasks: Omit<Task, 'id' | 'createdAt' | 'completedAt' | 'actualTimeMinutes' | 'isTimerRunning' | 'timerStartedAt'>[] = [
  {
    title: 'Review Q1 marketing strategy',
    description: 'Analyze campaign performance and prepare recommendations for next quarter',
    category: 'work',
    priority: 1,
    dueDate: new Date(),
    status: 'in-progress',
    estimatedTimeMinutes: 90,
  },
  {
    title: 'Morning workout session',
    description: '30 min cardio + strength training',
    category: 'health',
    priority: 2,
    dueDate: new Date(),
    status: 'completed',
    estimatedTimeMinutes: 45,
  },
  {
    title: 'Complete React course module 5',
    description: 'Learn about hooks and context API',
    category: 'learning',
    priority: 2,
    dueDate: new Date(Date.now() + 86400000), // Tomorrow
    status: 'pending',
    estimatedTimeMinutes: 60,
  },
  {
    title: 'Call mom for her birthday',
    description: 'Don\'t forget to send flowers!',
    category: 'personal',
    priority: 1,
    dueDate: new Date(),
    status: 'pending',
    estimatedTimeMinutes: 30,
  },
  {
    title: 'Prepare client presentation',
    description: 'Finalize slides and practice delivery',
    category: 'work',
    priority: 1,
    dueDate: new Date(Date.now() + 172800000), // 2 days
    status: 'pending',
    estimatedTimeMinutes: 120,
  },
  {
    title: 'Grocery shopping',
    description: 'Buy vegetables, fruits, and weekly essentials',
    category: 'personal',
    priority: 3,
    dueDate: new Date(Date.now() + 86400000),
    status: 'pending',
    estimatedTimeMinutes: 45,
  },
  {
    title: 'Team standup meeting',
    description: 'Daily sync with the engineering team',
    category: 'work',
    priority: 2,
    dueDate: new Date(),
    status: 'completed',
    estimatedTimeMinutes: 15,
  },
  {
    title: 'Read 20 pages of "Atomic Habits"',
    description: 'Continue from chapter 4',
    category: 'learning',
    priority: 4,
    dueDate: new Date(Date.now() + 259200000), // 3 days
    status: 'pending',
    estimatedTimeMinutes: 30,
  },
];

export function useSeedTasks() {
  const { tasks, addTask, updateTask } = useTaskStore();

  useEffect(() => {
    // Only seed if there are no tasks
    if (tasks.length === 0) {
      sampleTasks.forEach((taskData, index) => {
        setTimeout(() => {
          addTask(taskData);
        }, index * 10);
      });

      // Mark some tasks as completed with actual time
      setTimeout(() => {
        const allTasks = useTaskStore.getState().tasks;
        allTasks.forEach((task) => {
          if (task.status === 'completed') {
            updateTask(task.id, {
              completedAt: new Date(),
              actualTimeMinutes: Math.round(task.estimatedTimeMinutes * (0.8 + Math.random() * 0.4)),
            });
          }
        });
      }, 100);
    }
  }, []);
}
