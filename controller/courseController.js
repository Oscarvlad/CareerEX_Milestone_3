const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');
const User = require('../models/User');

// @desc    Create a course
// @route   POST /courses
// @access  Instructor
exports.createCourse = async (req, res) => {
  try {
    const { title, description } = req.body;
    
    const course = new Course({
      title,
      description,
      instructor: req.user.id
    });

    await course.save();
    res.status(201).json(course);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Get all courses
// @route   GET /courses
// @access  Public
exports.getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find().populate('instructor', 'username');
    res.json(courses);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Get single course
// @route   GET /courses/:id
// @access  Public
exports.getCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate('instructor', 'username email');
    
    if (!course) {
      return res.status(404).json({ msg: 'Course not found' });
    }

    // For enrolled students, include enrollment status
    if (req.user && req.user.role === 'student') {
      const enrollment = await Enrollment.findOne({
        user: req.user.id,
        course: req.params.id
      });
      
      return res.json({
        ...course.toObject(),
        enrollmentStatus: enrollment || null
      });
    }

    res.json(course);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Get students enrolled in a course
// @route   GET /courses/:id/students
// @access  Instructor
exports.getCourseStudents = async (req, res) => {
  try {
    // Verify the requesting instructor owns the course
    const course = await Course.findOne({
      _id: req.params.id,
      instructor: req.user.id
    });

    if (!course) {
      return res.status(404).json({ msg: 'Course not found or unauthorized' });
    }

    const enrollments = await Enrollment.find({ course: req.params.id })
      .populate('user', 'username email')
      .select('-course -_id -__v');

    res.json(enrollments);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};