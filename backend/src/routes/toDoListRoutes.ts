import express from 'express';
import * as ToDoListController from '../controllers/toDoListController'
import * as ToDoItemController from '../controllers/toDoItemController'
import { validateRequest } from '../middleware/validators/requestValidation';
import { validateUpdateItemRequest } from '../middleware/validators/requestValidation';
import * as listSchemas from '../schemas/requests/listSchemas';
import * as itemSchemas from '../schemas/requests/listItemSchemas'

const router = express.Router();

// List routes
router.get('/lists', ToDoListController.getAllLists);
router.get('/lists/:listId', ToDoListController.getList);
router.post('/lists', validateRequest(listSchemas.requestListTitleSchema), ToDoListController.createList);
router.patch('/lists/:listId', validateRequest(listSchemas.requestListTitleSchema), ToDoListController.updateList);
router.delete('/lists/:listId', ToDoListController.deleteList);

// Item routes (nested under lists)
router.get('/lists/:listId/items', ToDoItemController.getListItems);
router.get('/lists/:listId/items/:itemId', ToDoItemController.getListItem);
router.post('/lists/:listId/items', validateRequest(itemSchemas.requesItemContentSchema), ToDoItemController.createItem);
router.patch('/lists/:listId/items/:itemId', validateUpdateItemRequest(itemSchemas.requestItemUpdateSchema),ToDoItemController.updateListItem);
router.delete('/lists/:listId/items/:itemId', ToDoItemController.deleteListItem);

export default router