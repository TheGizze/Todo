import * as service from '../src/services/toDoListService'
import { toDoLists } from '../src/mockDb'
import { ToDoList } from '../src/models/ToDoList'

// Store original mock data for restoration
const originalMockData: ToDoList[] = [
    {
        "id": "1",
        "title": "Sample To-Do List",
        "items": [
            {"id": "1", "content": "Sample item 1", "completed": false},
            {"id": "2", "content": "Sample item 2", "completed": true}
        ]
    },
    {
        "id": "2",
        "title": "Another To-Do List",
        "items": [
            {"id": "1", "content": "Another item 1", "completed": false},
            {"id": "2", "content": "Another item 2", "completed": false}
        ]
    }
];

// Reset mock data before each test to ensure isolation
beforeEach(() => {
    // Clear the array and restore original data
    toDoLists.length = 0;
    toDoLists.push(...originalMockData);
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
                "id":"1",
                "title":"Sample To-Do List",
                "items":[
                    {
                        "id":"1",
                        "content":"Sample item 1",
                        "completed":false
                    },
            {
                "id":"2",
                "content":"Sample item 2",
                "completed":true}]},
                {
                    "id":"2",
                    "title":"Another To-Do List",
                    "items":[
                        {
                            "id":"1",
                            "content":"Another item 1",
                            "completed":false
                        },
                        {
                            "id":"2",
                            "content":"Another item 2",
                            "completed":false
                        }
                    ]
                }])
    });
});

describe('Get list by id', () => {
    it('Should be an object if exists', () => {
        const list = service.getList('1');
        expect(list).toBeInstanceOf(Object);
    });
    it('Should be undefined if not found', () => {
        const list = service.getList('999');
        expect(list).toBe(undefined);
    });
    it('should have correct structure', () => {
        const list = service.getList('1');
        expect(list).toEqual(
            expect.objectContaining({
                id: expect.any(String),
                title: expect.any(String),
                items: expect.any(Array)
            })
        );
    });
    it('should match mockdata', () => {
        const list = service.getList('1');
        expect(list).toEqual({
                "id":"1",
                "title":"Sample To-Do List",
                "items":[
                    {
                        "id":"1",
                        "content":"Sample item 1",
                        "completed":false
                    },
            {
                "id":"2",
                "content":"Sample item 2",
                "completed":true}]})
    });
});

describe('Update list by id', () => {
    it('should update list title when list exists', () => {
        const updatedList = service.updateListById('1', 'Updated Title');
        expect(updatedList).toBeDefined();
        expect(updatedList?.title).toBe('Updated Title');
        expect(updatedList?.id).toBe('1');
    });

    it('should return undefined when list does not exist', () => {
        const updatedList = service.updateListById('999', 'Updated Title');
        expect(updatedList).toBeUndefined();
    });

    it('should preserve other properties when updating title', () => {
        const originalList = service.getList('1');
        const updatedList = service.updateListById('1', 'New Title');
        
        expect(updatedList?.id).toBe(originalList?.id);
        expect(updatedList?.items).toEqual(originalList?.items);
        expect(updatedList?.title).toBe('New Title');
    });

    it('should actually modify the list in the database', () => {
        service.updateListById('1', 'Modified Title');
        const retrievedList = service.getList('1');
        expect(retrievedList?.title).toBe('Modified Title');
    });
});

describe('Delete list by id', () => {
    it('should return the deleted list when it exists', () => {
        const originalList = service.getList('2');
        const deletedList = service.deleteList('2');
        
        expect(deletedList).toEqual(originalList);
        expect(deletedList?.id).toBe('2');
    });

    it('should return undefined when list does not exist', () => {
        const deletedList = service.deleteList('999');
        expect(deletedList).toBeUndefined();
    });

    it('should remove the list from the database', () => {
        const initialCount = service.getLists().length;
        service.deleteList('1');
        
        const newCount = service.getLists().length;
        expect(newCount).toBe(initialCount - 1);
        
        const deletedList = service.getList('1');
        expect(deletedList).toBeUndefined();
    });

    it('should not affect other lists when deleting', () => {
        const allListsBefore = service.getLists();
        const otherLists = allListsBefore.filter(list => list.id !== '2');
        
        service.deleteList('2');
        
        const allListsAfter = service.getLists();
        expect(allListsAfter).toEqual(otherLists);
    });
});

describe('Create new list', () => {
    it('should create a new list with correct title', () => {
        const newList = service.createList('My New List');
        
        expect(newList).toBeDefined();
        expect(newList.title).toBe('My New List');
        expect(newList.id).toBeDefined();
        expect(newList.items).toEqual([]);
    });

    it('should assign a unique id to the new list', () => {
        const list1 = service.createList('List 1');
        const list2 = service.createList('List 2');
        
        expect(list1.id).not.toBe(list2.id);
        expect(typeof list1.id).toBe('string');
        expect(typeof list2.id).toBe('string');
    });

    it('should add the new list to the database', () => {
        const initialCount = service.getLists().length;
        const newList = service.createList('Test List');
        
        const newCount = service.getLists().length;
        expect(newCount).toBe(initialCount + 1);
        
        const retrievedList = service.getList(newList.id);
        expect(retrievedList).toEqual(newList);
    });

    it('should initialize new list with empty items array', () => {
        const newList = service.createList('Empty List');
        
        expect(Array.isArray(newList.items)).toBe(true);
        expect(newList.items).toHaveLength(0);
    });

    it('should increment id for each new list', () => {
        const list1 = service.createList('First');
        const list2 = service.createList('Second');
        
        const id1 = parseInt(list1.id);
        const id2 = parseInt(list2.id);
        
        expect(id2).toBeGreaterThan(id1);
    });
});

