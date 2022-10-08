import express from 'express';
import {
  getCourses,
  getCourse,
  createCourse,
  updateCourse,
  deleteCourse,
} from '../controllers/courses.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router({ mergeParams: true });

router
  .route('/')
  .get(getCourses)
  .post(protect, authorize('publisher', 'admin'), createCourse);
router
  .route('/:id')
  .get(getCourse)
  .put(protect, authorize('publisher', 'admin'), updateCourse)
  .delete(protect, authorize('publisher', 'admin'), deleteCourse);

export default router;
