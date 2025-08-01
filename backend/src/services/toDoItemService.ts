import { ToDoItem } from "../models/ToDoItem";
import { getList } from "./toDoListService";
import { generateItemId } from "../utils/idGenerator";
import { ItemNotFoundError } from "../errors/resourceErrors";
import { validateData } from "../middleware/validators/businessValidation";
import { TodoItemSchema, TodoItemCreateSchema } from "../schemas/BusinessSchemas";
import { DataValidationError } from "../errors/ValidationErrors";

export const createListItem = (listId: string, item: Partial <ToDoItem>): ToDoItem => {
    const validatedItem = validateData(item, TodoItemCreateSchema);
    
    const items = getListItems(listId);

    const newItem: ToDoItem = {
        id: generateItemId(),
        content: validatedItem.content,
        completed: false
    }

    items.push(newItem);
    return newItem;
};

export const getListItems = (listId: string): ToDoItem[] => getList(listId).items;

export const getListItem = (listId: string, itemId: string): ToDoItem => {
    const item = getListItems(listId).find(item => item.id === itemId);
    if (!item) throw new ItemNotFoundError(`No item found with id: ${itemId}`);

    return item;
};

export const updateListItem = (listId: string, itemId: string, updates: Partial <ToDoItem>): ToDoItem => {
    const valitadedUpdates = validateData(updates, TodoItemSchema);
    const result = findItemInList(listId, itemId);

    Object.assign(result.items[result.index], valitadedUpdates)
    return result.items[result.index];
};

//refactor deleteItem to DeleteListItem for consistensy
export const deleteItem = (listId: string, itemId: string): ToDoItem => {
    const result = findItemInList(listId, itemId);

    return result.items.splice(result.index, 1)[0];
};

const findItemInList = (listId: string, itemId: string): {items: ToDoItem[], index: number} => {
    const items = getListItems(listId);
    const index = items.findIndex(item => item.id === itemId);
    if (index === -1) throw new ItemNotFoundError(`No item found with id: ${itemId}`);

    return { items, index };
};
