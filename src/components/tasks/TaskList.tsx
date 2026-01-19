import { useState, useMemo } from 'react';
import { Task, Category, Priority, TaskStatus } from '@/types/task';
import { useTaskStore } from '@/store/taskStore';
import { TaskItem } from './TaskItem';
import { 
  Filter, 
  SortAsc, 
  SortDesc,
  ListFilter,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { CATEGORY_LABELS, PRIORITY_LABELS, STATUS_LABELS } from '@/lib/taskUtils';

interface TaskListProps {
  onEditTask: (task: Task) => void;
}

type SortField = 'priority' | 'dueDate' | 'createdAt';
type SortDirection = 'asc' | 'desc';

export function TaskList({ onEditTask }: TaskListProps) {
  const tasks = useTaskStore((state) => state.tasks);
  
  const [filterCategory, setFilterCategory] = useState<Category | 'all'>('all');
  const [filterPriority, setFilterPriority] = useState<Priority | 'all'>('all');
  const [filterStatus, setFilterStatus] = useState<TaskStatus | 'all'>('all');
  const [sortField, setSortField] = useState<SortField>('priority');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  const filteredAndSortedTasks = useMemo(() => {
    let result = [...tasks];

    // Apply filters
    if (filterCategory !== 'all') {
      result = result.filter((t) => t.category === filterCategory);
    }
    if (filterPriority !== 'all') {
      result = result.filter((t) => t.priority === filterPriority);
    }
    if (filterStatus !== 'all') {
      result = result.filter((t) => t.status === filterStatus);
    }

    // Apply sorting
    result.sort((a, b) => {
      let comparison = 0;
      
      switch (sortField) {
        case 'priority':
          comparison = a.priority - b.priority;
          break;
        case 'dueDate':
          if (!a.dueDate && !b.dueDate) comparison = 0;
          else if (!a.dueDate) comparison = 1;
          else if (!b.dueDate) comparison = -1;
          else comparison = new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
          break;
        case 'createdAt':
          comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          break;
      }

      return sortDirection === 'asc' ? comparison : -comparison;
    });

    return result;
  }, [tasks, filterCategory, filterPriority, filterStatus, sortField, sortDirection]);

  const hasActiveFilters = filterCategory !== 'all' || filterPriority !== 'all' || filterStatus !== 'all';

  const clearFilters = () => {
    setFilterCategory('all');
    setFilterPriority('all');
    setFilterStatus('all');
  };

  const toggleSortDirection = () => {
    setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
  };

  return (
    <div className="space-y-4">
      {/* Filters Bar */}
      <div className="flex flex-wrap items-center gap-3 bg-card p-4 rounded-xl border border-border/50 shadow-soft">
        <div className="flex items-center gap-2 text-muted-foreground">
          <ListFilter className="w-4 h-4" />
          <span className="text-sm font-medium">Filters:</span>
        </div>

        <Select value={filterCategory} onValueChange={(v) => setFilterCategory(v as Category | 'all')}>
          <SelectTrigger className="w-32 h-9">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
              <SelectItem key={key} value={key}>{label}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={filterPriority === 'all' ? 'all' : String(filterPriority)} onValueChange={(v) => setFilterPriority(v === 'all' ? 'all' : Number(v) as Priority)}>
          <SelectTrigger className="w-32 h-9">
            <SelectValue placeholder="Priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Priorities</SelectItem>
            {Object.entries(PRIORITY_LABELS).map(([key, label]) => (
              <SelectItem key={key} value={key}>{label}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={filterStatus} onValueChange={(v) => setFilterStatus(v as TaskStatus | 'all')}>
          <SelectTrigger className="w-32 h-9">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            {Object.entries(STATUS_LABELS).map(([key, label]) => (
              <SelectItem key={key} value={key}>{label}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={clearFilters} className="gap-1">
            <X className="w-3 h-3" />
            Clear
          </Button>
        )}

        <div className="flex-1" />

        {/* Sort Controls */}
        <div className="flex items-center gap-2">
          <Select value={sortField} onValueChange={(v) => setSortField(v as SortField)}>
            <SelectTrigger className="w-32 h-9">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="priority">Priority</SelectItem>
              <SelectItem value="dueDate">Due Date</SelectItem>
              <SelectItem value="createdAt">Created</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="ghost" size="icon" onClick={toggleSortDirection} className="h-9 w-9">
            {sortDirection === 'asc' ? (
              <SortAsc className="w-4 h-4" />
            ) : (
              <SortDesc className="w-4 h-4" />
            )}
          </Button>
        </div>
      </div>

      {/* Results Count */}
      <div className="flex items-center gap-2">
        <Badge variant="secondary" className="text-xs">
          {filteredAndSortedTasks.length} task{filteredAndSortedTasks.length !== 1 ? 's' : ''}
        </Badge>
      </div>

      {/* Task List */}
      <div className="space-y-2">
        {filteredAndSortedTasks.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <p className="text-lg font-medium">No tasks found</p>
            <p className="text-sm mt-1">
              {hasActiveFilters ? 'Try adjusting your filters' : 'Add a task to get started'}
            </p>
          </div>
        ) : (
          filteredAndSortedTasks.map((task) => (
            <TaskItem key={task.id} task={task} onEdit={onEditTask} />
          ))
        )}
      </div>
    </div>
  );
}
