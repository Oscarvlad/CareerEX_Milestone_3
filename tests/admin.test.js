const request = require('supertest');
const app = require('../app');
const Course = require('../models/Course');

let adminToken;

beforeAll(async () => {
    const res = await request(app)
        .post('/api/auth/register')
        .send({
            name: 'Admin User',
            email: 'admin@example.com',
            password: 'adminpass',
            role: 'admin'
        });

    const loginRes = await request(app)
        .post('/api/auth/login')
        .send({
            email: 'admin@example.com',
            password: 'adminpass'
        });
    adminToken = loginRes.body.token;
});

describe('Admin API', () => {
    it('should create a course', async () => {
        const res = await request(app)
            .post('/api/admin/courses')
            .set('x-auth-token', adminToken)
            .send({
                title: 'Math 101',
                description: 'Basic math concepts',
                instructor: 'Prof. Smith'
            });
        expect(res.statusCode).toBe(201);
        expect(res.body).toHaveProperty('_id');
    });
});