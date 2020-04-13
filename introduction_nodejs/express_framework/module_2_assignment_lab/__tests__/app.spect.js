const request = require('supertest');
const { server } = require('../lib/server');

describe('initial test', () => {
    it('Root test', () => {
        request(server)
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
