import Bootcamp from '../models/Bootcamp.js';
import ErrorResponse from '../utils/errorResponse.js';
import { asyncHandler } from '../middleware/async.js';
import geocoder from '../utils/geocoder.js';

// @desc      Get all bootcamps
// @route     GET /api/v1/bootcamps
// @access    Public
export const getBootcamps = asyncHandler(async (req, res, next) => {
  let query;

  // Copy req.query
  const reqQuery = { ...req.query };

  // Fields to exclude from query parameters
  const removeFields = ['select', 'sort', 'page', 'limit'];
  // Loop over removefields and delete them from reqQuery
  removeFields.forEach((el) => delete reqQuery[el]);

  // Convert to string
  let queryStr = JSON.stringify(reqQuery);

  // Create operators ($gt, $gte, etc)
  queryStr = queryStr.replace(
    /\b(gt|gte|lt|lte|in)\b/g,
    (match) => `$${match}`
  );

  // Finding resource
  query = Bootcamp.find(JSON.parse(queryStr)).populate('courses');

  if (req.query.select) {
    const fields = req.query.select.replaceAll(',', ' ');
    query = query.select(fields);
  }

  // Sort
  if (req.query.sort) {
    const sortBy = req.query.sort.replaceAll(',', ' ');
    query = query.sort(sortBy);
  } else {
    query = query.sort('-createdAt');
  }

  // Pagination
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 25;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const total = await Bootcamp.countDocuments();

  query = query.skip(startIndex).limit(limit);

  //Executing query
  const bootcamps = await query;

  // Pagination result
  const pagination = {};

  if (endIndex < total) {
    pagination.next = {
      page: page + 1,
      limit,
    };
  }

  if (startIndex > 0) {
    pagination.prev = {
      page: page - 1,
      limit,
    };
  }

  res.status(200).json({
    success: true,
    count: bootcamps.length,
    pagination,
    data: bootcamps,
  });
});

// @desc      Get single bootcamp
// @route     GET /api/v1/bootcamps/:id
// @access    Public
export const getBootcamp = async (req, res, next) => {
  try {
    const bootcamp = await Bootcamp.findById(req.params.id);

    if (!bootcamp) {
      return next(
        new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
      );
    }

    res.status(200).json({ success: true, data: bootcamp });
  } catch (error) {
    next(error);
  }
};

// @desc      Create new bootcamp
// @route     POST /api/v1/bootcamps
// @access    Private
export const createBootcamp = async (req, res, next) => {
  // Add user to req.body
  req.body.user = req.user.id;

  // check for published bootcamo
  const publishedBootcamp = await Bootcamp.findOne({ user: req.user.id });

  // If the user is not an admin, they can only add one bootcamp
  if (publishedBootcamp && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `The user with ID ${req.user.id} has already published a bootcamp`,
        400
      )
    );
  }

  const bootcamp = await Bootcamp.create(req.body);

  res.status(201).json({ success: true, data: bootcamp });
};

// @desc      Update bootcamp
// @route     PUT /api/v1/bootcamps/:id
// @access    Private
export const updateBootcamp = async (req, res, next) => {
  const bootcamp = await Bootcamp.findById(req.params.id);

  if (!bootcamp) {
    return next(
      new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
    );
  }

  // Get user ID asociated with Bootcamp in DB
  const user = bootcamp.user.toString();

  // Compare with current logged in user
  if (user !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `The user ${req.user.id} does not have permissions to update this bootcamp`,
        404
      )
    );
  }

  const updatedBootcamp = await Bootcamp.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );

  res.status(200).json({ success: true, data: updatedBootcamp });
};

// @desc      Delete bootcamp
// @route     DELETE /api/v1/bootcamps/:id
// @access    Private
export const deleteBootcamp = async (req, res, next) => {
  const bootcamp = await Bootcamp.findById(req.params.id);

  if (!bootcamp) {
    return next(
      new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
    );
  }

  // Get user ID asociated with Bootcamp in DB
  const user = bootcamp.user.toString();

  // Compare with current logged in user
  if (user !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `The user ${req.user.id} does not have permissions of removing the bootcamp`,
        404
      )
    );
  }

  await bootcamp.remove();

  res.status(200).json({ success: true, data: {} });
};

// @desc      Get bootcamps within a radius
// @route     GET /api/v1/bootcamps/radius/:zipcode/:distance
// @access    Private
export const getBootcampsInRadius = asyncHandler(async (req, res, next) => {
  const { zipcode, distance } = req.params;

  // Get lat/lng from geocoder
  const loc = await geocoder.geocode(zipcode);
  const lat = loc[0].latitude;
  const lng = loc[0].longitude;

  // Calc radius using radians
  // Divide dist by radius of earth
  // Earth Radius = 3,963 mi / 6,378 km
  const radius = distance / 3963;

  const bootcamps = await Bootcamp.find({
    location: {
      $geoWithin: { $centerSphere: [[lng, lat], radius] },
    },
  });

  res.status(200).json({
    success: true,
    count: bootcamps.length,
    data: bootcamps,
  });
});

// @desc      Upload photo for bootcamp
// @route     PUT /api/v1/bootcamps/:id/photo
// @access    Private
export const uploadPhotoBootcamp = async (req, res, next) => {
  const bootcamp = await Bootcamp.findById(req.params.id);

  if (!bootcamp) {
    return next(
      new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
    );
  }

  // Get user ID asociated with Bootcamp in DB
  const user = bootcamp.user.toString();

  // Compare with current logged in user
  if (user !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `The user ${req.user.id} does not have permissions to update this bootcamp`,
        404
      )
    );
  }

  // Check if file was uploaded
  if (!req.files) {
    return next(new ErrorResponse(`Please upload a file`, 400));
  }

  res.status(200).json({ success: true, data: {} });
};
