import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { TaskStatus, TaskPriority, TaskFilterParams, Task } from '../types/index.js';
import { useTasks } from '../features/tasks/hooks/useTasks.js';
import {
  useCreateTaskMutation,
  useUpdateTaskMutation,
  useDeleteTaskMutation,
} from '../features/tasks/hooks/useTaskMutations.js';
import { TaskStats } from '../features/tasks/components/TaskStats.js';
import { TaskFilters } from '../features/tasks/components/TaskFilters.js';
import { TaskCard } from '../features/tasks/components/TaskCard.js';
import { TaskFormModal } from '../features/tasks/components/TaskFormModal.js';
import { DeleteConfirmModal } from '../features/tasks/components/DeleteConfirmModal.js';
import { TaskDetailModal } from '../features/tasks/components/TaskDetailModal.js';
import { TaskCardSkeleton } from '../components/ui/Skeleton.js';
import { ToastContainer, ToastMessage } from '../components/ui/Toast.js';
import { Button } from '../components/ui/Button.js';
import { Plus, SearchX, CheckSquare, AlertCircle } from 'lucide-react';
import { TaskFormValues } from '../features/tasks/schemas/taskSchema.js';

export const DashboardPage: React.FC<{ isCreateModalOpenExternal?: boolean; onCloseExternalModal?: () => void }> = ({
  isCreateModalOpenExternal,
  onCloseExternalModal,
}) => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Filters state initialized from URL params
  const [filters, setFilters] = useState<TaskFilterParams>(() => ({
    search: searchParams.get('search') || '',
    status: (searchParams.get('status') as TaskStatus | 'ALL') || 'ALL',
    priority: (searchParams.get('priority') as TaskPriority | 'ALL') || 'ALL',
  }));

  // Sync URL search params with filters state
  useEffect(() => {
    const statusParam = (searchParams.get('status') as TaskStatus | 'ALL') || 'ALL';
    const priorityParam = (searchParams.get('priority') as TaskPriority | 'ALL') || 'ALL';
    const searchParam = searchParams.get('search') || '';

    setFilters((prev) => ({
      ...prev,
      status: statusParam,
      priority: priorityParam,
      search: searchParam,
    }));
  }, [searchParams]);

  // Fetch Tasks Query
  const { data, isLoading, isError, error, refetch } = useTasks(filters);

  // Mutations
  const createTaskMutation = useCreateTaskMutation();
  const updateTaskMutation = useUpdateTaskMutation();
  const deleteTaskMutation = useDeleteTaskMutation();

  // Modal States
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingTask, setDeletingTask] = useState<Task | null>(null);

  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [viewingTask, setViewingTask] = useState<Task | null>(null);

  // Toast Notifications State
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (type: 'success' | 'error' | 'info', title: string, message?: string) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, type, title, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Sync External Create Modal Trigger from Layout Header
  useEffect(() => {
    if (isCreateModalOpenExternal) {
      setEditingTask(null);
      setIsFormModalOpen(true);
    }
  }, [isCreateModalOpenExternal]);

  const handleCloseFormModal = () => {
    setIsFormModalOpen(false);
    setEditingTask(null);
    if (onCloseExternalModal) onCloseExternalModal();
  };

  // Handle Filter Changes
  const handleFilterChange = (newFilters: Partial<TaskFilterParams>) => {
    setFilters((prev) => {
      const updated = { ...prev, ...newFilters };
      const params = new URLSearchParams();
      if (updated.search) params.set('search', updated.search);
      if (updated.status && updated.status !== 'ALL') params.set('status', updated.status);
      if (updated.priority && updated.priority !== 'ALL') params.set('priority', updated.priority);
      setSearchParams(params);
      return updated;
    });
  };

  const handleResetFilters = () => {
    setFilters({ search: '', status: 'ALL', priority: 'ALL' });
    setSearchParams({});
  };

  // Create / Update Task Submit
  const handleTaskFormSubmit = async (values: TaskFormValues) => {
    try {
      if (editingTask) {
        await updateTaskMutation.mutateAsync({
          id: editingTask._id,
          data: values,
        });
        addToast('success', 'Task Updated', `"${values.title}" has been updated.`);
      } else {
        await createTaskMutation.mutateAsync(values);
        addToast('success', 'Task Created', `"${values.title}" has been added.`);
      }
      handleCloseFormModal();
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || 'Failed to save task';
      addToast('error', 'Operation Failed', msg);
    }
  };

  // Delete Task Submit
  const handleDeleteTaskConfirm = async () => {
    if (!deletingTask) return;
    try {
      await deleteTaskMutation.mutateAsync(deletingTask._id);
      addToast('success', 'Task Deleted', `"${deletingTask.title}" has been removed.`);
      setIsDeleteModalOpen(false);
      setDeletingTask(null);
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || 'Failed to delete task';
      addToast('error', 'Delete Failed', msg);
    }
  };

  const hasActiveFilters =
    (filters.search && filters.search.trim() !== '') ||
    (filters.status && filters.status !== 'ALL') ||
    (filters.priority && filters.priority !== 'ALL');

  const tasksList = data?.tasks || [];
  const statsData = data?.stats;
  const isZeroUserTasksTotal = (statsData?.total ?? 0) === 0 && !hasActiveFilters;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Toast Notifications Overlay */}
      <ToastContainer toasts={toasts} onDismiss={removeToast} />

      {/* Statistics Section */}
      <TaskStats stats={statsData} isLoading={isLoading} />

      {/* Filter & Search Bar */}
      <TaskFilters
        filters={filters}
        onFilterChange={handleFilterChange}
        onResetFilters={handleResetFilters}
      />

      {/* Error Banner */}
      {isError && (
        <div className="flex items-center justify-between gap-4 rounded-2xl bg-rose-50 p-4 text-sm font-semibold text-rose-700 border border-rose-200">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 shrink-0" />
            <span>Unable to load tasks: {(error as Error)?.message || 'Server error'}</span>
          </div>
          <Button size="sm" variant="outline" onClick={() => refetch()}>
            Try again
          </Button>
        </div>
      )}

      {/* Task Cards Grid / Loading / Empty States */}
      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <TaskCardSkeleton />
          <TaskCardSkeleton />
          <TaskCardSkeleton />
          <TaskCardSkeleton />
          <TaskCardSkeleton />
          <TaskCardSkeleton />
        </div>
      ) : tasksList.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {tasksList.map((task) => (
            <TaskCard
              key={task._id}
              task={task}
              onView={(t) => {
                setViewingTask(t);
                setIsDetailModalOpen(true);
              }}
              onEdit={(t) => {
                setEditingTask(t);
                setIsFormModalOpen(true);
              }}
              onDelete={(t) => {
                setDeletingTask(t);
                setIsDeleteModalOpen(true);
              }}
            />
          ))}
        </div>
      ) : isZeroUserTasksTotal ? (
        /* Empty State 1: No tasks created yet */
        <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-slate-200 bg-white p-12 text-center shadow-card">
          <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-brand-50 text-brand-500 mb-4 shadow-inner">
            <CheckSquare className="h-8 w-8" />
          </div>
          <h3 className="text-xl font-extrabold text-slate-900">No tasks yet</h3>
          <p className="text-sm text-slate-500 mt-1 max-w-sm">
            Create your first task to get started and keep track of your workflow.
          </p>
          <Button
            variant="primary"
            size="md"
            leftIcon={<Plus className="h-4 w-4" />}
            onClick={() => {
              setEditingTask(null);
              setIsFormModalOpen(true);
            }}
            className="mt-6 shadow-md"
          >
            Create Task
          </Button>
        </div>
      ) : (
        /* Empty State 2: No search/filter results found */
        <div className="flex flex-col items-center justify-center rounded-3xl border border-slate-100 bg-white p-12 text-center shadow-card">
          <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-slate-100 text-slate-400 mb-4">
            <SearchX className="h-8 w-8" />
          </div>
          <h3 className="text-xl font-extrabold text-slate-900">No tasks found</h3>
          <p className="text-sm text-slate-500 mt-1 max-w-sm">
            Try changing your search keywords or priority and status filters.
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={handleResetFilters}
            className="mt-6"
          >
            Clear filters
          </Button>
        </div>
      )}

      {/* Task Form Modal (Create & Edit) */}
      <TaskFormModal
        isOpen={isFormModalOpen}
        onClose={handleCloseFormModal}
        onSubmit={handleTaskFormSubmit}
        initialData={editingTask}
        isLoading={createTaskMutation.isPending || updateTaskMutation.isPending}
      />

      {/* Delete Task Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setDeletingTask(null);
        }}
        onConfirm={handleDeleteTaskConfirm}
        task={deletingTask}
        isLoading={deleteTaskMutation.isPending}
      />

      {/* Task Detail Modal */}
      <TaskDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false);
          setViewingTask(null);
        }}
        task={viewingTask}
        onEdit={(t) => {
          setEditingTask(t);
          setIsFormModalOpen(true);
        }}
        onDelete={(t) => {
          setDeletingTask(t);
          setIsDeleteModalOpen(true);
        }}
      />
    </div>
  );
};
