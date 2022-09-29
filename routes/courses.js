import express from 'express';
import {
  getCourses,
  // getCourse,
  // createCourse,
  // updateCourse,
  // deleteCourse,
} from '../controllers/courses.js';

const router = express.Router();

router.route('/').get(getCourses);

// router.route('/:id').get(getCourse).put(updateCourse).delete(deleteCourse);

export default router;
