import { Router } from 'express';
import { 
  getMessagesListController, 
  getThreadController, 
  syncEmailController,
  replyToEmailController,
  getMessagesInThreadController
} from '../controllers/email.controllers';

export const chatRouter = Router();

chatRouter.get('/:emailID/messagesList', getMessagesListController);
chatRouter.get('/:emailID/threads', getThreadController);
chatRouter.get('/thread/:emailID/:threadID', getMessagesInThreadController);
chatRouter.post('/reply', replyToEmailController);
chatRouter.get('/syncemail/:emailID', syncEmailController);