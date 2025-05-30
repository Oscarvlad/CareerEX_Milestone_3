const Enrollment = require('../models/Enrollment');
const Course = require('../models/Course');

// @desc    Enroll in a course
// @route   POST /enroll
// @access  Student
exports.enroll = async (req, res) => {
  try {
    const { courseId } = req.body;

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ msg: 'Course not found' });
    }

    // Check if already enrolled
    const existingEnrollment = await Enrollment.findOne({
      user: req.user.id,
      course: courseId
    });

    if (existingEnrollment) {
      return res.status(400).json({ msg: 'Already enrolled in this course' });
    }

    const enrollment = new Enrollment({
      user: req.user.id,
      course: courseId,
      completed: false
    });

    await enrollment.save();
    res.status(201).json(enrollment);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Get user's enrollments
// @route   GET /enrollments
// @access  Private
exports.getEnrollments = async (req, res) => {
  try {
    let enrollments;
    
    if (req.user.role === 'student') {
      // Students see their own enrollments
      enrollments = await Enrollment.find({ user: req.user.id })
        .populate('course', 'title description instructor')
        .populate('course.instructor', 'username');
    } else {
      // Instructors see enrollments in their courses
      const instructorCourses = await Course.find({ instructor: req.user.id });
      enrollments = await Enrollment.find({
        course: { $in: instructorCourses.map(c => c._id) }
      })
      .populate('user', 'username email')
      .populate('course', 'title');
    }

    res.json(enrollments);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Update course completion status
// @route   PUT /enrollments/:id/complete
// @access  Student
exports.updateCompletion = async (req, res) => {
  try {
    const { completed } = req.body;
    
    const enrollment = await Enrollment.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!enrollment) {
      return res.status(404).json({ msg: 'Enrollment not found' });
    }

    enrollment.completed = completed;
    enrollment.completedAt = completed ? new Date() : null;
    
    await enrollment.save();
    res.json(enrollment);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};