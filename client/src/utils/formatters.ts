import { TaskStatus, TaskPriority } from '../types/index.js';

export function formatDate(dateString?: string | null): string {
  if (!dateString) return 'No due date';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return 'Invalid date';

  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date);
}

export function formatRelativeDueDate(dateString?: string | null): { text: string; isOverdue: boolean } {
  if (!dateString) return { text: 'No due date', isOverdue: false };
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return { text: 'Invalid date', isOverdue: false };

  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const target = new Date(date);
  target.setHours(0, 0, 0, 0);

  const diffTime = target.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    return { text: `${Math.abs(diffDays)} ${Math.abs(diffDays) === 1 ? 'day' : 'days'} overdue`, isOverdue: true };
  }
  if (diffDays === 0) {
    return { text: 'Due today', isOverdue: false };
  }
  if (diffDays === 1) {
    return { text: 'Due tomorrow', isOverdue: false };
  }
  return { text: `Due in ${diffDays} days`, isOverdue: false };
}

export function getStatusConfig(status: TaskStatus) {
  switch (status) {
    case 'TODO':
      return {
        label: 'To Do',
        badgeBg: 'bg-slate-100 text-slate-700 border-slate-200',
        dotBg: 'bg-slate-400',
      };
    case 'IN_PROGRESS':
      return {
        label: 'In Progress',
        badgeBg: 'bg-indigo-50 text-indigo-700 border-indigo-200',
        dotBg: 'bg-indigo-500',
      };
    case 'DONE':
      return {
        label: 'Done',
        badgeBg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        dotBg: 'bg-emerald-500',
      };
    default:
      return {
        label: status,
        badgeBg: 'bg-slate-100 text-slate-700 border-slate-200',
        dotBg: 'bg-slate-400',
      };
  }
}

export function getPriorityConfig(priority: TaskPriority) {
  switch (priority) {
    case 'HIGH':
      return {
        label: 'High',
        badgeBg: 'bg-rose-50 text-rose-700 border-rose-200',
        iconColor: 'text-rose-500',
      };
    case 'MEDIUM':
      return {
        label: 'Medium',
        badgeBg: 'bg-amber-50 text-amber-700 border-amber-200',
        iconColor: 'text-amber-500',
      };
    case 'LOW':
      return {
        label: 'Low',
        badgeBg: 'bg-sky-50 text-sky-700 border-sky-200',
        iconColor: 'text-sky-500',
      };
    default:
      return {
        label: priority,
        badgeBg: 'bg-slate-100 text-slate-700 border-slate-200',
        iconColor: 'text-slate-500',
      };
  }
}
