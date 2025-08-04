import { Request, Response } from 'express';
import * as controller from '../../../src/controllers/toDoItemController';
import * as ToDoService from '../../../src/services/toDoItemService';
import { ListNotFoundError, ItemNotFoundError } from '../../../src/errors/resourceErrors';

// Mock all dependencies
jest.mock('../../../src/services/toDoItemService');

// Type the mocked modules
const mockToDoService = ToDoService as jest.Mocked<typeof ToDoService>;

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

            mockToDoService.createListItem.mockReturnValue(mockNewItem);

            controller.createItem(mockReq as Request, mockRes as Response);

            expect(mockToDoService.createListItem).toHaveBeenCalledWith('list-123', {content:'Test item content'});
            expect(mockRes.status).toHaveBeenCalledWith(200);
            expect(mockRes.json).toHaveBeenCalledWith(mockNewItem);
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

        it('should throw ListNotFoundError when list does not exist', () => {
            mockToDoService.getListItems.mockImplementation(() => {
                throw new ListNotFoundError('No list Found with id: list-123');
            });

            expect(() => {
                controller.getListItems(mockReq as Request, mockRes as Response);
            }).toThrow(ListNotFoundError);

            expect(mockToDoService.getListItems).toHaveBeenCalledWith('list-123');
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

        it('should throw ItemNotFoundError when list or item does not exist', () => {
            mockToDoService.getListItem.mockImplementation(() => {
                throw new ItemNotFoundError('No item found with id: item-456');
            });

            expect(() => {
                controller.getListItem(mockReq as Request, mockRes as Response);
            }).toThrow(ItemNotFoundError);

            expect(mockToDoService.getListItem).toHaveBeenCalledWith('list-123', 'item-456');
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

        it('should throw ItemNotFoundError when list or item does not exist', () => {
            mockToDoService.updateListItem.mockImplementation(() => {
                throw new ItemNotFoundError('No item found with id: item-456');
            });

            expect(() => {
                controller.updateListItem(mockReq as Request, mockRes as Response);
            }).toThrow(ItemNotFoundError);

            expect(mockToDoService.updateListItem).toHaveBeenCalledWith(
                'list-123', 
                'item-456', 
                { content: 'Updated content', completed: true }
            );
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

            mockToDoService.deleteListItem.mockReturnValue(mockDeletedItem);

            controller.deleteListItem(mockReq as Request, mockRes as Response);

            expect(mockToDoService.deleteListItem).toHaveBeenCalledWith('list-123', 'item-456');
            expect(mockRes.status).toHaveBeenCalledWith(200);
            expect(mockRes.json).toHaveBeenCalledWith(mockDeletedItem);
        });

        it('should throw ItemNotFoundError when list or item does not exist', () => {
            mockToDoService.deleteListItem.mockImplementation(() => {
                throw new ItemNotFoundError('No item found with id: item-456');
            });

            expect(() => {
                controller.deleteListItem(mockReq as Request, mockRes as Response);
            }).toThrow(ItemNotFoundError);

            expect(mockToDoService.deleteListItem).toHaveBeenCalledWith('list-123', 'item-456');
        });
    });


    describe('Service Layer Integration', () => {
        it('should properly pass parameters to service functions', () => {
            // Test createListItem service call
            mockReq = createMockRequest({
                params: { listId: 'specific-list-id' },
                body: { content: 'Specific content' }
            });

            mockToDoService.createListItem.mockReturnValue({
                id: 'item-123',
                content: 'Specific content',
                completed: false
            });

            controller.createItem(mockReq as Request, mockRes as Response);

            expect(mockToDoService.createListItem).toHaveBeenCalledWith('specific-list-id', {content:'Specific content'});

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
