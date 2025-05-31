const Course = require('../models/Course');

exports.createCourse = async (req, res) => {
    const { title, description, instructor } = req.body;

    try {
        const course = new Course({ title, description, instructor });
        await course.save();
        res.status(201).json(course);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};