import express from 'express';
import {
  getBootcamps,
  getBootcamp,
  createBootcamp,
  updateBootcamp,
  deleteBootcamp,
  getBootcampsInRadius,
  uploadPhotoBootcamp,
} from '../controllers/bootcamps.js';
// Include other resource routers
import courseRouter from './courses.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// Re-route into other resource routers
router.use('/:bootcampId/courses', courseRouter);

router
  .route('/')
  .get(getBootcamps)
  .post(protect, authorize('publisher', 'admin'), createBootcamp);

router
  .route('/:id')
  .get(getBootcamp)
  .put(protect, authorize('publisher', 'admin'), updateBootcamp)
  .delete(protect, authorize('publisher', 'admin'), deleteBootcamp);

router
  .route('/:id/photo')
  .put(protect, authorize('publisher', 'admin'), uploadPhotoBootcamp);

router.route('/radius/:zipcode/:distance').get(getBootcampsInRadius);

export default router;
