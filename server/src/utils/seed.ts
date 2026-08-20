import mongoose from 'mongoose';
import { connectDB } from '../config/db.js';
import { User } from '../models/User.js';
import { Task } from '../models/Task.js';

export const seedDatabase = async () => {
  try {
    await connectDB();
    console.log('Seeding TaskFlow Database...');

    // Clear existing data
    await User.deleteMany({});
    await Task.deleteMany({});

    // Create Test User
    const user = await User.create({
      name: 'John Doe',
      email: 'john@example.com',
      password: 'Password123',
    });

    console.log(`Created User: ${user.name} (${user.email})`);

    // Create Sample Tasks
    const tasks = [
      {
        title: 'Implement JWT Authentication & bcrypt hashing',
        description: 'Set up Express middleware with Bearer tokens and Zod validation schemas.',
        status: 'DONE',
        priority: 'HIGH',
        dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 2), // +2 days
        user: user._id,
      },
      {
        title: 'Design Dashboard UI matching Stitch specifications',
        description: 'Build responsive sidebar, header, statistics cards, and task filters with Tailwind CSS.',
        status: 'IN_PROGRESS',
        priority: 'HIGH',
        dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 3), // +3 days
        user: user._id,
      },
      {
        title: 'Configure TanStack Query for server state management',
        description: 'Add custom hooks for task CRUD with automatic query cache invalidation.',
        status: 'TODO',
        priority: 'MEDIUM',
        dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 5), // +5 days
        user: user._id,
      },
      {
        title: 'Perform Security Authorization checks',
        description: 'Verify user scoping on all MongoDB queries to prevent cross-account data leakage.',
        status: 'TODO',
        priority: 'LOW',
        dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7), // +7 days
        user: user._id,
      },
    ];

    await Task.insertMany(tasks);
    console.log(`Successfully seeded ${tasks.length} tasks for ${user.email}`);

    await mongoose.disconnect();
    console.log('Database connection closed.');
    process.exit(0);
  } catch (error) {
    console.error('Failed to seed database:', error);
    process.exit(1);
  }
};

seedDatabase();
