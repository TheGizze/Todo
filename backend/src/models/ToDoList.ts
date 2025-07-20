import { ToDoItem } from "./ToDoItem";

export interface ToDoList {
  id: string;
  title: string;
  items: ToDoItem[];
}