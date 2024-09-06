import { Router } from 'express';
import { setupAccountController, fetchInitController, getAllAccountsController } from '../controllers/setup.controllers';

export const setupRouter = Router();

setupRouter.get('/accounts', getAllAccountsController);
setupRouter.post('/account', setupAccountController);
setupRouter.post('/fetchinit', fetchInitController);