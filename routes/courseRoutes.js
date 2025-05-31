const express = require('express');
const router = express.Router();
const { auth, isInstructor } = require('../middlewares/authMiddleware');
const courseController = require('../controllers/courseController');

// @route   POST /courses
// @desc    Create a course
// @access  Instructor only
router.post('/', auth, isInstructor, courseController.createCourse);

// @route   GET /courses
// @desc    Get all courses
// @access  Public
router.get('/', courseController.getAllCourses);

// @route   GET /courses/:id
// @desc    Get course details
// @access  Public
router.get('/:id', courseController.getCourse);

// @route   GET /courses/:id/students
// @desc    Get students enrolled in a course
// @access  Instructor only
router.get('/:id/students', auth, isInstructor, courseController.getCourseStudents);

module.exports = router;