const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const adminOnly = require('../middleware/adminMiddleware');
const { createCourse } = require('../controllers/adminController');

router.post('/courses', auth, adminOnly, createCourse);

module.exports = router;