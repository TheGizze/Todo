import * as service from '../../../src/services/toDoItemService'
import { toDoLists } from '../../../src/mockDb'
import { ToDoItem } from '../../../src/models/ToDoItem'
import { ToDoList } from '../../../src/models/ToDoList';
import * as idGenerator from '../../../src/utils/idGenerator';
import { ListNotFoundError, ItemNotFoundError } from '../../../src/errors/resourceErrors';

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
        it('Should return new item when list exists', async () => {
            const mockedGenerateItemId = idGenerator.generateItemId as jest.MockedFunction<typeof idGenerator.generateItemId>;
            mockedGenerateItemId.mockReturnValue('item-test123');

            const newItem = await service.createListItem('list-sample1', {content: 'new sample item'});

            expect(newItem).toBeDefined();
            expect(mockedGenerateItemId).toHaveBeenCalledTimes(1);
            expect(newItem?.id).toBe('item-test123');
            expect(newItem?.content).toBe('new sample item');
            expect(newItem?.completed).toBe(false);
 
            
        });
        it('Should throw ListNotFoundError when list is not found', async () => {
            await expect(service.createListItem('list-sample99', {content: 'new sample item'})).rejects.toThrow(ListNotFoundError);
           
        });
        it('Should add new item to a list', async () => {
            const initialLength = toDoLists.find(list => list.id === 'list-sample1')?.items.length || 0;

            const mockedGenerateItemtId = idGenerator.generateItemId as jest.MockedFunction<typeof idGenerator.generateItemId>;
            mockedGenerateItemtId.mockReturnValue('item-test123');

            const newItem = await service.createListItem('list-sample1', {content: 'new sample item'});
            const list = toDoLists.find(list => list.id === 'list-sample1');

            expect(list?.items).toHaveLength(initialLength + 1);
            expect(list?.items).toContain(newItem);
            
        });

    });

    //Read Items
    describe('Get all Items', () => {
        it('should return items from existing list', async () => {
            const items = await service.getListItems('list-sample1');
            expect(items).toBeDefined();
            expect(items).toHaveLength(2);
            expect(items?.[0].id).toBe('item-sample1');
            expect(items?.[1].id).toBe('item-sample2');
        });

        it('should throw ListNotFoundError for non-existent list', async () => {
            await expect(service.getListItems('list-nonexistent')).rejects.toThrow(ListNotFoundError);
        });

        it('should return empty array for list with no items', async () => {
            // Add a list with no items to test data
            toDoLists.push({
                id: 'list-empty',
                title: 'Empty List',
                items: []
            });

            const items = await service.getListItems('list-empty');
            expect(items).toBeDefined();
            expect(items).toHaveLength(0);
        });
    });

    describe('Get item by id', () => {
        it('should return specific item from existing list', async () => {
            const item = await service.getListItem('list-sample1', 'item-sample1');
            expect(item).toBeDefined();
            expect(item?.id).toBe('item-sample1');
            expect(item?.content).toBe('Sample item 1');
            expect(item?.completed).toBe(false);
        });

        it('should throw ItemNotFoundError for non-existent item in existing list', async () => {
            await expect(service.getListItem('list-sample1', 'item-nonexistent')).rejects.toThrow(ItemNotFoundError);
        });

        it('should throw ListNotFoundError for item in non-existent list', async () => {
            await expect(service.getListItem('list-nonexistent', 'item-sample1')).rejects.toThrow(ListNotFoundError);
        });
    });

    describe('Update item by id', () => {
        it('should update existing item with partial data', async () => {
            const updatedItem = await service.updateListItem('list-sample1', 'item-sample1', {
                completed: true
            });

            expect(updatedItem).toBeDefined();
            expect(updatedItem?.id).toBe('item-sample1');
            expect(updatedItem?.content).toBe('Sample item 1'); // unchanged
            expect(updatedItem?.completed).toBe(true); // updated
        });

        it('should update multiple properties of existing item', async () => {
            const updatedItem = await service.updateListItem('list-sample1', 'item-sample1', {
                content: 'Updated content',
                completed: true
            });

            expect(updatedItem).toBeDefined();
            expect(updatedItem?.id).toBe('item-sample1');
            expect(updatedItem?.content).toBe('Updated content');
            expect(updatedItem?.completed).toBe(true);
        });

        it('should throw ItemNotFoundError for non-existent item', async () => {
            await expect(service.updateListItem('list-sample1', 'item-nonexistent', {
                completed: true
            })).rejects.toThrow(ItemNotFoundError);
        });

        it('should throw ListNotFoundError for item in non-existent list', async () => {
            await expect(service.updateListItem('list-nonexistent', 'item-sample1', {
                completed: true
            })).rejects.toThrow(ListNotFoundError);
        });

        it('should actually modify the item in the list', async () => {
            await service.updateListItem('list-sample1', 'item-sample1', { completed: true });
            
            const retrievedItem = await service.getListItem('list-sample1', 'item-sample1');
            expect(retrievedItem?.completed).toBe(true);
        });
    });

    describe('Delete item by id', () => {
        it('should delete existing item and return it', async () => {
            const deletedItem = await service.deleteListItem('list-sample1', 'item-sample1');

            expect(deletedItem).toBeDefined();
            expect(deletedItem?.id).toBe('item-sample1');
            expect(deletedItem?.content).toBe('Sample item 1');
            expect(deletedItem?.completed).toBe(false);
        });

        it('should remove item from the list', async () => {
            const initialLength = (await service.getListItems('list-sample1'))?.length || 0;
            
            await service.deleteListItem('list-sample1', 'item-sample1');
            
            const items = await service.getListItems('list-sample1');
            expect(items).toHaveLength(initialLength - 1);
            
            await expect(service.getListItem('list-sample1', 'item-sample1')).rejects.toThrow(ItemNotFoundError);
            
        });

        it('should throw ItemNotFoundError for non-existent item', async () => {
            await expect(service.deleteListItem('list-sample1', 'item-nonexistent')).rejects.toThrow(ItemNotFoundError);
        });

        it('should return undefined for item in non-existent list', async () => {
            await expect(service.deleteListItem('list-nonexistent', 'item-sample1')).rejects.toThrow(ListNotFoundError);
        });

        it('should not affect other items when deleting', async () => {
            const allItemsBefore = await service.getListItems('list-sample1');
            const otherItems = allItemsBefore?.filter(item => item.id !== 'item-sample1');
            
            await service.deleteListItem('list-sample1', 'item-sample1');
            
            const allItemsAfter = await service.getListItems('list-sample1');
            expect(allItemsAfter).toEqual(otherItems);
        });
    });




});