import { ToDoItem } from "../models/ToDoItem";
import { getList } from "./toDoListService";
import { generateItemId } from "../utils/idGenerator";
import { ItemNotFoundError } from "../errors/resourceErrors";
import { validateData } from "../middleware/validators/businessValidation";
import { TodoItemSchema, TodoItemCreateSchema } from "../schemas/BusinessSchemas";
import { logger } from "../utils/logger/logger";

export const createListItem = async(listId: string, item: Partial <ToDoItem>): Promise<ToDoItem> => {
    const validatedItem = validateData(item, TodoItemCreateSchema);
    
    const items = await getListItems(listId);

    const newItem: ToDoItem = {
        id: generateItemId(),
        content: validatedItem.content,
        completed: false
    }
    
    logger.info({
        operation: 'createListItem',
        list: listId,
        item: newItem
    }, 'Item successfully added to the list');

    items.push(newItem);
    return newItem;
};

export const getListItems = async(listId: string): Promise<ToDoItem[]> => {
    const list = await getList(listId);
    return list.items
}

export const getListItem = async (listId: string, itemId: string): Promise<ToDoItem> => {
    const items = await getListItems(listId);
    const item = items.find(item => item.id === itemId);
    if (!item) throw new ItemNotFoundError(`No item found with id: ${itemId}`);

    logger.debug({
        operation: 'getListItems',
        item: item
    },'Successfully fetched item from list');

    return item;
};

export const updateListItem = async (listId: string, itemId: string, updates: Partial <ToDoItem>): Promise<ToDoItem> => {
    const valitadedUpdates = validateData(updates, TodoItemSchema);
    const result = await findItemInList(listId, itemId);
    
    Object.assign(result.items[result.index], valitadedUpdates);

    logger.debug({
        operation: 'updateListItem',
        listId,
        itemId,
        updates,
        newItem: result.items[result.index]

    },'Successfully updated list item');

    return result.items[result.index];
};

export const deleteListItem = async (listId: string, itemId: string): Promise<ToDoItem> => {
    const result = await findItemInList(listId, itemId);
    
    logger.info({
        operation: 'deleteListItem',
        deletedItem: result.items[result.index]
    }, 'Successfully deleted item from the list');

    return result.items.splice(result.index, 1)[0];
};

const findItemInList = async (listId: string, itemId: string): Promise<{items: ToDoItem[], index: number}> => {
    const items = await getListItems(listId);
    const index = items.findIndex(item => item.id === itemId);
    if (index === -1) throw new ItemNotFoundError(`No item found with id: ${itemId}`);

    return { items, index };
};
