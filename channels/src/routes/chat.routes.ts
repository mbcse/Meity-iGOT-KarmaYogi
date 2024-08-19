import { Router } from 'express';
import {  getMessagesListController, getThreadController, replyController, syncEmailController } from '../controllers/email.controllers';

export const chatRouter = Router();



chatRouter.get('/:emailID/messagesList', getMessagesListController);
chatRouter.get('/threads/:emailID/:threadID', getThreadController);
chatRouter.post('/reply', replyController);
chatRouter.get('/syncemail/:emailID', syncEmailController);