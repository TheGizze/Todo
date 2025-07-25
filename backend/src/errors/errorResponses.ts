// errors/messages.ts
export const errors = {
  listNotFound: (id: string) => ({message: `No list found with id: ${id}`}),
  itemNotFound: (id: string) => ({message: `No item found with id: ${id}`}),
  invalidListName: (validationErrors: string[]) => ({message: 'invalid name', violations: validationErrors}),
  invalidItemContent: (validationErrors: string[]) => ({message: 'invalid content', violations: validationErrors}),
  missingValues: (values: string[]) => ({message: 'request body missing values', missingValues: values}),
  listOrItemNotFound: (listId: string, itemId: string) => ({message: `No list ${listId} or item ${itemId} found`})
};