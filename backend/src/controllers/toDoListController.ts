import { Request, Response } from "express";
import * as ToDoService from '../services/toDoListService'
import { errors } from '../errors/errorResponses'
import * as validator from '../middleware/validators/common'

export const getAllLists = (_req: Request, res: Response) => {
    const lists = ToDoService.getLists();
    return res.status(200).json(lists);
};

export const getList = (_req: Request, res: Response) => {
    const list = ToDoService.getList(_req.params.listId);
    return res.status(200).json(list);
}

export const createList = (_req: Request, res: Response) => {
        //comeup with away to dynamically check what values are missing from the body
    if (_req.body.title === undefined) return res.status(400).json(errors.missingValues(['title']));

    const validationErrors = validator.validateString(_req.body.title);
    if (validationErrors.length > 0) return res.status(400).json(errors.invalidListName(validationErrors));

    const list = ToDoService.createList(_req.body.title);
    return res.status(200).json(list);
}

export const deleteList = (_req: Request, res: Response) => {
    const list = ToDoService.deleteList(_req.params.listId);
    return res.status(200).json(list);
}

export const updateList = (_req: Request, res: Response) => {
    if (_req.body.title === undefined) return res.status(400).json(errors.missingValues(['title']));

    const validationErrors = validator.validateString(_req.body.title);
    if (validationErrors.length > 0) return res.status(400).json(errors.invalidListName(validationErrors));

    const updatedList = ToDoService.updateList(_req.params.listId, _req.body.title);
    return res.status(200).json(updatedList);
}

