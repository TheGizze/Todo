import * as service from '../../../src/services/toDoListService'
import { toDoLists } from '../../../src/mockDb'
import { ToDoList } from '../../../src/models/ToDoList'
import { ListNotFoundError } from '../../../src/errors/resourceErrors';

// Mock the ID generator to make tests predictable
jest.mock('../../../src/utils/idGenerator', () => ({
    generateListId: jest.fn(),
    generateItemId: jest.fn()
}));

import * as idGenerator from '../../../src/utils/idGenerator';

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
    
    // Reset mocks
    jest.clearAllMocks();
});

describe('Get all To Do Lists', () => {
    it('should return an array', async () => {
        const lists = await service.getLists();
        expect(lists).toBeInstanceOf(Array);
    });
    it('should not be an empty array', async () => {
        const lists = await service.getLists();
        expect(lists.length).toBeGreaterThan(0)
    });
    it('should return lists with correct structure', async () => {
        const lists = await service.getLists();
        lists.forEach(list => {
            expect(list).toEqual(
                expect.objectContaining({
                    id: expect.any(String),
                    title: expect.any(String),
                    items: expect.any(Array)
                })
            );
        });
    });
    it('should return expected mock data', async () => {
        const lists = await service.getLists();
        expect(lists).toEqual([
            {
                "id":"list-sample1",
                "title":"Sample To-Do List",
                "items":[
                    {
                        "id":"item-sample1",
                        "content":"Sample item 1",
                        "completed":false
                    },
            {
                "id":"item-sample2",
                "content":"Sample item 2",
                "completed":true}]},
                {
                    "id":"list-sample2",
                    "title":"Another To-Do List",
                    "items":[
                        {
                            "id":"item-another1",
                            "content":"Another item 1",
                            "completed":false
                        },
                        {
                            "id":"item-another2",
                            "content":"Another item 2",
                            "completed":false
                        }
                    ]
                }])
    });
});

describe('Get list by id', () => {
    it('Should be an object if exists', async () => {
        const list = await service.getList('list-sample1');
        expect(list).toBeInstanceOf(Object);
    });
    it('Should throw error if not found', async () => {
        await expect(service.getList('list-nonexistent')).rejects.toThrow(ListNotFoundError);
    });
    it('should have correct structure', async () => {
        const list = await service.getList('list-sample1');
        expect(list).toEqual(
            expect.objectContaining({
                id: expect.any(String),
                title: expect.any(String),
                items: expect.any(Array)
            })
        );
    });
    it('should match mockdata', async () => {
        const list = await service.getList('list-sample1');
        expect(list).toEqual({
                "id":"list-sample1",
                "title":"Sample To-Do List",
                "items":[
                    {
                        "id":"item-sample1",
                        "content":"Sample item 1",
                        "completed":false
                    },
            {
                "id":"item-sample2",
                "content":"Sample item 2",
                "completed":true}]})
    });
});

describe('Update list by id', () => {
    it('should update list title when list exists', async () => {
        const updatedList = await service.updateList('list-sample1', {title: 'Updated Title'});
        expect(updatedList).toBeDefined();
        expect(updatedList?.title).toBe('Updated Title');
        expect(updatedList?.id).toBe('list-sample1');
    });

    it('should throw ListNotFoundError when list does not exist', async () => {
        await expect(service.updateList('list-nonexistent', {title: 'Updated Title'})).rejects.toThrow(ListNotFoundError);
    });

    it('should preserve other properties when updating title', async () => {
        const originalList = await service.getList('list-sample1');
        const updatedList = await service.updateList('list-sample1', {title: 'New Title'});
        
        expect(updatedList?.id).toBe(originalList?.id);
        expect(updatedList?.items).toEqual(originalList?.items);
        expect(updatedList?.title).toBe('New Title');
    });

    it('should actually modify the list in the database', async () => {
        await service.updateList('list-sample1', {title: 'Modified Title'});
        const retrievedList = await service.getList('list-sample1');
        expect(retrievedList?.title).toBe('Modified Title');
    });
});

describe('Delete list by id', () => {
    it('should return the deleted list when it exists', async () => {
        const originalList = await service.getList('list-sample2');
        const deletedList = await service.deleteList('list-sample2');
        
        expect(deletedList).toEqual(originalList);
        expect(deletedList?.id).toBe('list-sample2');
    });

    it('should throw ListNotFoundError when list does not exist', async () => {
        await expect(service.deleteList('list-nonexistent')).rejects.toThrow(ListNotFoundError);
    });

    it('should remove the list from the database', async () => {
        const initialCount = (await service.getLists()).length;
        await service.deleteList('list-sample1');
        
        const newCount = (await service.getLists()).length;
        expect(newCount).toBe(initialCount - 1);
        
        await expect(service.getList('list-sample1')).rejects.toThrow(ListNotFoundError);
    });

    it('should not affect other lists when deleting', async () => {
        const allListsBefore = await service.getLists();
        const otherLists = allListsBefore.filter(list => list.id !== 'list-sample2');
        
        await service.deleteList('list-sample2');
        
        const allListsAfter = await service.getLists();
        expect(allListsAfter).toEqual(otherLists);
    });
});

describe('Create new list', () => {
    it('should create a new list with correct title', async () => {
        // Mock the ID generator to return a predictable ID
        const mockedGenerateListId = idGenerator.generateListId as jest.MockedFunction<typeof idGenerator.generateListId>;
        mockedGenerateListId.mockReturnValue('list-test123');
        
        const newList = await service.createList({title: 'My New List'});
        
        expect(newList).toBeDefined();
        expect(newList.title).toBe('My New List');
        expect(newList.id).toBe('list-test123');
        expect(newList.items).toEqual([]);
        expect(mockedGenerateListId).toHaveBeenCalledTimes(1);
    });

    it('should assign a unique id to the new list', async () => {
        const mockedGenerateListId = idGenerator.generateListId as jest.MockedFunction<typeof idGenerator.generateListId>;
        mockedGenerateListId
            .mockReturnValueOnce('list-abc123')
            .mockReturnValueOnce('list-def456');
        
        const list1 = await service.createList({title: 'List 1'});
        const list2 = await service.createList({title: 'List 2'});
        
        expect(list1.id).toBe('list-abc123');
        expect(list2.id).toBe('list-def456');
        expect(list1.id).not.toBe(list2.id);
        expect(typeof list1.id).toBe('string');
        expect(typeof list2.id).toBe('string');
        expect(mockedGenerateListId).toHaveBeenCalledTimes(2);
    });

    it('should add the new list to the database', async () => {
        const mockedGenerateListId = idGenerator.generateListId as jest.MockedFunction<typeof idGenerator.generateListId>;
        mockedGenerateListId.mockReturnValue('list-newitem');
        
        const initialCount = (await service.getLists()).length;
        const newList = await service.createList({title: 'Test List'});
        
        const newCount = (await service.getLists()).length;
        expect(newCount).toBe(initialCount + 1);
        
        const retrievedList = await service.getList(newList.id);
        expect(retrievedList).toEqual(newList);
    });

    it('should initialize new list with empty items array', async () => {
        const mockedGenerateListId = idGenerator.generateListId as jest.MockedFunction<typeof idGenerator.generateListId>;
        mockedGenerateListId.mockReturnValue('list-empty123');
        
        const newList = await service.createList({title: 'Empty List'});
        
        expect(Array.isArray(newList.items)).toBe(true);
        expect(newList.items).toHaveLength(0);
    });

    it('should call generateListId when creating a new list', async () => {
        const mockedGenerateListId = idGenerator.generateListId as jest.MockedFunction<typeof idGenerator.generateListId>;
        mockedGenerateListId.mockReturnValue('list-generated');
        
        const newList = await service.createList({title: 'Test List'});
        
        expect(mockedGenerateListId).toHaveBeenCalledTimes(1);
        expect(newList.id).toBe('list-generated');
    });
});

