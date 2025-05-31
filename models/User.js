const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const EnrolledCourseSchema = new Schema({
    courseId: {
        type: Schema.Types.ObjectId,
        ref: 'Course',
        required: true
    },
    completed: {
        type: Boolean,
        default: false
    }
});

const UserSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    enrolledCourses: [EnrolledCourseSchema]
});

module.exports = mongoose.model('User', UserSchema);