import { toDoLists } from "../mockDb";
import { ToDoList } from "../models/ToDoList";
import { generateListId } from "../utils/idGenerator";

export const getLists = (): ToDoList[] => toDoLists;

export const getList = (listId: string): ToDoList | undefined => toDoLists.find(list => list.id === listId);

export const updateListById = (listId: string, title: string): ToDoList | undefined => {
    const list = getList(listId);
    if (!list) return undefined;
    list.title = title;
    return list;
};

export const deleteList = (listId: string): ToDoList | undefined => {
    const list = getList(listId);
    if(!list) return undefined;
    const index = toDoLists.findIndex(list => list.id === listId);
    return toDoLists.splice(index, 1)[0];
}

export const createList = (title: string): ToDoList => {
    const newlist: ToDoList = {
        id: generateListId(),
        title: title,
        items: []
    }
    toDoLists.push(newlist);
    return newlist;
}
