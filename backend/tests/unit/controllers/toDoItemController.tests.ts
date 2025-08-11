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

        it('should create a new item successfully', async () => {
            const mockNewItem = {
                id: 'item-123',
                content: 'Test item content',
                completed: false
            };

            mockToDoService.createListItem.mockResolvedValue(mockNewItem);

            await controller.createItem(mockReq as Request, mockRes as Response);

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

        it('should return all items for a list successfully', async () => {
            const mockItems = [
                { id: 'item-1', content: 'Item 1', completed: false },
                { id: 'item-2', content: 'Item 2', completed: true }
            ];

            mockToDoService.getListItems.mockResolvedValue(mockItems);

            await controller.getListItems(mockReq as Request, mockRes as Response);

            expect(mockToDoService.getListItems).toHaveBeenCalledWith('list-123');
            expect(mockRes.status).toHaveBeenCalledWith(200);
            expect(mockRes.json).toHaveBeenCalledWith(mockItems);
        });

        it('should throw ListNotFoundError when list does not exist', async () => {
            mockToDoService.getListItems.mockRejectedValue(new ListNotFoundError('No list Found with id: list-123'));

            await expect(async () => {
                await controller.getListItems(mockReq as Request, mockRes as Response);
            }).rejects.toThrow(ListNotFoundError);

            expect(mockToDoService.getListItems).toHaveBeenCalledWith('list-123');
        });

        it('should return empty array when list exists but has no items', async () => {
            const mockItems: any[] = [];

            mockToDoService.getListItems.mockResolvedValue(mockItems);

            await controller.getListItems(mockReq as Request, mockRes as Response);

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

        it('should return a specific item successfully', async () => {
            const mockItem = {
                id: 'item-456',
                content: 'Test item',
                completed: false
            };

            mockToDoService.getListItem.mockResolvedValue(mockItem);

            await controller.getListItem(mockReq as Request, mockRes as Response);

            expect(mockToDoService.getListItem).toHaveBeenCalledWith('list-123', 'item-456');
            expect(mockRes.status).toHaveBeenCalledWith(200);
            expect(mockRes.json).toHaveBeenCalledWith(mockItem);
        });

        it('should throw ItemNotFoundError when list or item does not exist', async () => {
            mockToDoService.getListItem.mockRejectedValue(new ItemNotFoundError('No item found with id: item-456'));

            await expect(async () => {
                await controller.getListItem(mockReq as Request, mockRes as Response);
            }).rejects.toThrow(ItemNotFoundError);

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

        it('should update an item successfully', async () => {
            const mockUpdatedItem = {
                id: 'item-456',
                content: 'Updated content',
                completed: true
            };

            mockToDoService.updateListItem.mockResolvedValue(mockUpdatedItem);

            await controller.updateListItem(mockReq as Request, mockRes as Response);

            expect(mockToDoService.updateListItem).toHaveBeenCalledWith(
                'list-123', 
                'item-456', 
                { content: 'Updated content', completed: true }
            );
            expect(mockRes.status).toHaveBeenCalledWith(200);
            expect(mockRes.json).toHaveBeenCalledWith(mockUpdatedItem);
        });

        it('should throw ItemNotFoundError when list or item does not exist', async () => {
            mockToDoService.updateListItem.mockRejectedValue(new ItemNotFoundError('No item found with id: item-456'));

            await expect(async () => {
                await controller.updateListItem(mockReq as Request, mockRes as Response);
            }).rejects.toThrow(ItemNotFoundError);

            expect(mockToDoService.updateListItem).toHaveBeenCalledWith(
                'list-123', 
                'item-456', 
                { content: 'Updated content', completed: true }
            );
        });

        it('should handle partial updates correctly', async () => {
            mockReq.body = { content: 'Only content update', completed: false };
            const mockUpdatedItem = {
                id: 'item-456',
                content: 'Only content update',
                completed: false
            };

            mockToDoService.updateListItem.mockResolvedValue(mockUpdatedItem);

            await controller.updateListItem(mockReq as Request, mockRes as Response);

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

        it('should delete an item successfully', async () => {
            const mockDeletedItem = {
                id: 'item-456',
                content: 'Deleted item',
                completed: false
            };

            mockToDoService.deleteListItem.mockResolvedValue(mockDeletedItem);

            await controller.deleteListItem(mockReq as Request, mockRes as Response);

            expect(mockToDoService.deleteListItem).toHaveBeenCalledWith('list-123', 'item-456');
            expect(mockRes.status).toHaveBeenCalledWith(200);
            expect(mockRes.json).toHaveBeenCalledWith(mockDeletedItem);
        });

        it('should throw ItemNotFoundError when list or item does not exist', async () => {
            mockToDoService.deleteListItem.mockRejectedValue(new ItemNotFoundError('No item found with id: item-456'));

            await expect(async () => {
                await controller.deleteListItem(mockReq as Request, mockRes as Response);
            }).rejects.toThrow(ItemNotFoundError);

            expect(mockToDoService.deleteListItem).toHaveBeenCalledWith('list-123', 'item-456');
        });
    });


    describe('Service Layer Integration', () => {
        it('should properly pass parameters to service functions', async () => {
            // Test createListItem service call
            mockReq = createMockRequest({
                params: { listId: 'specific-list-id' },
                body: { content: 'Specific content' }
            });

            mockToDoService.createListItem.mockResolvedValue({
                id: 'item-123',
                content: 'Specific content',
                completed: false
            });

            await controller.createItem(mockReq as Request, mockRes as Response);

            expect(mockToDoService.createListItem).toHaveBeenCalledWith('specific-list-id', {content:'Specific content'});

            // Test updateListItem service call with specific updates
            jest.clearAllMocks();
            mockRes = createMockResponse();
            mockReq = createMockRequest({
                params: { listId: 'update-list-id', itemId: 'update-item-id' },
                body: { content: 'Updated specific content', completed: true }
            });

            mockToDoService.updateListItem.mockResolvedValue({
                id: 'update-item-id',
                content: 'Updated specific content',
                completed: true
            });

            await controller.updateListItem(mockReq as Request, mockRes as Response);

            expect(mockToDoService.updateListItem).toHaveBeenCalledWith(
                'update-list-id',
                'update-item-id',
                { content: 'Updated specific content', completed: true }
            );
        });
    });
});
