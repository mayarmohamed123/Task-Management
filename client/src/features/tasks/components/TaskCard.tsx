import React from 'react';
import { Task } from '../../../types/index.js';
import { StatusBadge, PriorityBadge } from '../../../components/ui/Badge.js';
import { formatRelativeDueDate, formatDate } from '../../../utils/formatters.js';
import { Calendar, Eye, Edit3, Trash2 } from 'lucide-react';

interface TaskCardProps {
  task: Task;
  onView: (task: Task) => void;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({ task, onView, onEdit, onDelete }) => {
  const relativeDate = formatRelativeDueDate(task.dueDate);

  return (
    <div className="group relative flex flex-col justify-between rounded-2xl border border-slate-100 bg-white p-5 shadow-card transition-all duration-200 hover:-translate-y-1 hover:shadow-card-hover">
      <div>
        {/* Header Badges */}
        <div className="flex items-center justify-between gap-2 pb-3">
          <StatusBadge status={task.status} />
          <PriorityBadge priority={task.priority} />
        </div>

        {/* Title */}
        <h3
          onClick={() => onView(task)}
          className="text-base font-bold text-slate-900 line-clamp-1 hover:text-brand-600 transition-colors cursor-pointer"
        >
          {task.title}
        </h3>

        {/* Description */}
        <p className="mt-2 text-xs text-slate-500 line-clamp-2 leading-relaxed min-h-[2.25rem]">
          {task.description || <span className="italic text-slate-400">No description provided</span>}
        </p>
      </div>

      {/* Footer Info & Actions */}
      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2 text-xs text-slate-500">
        {/* Due Date Indicator */}
        <div
          className={`inline-flex items-center gap-1.5 font-medium ${
            relativeDate.isOverdue ? 'text-rose-600 font-semibold' : 'text-slate-500'
          }`}
          title={formatDate(task.dueDate)}
        >
          <Calendar className="h-3.5 w-3.5" />
          <span>{relativeDate.text}</span>
        </div>

        {/* Actions Toolbar */}
        <div className="flex items-center gap-1 opacity-90 sm:opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onView(task)}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors"
            title="View Details"
            aria-label="View task details"
          >
            <Eye className="h-4 w-4" />
          </button>
          <button
            onClick={() => onEdit(task)}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-brand-50 hover:text-brand-600 transition-colors"
            title="Edit Task"
            aria-label="Edit task"
          >
            <Edit3 className="h-4 w-4" />
          </button>
          <button
            onClick={() => onDelete(task)}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition-colors"
            title="Delete Task"
            aria-label="Delete task"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
