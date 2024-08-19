import { Router } from 'express';
import { setupAccountController, fetchInitController } from '../controllers/setup.controllers';

export const setupRouter = Router();


setupRouter.post('/account', setupAccountController);
setupRouter.post('/fetchinit', fetchInitController);