import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Modal } from '../../../components/ui/Modal.js';
import { Input } from '../../../components/ui/Input.js';
import { Select } from '../../../components/ui/Select.js';
import { Textarea } from '../../../components/ui/Textarea.js';
import { Button } from '../../../components/ui/Button.js';
import { taskFormSchema, TaskFormValues } from '../schemas/taskSchema.js';
import { Task } from '../../../types/index.js';

interface TaskFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (values: TaskFormValues) => Promise<void>;
  initialData?: Task | null;
  isLoading: boolean;
}

export const TaskFormModal: React.FC<TaskFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  isLoading,
}) => {
  const isEditing = !!initialData;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TaskFormValues>({
    resolver: zodResolver(taskFormSchema),
    defaultValues: {
      title: '',
      description: '',
      status: 'TODO',
      priority: 'MEDIUM',
      dueDate: '',
    },
  });

  useEffect(() => {
    if (initialData) {
      // Format Date to YYYY-MM-DD for date input
      let formattedDate = '';
      if (initialData.dueDate) {
        const dateObj = new Date(initialData.dueDate);
        if (!isNaN(dateObj.getTime())) {
          formattedDate = dateObj.toISOString().split('T')[0];
        }
      }

      reset({
        title: initialData.title,
        description: initialData.description || '',
        status: initialData.status,
        priority: initialData.priority,
        dueDate: formattedDate,
      });
    } else {
      reset({
        title: '',
        description: '',
        status: 'TODO',
        priority: 'MEDIUM',
        dueDate: '',
      });
    }
  }, [initialData, reset, isOpen]);

  const handleFormSubmit = async (data: TaskFormValues) => {
    await onSubmit(data);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Edit Task' : 'Create New Task'}
      description={
        isEditing
          ? 'Update your task details and parameters below.'
          : 'Fill in the details below to add a new task to your workspace.'
      }
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4 pt-2">
        {/* Title */}
        <Input
          label="Task Title *"
          placeholder="e.g., Implement JWT Authentication middleware"
          error={errors.title?.message}
          {...register('title')}
        />

        {/* Description */}
        <Textarea
          label="Description"
          placeholder="Add detailed context, notes, or subtasks..."
          rows={3}
          error={errors.description?.message}
          {...register('description')}
        />

        {/* Status & Priority Grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Select
            label="Status *"
            options={[
              { value: 'TODO', label: 'To Do' },
              { value: 'IN_PROGRESS', label: 'In Progress' },
              { value: 'DONE', label: 'Done' },
            ]}
            error={errors.status?.message}
            {...register('status')}
          />

          <Select
            label="Priority *"
            options={[
              { value: 'LOW', label: 'Low Priority' },
              { value: 'MEDIUM', label: 'Medium Priority' },
              { value: 'HIGH', label: 'High Priority' },
            ]}
            error={errors.priority?.message}
            {...register('priority')}
          />
        </div>

        {/* Due Date */}
        <Input
          label="Due Date"
          type="date"
          error={errors.dueDate?.message}
          {...register('dueDate')}
        />

        {/* Form Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button type="submit" isLoading={isLoading} variant="primary">
            {isEditing ? 'Save Changes' : 'Create Task'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
