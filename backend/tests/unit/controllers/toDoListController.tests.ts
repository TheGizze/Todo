import { Request, Response } from 'express';
import request from 'supertest';
import * as controller from '../../../src/controllers/toDoListController';
import * as service from '../../../src/services/toDoListService';
import express from 'express';
import { ToDoList } from '../../../src/models/ToDoList';
import { errorHandler } from '../../../src/middleware/errorHandling/errorHandler';
import { ListNotFoundError } from '../../../src/errors/resourceErrors';

// Mock the service module
jest.mock('../../../src/services/toDoListService');
const mockedService = jest.mocked(service);

// Create an Express app for integration testing
const app = express();
app.use(express.json());
app.get('/api/lists/:id', controller.getList);
app.use(errorHandler);

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
        it('should return 200 with all lists', async () => {
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
            
            mockedService.getLists.mockResolvedValue(mockLists);

            const req = createMockReq();
            const res = createMockRes();

            await controller.getAllLists(req as Request, res as Response);

            expect(mockedService.getLists).toHaveBeenCalledTimes(1);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(mockLists);
        });

        it('should return 200 with empty array when no lists exist', async () => {
            mockedService.getLists.mockResolvedValue([]);

            const req = createMockReq();
            const res = createMockRes();

            await controller.getAllLists(req as Request, res as Response);

            expect(mockedService.getLists).toHaveBeenCalledTimes(1);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith([]);
        });

        it('should call service.getLists exactly once', async () => {
            const mockLists: ToDoList[] = [];
            mockedService.getLists.mockResolvedValue(mockLists);

            const req = createMockReq();
            const res = createMockRes();

            await controller.getAllLists(req as Request, res as Response);

            expect(mockedService.getLists).toHaveBeenCalledTimes(1);
            expect(mockedService.getLists).toHaveBeenCalledWith();
        });
    });

    describe('getList', () => {
        it('should return 200 with list when found', async () => {
            const mockList: ToDoList = {
                id: "1",
                title: "Sample To-Do List",
                items: [
                    {id: "1", content: "Sample item 1", completed: false},
                    {id: "2", content: "Sample item 2", completed: true}
                ]
            };
            
            mockedService.getList.mockResolvedValue(mockList);

            const req = createMockReq({ listId: '1' });
            const res = createMockRes();

            await controller.getList(req as Request, res as Response);

            expect(mockedService.getList).toHaveBeenCalledWith('1');
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(mockList);
        });

        it('should return 404 when list is not found', async () => {
            const id = 'list-nonexistent';
            
            mockedService.getList.mockRejectedValue(new ListNotFoundError(id));

            const req = createMockReq({ listId: id });
            const res = createMockRes();

            await expect(() => controller.getList(req as Request, res as Response))
                .rejects.toThrow(ListNotFoundError);
        });
    });

    describe('createList', () => {

        it('should return 200 with created list when title is valid', async () => {
            const mockCreatedList: ToDoList = {
                id: "3",
                title: "Valid List Name",
                items: []
            };
            
            mockedService.createList.mockResolvedValue(mockCreatedList);

            const req = createMockReq({}, { title: 'Valid List Name' });
            const res = createMockRes();

            await controller.createList(req as Request, res as Response);

            expect(mockedService.createList).toHaveBeenCalledWith({title: 'Valid List Name'});
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(mockCreatedList);
        });

    });

    describe('deleteList', () => {
        it('should return 200 with deleted list when found', async () => {
            const mockList: ToDoList = {
                id: "1",
                title: "List to Delete",
                items: []
            };
            
            mockedService.deleteList.mockResolvedValue(mockList);

            const req = createMockReq({ listId: '1' });
            const res = createMockRes();

            await controller.deleteList(req as Request, res as Response);

            expect(mockedService.deleteList).toHaveBeenCalledWith('1');
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(mockList);
        });

        it('should return 404 when list not found', async () => {
            mockedService.deleteList.mockRejectedValue(new ListNotFoundError('999'));

            const req = createMockReq({ listId: '999' });
            const res = createMockRes();

            await expect(() => controller.deleteList(req as Request, res as Response))
                .rejects.toThrow(ListNotFoundError);
        });
    });

    describe('updateList', () => {
       
        it('should return 200 with updated list when successful', async () => {
            const mockUpdatedList: ToDoList = {
                id: "1",
                title: "Updated Title",
                items: []
            };
            
            mockedService.updateList.mockResolvedValue(mockUpdatedList);

            const req = createMockReq({ listId: '1' }, { title: 'Updated Title' });
            const res = createMockRes();

            await controller.updateList(req as Request, res as Response);

            expect(mockedService.updateList).toHaveBeenCalledWith('1', {title: 'Updated Title'});
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(mockUpdatedList);
        });

        it('should return 404 when list not found', async () => {
            mockedService.updateList.mockRejectedValue(new ListNotFoundError('999'));

            const req = createMockReq({ listId: '999' }, { title: 'New Title' });
            const res = createMockRes();

            await expect(() => controller.updateList(req as Request, res as Response))
                .rejects.toThrow(ListNotFoundError);
        });
    });
});
