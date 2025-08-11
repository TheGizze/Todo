import { Request, Response } from "express";
import * as ToDoService from '../services/toDoItemService'


export const createItem = async(req: Request, res: Response) => {
    const newItem = await ToDoService.createListItem(req.params.listId, req.body);
    return res.status(200).json(newItem);
};

export const getListItems = async(req: Request, res: Response) => {
    const items = await ToDoService.getListItems(req.params.listId);
    return res.status(200).json(items);
};

export const getListItem = async(_req: Request, res: Response) => {
    const item = await ToDoService.getListItem(_req.params.listId, _req.params.itemId);
    return res.status(200).json(item);
};

export const updateListItem = async(req: Request, res: Response) => {
    const updatedItem = await ToDoService.updateListItem(req.params.listId, req.params.itemId, req.body);
    return res.status(200).json(updatedItem);
};

export const deleteListItem = async(req: Request, res: Response) => {
    const deletedItem = await ToDoService.deleteListItem(req.params.listId, req.params.itemId);
    return res.status(200).json(deletedItem);
};