import React from 'react';
import { Modal } from '../../../components/ui/Modal.js';
import { Button } from '../../../components/ui/Button.js';
import { AlertTriangle } from 'lucide-react';
import { Task } from '../../../types/index.js';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  task: Task | null;
  isLoading: boolean;
}

export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  task,
  isLoading,
}) => {
  if (!task) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="sm">
      <div className="flex flex-col items-center text-center space-y-4 pt-2">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-100 text-rose-600">
          <AlertTriangle className="h-6 w-6" />
        </div>

        <div>
          <h3 className="text-lg font-bold text-slate-900">Delete Task</h3>
          <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
            Are you sure you want to delete <span className="font-semibold text-slate-800">"{task.title}"</span>? This action cannot be undone.
          </p>
        </div>

        <div className="flex items-center justify-center gap-3 w-full pt-4 border-t border-slate-100">
          <Button variant="outline" onClick={onClose} disabled={isLoading} className="w-1/2">
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={onConfirm}
            isLoading={isLoading}
            className="w-1/2"
          >
            Delete
          </Button>
        </div>
      </div>
    </Modal>
  );
};
