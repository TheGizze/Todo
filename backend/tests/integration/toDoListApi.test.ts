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
    
    // Add fresh copies of the original data (deep clone to avoid reference issues)
    toDoLists.push(...JSON.parse(JSON.stringify(originalMockData)));
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

            expect(response.body).toHaveProperty('error');
            expect(response.body.error).toHaveProperty('message');
            expect(response.body.error.message).toContain('No list Found');
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
            expect(response.body.error).toHaveProperty('violations');
            expect(response.body.error.violations).toHaveProperty('title');
            expect(response.body.error.violations.title).toContain('Required');
        });

        it('should return 400 when title is too short', async () => {
            const response = await request(app)
                .post('/api/lists')
                .send({ title: 'Hi' })
                .expect(400);
            expect(response.body.error).toHaveProperty('violations');
            expect(response.body.error.violations).toHaveProperty('title');
            expect(response.body.error.violations.title).toContain('Must be at least 3 characters long');
        });

        it('should return 400 when title is too long', async () => {
            const longTitle = 'a'.repeat(101); // Assuming max length is 100
            
            const response = await request(app)
                .post('/api/lists')
                .send({ title: longTitle })
                .expect(400);
            expect(response.body.error).toHaveProperty('violations');
            expect(response.body.error.violations).toHaveProperty('title');
            expect(response.body.error.violations.title).toContain("Can't be longer than 50 characters");
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

            expect(response.body).toHaveProperty('error');
            expect(response.body.error).toHaveProperty('message');
            expect(response.body.error.message).toContain('No list Found');
        });

        it('should return 400 when title is missing', async () => {
            const response = await request(app)
                .patch('/api/lists/list-sample1')
                .send({})
                .expect(400);
            expect(response.body.error).toHaveProperty('violations');
            expect(response.body.error.violations).toHaveProperty('title');
            expect(response.body.error.violations.title).toContain('Required');
        });

        it('should return 400 when title is invalid', async () => {
            const response = await request(app)
                .patch('/api/lists/list-sample1')
                .send({ title: 'Hi' })
                .expect(400);
            expect(response.body.error).toHaveProperty('violations');
            expect(response.body.error.violations).toHaveProperty('title');
            expect(response.body.error.violations.title).toContain('Must be at least 3 characters long');
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

            expect(response.body).toHaveProperty('error');
            expect(response.body.error).toHaveProperty('message');
            expect(response.body.error.message).toContain('No list Found');
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

describe('ToDoItem API Integration Tests', () => {
    
    describe('GET /api/lists/:listId/items', () => {
        it('should return 200 and all items for a list', async () => {
            const response = await request(app)
                .get('/api/lists/list-sample1/items')
                .expect(200);

            expect(Array.isArray(response.body)).toBe(true);
            expect(response.body).toHaveLength(2);
            expect(response.body[0]).toHaveProperty('id');
            expect(response.body[0]).toHaveProperty('content');
            expect(response.body[0]).toHaveProperty('completed');
        });

        it('should return 404 when list does not exist', async () => {
            const response = await request(app)
                .get('/api/lists/list-nonexistent/items')
                .expect(404);

            expect(response.body).toHaveProperty('error');
            expect(response.body.error).toHaveProperty('message');
            expect(response.body.error.message).toContain('No list Found');
        });

        it('should return empty array when list exists but has no items', async () => {
            // Create a new list with no items
            const createResponse = await request(app)
                .post('/api/lists')
                .send({ title: 'Empty List' })
                .expect(200);

            const response = await request(app)
                .get(`/api/lists/${createResponse.body.id}/items`)
                .expect(200);

            expect(Array.isArray(response.body)).toBe(true);
            expect(response.body).toHaveLength(0);
        });

        it('should return items with correct structure', async () => {
            const response = await request(app)
                .get('/api/lists/list-sample1/items')
                .expect(200);

            response.body.forEach((item: any) => {
                expect(item).toEqual(
                    expect.objectContaining({
                        id: expect.any(String),
                        content: expect.any(String),
                        completed: expect.any(Boolean)
                    })
                );
            });
        });

        it('should return the correct items for the specified list', async () => {
            const response = await request(app)
                .get('/api/lists/list-sample1/items')
                .expect(200);

            expect(response.body).toEqual([
                {"id": "item-sample1", "content": "Sample item 1", "completed": false},
                {"id": "item-sample2", "content": "Sample item 2", "completed": true}
            ]);
        });
    });

    describe('GET /api/lists/:listId/items/:itemId', () => {
        it('should return 200 and the specific item when it exists', async () => {
            const response = await request(app)
                .get('/api/lists/list-sample1/items/item-sample1')
                .expect(200);

            expect(response.body).toEqual({
                "id": "item-sample1",
                "content": "Sample item 1",
                "completed": false
            });
        });

        it('should return 404 when list does not exist', async () => {
            const response = await request(app)
                .get('/api/lists/list-nonexistent/items/item-sample1')
                .expect(404);

            expect(response.body).toHaveProperty('error');
            expect(response.body.error).toHaveProperty('message');
            expect(response.body.error.message).toContain('No list Found with id: list-nonexistent');
        });

        it('should return 404 when item does not exist in list', async () => {
            const response = await request(app)
                .get('/api/lists/list-sample1/items/item-nonexistent')
                .expect(404);

            expect(response.body).toHaveProperty('error');
            expect(response.body.error).toHaveProperty('message');
            expect(response.body.error.message).toContain('No item found with id: item-nonexistent');
        });

        it('should return correct item structure', async () => {
            const response = await request(app)
                .get('/api/lists/list-sample1/items/item-sample2')
                .expect(200);

            expect(response.body).toEqual(
                expect.objectContaining({
                    id: expect.any(String),
                    content: expect.any(String),
                    completed: expect.any(Boolean)
                })
            );
        });
    });

    describe('POST /api/lists/:listId/items', () => {
        it('should create a new item and return 200', async () => {
            const newItemData = { content: 'New test item' };

            const response = await request(app)
                .post('/api/lists/list-sample1/items')
                .send(newItemData)
                .expect(200);

            expect(response.body).toHaveProperty('id');
            expect(response.body.content).toBe('New test item');
            expect(response.body.completed).toBe(false);
            expect(typeof response.body.id).toBe('string');
        });

        it('should return 400 when content is missing', async () => {
            const response = await request(app)
                .post('/api/lists/list-sample1/items')
                .send({})
                .expect(400);
            expect(response.body.error).toHaveProperty('violations');
            expect(response.body.error.violations).toHaveProperty('content');
            expect(response.body.error.violations.content).toContain('Required');
        });

        it('should return 400 when content is too short', async () => {
            const response = await request(app)
                .post('/api/lists/list-sample1/items')
                .send({ content: 'H' })
                .expect(400);
            expect(response.body.error).toHaveProperty('violations');
            expect(response.body.error.violations.content).toContain('Must be at least 2 characters long');
        });

        it('should return 400 when content is too long', async () => {
            const longContent = 'a'.repeat(201); // Assuming max length is 200
            
            const response = await request(app)
                .post('/api/lists/list-sample1/items')
                .send({ content: longContent })
                .expect(400);
            expect(response.body.error).toHaveProperty('violations');
        });

        it('should return 404 when list does not exist', async () => {
            const response = await request(app)
                .post('/api/lists/list-nonexistent/items')
                .send({ content: 'Valid content' })
                .expect(404);

            expect(response.body).toHaveProperty('error');
            expect(response.body.error).toHaveProperty('message');
            expect(response.body.error.message).toContain('No list Found');
        });

        it('should actually add the item to the list', async () => {
            const initialResponse = await request(app).get('/api/lists/list-sample1/items');
            const initialCount = initialResponse.body.length;
            
            await request(app)
                .post('/api/lists/list-sample1/items')
                .send({ content: 'Persistent test item' })
                .expect(200);

            const afterResponse = await request(app).get('/api/lists/list-sample1/items');
            expect(afterResponse.body).toHaveLength(initialCount + 1);
        });

        it('should handle valid special characters in content', async () => {
            const specialContent = 'Test 123 (.,!?:;-_\') symbols';
            
            const response = await request(app)
                .post('/api/lists/list-sample1/items')
                .send({ content: specialContent })
                .expect(200);

            expect(response.body.content).toBe(specialContent);
        });

        it('should set completed to false by default', async () => {
            const response = await request(app)
                .post('/api/lists/list-sample1/items')
                .send({ content: 'Default completed test' })
                .expect(200);

            expect(response.body.completed).toBe(false);
        });
    });

    describe('PATCH /api/lists/:listId/items/:itemId', () => {
        it('should update an existing item and return 200', async () => {
            const updateData = { content: 'Updated item content', completed: true };

            const response = await request(app)
                .patch('/api/lists/list-sample1/items/item-sample1')
                .send(updateData)
                .expect(200);

            expect(response.body.id).toBe('item-sample1');
            expect(response.body.content).toBe('Updated item content');
            expect(response.body.completed).toBe(true);
        });

        it('should return 404 when list does not exist', async () => {
            const response = await request(app)
                .patch('/api/lists/list-nonexistent/items/item-sample1')
                .send({ content: 'Updated content', completed: true })
                .expect(404);

            expect(response.body).toHaveProperty('error');
            expect(response.body.error).toHaveProperty('message');
            expect(response.body.error.message).toContain('No list Found with id: list-nonexistent');
        });

        it('should return 404 when item does not exist', async () => {
            const response = await request(app)
                .patch('/api/lists/list-sample1/items/item-nonexistent')
                .send({ content: 'Updated content', completed: true })
                .expect(404);

            expect(response.body).toHaveProperty('error');
            expect(response.body.error).toHaveProperty('message');
            expect(response.body.error.message).toContain('No item found with id: item-nonexistent');
        });

        it('should return 200 when only completed is provided', async () => {
            const response = await request(app)
                .patch('/api/lists/list-sample1/items/item-sample1')
                .send({ completed: true })
                .expect(200);
            expect(response.body).toHaveProperty('completed');
            expect(response.body.completed).toBeTruthy();
        });

        it('should return 200 when only content is provided', async () => {
            const response = await request(app)
                .patch('/api/lists/list-sample1/items/item-sample1')
                .send({ content: 'Updated content' })
                .expect(200);
            expect(response.body).toHaveProperty('content');
            expect(response.body.content).toContain('Updated content');
        });

        it('should return 400 when both fields are missing', async () => {
            const response = await request(app)
                .patch('/api/lists/list-sample1/items/item-sample1')
                .send({})
                .expect(400);
            expect(response.body.error).toHaveProperty('violations');
            expect(response.body.error.violations).toHaveProperty('_global');
            expect(response.body.error.violations._global).toContain("At least one of 'content' or 'completed' is required.");
        });

        it('should actually modify the item in the list', async () => {
            await request(app)
                .patch('/api/lists/list-sample1/items/item-sample1')
                .send({ content: 'Permanently updated content', completed: true })
                .expect(200);

            const verifyResponse = await request(app)
                .get('/api/lists/list-sample1/items/item-sample1')
                .expect(200);

            expect(verifyResponse.body.content).toBe('Permanently updated content');
            expect(verifyResponse.body.completed).toBe(true);
        });

        it('should handle toggling completed status', async () => {
            // First, update to completed: true
            await request(app)
                .patch('/api/lists/list-sample1/items/item-sample1')
                .send({ content: 'Toggle test content', completed: true })
                .expect(200);

            // Then, update to completed: false
            const response = await request(app)
                .patch('/api/lists/list-sample1/items/item-sample1')
                .send({ content: 'Toggle test content', completed: false })
                .expect(200);

            expect(response.body.completed).toBe(false);
        });
    });

    describe('DELETE /api/lists/:listId/items/:itemId', () => {
        it('should delete an existing item and return 200', async () => {
            const response = await request(app)
                .delete('/api/lists/list-sample1/items/item-sample1')
                .expect(200);

            expect(response.body.id).toBe('item-sample1');
            expect(response.body.content).toBe('Sample item 1');
            expect(response.body.completed).toBe(false);
        });

        it('should return 404 when list does not exist', async () => {
            const response = await request(app)
                .delete('/api/lists/list-nonexistent/items/item-sample1')
                .expect(404);

            expect(response.body).toHaveProperty('error');
            expect(response.body.error).toHaveProperty('message');
            expect(response.body.error.message).toContain('No list Found with id: list-nonexistent');
        });

        it('should return 404 when item does not exist', async () => {
            const response = await request(app)
                .delete('/api/lists/list-sample1/items/item-nonexistent')
                .expect(404);

            expect(response.body).toHaveProperty('error');
            expect(response.body.error).toHaveProperty('message');
            expect(response.body.error.message).toContain('No item found with id: item-nonexistent');
        });

        it('should actually remove the item from the list', async () => {
            const initialResponse = await request(app).get('/api/lists/list-sample1/items');
            const initialCount = initialResponse.body.length;

            await request(app)
                .delete('/api/lists/list-sample1/items/item-sample1')
                .expect(200);

            const afterResponse = await request(app).get('/api/lists/list-sample1/items');
            expect(afterResponse.body).toHaveLength(initialCount - 1);

            // Verify the item is gone
            await request(app)
                .get('/api/lists/list-sample1/items/item-sample1')
                .expect(404);
        });

        it('should not affect other items when deleting', async () => {
            const allItemsBefore = await request(app).get('/api/lists/list-sample1/items');
            const otherItems = allItemsBefore.body.filter((item: any) => item.id !== 'item-sample2');

            await request(app)
                .delete('/api/lists/list-sample1/items/item-sample2')
                .expect(200);

            const allItemsAfter = await request(app).get('/api/lists/list-sample1/items');
            expect(allItemsAfter.body).toEqual(otherItems);
        });

        it('should not affect items in other lists', async () => {
            const list2ItemsBefore = await request(app).get('/api/lists/list-sample2/items');

            await request(app)
                .delete('/api/lists/list-sample1/items/item-sample1')
                .expect(200);

            const list2ItemsAfter = await request(app).get('/api/lists/list-sample2/items');
            expect(list2ItemsAfter.body).toEqual(list2ItemsBefore.body);
        });
    });

    describe('Item Error Handling', () => {
        it('should handle malformed JSON in POST requests', async () => {
            const response = await request(app)
                .post('/api/lists/list-sample1/items')
                .set('Content-Type', 'application/json')
                .send('{"content": invalid json}')
                .expect(400);
        });

        it('should handle malformed JSON in PATCH requests', async () => {
            const response = await request(app)
                .patch('/api/lists/list-sample1/items/item-sample1')
                .set('Content-Type', 'application/json')
                .send('{"content": invalid json}')
                .expect(400);
        });

        it('should return proper Content-Type headers', async () => {
            const response = await request(app)
                .get('/api/lists/list-sample1/items')
                .expect(200);

            expect(response.headers['content-type']).toMatch(/application\/json/);
        });

        it('should handle invalid boolean values for completed', async () => {
            const response = await request(app)
                .patch('/api/lists/list-sample1/items/item-sample1')
                .send({ content: 'Valid content', completed: 'not-a-boolean' })
                .expect(400); 
        });
    });

    describe('Item End-to-End Workflows', () => {
        it('should support full CRUD workflow for items', async () => {
            // Create a new item
            const createResponse = await request(app)
                .post('/api/lists/list-sample1/items')
                .send({ content: 'E2E Test Item' })
                .expect(200);

            const itemId = createResponse.body.id;

            // Read the created item
            const readResponse = await request(app)
                .get(`/api/lists/list-sample1/items/${itemId}`)
                .expect(200);

            expect(readResponse.body.content).toBe('E2E Test Item');
            expect(readResponse.body.completed).toBe(false);

            // Update the item
            const updateResponse = await request(app)
                .patch(`/api/lists/list-sample1/items/${itemId}`)
                .send({ content: 'Updated E2E Item', completed: true })
                .expect(200);

            expect(updateResponse.body.content).toBe('Updated E2E Item');
            expect(updateResponse.body.completed).toBe(true);

            // Delete the item
            await request(app)
                .delete(`/api/lists/list-sample1/items/${itemId}`)
                .expect(200);

            // Verify deletion
            await request(app)
                .get(`/api/lists/list-sample1/items/${itemId}`)
                .expect(404);
        });

        it('should maintain data consistency across item operations', async () => {
            const initialItems = await request(app).get('/api/lists/list-sample1/items');
            const initialCount = initialItems.body.length;

            // Create multiple items
            await request(app).post('/api/lists/list-sample1/items').send({ content: 'Item A' });
            await request(app).post('/api/lists/list-sample1/items').send({ content: 'Item B' });
            await request(app).post('/api/lists/list-sample1/items').send({ content: 'Item C' });

            const afterCreate = await request(app).get('/api/lists/list-sample1/items');
            expect(afterCreate.body).toHaveLength(initialCount + 3);

            // Delete one item
            const itemToDelete = afterCreate.body.find((item: any) => item.content === 'Item B');
            await request(app).delete(`/api/lists/list-sample1/items/${itemToDelete.id}`);

            const afterDelete = await request(app).get('/api/lists/list-sample1/items');
            expect(afterDelete.body).toHaveLength(initialCount + 2);
            expect(afterDelete.body.find((item: any) => item.content === 'Item B')).toBeUndefined();
        });

        it('should support creating items in different lists independently', async () => {
            // Create item in list 1
            const item1Response = await request(app)
                .post('/api/lists/list-sample1/items')
                .send({ content: 'Item in List 1' })
                .expect(200);

            // Create item in list 2
            const item2Response = await request(app)
                .post('/api/lists/list-sample2/items')
                .send({ content: 'Item in List 2' })
                .expect(200);

            // Verify items are in correct lists
            const list1Items = await request(app).get('/api/lists/list-sample1/items');
            const list2Items = await request(app).get('/api/lists/list-sample2/items');

            expect(list1Items.body.some((item: any) => item.content === 'Item in List 1')).toBe(true);
            expect(list2Items.body.some((item: any) => item.content === 'Item in List 2')).toBe(true);

            // Verify cross-contamination didn't occur
            expect(list1Items.body.some((item: any) => item.content === 'Item in List 2')).toBe(false);
            expect(list2Items.body.some((item: any) => item.content === 'Item in List 1')).toBe(false);
        });
    });
});
