import Course from '../models/Course.js';
import Bootcamp from '../models/Bootcamp.js';
import ErrorResponse from '../utils/errorResponse.js';
import { asyncHandler } from '../middleware/async.js';

// @desc      Get courses
// @route     GET /api/v1/courses
// @route     GET /api/v1/courses/bootcamps/:bootcampId/courses
// @access    Public
export const getCourses = asyncHandler(async (req, res, next) => {
  let query;

  if (req.params.bootcampId) {
    query = Course.find({ bootcamp: req.params.bootcampId });
  } else {
    query = Course.find().populate({
      path: 'bootcamp',
      select: 'name description',
    });
  }

  const courses = await query;

  res.status(200).json({
    success: true,
    count: courses.length,
    data: courses,
  });
});

// @desc      Get single course
// @route     GET /api/v1/courses/:id
// @access    Public
export const getCourse = asyncHandler(async (req, res, next) => {
  const course = await Course.findById(req.params.id).populate({
    path: 'bootcamp',
    select: 'name description',
  });

  if (!course) {
    return next(
      new ErrorResponse(`Course not found with id of ${req.params.id}`, 404)
    );
  }

  res.status(200).json({ success: true, data: course });
});

// @desc      Create new course
// @route     POST /api/v1/bootcamps/:bootcampId/courses
// @access    Private
export const createCourse = asyncHandler(async (req, res, next) => {
  req.body.bootcamp = req.params.bootcampId;
  req.body.user = req.user.id;

  const bootcamp = await Bootcamp.findById(req.params.bootcampId);

  if (!bootcamp) {
    return next(
      new ErrorResponse(
        `Bootcamp with id of ${req.params.bootcampId} does not exist`,
        404
      )
    );
  }

  // Get user ID asociated with Bootcamp in DB
  const user = bootcamp.user.toString();

  if (user !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `The user ${req.user.id} can not create the course`,
        404
      )
    );
  }

  const course = await Course.create(req.body);

  res.status(201).json({ success: true, data: course });
});

// @desc      Update course
// @route     PUT /api/v1/courses/:id
// @access    Private
export const updateCourse = asyncHandler(async (req, res, next) => {
  const course = await Course.findById(req.params.id);

  if (!course) {
    return next(new ErrorResponse(`No course with id ${req.params.id}`, 404));
  }

  // Get user ID asociated with Bootcamp in DB
  const user = course.user.toString();

  // Compare with current logged in user
  if (user !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `The user ${req.user.id} does not have permissions to update this course`,
        404
      )
    );
  }

  const updatedCourse = await Course.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );
  res.status(200).json({ success: true, data: updatedCourse });
});

// @desc      Delete course
// @route     DELETE /api/v1/courses/:id
// @access    Private
export const deleteCourse = async (req, res, next) => {
  const course = await Course.findById(req.params.id);

  if (!course) {
    return next(new ErrorResponse(`No course with id  ${req.params.id}`, 404));
  }

  // Get user ID asociated with Bootcamp in DB
  const user = course.user.toString();

  // Compare with current logged in user
  if (user !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `The user ${req.user.id} does not have permissions to delete this course`,
        404
      )
    );
  }

  await course.remove();

  res.status(200).json({ success: true, data: {} });
};
