import * as service from '../../../src/services/toDoListService'
import { toDoLists } from '../../../src/mockDb'
import { ToDoList } from '../../../src/models/ToDoList'

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
    it('should return an array', () => {
        const lists = service.getLists();
        expect(lists).toBeInstanceOf(Array);
    });
    it('should not be an empty array', () => {
        const lists = service.getLists();
        expect(lists.length).toBeGreaterThan(0)
    });
    it('should return lists with correct structure', () => {
        const lists = service.getLists();
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
    it('should return expected mock data', () => {
        const lists = service.getLists();
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
    it('Should be an object if exists', () => {
        const list = service.getList('list-sample1');
        expect(list).toBeInstanceOf(Object);
    });
    it('Should be undefined if not found', () => {
        const list = service.getList('list-nonexistent');
        expect(list).toBe(undefined);
    });
    it('should have correct structure', () => {
        const list = service.getList('list-sample1');
        expect(list).toEqual(
            expect.objectContaining({
                id: expect.any(String),
                title: expect.any(String),
                items: expect.any(Array)
            })
        );
    });
    it('should match mockdata', () => {
        const list = service.getList('list-sample1');
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
    it('should update list title when list exists', () => {
        const updatedList = service.updateList('list-sample1', 'Updated Title');
        expect(updatedList).toBeDefined();
        expect(updatedList?.title).toBe('Updated Title');
        expect(updatedList?.id).toBe('list-sample1');
    });

    it('should return undefined when list does not exist', () => {
        const updatedList = service.updateList('list-nonexistent', 'Updated Title');
        expect(updatedList).toBeUndefined();
    });

    it('should preserve other properties when updating title', () => {
        const originalList = service.getList('list-sample1');
        const updatedList = service.updateList('list-sample1', 'New Title');
        
        expect(updatedList?.id).toBe(originalList?.id);
        expect(updatedList?.items).toEqual(originalList?.items);
        expect(updatedList?.title).toBe('New Title');
    });

    it('should actually modify the list in the database', () => {
        service.updateList('list-sample1', 'Modified Title');
        const retrievedList = service.getList('list-sample1');
        expect(retrievedList?.title).toBe('Modified Title');
    });
});

describe('Delete list by id', () => {
    it('should return the deleted list when it exists', () => {
        const originalList = service.getList('list-sample2');
        const deletedList = service.deleteList('list-sample2');
        
        expect(deletedList).toEqual(originalList);
        expect(deletedList?.id).toBe('list-sample2');
    });

    it('should return undefined when list does not exist', () => {
        const deletedList = service.deleteList('list-nonexistent');
        expect(deletedList).toBeUndefined();
    });

    it('should remove the list from the database', () => {
        const initialCount = service.getLists().length;
        service.deleteList('list-sample1');
        
        const newCount = service.getLists().length;
        expect(newCount).toBe(initialCount - 1);
        
        const deletedList = service.getList('list-sample1');
        expect(deletedList).toBeUndefined();
    });

    it('should not affect other lists when deleting', () => {
        const allListsBefore = service.getLists();
        const otherLists = allListsBefore.filter(list => list.id !== 'list-sample2');
        
        service.deleteList('list-sample2');
        
        const allListsAfter = service.getLists();
        expect(allListsAfter).toEqual(otherLists);
    });
});

describe('Create new list', () => {
    it('should create a new list with correct title', () => {
        // Mock the ID generator to return a predictable ID
        const mockedGenerateListId = idGenerator.generateListId as jest.MockedFunction<typeof idGenerator.generateListId>;
        mockedGenerateListId.mockReturnValue('list-test123');
        
        const newList = service.createList('My New List');
        
        expect(newList).toBeDefined();
        expect(newList.title).toBe('My New List');
        expect(newList.id).toBe('list-test123');
        expect(newList.items).toEqual([]);
        expect(mockedGenerateListId).toHaveBeenCalledTimes(1);
    });

    it('should assign a unique id to the new list', () => {
        const mockedGenerateListId = idGenerator.generateListId as jest.MockedFunction<typeof idGenerator.generateListId>;
        mockedGenerateListId
            .mockReturnValueOnce('list-abc123')
            .mockReturnValueOnce('list-def456');
        
        const list1 = service.createList('List 1');
        const list2 = service.createList('List 2');
        
        expect(list1.id).toBe('list-abc123');
        expect(list2.id).toBe('list-def456');
        expect(list1.id).not.toBe(list2.id);
        expect(typeof list1.id).toBe('string');
        expect(typeof list2.id).toBe('string');
        expect(mockedGenerateListId).toHaveBeenCalledTimes(2);
    });

    it('should add the new list to the database', () => {
        const mockedGenerateListId = idGenerator.generateListId as jest.MockedFunction<typeof idGenerator.generateListId>;
        mockedGenerateListId.mockReturnValue('list-newitem');
        
        const initialCount = service.getLists().length;
        const newList = service.createList('Test List');
        
        const newCount = service.getLists().length;
        expect(newCount).toBe(initialCount + 1);
        
        const retrievedList = service.getList(newList.id);
        expect(retrievedList).toEqual(newList);
    });

    it('should initialize new list with empty items array', () => {
        const mockedGenerateListId = idGenerator.generateListId as jest.MockedFunction<typeof idGenerator.generateListId>;
        mockedGenerateListId.mockReturnValue('list-empty123');
        
        const newList = service.createList('Empty List');
        
        expect(Array.isArray(newList.items)).toBe(true);
        expect(newList.items).toHaveLength(0);
    });

    it('should call generateListId when creating a new list', () => {
        const mockedGenerateListId = idGenerator.generateListId as jest.MockedFunction<typeof idGenerator.generateListId>;
        mockedGenerateListId.mockReturnValue('list-generated');
        
        const newList = service.createList('Test List');
        
        expect(mockedGenerateListId).toHaveBeenCalledTimes(1);
        expect(newList.id).toBe('list-generated');
    });
});

