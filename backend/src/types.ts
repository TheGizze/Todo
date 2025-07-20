export interface ToDoList {
  id: string;
  title: string;
  items: ToDoItem[];
}

export interface ToDoItem {
  id: string;
  content: string;
  completed: boolean;
}
