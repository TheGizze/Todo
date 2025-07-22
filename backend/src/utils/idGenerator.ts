import { nanoid } from 'nanoid';

export const generateListId = () => `list-${nanoid(8)}`;
export const generateItemId = () => `item-${nanoid(8)}`;