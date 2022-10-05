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

const router = express.Router();

// Re-route into other resource routers
router.use('/:bootcampId/courses', courseRouter);

router.route('/').get(getBootcamps).post(createBootcamp);

router
  .route('/:id')
  .get(getBootcamp)
  .put(updateBootcamp)
  .delete(deleteBootcamp);

router.route('/:id/photo').put(uploadPhotoBootcamp);

router.route('/radius/:zipcode/:distance').get(getBootcampsInRadius);

export default router;
