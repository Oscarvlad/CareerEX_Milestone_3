const Course = require('../models/Course');
const User = require('../models/User');

// Get all enrolled courses
exports.getEnrolledCourses = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).populate('enrolledCourses.courseId');
        const courses = user.enrolledCourses.map(ec => ({
            ...ec.courseId._doc,
            completed: ec.completed
        }));
        res.json(courses);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// Get single course by ID
exports.getCourseById = async (req, res) => {
    try {
        const course = await Course.findById(req.params.id);
        if (!course) return res.status(404).json({ msg: 'Course not found' });

        res.json(course);
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') return res.status(404).json({ msg: 'Course not found' });
        res.status(500).send('Server error');
    }
};

// Enroll in course
exports.enrollInCourse = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);

        const alreadyEnrolled = user.enrolledCourses.some(
            ec => ec.courseId.toString() === req.params.id
        );

        if (alreadyEnrolled) return res.status(400).json({ msg: 'Already enrolled' });

        user.enrolledCourses.push({ courseId: req.params.id });
        await user.save();

        res.json({ msg: 'Successfully enrolled' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// Mark course complete
exports.markCourseComplete = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);

        const courseIndex = user.enrolledCourses.findIndex(
            ec => ec.courseId.toString() === req.params.id
        );

        if (courseIndex === -1) return res.status(404).json({ msg: 'Course not enrolled' });

        user.enrolledCourses[courseIndex].completed = true;
        await user.save();

        res.json({ msg: 'Course marked as completed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};