import { Task, ITask } from '../models/Task.js';
import { CreateTaskInput, UpdateTaskInput, QueryTaskInput } from '../validations/taskValidation.js';
import { AppError } from '../utils/AppError.js';
import mongoose from 'mongoose';

export class TaskService {
  static async getTasks(userId: string, queryParams: QueryTaskInput) {
    const filterQuery: mongoose.FilterQuery<ITask> = {
      user: new mongoose.Types.ObjectId(userId),
    };

    if (queryParams.search && queryParams.search.trim() !== '') {
      filterQuery.title = { $regex: queryParams.search.trim(), $options: 'i' };
    }

    if (queryParams.status && queryParams.status !== 'ALL') {
      filterQuery.status = queryParams.status;
    }

    if (queryParams.priority && queryParams.priority !== 'ALL') {
      filterQuery.priority = queryParams.priority;
    }

    const tasks = await Task.find(filterQuery).sort({ createdAt: -1 });

    // Calculate stats specifically for this user across all their tasks
    const statsAggregation = await Task.aggregate([
      { $match: { user: new mongoose.Types.ObjectId(userId) } },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
        },
      },
    ]);

    const stats = {
      total: 0,
      todo: 0,
      inProgress: 0,
      done: 0,
    };

    statsAggregation.forEach((stat) => {
      stats.total += stat.count;
      if (stat._id === 'TODO') stats.todo = stat.count;
      if (stat._id === 'IN_PROGRESS') stats.inProgress = stat.count;
      if (stat._id === 'DONE') stats.done = stat.count;
    });

    return {
      tasks,
      stats,
    };
  }

  static async getTaskById(userId: string, taskId: string) {
    if (!mongoose.Types.ObjectId.isValid(taskId)) {
      throw new AppError('Task not found', 404);
    }

    const task = await Task.findOne({
      _id: taskId,
      user: new mongoose.Types.ObjectId(userId),
    });

    if (!task) {
      throw new AppError('Task not found', 404);
    }

    return task;
  }

  static async createTask(userId: string, taskData: CreateTaskInput) {
    const task = await Task.create({
      ...taskData,
      user: new mongoose.Types.ObjectId(userId),
    });

    return task;
  }

  static async updateTask(userId: string, taskId: string, updateData: UpdateTaskInput) {
    if (!mongoose.Types.ObjectId.isValid(taskId)) {
      throw new AppError('Task not found', 404);
    }

    const task = await Task.findOneAndUpdate(
      {
        _id: taskId,
        user: new mongoose.Types.ObjectId(userId),
      },
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!task) {
      throw new AppError('Task not found', 404);
    }

    return task;
  }

  static async deleteTask(userId: string, taskId: string) {
    if (!mongoose.Types.ObjectId.isValid(taskId)) {
      throw new AppError('Task not found', 404);
    }

    const task = await Task.findOneAndDelete({
      _id: taskId,
      user: new mongoose.Types.ObjectId(userId),
    });

    if (!task) {
      throw new AppError('Task not found', 404);
    }

    return { id: taskId };
  }
}
