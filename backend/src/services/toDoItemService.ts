import { ToDoItem } from "../models/ToDoItem";
import { getList } from "./toDoListService";

export const createListItem = (listId: string, listItem: ToDoItem): ToDoItem | undefined => {
    const items = getListItems(listId);
    if (!items) return undefined;
    
    items.push(listItem);
    return listItem;
};

export const getListItems = (listId: string): ToDoItem[] | undefined => getList(listId)?.items;

export const getListItem = (listId: string, itemId: string): ToDoItem | undefined => getListItems(listId)?.find(item => item.id === itemId);

export const updateListItem = (listId: string, itemId: string, updates: Partial <ToDoItem>): ToDoItem | undefined => {
    const result = findItemInList(listId, itemId);
    if (!result) return undefined;

    Object.assign(result.items[result.index], updates)
    return result.items[result.index];
};

export const deleteItem = (listId: string, itemId: string): ToDoItem | undefined => {
    const result = findItemInList(listId, itemId);
    if (!result) return undefined;

    return result.items.splice(result.index, 1)[0];
};

const findItemInList = (listId: string, itemId: string): {items: ToDoItem[], index: number}  | undefined => {
    const items = getListItems(listId);
    if (!items) return undefined;

    const index = items.findIndex(item => item.id === itemId);
    if (index === -1) return undefined;

    return { items, index };
};
