import express from 'express';
import * as ToDoListController from '../controllers/toDoListController'

const router = express.Router();

router.get('/lists', ToDoListController.getAllLists);
router.get('/lists/:id', ToDoListController.getListById);
router.post('/list', ToDoListController.createList);
router.patch('/list/:id', ToDoListController.updateList);
router.delete('/list/:id', ToDoListController.deleteList);

export default router