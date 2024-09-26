import express, { Request, Response } from 'express';
import { addEmailToQueue, addSMSToQueue, addWhatsappToQueue, addEmailToQueue_NonCampaign } from '../utils/producers';
import axios from 'axios';

const producerRouter = express.Router();

export async function handleQueueRequest(req: Request, res: Response, addToQueue: Function, successMessage: string, typeOfList: string) {
    try {
        const payload = req.body;
        console.log(payload);

        const bucket = payload.bucketName;
        const response = await axios.post(`http://localhost:3000/api/db/showview/get${typeOfList}`, { bucketName: bucket });
        console.log("response", response.data);

        let camptype = typeOfList.slice(0, -4);

        if (camptype === "whatsapp" || camptype === "sms") {
            camptype = "number";
        }

        const listarr = response.data.map((element: any) => element[camptype]);

        const queue_payload = {
            [`${camptype}List`]: listarr,
            "work_type": payload.work_type,
            "sub_campaign_id": payload.sub_campaign_id
        };

        console.log("queue_payload", queue_payload);

        await addToQueue(queue_payload);

        // Ensure the response is sent in JSON format
        return JSON.stringify({ message: successMessage });
    } catch (error) {
        console.error('Error adding to queue:', error);
        return error;
    }
}


producerRouter.get('/health', (req, res) => {
    res.json('healthy');
});

producerRouter.post('/add/email', (req, res) => handleQueueRequest(req, res, addEmailToQueue, 'Emails added to queue', "emaillist"));
producerRouter.post('/add/sms', (req, res) => handleQueueRequest(req, res, addSMSToQueue, 'SMS added to queue', "smslist"));
producerRouter.post('/add/whatsapp', (req, res) => handleQueueRequest(req, res, addWhatsappToQueue, 'WhatsApp messages added to queue', "whatsapplist"));
producerRouter.post('/push/auxiliary-emails', (req, res) => handleQueueRequest(req, res, addEmailToQueue_NonCampaign, 'Auxiliary emails added to queue', "emaillist"));

export default producerRouter;
