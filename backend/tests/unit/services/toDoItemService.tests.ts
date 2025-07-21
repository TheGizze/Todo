import * as service from '../../../src/services/toDoItemService'
import { toDoLists } from '../../../src/mockDb'
import { ToDoItem } from '../../../src/models/ToDoItem'
import { ToDoList } from '../../../src/models/ToDoList';
import * as idGenerator from '../../../src/utils/idGenerator';

// Mock the ID generator to make tests predictable
jest.mock('../../../src/utils/idGenerator', () => ({
    generateListId: jest.fn(),
    generateItemId: jest.fn()
}));

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



describe('ToDoItemService', () => {

    beforeEach(() => {
        toDoLists.length = 0;

        // Add fresh copies of the original data (deep clone to avoid reference issues)
        toDoLists.push(...JSON.parse(JSON.stringify(originalMockData)));

        jest.clearAllMocks();
    });

    //Create Item
    describe('Create new item to a list', () => {
        it('Should return new item when list exists', () => {
            const mockedGenerateItemId = idGenerator.generateItemId as jest.MockedFunction<typeof idGenerator.generateItemId>;
            mockedGenerateItemId.mockReturnValue('item-test123');

            const newItem = service.createListItem('list-sample1', 'new sample item');

            expect(newItem).toBeDefined();
            expect(mockedGenerateItemId).toHaveBeenCalledTimes(1);
            expect(newItem?.id).toBe('item-test123');
            expect(newItem?.content).toBe('new sample item');
            expect(newItem?.completed).toBe(false);
 
            
        });
        it('Should return undefined when list is not found', () => {
            const newItem = service.createListItem('list-sample99', 'new sample item');
            expect(newItem).toBe(undefined);
        });
        it('Should add new item to a list', () => {
            const initialLength = toDoLists.find(list => list.id === 'list-sample1')?.items.length || 0;

            const mockedGenerateItemtId = idGenerator.generateItemId as jest.MockedFunction<typeof idGenerator.generateItemId>;
            mockedGenerateItemtId.mockReturnValue('item-test123');

            const newItem = service.createListItem('list-sample1', 'new sample item');
            const list = toDoLists.find(list => list.id === 'list-sample1');

            expect(list?.items).toHaveLength(initialLength + 1);
            expect(list?.items).toContain(newItem);
            
        });

    });

    //Read Items
    describe('Get all Items', () => {
        it('should return items from existing list', () => {
            const items = service.getListItems('list-sample1');
            expect(items).toBeDefined();
            expect(items).toHaveLength(2);
            expect(items?.[0].id).toBe('item-sample1');
            expect(items?.[1].id).toBe('item-sample2');
        });

        it('should return undefined for non-existent list', () => {
            const items = service.getListItems('list-nonexistent');
            expect(items).toBeUndefined();
        });

        it('should return empty array for list with no items', () => {
            // Add a list with no items to test data
            toDoLists.push({
                id: 'list-empty',
                title: 'Empty List',
                items: []
            });

            const items = service.getListItems('list-empty');
            expect(items).toBeDefined();
            expect(items).toHaveLength(0);
        });
    });

    describe('Get item by id', () => {
        it('should return specific item from existing list', () => {
            const item = service.getListItem('list-sample1', 'item-sample1');
            expect(item).toBeDefined();
            expect(item?.id).toBe('item-sample1');
            expect(item?.content).toBe('Sample item 1');
            expect(item?.completed).toBe(false);
        });

        it('should return undefined for non-existent item in existing list', () => {
            const item = service.getListItem('list-sample1', 'item-nonexistent');
            expect(item).toBeUndefined();
        });

        it('should return undefined for item in non-existent list', () => {
            const item = service.getListItem('list-nonexistent', 'item-sample1');
            expect(item).toBeUndefined();
        });
    });

    describe('Update item by id', () => {
        it('should update existing item with partial data', () => {
            const updatedItem = service.updateListItem('list-sample1', 'item-sample1', {
                completed: true
            });

            expect(updatedItem).toBeDefined();
            expect(updatedItem?.id).toBe('item-sample1');
            expect(updatedItem?.content).toBe('Sample item 1'); // unchanged
            expect(updatedItem?.completed).toBe(true); // updated
        });

        it('should update multiple properties of existing item', () => {
            const updatedItem = service.updateListItem('list-sample1', 'item-sample1', {
                content: 'Updated content',
                completed: true
            });

            expect(updatedItem).toBeDefined();
            expect(updatedItem?.id).toBe('item-sample1');
            expect(updatedItem?.content).toBe('Updated content');
            expect(updatedItem?.completed).toBe(true);
        });

        it('should return undefined for non-existent item', () => {
            const result = service.updateListItem('list-sample1', 'item-nonexistent', {
                completed: true
            });

            expect(result).toBeUndefined();
        });

        it('should return undefined for item in non-existent list', () => {
            const result = service.updateListItem('list-nonexistent', 'item-sample1', {
                completed: true
            });

            expect(result).toBeUndefined();
        });

        it('should actually modify the item in the list', () => {
            service.updateListItem('list-sample1', 'item-sample1', { completed: true });
            
            const retrievedItem = service.getListItem('list-sample1', 'item-sample1');
            expect(retrievedItem?.completed).toBe(true);
        });
    });

    describe('Delete item by id', () => {
        it('should delete existing item and return it', () => {
            const deletedItem = service.deleteItem('list-sample1', 'item-sample1');

            expect(deletedItem).toBeDefined();
            expect(deletedItem?.id).toBe('item-sample1');
            expect(deletedItem?.content).toBe('Sample item 1');
            expect(deletedItem?.completed).toBe(false);
        });

        it('should remove item from the list', () => {
            const initialLength = service.getListItems('list-sample1')?.length || 0;
            
            service.deleteItem('list-sample1', 'item-sample1');
            
            const items = service.getListItems('list-sample1');
            expect(items).toHaveLength(initialLength - 1);
            
            const deletedItem = service.getListItem('list-sample1', 'item-sample1');
            expect(deletedItem).toBeUndefined();
        });

        it('should return undefined for non-existent item', () => {
            const result = service.deleteItem('list-sample1', 'item-nonexistent');
            expect(result).toBeUndefined();
        });

        it('should return undefined for item in non-existent list', () => {
            const result = service.deleteItem('list-nonexistent', 'item-sample1');
            expect(result).toBeUndefined();
        });

        it('should not affect other items when deleting', () => {
            const allItemsBefore = service.getListItems('list-sample1');
            const otherItems = allItemsBefore?.filter(item => item.id !== 'item-sample1');
            
            service.deleteItem('list-sample1', 'item-sample1');
            
            const allItemsAfter = service.getListItems('list-sample1');
            expect(allItemsAfter).toEqual(otherItems);
        });
    });




});