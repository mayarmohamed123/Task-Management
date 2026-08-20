import React from 'react';
import { Modal } from '../../../components/ui/Modal.js';
import { StatusBadge, PriorityBadge } from '../../../components/ui/Badge.js';
import { formatDate, formatRelativeDueDate } from '../../../utils/formatters.js';
import { Calendar, Clock, Edit3, Trash2 } from 'lucide-react';
import { Task } from '../../../types/index.js';
import { Button } from '../../../components/ui/Button.js';

interface TaskDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: Task | null;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
}

export const TaskDetailModal: React.FC<TaskDetailModalProps> = ({
  isOpen,
  onClose,
  task,
  onEdit,
  onDelete,
}) => {
  if (!task) return null;

  const relativeDate = formatRelativeDueDate(task.dueDate);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Task Overview" maxWidth="lg">
      <div className="space-y-5 pt-2">
        {/* Status & Priority Badges */}
        <div className="flex items-center gap-3">
          <StatusBadge status={task.status} />
          <PriorityBadge priority={task.priority} />
        </div>

        {/* Task Title */}
        <div>
          <h2 className="text-xl font-bold text-slate-900">{task.title}</h2>
        </div>

        {/* Description */}
        <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-4">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
            Description
          </h4>
          <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
            {task.description || <span className="italic text-slate-400">No description provided</span>}
          </p>
        </div>

        {/* Metadata */}
        <div className="grid grid-cols-2 gap-4 text-xs text-slate-600 rounded-xl bg-white border border-slate-100 p-4">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-slate-400 shrink-0" />
            <div>
              <span className="block text-[10px] uppercase font-semibold text-slate-400">Due Date</span>
              <span className="font-medium text-slate-800">{formatDate(task.dueDate)}</span>
              {task.dueDate && (
                <span className={`block text-[10px] ${relativeDate.isOverdue ? 'text-rose-600 font-semibold' : 'text-slate-400'}`}>
                  {relativeDate.text}
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-slate-400 shrink-0" />
            <div>
              <span className="block text-[10px] uppercase font-semibold text-slate-400">Created At</span>
              <span className="font-medium text-slate-800">{formatDate(task.createdAt)}</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
          <Button
            variant="danger"
            size="sm"
            leftIcon={<Trash2 className="h-4 w-4" />}
            onClick={() => {
              onClose();
              onDelete(task);
            }}
          >
            Delete
          </Button>
          <Button
            variant="outline"
            size="sm"
            leftIcon={<Edit3 className="h-4 w-4" />}
            onClick={() => {
              onClose();
              onEdit(task);
            }}
          >
            Edit Task
          </Button>
        </div>
      </div>
    </Modal>
  );
};
