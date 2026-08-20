import mongoose, { Schema, Document, Model } from 'mongoose';
import { TaskStatus, TaskPriority } from '../types/index.js';

export interface ITask extends Document {
  _id: mongoose.Types.ObjectId;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate?: Date | null;
  user: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const taskSchema = new Schema<ITask>(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      minlength: [1, 'Title cannot be empty'],
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    description: {
      type: String,
      trim: true,
      default: '',
    },
    status: {
      type: String,
      enum: {
        values: ['TODO', 'IN_PROGRESS', 'DONE'],
        message: 'Invalid task status',
      },
      default: 'TODO',
      required: true,
    },
    priority: {
      type: String,
      enum: {
        values: ['LOW', 'MEDIUM', 'HIGH'],
        message: 'Invalid task priority',
      },
      default: 'MEDIUM',
      required: true,
    },
    dueDate: {
      type: Date,
      default: null,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Task must belong to a user'],
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// Compound indexes for user-scoped queries and performance
taskSchema.index({ user: 1, createdAt: -1 });
taskSchema.index({ user: 1, status: 1 });
taskSchema.index({ user: 1, priority: 1 });

export const Task: Model<ITask> = mongoose.model<ITask>('Task', taskSchema);
