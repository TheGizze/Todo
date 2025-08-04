import { Request, Response } from "express";
import * as ToDoService from '../services/toDoItemService'


export const createItem = (req: Request, res: Response) => {
    const newItem = ToDoService.createListItem(req.params.listId, req.body);
    return res.status(200).json(newItem);
};

export const getListItems = (req: Request, res: Response) => {
    const items = ToDoService.getListItems(req.params.listId);
    return res.status(200).json(items);
};

export const getListItem = (_req: Request, res: Response) => {
    const item = ToDoService.getListItem(_req.params.listId, _req.params.itemId);
    return res.status(200).json(item);
};

export const updateListItem = (req: Request, res: Response) => {
    const updatedItem = ToDoService.updateListItem(req.params.listId, req.params.itemId, req.body);
    return res.status(200).json(updatedItem);
};

export const deleteListItem = (req: Request, res: Response) => {
    const deletedItem = ToDoService.deleteListItem(req.params.listId, req.params.itemId);
    return res.status(200).json(deletedItem);
};