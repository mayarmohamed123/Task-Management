import { User, IUser } from '../models/User.js';
import { RegisterInput, LoginInput } from '../validations/authValidation.js';
import { AppError } from '../utils/AppError.js';
import { generateToken } from '../utils/jwt.js';

export class AuthService {
  static async register(data: RegisterInput) {
    const emailNormalized = data.email.toLowerCase().trim();

    const existingUser = await User.findOne({ email: emailNormalized });
    if (existingUser) {
      throw new AppError('Email already registered', 409);
    }

    const user = await User.create({
      name: data.name.trim(),
      email: emailNormalized,
      password: data.password,
    });

    const token = generateToken({
      id: user._id.toString(),
      name: user.name,
      email: user.email,
    });

    return {
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
      },
      token,
    };
  }

  static async login(data: LoginInput) {
    const emailNormalized = data.email.toLowerCase().trim();

    const user = await User.findOne({ email: emailNormalized }).select('+password');
    if (!user) {
      throw new AppError('Invalid email or password', 401);
    }

    const isPasswordMatch = await user.comparePassword(data.password);
    if (!isPasswordMatch) {
      throw new AppError('Invalid email or password', 401);
    }

    const token = generateToken({
      id: user._id.toString(),
      name: user.name,
      email: user.email,
    });

    return {
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
      },
      token,
    };
  }

  static async getCurrentUser(userId: string) {
    const user = await User.findById(userId).select('-password');
    if (!user) {
      throw new AppError('User not found', 404);
    }

    return {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}
