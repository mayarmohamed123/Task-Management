import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../types/index.js';
import { verifyToken } from '../utils/jwt.js';
import { User } from '../models/User.js';
import { AppError } from '../utils/AppError.js';

export const protect = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    let token: string | undefined;

    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    }

    if (!token) {
      return next(new AppError('Authentication required. Please log in.', 401));
    }

    // Verify JWT
    let decoded;
    try {
      decoded = verifyToken(token);
    } catch (err) {
      return next(new AppError('Invalid or expired authentication token.', 401));
    }

    // Verify user still exists
    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
      return next(new AppError('The user belonging to this token no longer exists.', 401));
    }

    // Attach user payload to request
    req.user = {
      id: currentUser._id.toString(),
      name: currentUser.name,
      email: currentUser.email,
    };

    next();
  } catch (error) {
    next(error);
  }
};
