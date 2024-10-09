import { Router } from 'express';
import coastersRouter from './coastersRoutes';
import wagonsRouter from './wagonsRoutes';

const router = Router();

router.get('/', (req, res) => res.sendStatus(200));

router.use('/coasters', coastersRouter);
coastersRouter.use('/:coasterId/wagons', wagonsRouter);

export default router;
