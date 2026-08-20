import { useQuery } from '@tanstack/react-query';
import { getTasksApi, getTaskByIdApi } from '../api/taskApi.js';
import { TaskFilterParams } from '../../../types/index.js';

export const TASK_KEYS = {
  all: ['tasks'] as const,
  list: (filters: TaskFilterParams) => ['tasks', 'list', filters] as const,
  detail: (id: string) => ['tasks', 'detail', id] as const,
};

export function useTasks(filters: TaskFilterParams) {
  return useQuery({
    queryKey: TASK_KEYS.list(filters),
    queryFn: () => getTasksApi(filters),
    placeholderData: (previousData) => previousData,
  });
}

export function useTask(id: string | null) {
  return useQuery({
    queryKey: id ? TASK_KEYS.detail(id) : ['tasks', 'detail', 'none'],
    queryFn: () => getTaskByIdApi(id!),
    enabled: !!id,
  });
}
