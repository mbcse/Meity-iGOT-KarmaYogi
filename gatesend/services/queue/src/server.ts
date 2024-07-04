import express, { Request, Response } from 'express';
import { addEmailToQueue, addSMSToQueue, addWhatsappToQueue, I_EmailQueue, I_SMSQueue, I_WhatsappQueue } from './producers';

const app = express();
const port = 3080;

// Middleware to parse JSON bodies
app.use(express.json());

// Endpoint to add emails to queue
app.post('/add-email', (req: Request, res: Response) => {
    const payload: I_EmailQueue = req.body;
    addEmailToQueue(payload);
    res.status(200).send('Emails added to queue');
});

// Endpoint to add SMS to queue
app.post('/add-sms', (req: Request, res: Response) => {
    const payload: I_SMSQueue = req.body;
    addSMSToQueue(payload);
    res.status(200).send('SMS added to queue');
});

// Endpoint to add WhatsApp messages to queue
app.post('/add-whatsapp', (req: Request, res: Response) => {
    const payload: I_WhatsappQueue = req.body;
    addWhatsappToQueue(payload);
    res.status(200).send('WhatsApp messages added to queue');
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
