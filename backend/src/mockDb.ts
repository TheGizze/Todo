import { ToDoList } from './models/ToDoList';

export const toDoLists: ToDoList[] = [
    {
        id: '1',
        title: 'Sample To-Do List',
        items: [
            { id: '1', content: 'Sample item 1', completed: false },
            { id: '2', content: 'Sample item 2', completed: true },
        ],
    },
    {
        id: '2',
        title: 'Another To-Do List',
        items: [
            { id: '1', content: 'Another item 1', completed: false },
            { id: '2', content: 'Another item 2', completed: false },
        ],
    },
];