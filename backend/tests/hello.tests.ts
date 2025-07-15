import request from 'supertest';
import app from '../src/index';

const toDoLists: JSON = {}

describe('Hello API', () => {
    it('should return hello message', async () => {
        const response = await request(app).get('/hello');
        expect(response.status).toBe(200);
        expect(response.body).toEqual({ message: 'Hello, world!' });
    });
});