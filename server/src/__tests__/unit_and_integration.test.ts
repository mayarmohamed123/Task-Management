import { describe, it, expect } from 'vitest';
import { registerSchema, loginSchema } from '../validations/authValidation.js';
import { createTaskSchema, updateTaskSchema, queryTaskSchema } from '../validations/taskValidation.js';
import { generateToken, verifyToken } from '../utils/jwt.js';
import { AppError } from '../utils/AppError.js';

describe('TaskFlow Unit & Architectural Test Suite', () => {
  describe('Zod Validation Schemas', () => {
    it('should validate valid user registration payload', () => {
      const validPayload = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'Password123',
      };
      const result = registerSchema.safeParse(validPayload);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.email).toBe('john@example.com');
      }
    });

    it('should reject invalid email in registration', () => {
      const invalidPayload = {
        name: 'John Doe',
        email: 'not-an-email',
        password: 'Password123',
      };
      const result = registerSchema.safeParse(invalidPayload);
      expect(result.success).toBe(false);
    });

    it('should reject short password under 6 characters', () => {
      const invalidPayload = {
        name: 'John Doe',
        email: 'john@example.com',
        password: '123',
      };
      const result = registerSchema.safeParse(invalidPayload);
      expect(result.success).toBe(false);
    });

    it('should validate task creation payload', () => {
      const taskPayload = {
        title: 'Build Full-Stack MERN App',
        description: 'Complete task management tech assessment',
        status: 'IN_PROGRESS',
        priority: 'HIGH',
        dueDate: '2026-08-30',
      };
      const result = createTaskSchema.safeParse(taskPayload);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.status).toBe('IN_PROGRESS');
        expect(result.data.priority).toBe('HIGH');
      }
    });

    it('should reject invalid task status', () => {
      const invalidTask = {
        title: 'Invalid Task',
        status: 'INVALID_STATUS',
      };
      const result = createTaskSchema.safeParse(invalidTask);
      expect(result.success).toBe(false);
    });

    it('should parse query parameters correctly', () => {
      const query = {
        search: 'authentication',
        status: 'TODO',
        priority: 'MEDIUM',
      };
      const result = queryTaskSchema.safeParse(query);
      expect(result.success).toBe(true);
    });
  });

  describe('JWT Security Helper', () => {
    it('should generate and verify valid JWT token payload', () => {
      const userPayload = {
        id: '60c72b2f9b1d8b2b88f8e21a',
        name: 'John Doe',
        email: 'john@example.com',
      };

      const token = generateToken(userPayload);
      expect(token).toBeDefined();
      expect(typeof token).toBe('string');

      const decoded = verifyToken(token);
      expect(decoded.id).toBe(userPayload.id);
      expect(decoded.name).toBe(userPayload.name);
      expect(decoded.email).toBe(userPayload.email);
    });
  });

  describe('AppError Utility', () => {
    it('should create operational error with custom status code', () => {
      const error = new AppError('Email already registered', 409);
      expect(error.message).toBe('Email already registered');
      expect(error.statusCode).toBe(409);
      expect(error.isOperational).toBe(true);
    });
  });
});
