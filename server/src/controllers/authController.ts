import { Response } from 'express';
import { AuthenticatedRequest } from '../types/index.js';
import { AuthService } from '../services/authService.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { AppError } from '../utils/AppError.js';

export const registerUser = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const result = await AuthService.register(req.body);
  res.status(201).json({
    success: true,
    data: result,
  });
});

export const loginUser = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const result = await AuthService.login(req.body);
  res.status(200).json({
    success: true,
    data: result,
  });
});

export const getMe = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) {
    throw new AppError('Not authenticated', 401);
  }
  const user = await AuthService.getCurrentUser(req.user.id);
  res.status(200).json({
    success: true,
    data: { user },
  });
});
