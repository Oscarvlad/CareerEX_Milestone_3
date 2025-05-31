const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const {
    getEnrolledCourses,
    getCourseById,
    enrollInCourse,
    markCourseComplete
} = require('../controllers/courseController');

router.get('/enrolled', auth, getEnrolledCourses);
router.get('/:id', auth, getCourseById);
router.put('/complete/:id', auth, markCourseComplete);
router.post('/enroll/:id', auth, enrollInCourse);

module.exports = router;