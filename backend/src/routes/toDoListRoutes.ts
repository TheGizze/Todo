import express from 'express';
import * as ToDoListController from '../controllers/toDoListController'

const router = express.Router();

router.get('/lists', ToDoListController.getAllLists);
router.get('/lists/:id', ToDoListController.getListById);

export default router