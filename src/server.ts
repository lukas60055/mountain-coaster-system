import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import './config/logger';
import router from './routes/indexRoutes';
import NotFound from './middlewares/NotFound';
import { handleError } from './middlewares/ErrorHandler';
import { CheckRedisConnection } from './middlewares/CheckRedisConnection';
import { monitorCoasters } from './services/monitoringService';

dotenv.config();

const app = express();
const port = Number(process.env.PORT || '3050');

app.use(cors({ credentials: true }));

app.use(express.json({ limit: '200mb' }));
app.use(express.urlencoded({ limit: '200mb', extended: true }));

app.use(CheckRedisConnection);

app.use('/api', router);

app.use(NotFound);
app.use(handleError);

app.listen(port, () => {
  console.log(`Server running on port ${port} in ${process.env.NODE_ENV} mode`);
});

monitorCoasters();
