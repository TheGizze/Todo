import { Request, Response } from 'express';
import * as controller from '../src/controllers/toDoListController';
import * as service from '../src/services/toDoListService';
import { ToDoList } from '../src/models/ToDoList';

// Mock the service module
jest.mock('../src/services/toDoListService');
const mockedService = jest.mocked(service);

// Helper function to create mock Request and Response objects
const createMockReq = (params = {}, body = {}): Partial<Request> => ({
    params,
    body
});

const createMockRes = (): Partial<Response> => {
    const res: Partial<Response> = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
};

describe('ToDoListController', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('getAllLists', () => {
        it('should return 200 with all lists', () => {
            const mockLists: ToDoList[] = [
                {
                    id: "1",
                    title: "Sample To-Do List",
                    items: [
                        {id: "1", content: "Sample item 1", completed: false},
                        {id: "2", content: "Sample item 2", completed: true}
                    ]
                },
                {
                    id: "2",
                    title: "Another To-Do List",
                    items: []
                }
            ];
            
            mockedService.getLists.mockReturnValue(mockLists);

            const req = createMockReq();
            const res = createMockRes();

            controller.getAllLists(req as Request, res as Response);

            expect(mockedService.getLists).toHaveBeenCalledTimes(1);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(mockLists);
        });

        it('should return 200 with empty array when no lists exist', () => {
            mockedService.getLists.mockReturnValue([]);

            const req = createMockReq();
            const res = createMockRes();

            controller.getAllLists(req as Request, res as Response);

            expect(mockedService.getLists).toHaveBeenCalledTimes(1);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith([]);
        });

        it('should call service.getLists exactly once', () => {
            const mockLists: ToDoList[] = [];
            mockedService.getLists.mockReturnValue(mockLists);

            const req = createMockReq();
            const res = createMockRes();

            controller.getAllLists(req as Request, res as Response);

            expect(mockedService.getLists).toHaveBeenCalledTimes(1);
            expect(mockedService.getLists).toHaveBeenCalledWith();
        });
    });

    describe('createList', () => {
        it('should return 400 when title is missing', () => {
            const req = createMockReq();
            req.body = {}; // No title provided
            const res = createMockRes();

            controller.createList(req as Request, res as Response);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ 
                message: 'request body missing values',
                missingValues: ['title']
            });
            expect(mockedService.createList).not.toHaveBeenCalled();
        });

        it('should return 400 when title is undefined', () => {
            const req = createMockReq();
            req.body = { title: undefined };
            const res = createMockRes();

            controller.createList(req as Request, res as Response);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ 
                message: 'request body missing values',
                missingValues: ['title']
            });
            expect(mockedService.createList).not.toHaveBeenCalled();
        });

        it('should return 400 with validation errors for invalid title', () => {
            const req = createMockReq();
            req.body = { title: 'Hi' }; // Too short
            const res = createMockRes();

            controller.createList(req as Request, res as Response);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                message: 'invalid name',
                violations: ['Must be at least 3 characters long']
            });
            expect(mockedService.createList).not.toHaveBeenCalled();
        });

        it('should handle valid title (controller incomplete - currently returns validation error)', () => {
            const req = createMockReq();
            req.body = { title: 'Valid List Name' }; // Valid 3+ character title
            const res = createMockRes();

            controller.createList(req as Request, res as Response);

            expect(res.status).toHaveBeenCalledWith(200);
            
            // When you complete the controller implementation, change this to:
            expect(mockedService.createList).toHaveBeenCalledWith('Valid List Name');
            expect(res.status).toHaveBeenCalledWith(200);
        });

        it('should handle valid input without errors', () => {
            const req = createMockReq();
            req.body = { title: 'Another Valid List' }; // Valid 3+ character title
            const res = createMockRes();

            // Should not throw any errors
            expect(() => {
                controller.createList(req as Request, res as Response);
            }).not.toThrow();
        });

        it('should handle empty string title appropriately', () => {
            const req = createMockReq();
            req.body = { title: '' };
            const res = createMockRes();

            controller.createList(req as Request, res as Response);

            // This test depends on your validation - adjust based on whether empty strings are allowed
            expect(res.status).toHaveBeenCalledWith(400);
        });
    });
    describe("Get list by ID", () => {
        it('should return 200 with list when found', () => {
            const mockList: ToDoList = {
                id: "1",
                title: "Sample To-Do List",
                items: []
            }

            mockedService.getList.mockReturnValue(mockList);

            const req = createMockReq({id: '1'});
            const res = createMockRes();

            controller.getListById(req as Request, res as Response);

            expect(mockedService.getList).toHaveBeenCalledWith('1');
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(mockList);
        });
        it('Should Return 404 with error message when not found', () => {
            mockedService.getList.mockReturnValue(undefined);

            const req = createMockReq({id: '99'});
            const res = createMockRes();

            controller.getListById(req as Request, res as Response);

            expect(mockedService.getList).toHaveBeenCalledWith('99');
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({message: "No list found with id: 99"});
        });
    })
});