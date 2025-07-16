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
        //expect(response.status).toBe(400);
        expect(response.body).toEqual({ message: 'List name must be a string' });
    });

    it('should return 400 if name is empty string', async () => {
        const response = await request(app).post('/lists').send({ name: '' });
        expect(response.status).toBe(400);
        expect(response.body).toEqual({ message: 'List name cannot be empty' });
    });
    
});