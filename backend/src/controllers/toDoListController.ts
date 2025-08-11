import { Request, Response } from "express";
import * as ToDoService from '../services/toDoListService'

export const getAllLists = async (req: Request, res: Response) => {
    const lists = await ToDoService.getLists();
    return res.status(200).json(lists);
};

export const getList = async (req: Request, res: Response) => {
    const list = await ToDoService.getList(req.params.listId);
    return res.status(200).json(list);
};

export const createList = async (req: Request, res: Response) => {
    const list = await ToDoService.createList(req.body);
    return res.status(200).json(list);
};

export const deleteList = async (req: Request, res: Response) => {
    const list = await ToDoService.deleteList(req.params.listId);
    return res.status(200).json(list);
};

export const updateList = async(req: Request, res: Response) => {
    const updatedList = await ToDoService.updateList(req.params.listId, req.body);
    return res.status(200).json(updatedList);
};

