import { describe, it, expect } from 'vitest';
import { registerSchema, loginSchema } from '../validations/authValidation.js';
import { createTaskSchema, updateTaskSchema } from '../validations/taskValidation.js';
import { generateToken, verifyToken } from '../utils/jwt.js';

describe('Core Business Logic & Schema Validation Tests', () => {
  it('validates user registration input correctly', () => {
    const valid = registerSchema.safeParse({
      name: 'John Doe',
      email: 'john@example.com',
      password: 'Password123',
    });
    expect(valid.success).toBe(true);

    const invalidEmail = registerSchema.safeParse({
      name: 'John Doe',
      email: 'invalid-email',
      password: 'Password123',
    });
    expect(invalidEmail.success).toBe(false);
  });

  it('validates task CRUD schemas accurately', () => {
    const validTask = createTaskSchema.safeParse({
      title: 'Setup MongoDB Indexes',
      description: 'Add index for user and status fields',
      status: 'TODO',
      priority: 'HIGH',
    });
    expect(validTask.success).toBe(true);

    const invalidPriority = createTaskSchema.safeParse({
      title: 'Setup MongoDB Indexes',
      priority: 'ULTRA_HIGH',
    });
    expect(invalidPriority.success).toBe(false);
  });

  it('signs and verifies JWT authentication tokens securely', () => {
    const payload = { id: 'user123', name: 'Test User', email: 'test@example.com' };
    const token = generateToken(payload);
    const decoded = verifyToken(token);

    expect(decoded.id).toBe('user123');
    expect(decoded.email).toBe('test@example.com');
  });
});
