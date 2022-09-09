import Bootcamp from '../models/Bootcamp.js';

// @desc Get all bootcamps
// @route GET /api/v1/bootcamps
// Public
export const getBootcamps = async (req, res) => {
  try {
    const bootcamps = await Bootcamp.find();
    res
      .status(200)
      .json({ success: true, count: bootcamps.length, data: bootcamps });
  } catch (error) {
    res.status(400).json({ success: false });
  }
};

// @desc Create new bootcamp
// @route POST /api/v1/bootcamps
// Private
export const createBootcamp = async (req, res, next) => {
  try {
    const bootcamp = await Bootcamp.create(req.body);

    res.status(201).json({ success: true, data: bootcamp });
  } catch (error) {
    next(error);
    // res.status(400).json({ success: false });
  }
};

// @desc Get bootcamp by Id
// @route GET /api/v1/bootcamps/:id
// Public
export const getBootcamp = async (req, res, next) => {
  try {
    const bootcamp = await Bootcamp.findById(req.params.id);

    if (!bootcamp) {
      return res.status(400).json({ success: false });
    }

    res.status(200).json({ success: true, data: bootcamp });
  } catch (error) {
    next(error);
    // res.status(400).json({ success: false });
  }
};

// @desc Update bootcamp by Id
// @route PUT /api/v1/bootcamps/:id
// Private
export const updateBootcamp = async (req, res) => {
  try {
    const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!bootcamp) {
      return res.status(400).json({ success: false });
    }

    res.status(200).json({ success: true, data: bootcamp });
  } catch (error) {
    res.status(400).json({ success: false });
  }
};

// @desc Delete bootcamp by Id
// @route DELETE /api/v1/bootcamps/:id
// Private
export const deleteBootcamp = async (req, res) => {
  try {
    const bootcamp = await Bootcamp.findByIdAndDelete(req.params.id);

    if (!bootcamp) {
      return res.status(400).json({ success: false });
    }

    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    res.status(400).json({ success: false });
  }
};
