import { toDoLists } from "../mockDb";
import { ToDoList } from "../models/ToDoList";
import { generateListId } from "../utils/idGenerator";
import { ListNotFoundError } from "../errors/resourceErrors";
import { validateData } from "../middleware/validators/businessValidation";
import { ToDoListSchema } from "../schemas/BusinessSchemas";
import { logger } from "../utils/logger/logger";

export const getLists = (): ToDoList[] => toDoLists;

export const getList = (listId: string): ToDoList => {
    const list = toDoLists.find(list => list.id === listId);
    if (!list) throw new ListNotFoundError(`No list Found with id: ${listId}`);

    return list;
};

export const updateList = (listId: string, listUpdate: Partial<ToDoList>): ToDoList => {
    const validatedListUpdate = validateData(listUpdate, ToDoListSchema);
   
    const list = getList(listId);
    
    const oldTitle = list.title;

    list.title = validatedListUpdate.title;

    logger.debug({
        operation: 'updateList',
        listId,
        changes: {
            from: oldTitle,
            to: list.title
        },
        oldTitle: listUpdate.title,
        
    }, 'Successfully updated list title');
    return list;
};

export const deleteList = (listId: string): ToDoList => {
    const list = getList(listId);

    const index = toDoLists.findIndex(list => list.id === listId);

    logger.info({
        operation: 'deleteList',
        deletedItem: list
    }, 'Successfully deleted the list');
    
    return toDoLists.splice(index, 1)[0];
}

export const createList = (list: Partial<ToDoList>): ToDoList => {
    const validatedList = validateData(list, ToDoListSchema);
    
    const newlist: ToDoList = {
        id: generateListId(),
        title: validatedList.title,
        items: []
    }

    logger.info({
        operation: 'createList',
        newlist
    }, 'Successfully created new list');
    
    toDoLists.push(newlist);
    return newlist;
}
