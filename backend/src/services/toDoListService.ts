import { toDoLists } from "../mockDb";
import { ToDoList } from "../models/ToDoList";
import { generateListId } from "../utils/idGenerator";

export const getLists = (): ToDoList[] => toDoLists;

export const getList = (id: string): ToDoList | undefined => toDoLists.find(list => list.id === id);

export const updateListById = (id: string, title: string): ToDoList | undefined => {
    const list = getList(id);
    if (!list) return undefined;
    list.title = title;
    return list;
};

export const deleteList = (id: string): ToDoList | undefined => {
    const list = getList(id);
    if(!list) return undefined;
    const index = toDoLists.findIndex(l => l.id === id);
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
