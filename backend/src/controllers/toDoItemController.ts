import { Request, Response } from "express";
import * as ToDoService from '../services/toDoItemService'
import { errors } from '../responses/errorResponses'
import * as validator from '../validators/common'

export const createItem = (_req: Request, res: Response) => {
    if (_req.body.content === undefined) return res.status(400).json(errors.missingValues(["content"]));
    
    const validationErrors = validator.validateString(_req.body.content);
    if (validationErrors.length > 0) return res.status(400).json(errors.invalidItemContent(validationErrors));
    
    const newItem = ToDoService.createListItem(_req.params.id, _req.body.content);
    if (!newItem) return res.status(404).json(errors.listNotFound(_req.params.id));

    return res.status(200).json(newItem);
};
