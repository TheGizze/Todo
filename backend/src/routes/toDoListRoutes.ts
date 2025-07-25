import express from 'express';
import * as ToDoListController from '../controllers/toDoListController'
import * as ToDoItemController from '../controllers/toDoItemController'

const router = express.Router();

// List routes
router.get('/lists', ToDoListController.getAllLists);
router.get('/lists/:listId', ToDoListController.getList);
router.post('/lists', ToDoListController.createList);
router.patch('/lists/:listId', ToDoListController.updateList);
router.delete('/lists/:listId', ToDoListController.deleteList);

// Item routes (nested under lists)
router.get('/lists/:listId/items', ToDoItemController.getListItems);
router.get('/lists/:listId/items/:itemId', ToDoItemController.getListItem);
router.post('/lists/:listId/items', ToDoItemController.createItem);
router.patch('/lists/:listId/items/:itemId', ToDoItemController.updateListItem);
router.delete('/lists/:listId/items/:itemId', ToDoItemController.deleteListItem);

export default router