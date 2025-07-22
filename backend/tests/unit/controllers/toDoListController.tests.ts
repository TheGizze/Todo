import { Request, Response } from 'express';
import * as controller from '../../../src/controllers/toDoListController';
import * as service from '../../../src/services/toDoListService';
import { ToDoList } from '../../../src/models/ToDoList';

// Mock the service module
jest.mock('../../../src/services/toDoListService');
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

    describe('getList', () => {
        it('should return 200 with list when found', () => {
            const mockList: ToDoList = {
                id: "1",
                title: "Sample To-Do List",
                items: [
                    {id: "1", content: "Sample item 1", completed: false},
                    {id: "2", content: "Sample item 2", completed: true}
                ]
            };
            
            mockedService.getList.mockReturnValue(mockList);

            const req = createMockReq({ listId: '1' });
            const res = createMockRes();

            controller.getList(req as Request, res as Response);

            expect(mockedService.getList).toHaveBeenCalledWith('1');
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(mockList);
        });

        it('should return 404 when list not found', () => {
            mockedService.getList.mockReturnValue(undefined);

            const req = createMockReq({ listId: '999' });
            const res = createMockRes();

            controller.getList(req as Request, res as Response);

            expect(mockedService.getList).toHaveBeenCalledWith('999');
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalled();
        });
    });

    describe('createList', () => {
        it('should return 400 when title is missing', () => {
            const req = createMockReq({}, {});
            const res = createMockRes();

            controller.createList(req as Request, res as Response);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalled();
            expect(mockedService.createList).not.toHaveBeenCalled();
        });

        it('should return 400 when title is undefined', () => {
            const req = createMockReq({}, { title: undefined });
            const res = createMockRes();

            controller.createList(req as Request, res as Response);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalled();
            expect(mockedService.createList).not.toHaveBeenCalled();
        });

        it('should return 400 with validation errors for invalid title', () => {
            const req = createMockReq({}, { title: 'Hi' }); // Too short
            const res = createMockRes();

            controller.createList(req as Request, res as Response);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalled();
            expect(mockedService.createList).not.toHaveBeenCalled();
        });

        it('should return 200 with created list when title is valid', () => {
            const mockCreatedList: ToDoList = {
                id: "3",
                title: "Valid List Name",
                items: []
            };
            
            mockedService.createList.mockReturnValue(mockCreatedList);

            const req = createMockReq({}, { title: 'Valid List Name' });
            const res = createMockRes();

            controller.createList(req as Request, res as Response);

            expect(mockedService.createList).toHaveBeenCalledWith('Valid List Name');
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(mockCreatedList);
        });

        it('should handle empty string title appropriately', () => {
            const req = createMockReq({}, { title: '' });
            const res = createMockRes();

            controller.createList(req as Request, res as Response);

            expect(res.status).toHaveBeenCalledWith(400);
        });
    });

    describe('deleteList', () => {
        it('should return 200 with deleted list when found', () => {
            const mockList: ToDoList = {
                id: "1",
                title: "List to Delete",
                items: []
            };
            
            mockedService.deleteList.mockReturnValue(mockList);

            const req = createMockReq({ listId: '1' });
            const res = createMockRes();

            controller.deleteList(req as Request, res as Response);

            expect(mockedService.deleteList).toHaveBeenCalledWith('1');
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(mockList);
        });

        it('should return 404 when list not found', () => {
            mockedService.deleteList.mockReturnValue(undefined);

            const req = createMockReq({ listId: '999' });
            const res = createMockRes();

            controller.deleteList(req as Request, res as Response);

            expect(mockedService.deleteList).toHaveBeenCalledWith('999');
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalled();
        });
    });

    describe('updateList', () => {
        it('should return 400 when title is missing', () => {
            const req = createMockReq({ listId: '1' }, {});
            const res = createMockRes();

            controller.updateList(req as Request, res as Response);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalled();
            expect(mockedService.updateListById).not.toHaveBeenCalled();
        });

        it('should return 400 with validation errors for invalid title', () => {
            const req = createMockReq({ listId: '1' }, { title: 'Hi' }); // Too short
            const res = createMockRes();

            controller.updateList(req as Request, res as Response);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalled();
            expect(mockedService.updateListById).not.toHaveBeenCalled();
        });

        it('should return 200 with updated list when successful', () => {
            const mockUpdatedList: ToDoList = {
                id: "1",
                title: "Updated Title",
                items: []
            };
            
            mockedService.updateListById.mockReturnValue(mockUpdatedList);

            const req = createMockReq({ listId: '1' }, { title: 'Updated Title' });
            const res = createMockRes();

            controller.updateList(req as Request, res as Response);

            expect(mockedService.updateListById).toHaveBeenCalledWith('1', 'Updated Title');
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(mockUpdatedList);
        });

        it('should return 404 when list not found', () => {
            mockedService.updateListById.mockReturnValue(undefined);

            const req = createMockReq({ listId: '999' }, { title: 'New Title' });
            const res = createMockRes();

            controller.updateList(req as Request, res as Response);

            expect(mockedService.updateListById).toHaveBeenCalledWith('999', 'New Title');
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalled();
        });
    });
});
