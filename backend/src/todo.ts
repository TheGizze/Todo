import express from 'express';
import { toDoLists } from './mockDb';
import * as helper from './helper';
import { ToDoList } from './types';

const app = express();
app.use(express.json());
const port = process.env.PORT || 3000;

let nextId: number = 2

app.get('/lists', (_req, res) => {
  return res.json(toDoLists);
});

app.get('/lists/:id', (req, res) => {
    const listId = req.params.id;
    const list = toDoLists.find(list => list.id === listId);
    if(list){
        res.statusCode = 200;
        return res.json(list);
    };
    res.statusCode = 404;
    return res.json({ message: `No lists with id: ${listId}` });
});

app.delete('/lists/:id', (req, res) => {
    const listId = req.params.id;
    const listIndex = toDoLists.findIndex((list) => list.id == listId);
    if(listIndex >= 0){
        res.statusCode = 200;
        return res.json(toDoLists.splice(listIndex)[0]);
    };
    res.statusCode = 404;
    return res.json({ message: `No lists with id: ${listId}` });
});

app.post('/lists', (req, res) => {

    if(!req.body.name){
      return res.status(400).json({message: 'request body must contain name'});
    }
    const violationMessages: string[] = helper.validateString(req.body.name);

    if(violationMessages.length > 0){
      return res.status(400).json({ message: 'invalid name', violations: violationMessages })
    }

    nextId++;

    const newlist: ToDoList = {
        id: nextId.toString(),
        title: req.body.name,
        items: []
    }

    toDoLists.push(newlist);
    return res.status(200).json(newlist);

});

// Only start the server if this file is run directly (not imported for testing)
if (require.main === module) {
  app.listen(port, () => console.log(`Backend running on port ${port}`));
}

// Export the app for testing
export default app;