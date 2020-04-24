const request = require('supertest');
const { app } = require('../lib/app');

describe('initial test', () => {
    it('Root test', () => {
        request(app)
            .get('/')
            .expect('Content-Type', /json/)
            .expect(200)
            .end((err) => {
                if (err) {
                    throw err;
                }
            })
    });
});
