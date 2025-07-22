import request from 'supertest';
import app from '../../src/index';
import { toDoLists } from '../../src/mockDb';
import { ToDoList } from '../../src/models/ToDoList';

// Store original mock data for restoration
const originalMockData: ToDoList[] = [
    {
        "id": "list-sample1",
        "title": "Sample To-Do List",
        "items": [
            {"id": "item-sample1", "content": "Sample item 1", "completed": false},
            {"id": "item-sample2", "content": "Sample item 2", "completed": true}
        ]
    },
    {
        "id": "list-sample2",
        "title": "Another To-Do List",
        "items": [
            {"id": "item-another1", "content": "Another item 1", "completed": false},
            {"id": "item-another2", "content": "Another item 2", "completed": false}
        ]
    }
];

// Reset mock data before each test to ensure isolation
beforeEach(() => {
    // Clear the array and restore original data
    toDoLists.length = 0;
    toDoLists.push(...originalMockData);
});

describe('ToDoList API Integration Tests', () => {
    
    describe('GET /api/lists', () => {
        it('should return 200 and all lists', async () => {
            const response = await request(app)
                .get('/api/lists')
                .expect(200);

            expect(Array.isArray(response.body)).toBe(true);
            expect(response.body).toHaveLength(2);
            expect(response.body[0]).toHaveProperty('id');
            expect(response.body[0]).toHaveProperty('title');
            expect(response.body[0]).toHaveProperty('items');
        });

        it('should return empty array when no lists exist', async () => {
            // Clear all lists
            toDoLists.length = 0;

            const response = await request(app)
                .get('/api/lists')
                .expect(200);

            expect(Array.isArray(response.body)).toBe(true);
            expect(response.body).toHaveLength(0);
        });

        it('should return lists with correct structure', async () => {
            const response = await request(app)
                .get('/api/lists')
                .expect(200);

            response.body.forEach((list: any) => {
                expect(list).toEqual(
                    expect.objectContaining({
                        id: expect.any(String),
                        title: expect.any(String),
                        items: expect.any(Array)
                    })
                );
            });
        });
    });

    describe('GET /api/lists/:id', () => {
        it('should return 200 and the specific list when it exists', async () => {
            const response = await request(app)
                .get('/api/lists/list-sample1')
                .expect(200);

            expect(response.body).toEqual({
                "id": "list-sample1",
                "title": "Sample To-Do List",
                "items": [
                    {"id": "item-sample1", "content": "Sample item 1", "completed": false},
                    {"id": "item-sample2", "content": "Sample item 2", "completed": true}
                ]
            });
        });

        it('should return 404 when list does not exist', async () => {
            const response = await request(app)
                .get('/api/lists/list-nonexistent')
                .expect(404);

            expect(response.body).toHaveProperty('message');
            expect(response.body.message).toContain('No list found');
        });

        it('should return correct list structure', async () => {
            const response = await request(app)
                .get('/api/lists/list-sample2')
                .expect(200);

            expect(response.body).toEqual(
                expect.objectContaining({
                    id: expect.any(String),
                    title: expect.any(String),
                    items: expect.any(Array)
                })
            );
        });
    });

    describe('POST /api/list', () => {
        it('should create a new list and return 200', async () => {
            const newListData = { title: 'New Integration Test List' };

            const response = await request(app)
                .post('/api/lists')
                .send(newListData)
                .expect(200);

            expect(response.body).toHaveProperty('id');
            expect(response.body.title).toBe('New Integration Test List');
            expect(response.body.items).toEqual([]);
            expect(typeof response.body.id).toBe('string');
        });

        it('should return 400 when title is missing', async () => {
            const response = await request(app)
                .post('/api/lists')
                .send({})
                .expect(400);

            expect(response.body).toHaveProperty('message');
            expect(response.body).toHaveProperty('missingValues');
            expect(response.body.missingValues).toContain('title');
        });

        it('should return 400 when title is too short', async () => {
            const response = await request(app)
                .post('/api/lists')
                .send({ title: 'Hi' })
                .expect(400);

            expect(response.body).toHaveProperty('message');
            expect(response.body).toHaveProperty('violations');
            expect(response.body.violations).toContain('Must be at least 3 characters long');
        });

        it('should return 400 when title is too long', async () => {
            const longTitle = 'a'.repeat(101); // Assuming max length is 100
            
            const response = await request(app)
                .post('/api/lists')
                .send({ title: longTitle })
                .expect(400);

            expect(response.body).toHaveProperty('message');
            expect(response.body).toHaveProperty('violations');
            expect(response.body.violations).toContain("Can't be longer than 50 characters");
        });

        it('should actually add the list to the database', async () => {
            const initialCount = toDoLists.length;
            
            await request(app)
                .post('/api/lists')
                .send({ title: 'Persistent Test List' })
                .expect(200);

            expect(toDoLists).toHaveLength(initialCount + 1);
        });

        it('should handle valid special characters in title', async () => {
            const specialTitle = 'List with spaces and numbers 123';
            
            const response = await request(app)
                .post('/api/lists')
                .send({ title: specialTitle })
                .expect(200);

            expect(response.body.title).toBe(specialTitle);
        });
    });

    describe('PATCH /api/list/:id', () => {
        it('should update an existing list and return 200', async () => {
            const updateData = { title: 'Updated List Title' };

            const response = await request(app)
                .patch('/api/lists/list-sample1')
                .send(updateData)
                .expect(200);

            expect(response.body.id).toBe('list-sample1');
            expect(response.body.title).toBe('Updated List Title');
            expect(response.body.items).toEqual([
                {"id": "item-sample1", "content": "Sample item 1", "completed": false},
                {"id": "item-sample2", "content": "Sample item 2", "completed": true}
            ]);
        });

        it('should return 404 when trying to update non-existent list', async () => {
            const response = await request(app)
                .patch('/api/lists/list-nonexistent')
                .send({ title: 'Updated Title' })
                .expect(404);

            expect(response.body).toHaveProperty('message');
            expect(response.body.message).toContain('No list found');
        });

        it('should return 400 when title is missing', async () => {
            const response = await request(app)
                .patch('/api/lists/list-sample1')
                .send({})
                .expect(400);

            expect(response.body).toHaveProperty('message');
            expect(response.body).toHaveProperty('missingValues');
            expect(response.body.missingValues).toContain('title');
        });

        it('should return 400 when title is invalid', async () => {
            const response = await request(app)
                .patch('/api/lists/list-sample1')
                .send({ title: 'Hi' })
                .expect(400);

            expect(response.body).toHaveProperty('message');
            expect(response.body).toHaveProperty('violations');
            expect(response.body.violations).toContain('Must be at least 3 characters long');
        });

        it('should preserve items when updating title', async () => {
            const originalResponse = await request(app).get('/api/lists/list-sample1');
            const originalItems = originalResponse.body.items;

            const updateResponse = await request(app)
                .patch('/api/lists/list-sample1')
                .send({ title: 'New Title' })
                .expect(200);

            expect(updateResponse.body.items).toEqual(originalItems);
        });

        it('should actually modify the list in the database', async () => {
            await request(app)
                .patch('/api/lists/list-sample1')
                .send({ title: 'Permanently Updated' })
                .expect(200);

            const verifyResponse = await request(app)
                .get('/api/lists/list-sample1')
                .expect(200);

            expect(verifyResponse.body.title).toBe('Permanently Updated');
        });
    });

    describe('DELETE /api/list/:listId', () => {
        it('should delete an existing list and return 200', async () => {
            const response = await request(app)
                .delete('/api/lists/list-sample2')
                .expect(200);

            expect(response.body.id).toBe('list-sample2');
            expect(response.body.title).toBe('Another To-Do List');
        });

        it('should return 404 when trying to delete non-existent list', async () => {
            const response = await request(app)
                .delete('/api/lists/list-nonexistent')
                .expect(404);

            expect(response.body).toHaveProperty('message');
            expect(response.body.message).toContain('No list found');
        });

        it('should actually remove the list from the database', async () => {
            const initialCount = toDoLists.length;

            await request(app)
                .delete('/api/lists/list-sample1')
                .expect(200);

            expect(toDoLists).toHaveLength(initialCount - 1);

            // Verify the list is gone
            await request(app)
                .get('/api/lists/list-sample1')
                .expect(404);
        });

        it('should not affect other lists when deleting', async () => {
            const allListsBefore = await request(app).get('/api/lists');
            const otherLists = allListsBefore.body.filter((list: any) => list.id !== 'list-sample2');

            await request(app)
                .delete('/api/lists/list-sample2')
                .expect(200);

            const allListsAfter = await request(app).get('/api/lists');
            expect(allListsAfter.body).toEqual(otherLists);
        });
    });

    describe('Error Handling', () => {
        it('should handle malformed JSON in POST requests', async () => {
            const response = await request(app)
                .post('/api/lists')
                .set('Content-Type', 'application/json')
                .send('{"title": invalid json}')
                .expect(400);
        });

        it('should handle malformed JSON in PATCH requests', async () => {
            const response = await request(app)
                .patch('/api/lists/list-sample1')
                .set('Content-Type', 'application/json')
                .send('{"title": invalid json}')
                .expect(400);
        });

        it('should return proper Content-Type headers', async () => {
            const response = await request(app)
                .get('/api/lists')
                .expect(200);

            expect(response.headers['content-type']).toMatch(/application\/json/);
        });
    });

    describe('End-to-End Workflows', () => {
        it('should support full CRUD workflow', async () => {
            // Create a new list
            const createResponse = await request(app)
                .post('/api/lists')
                .send({ title: 'E2E Test List' })
                .expect(200);

            const listId = createResponse.body.id;

            // Read the created list
            const readResponse = await request(app)
                .get(`/api/lists/${listId}`)
                .expect(200);

            expect(readResponse.body.title).toBe('E2E Test List');

            // Update the list
            const updateResponse = await request(app)
                .patch(`/api/lists/${listId}`)
                .send({ title: 'Updated E2E List' })
                .expect(200);

            expect(updateResponse.body.title).toBe('Updated E2E List');

            // Delete the list
            await request(app)
                .delete(`/api/lists/${listId}`)
                .expect(200);

            // Verify deletion
            await request(app)
                .get(`/api/lists/${listId}`)
                .expect(404);
        });

        it('should maintain data consistency across operations', async () => {
            const initialLists = await request(app).get('/api/lists');
            const initialCount = initialLists.body.length;

            // Create multiple lists
            await request(app).post('/api/lists').send({ title: 'List A' });
            await request(app).post('/api/lists').send({ title: 'List B' });
            await request(app).post('/api/lists').send({ title: 'List C' });

            const afterCreate = await request(app).get('/api/lists');
            expect(afterCreate.body).toHaveLength(initialCount + 3);

            // Delete one list
            const listToDelete = afterCreate.body.find((list: any) => list.title === 'List B');
            await request(app).delete(`/api/lists/${listToDelete.id}`);

            const afterDelete = await request(app).get('/api/lists');
            expect(afterDelete.body).toHaveLength(initialCount + 2);
            expect(afterDelete.body.find((list: any) => list.title === 'List B')).toBeUndefined();
        });
    });
});
