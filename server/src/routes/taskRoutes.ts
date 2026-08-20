import { Router } from 'express';
import {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
} from '../controllers/taskController.js';
import { validateBody, validateQuery } from '../middleware/validate.js';
import {
  createTaskSchema,
  updateTaskSchema,
  queryTaskSchema,
} from '../validations/taskValidation.js';
import { protect } from '../middleware/authMiddleware.js';

const router = Router();

// Protect all task endpoints
router.use(protect);

router.route('/')
  .get(validateQuery(queryTaskSchema), getTasks)
  .post(validateBody(createTaskSchema), createTask);

router.route('/:id')
  .get(getTaskById)
  .patch(validateBody(updateTaskSchema), updateTask)
  .delete(deleteTask);

export default router;
