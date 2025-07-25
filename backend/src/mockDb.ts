import { ToDoList } from './models/ToDoList';

export const toDoLists: ToDoList[] = [
    {
        id: 'list-sample1',
        title: 'Sample To-Do List',
        items: [
            { id: 'item-sample1', content: 'Sample item 1', completed: false },
            { id: 'item-sample2', content: 'Sample item 2', completed: true },
        ],
    },
    {
        id: 'list-sample2',
        title: 'Another To-Do List',
        items: [
            { id: 'item-another1', content: 'Another item 1', completed: false },
            { id: 'item-another2', content: 'Another item 2', completed: false },
        ],
    },
];