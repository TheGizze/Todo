import { Request, Response } from "express";
import * as ToDoService from '../services/toDoListService'

export const getAllLists = (req: Request, res: Response) => {
    const lists = ToDoService.getLists();
    return res.status(200).json(lists);
};

export const getList = (req: Request, res: Response) => {
    const list = ToDoService.getList(req.params.listId);
    return res.status(200).json(list);
}

export const createList = (req: Request, res: Response) => {
    const list = ToDoService.createList(req.body.title);
    return res.status(200).json(list);
}

export const deleteList = (req: Request, res: Response) => {
    const list = ToDoService.deleteList(req.params.listId);
    return res.status(200).json(list);
}

export const updateList = (req: Request, res: Response) => {
    const updatedList = ToDoService.updateList(req.params.listId, req.body.title);
    return res.status(200).json(updatedList);
}

