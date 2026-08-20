import { api } from '../../../lib/api.js';
import { Task, GetTasksResponse, ApiResponse, TaskFilterParams } from '../../../types/index.js';
import { TaskFormValues } from '../schemas/taskSchema.js';

export const getTasksApi = async (params: TaskFilterParams): Promise<GetTasksResponse> => {
  const response = await api.get<ApiResponse<GetTasksResponse>>('/tasks', {
    params: {
      search: params.search || undefined,
      status: params.status && params.status !== 'ALL' ? params.status : undefined,
      priority: params.priority && params.priority !== 'ALL' ? params.priority : undefined,
    },
  });

  if (!response.data.success || !response.data.data) {
    throw new Error(response.data.message || 'Failed to fetch tasks');
  }

  return response.data.data;
};

export const getTaskByIdApi = async (id: string): Promise<Task> => {
  const response = await api.get<ApiResponse<{ task: Task }>>(`/tasks/${id}`);
  if (!response.data.success || !response.data.data) {
    throw new Error(response.data.message || 'Failed to fetch task');
  }
  return response.data.data.task;
};

export const createTaskApi = async (data: TaskFormValues): Promise<Task> => {
  const response = await api.post<ApiResponse<{ task: Task }>>('/tasks', data);
  if (!response.data.success || !response.data.data) {
    throw new Error(response.data.message || 'Failed to create task');
  }
  return response.data.data.task;
};

export const updateTaskApi = async (
  id: string,
  data: Partial<TaskFormValues>
): Promise<Task> => {
  const response = await api.patch<ApiResponse<{ task: Task }>>(`/tasks/${id}`, data);
  if (!response.data.success || !response.data.data) {
    throw new Error(response.data.message || 'Failed to update task');
  }
  return response.data.data.task;
};

export const deleteTaskApi = async (id: string): Promise<void> => {
  const response = await api.delete<ApiResponse<{ id: string }>>(`/tasks/${id}`);
  if (!response.data.success) {
    throw new Error(response.data.message || 'Failed to delete task');
  }
};
