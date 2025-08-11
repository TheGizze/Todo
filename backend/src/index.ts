import 'dotenv/config'
import express from 'express';
import cors from 'cors';
import toDoListRoutes from './routes/toDoListRoutes';
import { errorHandler } from './middleware/errorHandling/errorHandler';
import { logger } from './utils/logger/logger';
import { requestLogger } from './middleware/logging/requestLogger';

const app = express();
const port = process.env.PORT || 3000;
app.use(cors());
app.use(requestLogger);
app.use(express.json());
app.use('/api', toDoListRoutes);
app.use(errorHandler);

if (require.main === module) {
  app.listen(port, () => logger.info({ port }, 'Server started successfully'));
}

export default app;
