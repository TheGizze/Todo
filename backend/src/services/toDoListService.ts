import { toDoLists } from "../mockDb";
import { ToDoList } from "../models/ToDoList";
import { generateListId } from "../utils/idGenerator";
import { ListNotFoundError } from "../errors/resourceErrors";
import { validateString } from "../middleware/validators/businessValidation";
import { listTitleSchema } from "../schemas/business/listsBusinessSchemas";

export const getLists = (): ToDoList[] => toDoLists;

export const getList = (listId: string): ToDoList => {
    const list = toDoLists.find(list => list.id === listId);
    if (!list) throw new ListNotFoundError(`No list Found with id: ${listId}`);

    return list;
};

export const updateList = (listId: string, title: string): ToDoList => {
    validateString(title, listTitleSchema);

    const list = getList(listId);
    list.title = title;

    return list;
};

export const deleteList = (listId: string): ToDoList => {
    const list = getList(listId);

    const index = toDoLists.findIndex(list => list.id === listId);
    
    return toDoLists.splice(index, 1)[0];
}

export const createList = (title: string): ToDoList => {
    validateString(title, listTitleSchema);

    const newlist: ToDoList = {
        id: generateListId(),
        title: title,
        items: []
    }
    toDoLists.push(newlist);
    return newlist;
}
