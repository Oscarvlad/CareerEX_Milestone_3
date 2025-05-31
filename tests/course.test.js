const request = require('supertest');
const app = require('../app');
const Course = require('../models/Course');

let token;

beforeAll(async () => {
    const res = await request(app)
        .post('/api/auth/login')
        .send({
            email: 'test@example.com',
            password: 'password123'
        });
    token = res.body.token;
});

describe('Course API', () => {
    it('should get enrolled courses', async () => {
        const res = await request(app)
            .get('/api/courses/enrolled')
            .set('x-auth-token', token);
        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
    });

    it('should enroll in course', async () => {
        const course = await Course.findOne();
        const res = await request(app)
            .post(`/api/courses/enroll/${course._id}`)
            .set('x-auth-token', token);
        expect(res.statusCode).toBe(200);
        expect(res.body.msg).toBe('Successfully enrolled');
    });
});