const express = require('express');
const router = express.Router();
const { auth, isStudent } = require('../middlewares/authMiddleware');
const enrollmentController = require('../controllers/enrollmentController');

// @route   POST /enroll
// @desc    Enroll in a course
// @access  Student only
router.post('/', auth, isStudent, enrollmentController.enroll);

// @route   GET /enrollments
// @desc    Get user's enrollments
// @access  Private
router.get('/', auth, enrollmentController.getEnrollments);

// @route   PUT /enrollments/:id/complete
// @desc    Update course completion status
// @access  Student only
router.put('/:id/complete', auth, isStudent, enrollmentController.updateCompletion);

module.exports = router;