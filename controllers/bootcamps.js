import Bootcamp from '../models/Bootcamp.js';

// @desc Get all bootcamps
// @route GET /api/v1/bootcamps
// Public
export const getBootcamps = (req, res) => {
  res.status(200).json({ success: true, msg: 'Get all bootcamps' });
};

// @desc Create new bootcamp
// @route POST /api/v1/bootcamps
// Private
export const createBootcamp = async (req, res) => {
  try {
    const bootcamp = await Bootcamp.create(req.body);

    res.status(201).json({ success: true, data: bootcamp });
  } catch (error) {
    res.status(400).json({ success: false });
  }
};

// @desc Get bootcamp by Id
// @route GET /api/v1/bootcamps/:id
// Public
export const getBootcamp = (req, res) => {
  res.status(200).json({ success: true, msg: `Get bootcamp ${req.params.id}` });
};

// @desc Update bootcamp by Id
// @route PUT /api/v1/bootcamps/:id
// Private
export const updateBootcamp = (req, res) => {
  res
    .status(200)
    .json({ success: true, msg: `Update bootcamp ${req.params.id}` });
};

// @desc Delete bootcamp by Id
// @route DELETE /api/v1/bootcamps/:id
// Private
export const deleteBootcamp = (req, res) => {
  res
    .status(200)
    .json({ success: true, msg: `Delete bootcamp ${req.params.id}` });
};
