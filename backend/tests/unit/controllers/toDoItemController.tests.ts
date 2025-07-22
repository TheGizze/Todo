import { Request, Response } from 'express';
import * as controller from '../../../src/controllers/toDoItemController';
import * as ToDoService from '../../../src/services/toDoItemService';
import { errors } from '../../../src/responses/errorResponses';
import * as validator from '../../../src/validators/common';

// Mock all dependencies
jest.mock('../../../src/services/toDoItemService');
jest.mock('../../../src/responses/errorResponses');
jest.mock('../../../src/validators/common');

// Type the mocked modules
const mockToDoService = ToDoService as jest.Mocked<typeof ToDoService>;
const mockErrors = errors as jest.Mocked<typeof errors>;
const mockValidator = validator as jest.Mocked<typeof validator>;

// Mock response object factory
const createMockResponse = (): Partial<Response> => {
    const res: Partial<Response> = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis()
    };
    return res;
};

// Mock request object factory
const createMockRequest = (overrides: Partial<Request> = {}): Partial<Request> => {
    return {
        params: { listId: 'list-123', itemId: 'item-456' },
        body: {},
        ...overrides
    };
};

describe('ToDoItemController Unit Tests', () => {
    let mockReq: Partial<Request>;
    let mockRes: Partial<Response>;

    beforeEach(() => {
        jest.clearAllMocks();
        mockRes = createMockResponse();
    });

    describe('createItem', () => {
        beforeEach(() => {
            mockReq = createMockRequest({
                params: { listId: 'list-123' },
                body: { content: 'Test item content' }
            });
        });

        it('should create a new item successfully', () => {
            const mockNewItem = {
                id: 'item-123',
                content: 'Test item content',
                completed: false
            };

            mockValidator.validateString.mockReturnValue([]);
            mockToDoService.createListItem.mockReturnValue(mockNewItem);

            controller.createItem(mockReq as Request, mockRes as Response);

            expect(mockValidator.validateString).toHaveBeenCalledWith('Test item content');
            expect(mockToDoService.createListItem).toHaveBeenCalledWith('list-123', 'Test item content');
            expect(mockRes.status).toHaveBeenCalledWith(200);
            expect(mockRes.json).toHaveBeenCalledWith(mockNewItem);
        });

        it('should return 400 when content is missing', () => {
            mockReq.body = {};
            const mockErrorResponse = { message: 'Missing values', missingValues: ['content'] };
            mockErrors.missingValues.mockReturnValue(mockErrorResponse);

            controller.createItem(mockReq as Request, mockRes as Response);

            expect(mockErrors.missingValues).toHaveBeenCalledWith(['content']);
            expect(mockRes.status).toHaveBeenCalledWith(400);
            expect(mockRes.json).toHaveBeenCalledWith(mockErrorResponse);
        });

        it('should return 400 when content validation fails', () => {
            const validationErrors = ['Must be at least 3 characters long'];
            const mockErrorResponse = { message: 'Invalid content', violations: validationErrors };
            
            mockValidator.validateString.mockReturnValue(validationErrors);
            mockErrors.invalidItemContent.mockReturnValue(mockErrorResponse);

            controller.createItem(mockReq as Request, mockRes as Response);

            expect(mockValidator.validateString).toHaveBeenCalledWith('Test item content');
            expect(mockErrors.invalidItemContent).toHaveBeenCalledWith(validationErrors);
            expect(mockRes.status).toHaveBeenCalledWith(400);
            expect(mockRes.json).toHaveBeenCalledWith(mockErrorResponse);
        });

        it('should return 404 when list does not exist', () => {
            const mockErrorResponse = { message: 'List not found' };
            
            mockValidator.validateString.mockReturnValue([]);
            mockToDoService.createListItem.mockReturnValue(undefined);
            mockErrors.listNotFound.mockReturnValue(mockErrorResponse);

            controller.createItem(mockReq as Request, mockRes as Response);

            expect(mockToDoService.createListItem).toHaveBeenCalledWith('list-123', 'Test item content');
            expect(mockErrors.listNotFound).toHaveBeenCalledWith('list-123');
            expect(mockRes.status).toHaveBeenCalledWith(404);
            expect(mockRes.json).toHaveBeenCalledWith(mockErrorResponse);
        });
    });

    describe('getListItems', () => {
        beforeEach(() => {
            mockReq = createMockRequest({
                params: { listId: 'list-123' }
            });
        });

        it('should return all items for a list successfully', () => {
            const mockItems = [
                { id: 'item-1', content: 'Item 1', completed: false },
                { id: 'item-2', content: 'Item 2', completed: true }
            ];

            mockToDoService.getListItems.mockReturnValue(mockItems);

            controller.getListItems(mockReq as Request, mockRes as Response);

            expect(mockToDoService.getListItems).toHaveBeenCalledWith('list-123');
            expect(mockRes.status).toHaveBeenCalledWith(200);
            expect(mockRes.json).toHaveBeenCalledWith(mockItems);
        });

        it('should return 404 when list does not exist', () => {
            const mockErrorResponse = { message: 'List not found' };
            
            mockToDoService.getListItems.mockReturnValue(undefined);
            mockErrors.listNotFound.mockReturnValue(mockErrorResponse);

            controller.getListItems(mockReq as Request, mockRes as Response);

            expect(mockToDoService.getListItems).toHaveBeenCalledWith('list-123');
            expect(mockErrors.listNotFound).toHaveBeenCalledWith('list-123');
            expect(mockRes.status).toHaveBeenCalledWith(404);
            expect(mockRes.json).toHaveBeenCalledWith(mockErrorResponse);
        });

        it('should return empty array when list exists but has no items', () => {
            const mockItems: any[] = [];

            mockToDoService.getListItems.mockReturnValue(mockItems);

            controller.getListItems(mockReq as Request, mockRes as Response);

            expect(mockToDoService.getListItems).toHaveBeenCalledWith('list-123');
            expect(mockRes.status).toHaveBeenCalledWith(200);
            expect(mockRes.json).toHaveBeenCalledWith(mockItems);
        });
    });

    describe('getListItem', () => {
        beforeEach(() => {
            mockReq = createMockRequest({
                params: { listId: 'list-123', itemId: 'item-456' }
            });
        });

        it('should return a specific item successfully', () => {
            const mockItem = {
                id: 'item-456',
                content: 'Test item',
                completed: false
            };

            mockToDoService.getListItem.mockReturnValue(mockItem);

            controller.getListItem(mockReq as Request, mockRes as Response);

            expect(mockToDoService.getListItem).toHaveBeenCalledWith('list-123', 'item-456');
            expect(mockRes.status).toHaveBeenCalledWith(200);
            expect(mockRes.json).toHaveBeenCalledWith(mockItem);
        });

        it('should return 404 when list or item does not exist', () => {
            const mockErrorResponse = { message: 'List or item not found' };
            
            mockToDoService.getListItem.mockReturnValue(undefined);
            mockErrors.listOrItemNotFound.mockReturnValue(mockErrorResponse);

            controller.getListItem(mockReq as Request, mockRes as Response);

            expect(mockToDoService.getListItem).toHaveBeenCalledWith('list-123', 'item-456');
            expect(mockErrors.listOrItemNotFound).toHaveBeenCalledWith('list-123', 'item-456');
            expect(mockRes.status).toHaveBeenCalledWith(404);
            expect(mockRes.json).toHaveBeenCalledWith(mockErrorResponse);
        });
    });

    describe('updateListItem', () => {
        beforeEach(() => {
            mockReq = createMockRequest({
                params: { listId: 'list-123', itemId: 'item-456' },
                body: { content: 'Updated content', completed: true }
            });
        });

        it('should update an item successfully', () => {
            const mockUpdatedItem = {
                id: 'item-456',
                content: 'Updated content',
                completed: true
            };

            mockToDoService.updateListItem.mockReturnValue(mockUpdatedItem);

            controller.updateListItem(mockReq as Request, mockRes as Response);

            expect(mockToDoService.updateListItem).toHaveBeenCalledWith(
                'list-123', 
                'item-456', 
                { content: 'Updated content', completed: true }
            );
            expect(mockRes.status).toHaveBeenCalledWith(200);
            expect(mockRes.json).toHaveBeenCalledWith(mockUpdatedItem);
        });

        it('should return 400 when required fields are missing', () => {
            mockReq.body = {}; // Missing both content and completed
            const mockErrorResponse = { message: 'Missing values', missingValues: ['completed', 'content'] };
            mockErrors.missingValues.mockReturnValue(mockErrorResponse);

            controller.updateListItem(mockReq as Request, mockRes as Response);

            expect(mockErrors.missingValues).toHaveBeenCalledWith(['completed', 'content']);
            expect(mockRes.status).toHaveBeenCalledWith(400);
            expect(mockRes.json).toHaveBeenCalledWith(mockErrorResponse);
        });

        it('should return 400 when only content is missing', () => {
            mockReq.body = { completed: true }; // Missing content
            const mockErrorResponse = { message: 'Missing values', missingValues: ['content'] };
            mockErrors.missingValues.mockReturnValue(mockErrorResponse);

            controller.updateListItem(mockReq as Request, mockRes as Response);

            expect(mockErrors.missingValues).toHaveBeenCalledWith(['content']);
            expect(mockRes.status).toHaveBeenCalledWith(400);
            expect(mockRes.json).toHaveBeenCalledWith(mockErrorResponse);
        });

        it('should return 400 when only completed is missing', () => {
            mockReq.body = { content: 'Updated content' }; // Missing completed
            const mockErrorResponse = { message: 'Missing values', missingValues: ['completed'] };
            mockErrors.missingValues.mockReturnValue(mockErrorResponse);

            controller.updateListItem(mockReq as Request, mockRes as Response);

            expect(mockErrors.missingValues).toHaveBeenCalledWith(['completed']);
            expect(mockRes.status).toHaveBeenCalledWith(400);
            expect(mockRes.json).toHaveBeenCalledWith(mockErrorResponse);
        });

        it('should return 404 when list or item does not exist', () => {
            const mockErrorResponse = { message: 'List or item not found' };
            
            mockToDoService.updateListItem.mockReturnValue(undefined);
            mockErrors.listOrItemNotFound.mockReturnValue(mockErrorResponse);

            controller.updateListItem(mockReq as Request, mockRes as Response);

            expect(mockToDoService.updateListItem).toHaveBeenCalledWith(
                'list-123', 
                'item-456', 
                { content: 'Updated content', completed: true }
            );
            expect(mockErrors.listOrItemNotFound).toHaveBeenCalledWith('list-123', 'item-456');
            expect(mockRes.status).toHaveBeenCalledWith(404);
            expect(mockRes.json).toHaveBeenCalledWith(mockErrorResponse);
        });

        it('should handle partial updates correctly', () => {
            mockReq.body = { content: 'Only content update', completed: false };
            const mockUpdatedItem = {
                id: 'item-456',
                content: 'Only content update',
                completed: false
            };

            mockToDoService.updateListItem.mockReturnValue(mockUpdatedItem);

            controller.updateListItem(mockReq as Request, mockRes as Response);

            expect(mockToDoService.updateListItem).toHaveBeenCalledWith(
                'list-123', 
                'item-456', 
                { content: 'Only content update', completed: false }
            );
            expect(mockRes.status).toHaveBeenCalledWith(200);
            expect(mockRes.json).toHaveBeenCalledWith(mockUpdatedItem);
        });
    });

    describe('deleteListItem', () => {
        beforeEach(() => {
            mockReq = createMockRequest({
                params: { listId: 'list-123', itemId: 'item-456' }
            });
        });

        it('should delete an item successfully', () => {
            const mockDeletedItem = {
                id: 'item-456',
                content: 'Deleted item',
                completed: false
            };

            mockToDoService.deleteItem.mockReturnValue(mockDeletedItem);

            controller.deleteListItem(mockReq as Request, mockRes as Response);

            expect(mockToDoService.deleteItem).toHaveBeenCalledWith('list-123', 'item-456');
            expect(mockRes.status).toHaveBeenCalledWith(200);
            expect(mockRes.json).toHaveBeenCalledWith(mockDeletedItem);
        });

        it('should return 404 when list or item does not exist', () => {
            const mockErrorResponse = { message: 'List or item not found' };
            
            mockToDoService.deleteItem.mockReturnValue(undefined);
            mockErrors.listOrItemNotFound.mockReturnValue(mockErrorResponse);

            controller.deleteListItem(mockReq as Request, mockRes as Response);

            expect(mockToDoService.deleteItem).toHaveBeenCalledWith('list-123', 'item-456');
            expect(mockErrors.listOrItemNotFound).toHaveBeenCalledWith('list-123', 'item-456');
            expect(mockRes.status).toHaveBeenCalledWith(404);
            expect(mockRes.json).toHaveBeenCalledWith(mockErrorResponse);
        });
    });

    describe('Error Response Integration', () => {
        it('should call the correct error functions with proper parameters', () => {
            // Test missingValues error
            mockReq = createMockRequest({ body: {} });
            const missingValuesResponse = { message: 'Missing values', missingValues: ['content'] };
            mockErrors.missingValues.mockReturnValue(missingValuesResponse);

            controller.createItem(mockReq as Request, mockRes as Response);

            expect(mockErrors.missingValues).toHaveBeenCalledWith(['content']);

            // Test listNotFound error
            jest.clearAllMocks();
            mockRes = createMockResponse();
            mockReq = createMockRequest({ 
                params: { listId: 'nonexistent-list' },
                body: { content: 'Valid content' }
            });
            
            const listNotFoundResponse = { message: 'List not found' };
            mockValidator.validateString.mockReturnValue([]);
            mockToDoService.createListItem.mockReturnValue(undefined);
            mockErrors.listNotFound.mockReturnValue(listNotFoundResponse);

            controller.createItem(mockReq as Request, mockRes as Response);

            expect(mockErrors.listNotFound).toHaveBeenCalledWith('nonexistent-list');
        });
    });

    describe('Service Layer Integration', () => {
        it('should properly pass parameters to service functions', () => {
            // Test createListItem service call
            mockReq = createMockRequest({
                params: { listId: 'specific-list-id' },
                body: { content: 'Specific content' }
            });

            mockValidator.validateString.mockReturnValue([]);
            mockToDoService.createListItem.mockReturnValue({
                id: 'item-123',
                content: 'Specific content',
                completed: false
            });

            controller.createItem(mockReq as Request, mockRes as Response);

            expect(mockToDoService.createListItem).toHaveBeenCalledWith('specific-list-id', 'Specific content');

            // Test updateListItem service call with specific updates
            jest.clearAllMocks();
            mockRes = createMockResponse();
            mockReq = createMockRequest({
                params: { listId: 'update-list-id', itemId: 'update-item-id' },
                body: { content: 'Updated specific content', completed: true }
            });

            mockToDoService.updateListItem.mockReturnValue({
                id: 'update-item-id',
                content: 'Updated specific content',
                completed: true
            });

            controller.updateListItem(mockReq as Request, mockRes as Response);

            expect(mockToDoService.updateListItem).toHaveBeenCalledWith(
                'update-list-id',
                'update-item-id',
                { content: 'Updated specific content', completed: true }
            );
        });
    });
});
