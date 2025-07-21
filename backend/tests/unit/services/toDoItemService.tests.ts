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
        toDoLists.push(...originalMockData);

        jest.clearAllMocks();
    });

    //Create Item
    describe('Create new item to a list', () => {
        it('Should return new item when list exists', () => {
            const mockedGenerateItemtId = idGenerator.generateItemId as jest.MockedFunction<typeof idGenerator.generateItemId>;
            mockedGenerateItemtId.mockReturnValue('item-test123');

            const newItem = service.createListItem('list-sample1', 'new sample item');

            expect(newItem).toBeDefined();
            if(newItem){
                expect(newItem.id).toBe('item-test123');
                expect(newItem.content).toBe('new sample item');
                expect(newItem.completed).toBe(false);
            };
            
        });
        it('Should return undefined when list is not found', () => {
            const newItem = service.createListItem('list-sample99', 'new sample item');
            expect(newItem).toBe(undefined);
        });

    });

/*     //Read Items
    describe('Get all Items', () => {
        
    });
    
    //Read Item
    describe('Get item by id', () => {
        
    });


    //Update Item
    describe('Update item by id', () => {
        
    });

    //Delete Items
    describe('Delete All Items from list', () => {
        
    });
    // Delete Item
    describe('delete item by id', () => {
        
    }); */




});