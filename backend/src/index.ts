import express from 'express';
import toDoListRoutes from './routes/toDoListRoutes';
import { errorHandler } from './middleware/errorHandler';

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use('/api', toDoListRoutes);
app.use(errorHandler);

if (require.main === module) {
  app.listen(port, () => console.log(`Server running on port ${port}`));
}

export default app;
