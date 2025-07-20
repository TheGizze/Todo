import request from 'supertest';
import app from '../src/todo';


describe('Get all To Do lists', () => {
    it('should return array with todo list objects', async () => {
        const response = await request(app).get('/lists');
        expect(response.status).toBe(200);
        expect(response.body).toEqual([{"id":"1","title":"Sample To-Do List","items":[{"id":"1","content":"Sample item 1","completed":false},{"id":"2","content":"Sample item 2","completed":true}]},{"id":"2","title":"Another To-Do List","items":[{"id":"1","content":"Another item 1","completed":false},{"id":"2","content":"Another item 2","completed":false}]}]);
    });
});

describe('Get list by id', () => {
    it('should return a specific todo list object', async () => {
        const response = await request(app).get('/lists/1');
        expect(response.status).toBe(200);
        expect(response.body).toEqual({"id":"1","title":"Sample To-Do List","items":[{"id":"1","content":"Sample item 1","completed":false},{"id":"2","content":"Sample item 2","completed":true}]});
    });

    it('should return 404 for non-existent list', async () => {
        const response = await request(app).get('/lists/999');
        expect(response.status).toBe(404);
        expect(response.body).toEqual({message: "No lists with id: 999"});
    });
});

describe('Delete list by id', () => {
    it('should return specific todo list object', async () => {
        const response = await request(app).delete('/lists/2');
        expect(response.status).toBe(200);
        expect(response.body).toEqual({"id":"2","title":"Another To-Do List","items":[{"id":"1","content":"Another item 1","completed":false},{"id":"2","content":"Another item 2","completed":false}]});
    });

    it('should return 404 for non-existent list', async () => {
        const response = await request(app).delete('/lists/999');
        expect(response.status).toBe(404);
        expect(response.body).toEqual({message: "No lists with id: 999"});
    });
});

describe('Add new list', () => {
    it('should return 200 and created list', async() => {
        const payload = {name: 'My new list'};
        const response = await request(app).post('/lists').send(payload);
        expect(response.status).toBe(200);
        expect(response.body).toEqual({id: '3', title: 'My new list', items: []});
    });

    it('should return 400 if name is missing', async () => {
        const response = await request(app).post('/lists').send({});
        expect(response.status).toBe(400);
        expect(response.body).toEqual({ message: 'request body must contain name' });
    });

    it('should return 400 if name is not a string', async () => {
        const response = await request(app).post('/lists').send({ name: 123 });
        expect(response.status).toBe(400);
        expect(response.body).toEqual({ message: "invalid name", violations: ["Must be a string"] });
    });

    it('should return 400 if name is empty string', async () => {
        const response = await request(app).post('/lists').send({ name: '' });
        expect(response.status).toBe(400);
        expect(response.body).toEqual({ message: "invalid name", 
            violations: ["Must not be empty.",
                         "Must be at least 3 characters long"
                        ], });
    });

    it('should return 400 if name is too short (less than 3 characters)', async () => {
        const response = await request(app).post('/lists').send({ name: 'Hi' });
        expect(response.status).toBe(400);
        expect(response.body).toEqual({ 
            message: "invalid name", 
            violations: ["Must be at least 3 characters long"]
        });
    });

    it('should return 400 if name is too long (more than 50 characters)', async () => {
        const longName = 'This is a very long name that exceeds fifty characters limit for validation testing';
        const response = await request(app).post('/lists').send({ name: longName });
        expect(response.status).toBe(400);
        expect(response.body).toEqual({ 
            message: "invalid name", 
            violations: ["Can't be longer than 50 characters"]
        });
    });

    it('should return 400 if name contains special characters', async () => {
        const response = await request(app).post('/lists').send({ name: 'My List@#$' });
        expect(response.status).toBe(400);
        expect(response.body).toEqual({ 
            message: "invalid name", 
            violations: ["Must not contain special characters: `@#$%^&*+=[]{}\"\\|<>/?~"]
        });
    });

    it('should return 400 if name contains invalid characters', async () => {
        const response = await request(app).post('/lists').send({ name: 'My List@' });
        expect(response.status).toBe(400);
        expect(response.body).toEqual({ 
            message: "invalid name", 
            violations: ["Must not contain special characters: `@#$%^&*+=[]{}\"\\|<>/?~"]
        });
    });

    it('should return 400 with multiple validation errors', async () => {
        const response = await request(app).post('/lists').send({ name: 'A@' });
        expect(response.status).toBe(400);
        expect(response.body).toEqual({ 
            message: "invalid name", 
            violations: [
                "Must be at least 3 characters long",
                "Must not contain special characters: `@#$%^&*+=[]{}\"\\|<>/?~"
            ]
        });
    });

    
    
});