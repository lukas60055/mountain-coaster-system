import { Router } from 'express';
import { registerWagon, deleteWagon } from '../controllers/WagonsController';

const router = Router({ mergeParams: true });

router.post('/', registerWagon);

router.delete('/:wagonId', deleteWagon);

export default router;
