import { Queue } from 'bullmq';
import { emailQueueName, redisHost, redisPort } from '../config';

const redisConnection = { host: redisHost, port: parseInt(redisPort) };
const EmailQueue = new Queue(emailQueueName, { connection: redisConnection });
const SMSQueue = new Queue('sms-qu', { connection: redisConnection });
const WhatsappQueue = new Queue('whatsapp-qu', { connection: redisConnection });

export interface I_Email {
    email: string;
}

export interface I_SMS {
    phoneNumber: string;
}

export interface I_Whatsapp {
    phoneNumber: string;
}

export interface I_EmailQueue {
    emailList: string[];
    sub_campaign_id: string;
    template: string;
    scheduledAt: Date; // Add scheduled date and time
}

export interface I_EmailQueue_NC {
    email: string[];
    work_type: string;
    template: string;
    scheduledAt: Date; // Add scheduled date and time
}

export interface I_SMSQueue {
    numberList: string[];
    sub_campaign_id: string;
    template: string;
    scheduledAt: Date; // Add scheduled date and time
}

export interface I_WhatsappQueue {
    numberList: string[];
    sub_campaign_id: string;
    template: string;
    scheduledAt: Date; // Add scheduled date and time
}
async function addItemsToQueue(
    queue: Queue,
    items: any[],
    sub_campaign_id: string,
    template: string,
    scheduledAt: Date
) {
    const istOffset = 5.5 * 60 * 60 * 1000; // IST offset in milliseconds

    // Convert scheduledAt from UTC to IST
    const scheduledDateUTC = new Date(scheduledAt);
    const scheduledDateIST = new Date(scheduledDateUTC.getTime() + istOffset);

    // Get current time in IST
    const currentTimeUTC = new Date();
    const currentTimeIST = new Date(currentTimeUTC.getTime() + istOffset);

    // Calculate delay in milliseconds
    const delayIST = scheduledDateIST.getTime() - currentTimeIST.getTime();
    const delayUTC = scheduledDateUTC.getTime() - currentTimeIST.getTime();

    // Log the variables for debugging
    console.log(`scheduledAt (UTC): ${scheduledDateUTC.toISOString()}`);
    console.log(`scheduledAt (IST): ${scheduledDateIST.toISOString()}`);
    console.log(`currentTime (UTC): ${currentTimeUTC.toISOString()}`);
    console.log(`currentTime (IST): ${currentTimeIST.toISOString()}`);
    console.log(`Calculated delay (milliseconds): ${delayUTC}`);

    if (delayUTC < 0) {
        throw new Error("Scheduled time is in the past.");
    }

    const results = [];

    for (const item of items) {
        try {
            const jobData = {
                item,
                template,
                scheduledAt: scheduledDateIST.toISOString(), // Keep this in ISO format
            };
            const result = await queue.add(sub_campaign_id, jobData, { delay:delayUTC });
            results.push(result);
        } catch (error) {
            console.error(`Failed to add item ${JSON.stringify(item)} to queue:`, error);
            // Decide if you want to continue or break here
            // throw error; // Uncomment if you want to stop processing on the first failure
        }
    }

    return results;
}




export async function addEmailToQueue({ emailList, sub_campaign_id, template, scheduledAt }: I_EmailQueue) {
    return await addItemsToQueue(EmailQueue, emailList, sub_campaign_id, template, scheduledAt);
}

export async function addSMSToQueue({ numberList, sub_campaign_id, template, scheduledAt }: I_SMSQueue) {
    return await addItemsToQueue(SMSQueue, numberList, sub_campaign_id, template, scheduledAt);
}

export async function addWhatsappToQueue({ numberList, sub_campaign_id, template, scheduledAt }: I_WhatsappQueue) {
    return await addItemsToQueue(WhatsappQueue, numberList, sub_campaign_id, template, scheduledAt);
}

async function addItemsToQueue_NonCampaign(queue: Queue, item: any, work_type: string, scheduledAt: Date) {
    const delay = scheduledAt.getTime() - Date.now();

    try {
        const result = await queue.add(work_type, item, { delay });
        return result;
    } catch (error) {
        console.error(`Failed to add item ${JSON.stringify(item)} to queue:`, error);
        throw error;
    }
}

export async function addEmailToQueue_NonCampaign({ email, work_type, template, scheduledAt }: I_EmailQueue_NC) {
    const jobData = {
        email,
        template,
        scheduledAt,
    };
    return await addItemsToQueue_NonCampaign(EmailQueue, jobData, work_type, scheduledAt);
}
