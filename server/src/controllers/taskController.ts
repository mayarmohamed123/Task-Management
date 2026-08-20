import { Response } from 'express';
import { AuthenticatedRequest } from '../types/index.js';
import { TaskService } from '../services/taskService.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { AppError } from '../utils/AppError.js';

export const getTasks = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) throw new AppError('Not authenticated', 401);
  const result = await TaskService.getTasks(req.user.id, req.query as any);
  res.status(200).json({
    success: true,
    data: result,
  });
});

export const getTaskById = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) throw new AppError('Not authenticated', 401);
  const task = await TaskService.getTaskById(req.user.id, req.params.id);
  res.status(200).json({
    success: true,
    data: { task },
  });
});

export const createTask = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) throw new AppError('Not authenticated', 401);
  const task = await TaskService.createTask(req.user.id, req.body);
  res.status(201).json({
    success: true,
    data: { task },
  });
});

export const updateTask = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) throw new AppError('Not authenticated', 401);
  const task = await TaskService.updateTask(req.user.id, req.params.id, req.body);
  res.status(200).json({
    success: true,
    data: { task },
  });
});

export const deleteTask = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) throw new AppError('Not authenticated', 401);
  await TaskService.deleteTask(req.user.id, req.params.id);
  res.status(200).json({
    success: true,
    message: 'Task deleted successfully',
  });
});
