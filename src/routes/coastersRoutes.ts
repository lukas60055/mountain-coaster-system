import { Router } from 'express';
import {
  registerCoaster,
  updateCoaster,
} from '../controllers/CoastersController';

const router = Router();

router.post('/', registerCoaster);

router.put('/:coasterId', updateCoaster);

export default router;
