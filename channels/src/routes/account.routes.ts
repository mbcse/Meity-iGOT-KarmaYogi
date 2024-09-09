import { Router } from 'express';
import {getAccountsController} from '../controllers/accounts.controllers';

export const accountRouter = Router();

accountRouter.get('/:chatCommType', getAccountsController);
