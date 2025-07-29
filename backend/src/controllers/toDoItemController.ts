import { Request, Response } from "express";
import * as ToDoService from '../services/toDoItemService'
import { errors } from '../errors/errorResponses'
import * as validator from '../middleware/validators/common'
import { ToDoItem } from "../models/ToDoItem";

export const createItem = (_req: Request, res: Response) => {
    //create request validator that handles this kind of stuff later
    if (_req.body.content === undefined) return res.status(400).json(errors.missingValues(["content"]));
    //---------------------------------------------------

    //move this logic to a data validator and validate it on a service level
    const validationErrors = validator.validateString(_req.body.content);
    if (validationErrors.length > 0) return res.status(400).json(errors.invalidItemContent(validationErrors));
    //---------------------------------------------------
    const newItem = ToDoService.createListItem(_req.params.listId, _req.body.content);

    return res.status(200).json(newItem);
};

export const getListItems = (_req: Request, res: Response) => {
    const items = ToDoService.getListItems(_req.params.listId);
    return res.status(200).json(items);
};

export const getListItem = (_req: Request, res: Response) => {
    const item = ToDoService.getListItem(_req.params.listId, _req.params.itemId);
    return res.status(200).json(item);
};

export const updateListItem = (_req: Request, res: Response) => {
    //create request validator that handles this kind of stuff later
    const missingValues: string[] = [];
    const updates: Partial<ToDoItem> = {};
    if (_req.body.completed === undefined) { missingValues.push("completed") } else { updates.completed = _req.body.completed };
    if (_req.body.content === undefined) { missingValues.push("content") } else { updates.content = _req.body.content };
    if (missingValues.length > 0) return res.status(400).json(errors.missingValues(missingValues));
    //---------------------------------------------------

    const updatedItem = ToDoService.updateListItem(_req.params.listId, _req.params.itemId, updates);

    return res.status(200).json(updatedItem);
};

export const deleteListItem = (_req: Request, res: Response) => {
    const deletedItem = ToDoService.deleteItem(_req.params.listId, _req.params.itemId);
    return res.status(200).json(deletedItem);
};