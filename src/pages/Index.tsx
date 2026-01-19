import { useState } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { StatsCards } from '@/components/dashboard/StatsCards';
import { TaskList } from '@/components/tasks/TaskList';
import { TaskDialog } from '@/components/tasks/TaskDialog';
import { AnalyticsCharts } from '@/components/analytics/AnalyticsCharts';
import { TodayView } from '@/components/calendar/TodayView';
import { Task } from '@/types/task';
import { useTaskStore } from '@/store/taskStore';
import { useSeedTasks } from '@/hooks/useSeedTasks';
import { Plus, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Index = () => {
  const [activeView, setActiveView] = useState('dashboard');
  const [isTaskDialogOpen, setIsTaskDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  
  // Seed sample tasks on first load
  useSeedTasks();
  
  const tasks = useTaskStore((state) => state.tasks);

  const handleAddTask = () => {
    setEditingTask(null);
    setIsTaskDialogOpen(true);
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setIsTaskDialogOpen(true);
  };

  const renderContent = () => {
    switch (activeView) {
      case 'dashboard':
        return (
          <div className="space-y-8">
            {/* Welcome Section */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-foreground">Good morning! ☀️</h1>
                <p className="text-muted-foreground mt-1">
                  {tasks.filter((t) => t.status !== 'completed').length} tasks remaining today
                </p>
              </div>
              <Button onClick={handleAddTask} className="gap-2">
                <Plus className="w-4 h-4" />
                Add Task
              </Button>
            </div>

            {/* Stats */}
            <StatsCards />

            {/* Today's Focus */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-5 h-5 text-primary" />
                <h2 className="text-xl font-semibold">Today's Focus</h2>
              </div>
              <TodayView onEditTask={handleEditTask} />
            </div>
          </div>
        );
      
      case 'tasks':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-foreground">All Tasks</h1>
                <p className="text-muted-foreground mt-1">Manage and organize your tasks</p>
              </div>
              <Button onClick={handleAddTask} className="gap-2">
                <Plus className="w-4 h-4" />
                Add Task
              </Button>
            </div>
            <TaskList onEditTask={handleEditTask} />
          </div>
        );
      
      case 'calendar':
        return (
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Calendar View</h1>
              <p className="text-muted-foreground mt-1">Tasks organized by due date</p>
            </div>
            <TodayView onEditTask={handleEditTask} />
          </div>
        );
      
      case 'analytics':
        return (
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Analytics</h1>
              <p className="text-muted-foreground mt-1">Track your productivity trends</p>
            </div>
            <StatsCards />
            <AnalyticsCharts />
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar 
        activeView={activeView} 
        onViewChange={setActiveView} 
        onAddTask={handleAddTask}
      />
      
      <main className="flex-1 overflow-y-auto">
        <div className="container max-w-6xl py-8">
          {renderContent()}
        </div>
      </main>

      <TaskDialog
        open={isTaskDialogOpen}
        onOpenChange={setIsTaskDialogOpen}
        task={editingTask}
      />
    </div>
  );
};

export default Index;
