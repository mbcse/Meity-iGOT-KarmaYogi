import express, { Request, Response } from 'express';
import { addEmailToQueue, addSMSToQueue, addWhatsappToQueue,addEmailToQueue_NonCampaign} from '../utils/producers';


const producerRouter = express.Router();


async function handleQueueRequest(req: Request, res: Response, addToQueue: Function, successMessage: string) {
    try {
        const payload = req.body;
        await addToQueue(payload);
        res.status(200).send(successMessage);
    } catch (error) {
        console.error('Error adding to queue:', error);
        res.status(500).send('Failed to add to queue');
    }
}

producerRouter.get('/health', (req, res) => {res.json('healthy')});

producerRouter.post('/add/email', (req, res) => handleQueueRequest(req, res, addEmailToQueue, 'Emails added to queue'));
producerRouter.post('/add/sms', (req, res) => handleQueueRequest(req, res, addSMSToQueue, 'SMS added to queue'));
producerRouter.post('/add/whatsapp', (req, res) => handleQueueRequest(req, res, addWhatsappToQueue, 'WhatsApp messages added to queue'));
producerRouter.post('/push/auxiliary-emails', (req, res) => handleQueueRequest(req, res, addEmailToQueue_NonCampaign, 'Auxiliary emails added to queue'));



export default producerRouter;