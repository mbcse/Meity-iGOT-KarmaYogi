import { Worker } from 'bullmq';
import { getSmsInfo } from '../utils/sms.utils';
import { ISmsCacheValues } from '../utils/cache.utils';
import fs from 'fs';

const redisConnection = { host: 'localhost', port: 4003 };

  
// Initialize Worker
const smsWorkers = new Worker('sms-qu', async job => {
    
    const { phoneNumber } = job.data;
    const campaign_id = job.name; 

    const {body} = await getSmsInfo(campaign_id) as ISmsCacheValues;

    try {
        // Function to write logs in the specified format
        const writeLog = (to: string, body: string) => {
            const log = ` ${to} - ${body}\n`;
            fs.appendFileSync('./dmp.message.log', log);
        };

        // Usage example
        writeLog(phoneNumber, body);
        console.log(`SMS sent to ${phoneNumber}`);
    } catch (error) {
        console.error(`Failed to send SMS to ${phoneNumber}:`, error);
        throw error;
    }
}, { connection: redisConnection });



smsWorkers.on('failed', (job, err) => {
    // Ensure job is defined before accessing its properties
    if (job) {
        console.error(`Job ${job.id} failed with error ${err.message}`);
    } else {
        console.error(`Job failed with error ${err.message}`);
    }
});

smsWorkers.on('ready',()=>{
    console.log("ready")
})


console.log('Email worker started');
