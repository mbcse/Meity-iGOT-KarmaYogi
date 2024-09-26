import { Queue } from 'bullmq';

const redisConnection = { host: 'localhost', port: 4003 };

const EmailQueue = new Queue('email-qu', { connection: redisConnection });
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
}

export interface I_EmailQueue_NC {
    email: string[];
    work_type: string;
}


export interface I_SMSQueue {
    numberList: string[];
    sub_campaign_id: string;
}

export interface I_WhatsappQueue {
    numberList: string[];
    sub_campaign_id: string;
}

async function addItemsToQueue(queue: Queue, items: any[], sub_campaign_id: string) {
    const results = [];
    for (const item of items) {
        try {
            const result = await queue.add(sub_campaign_id, item);
            results.push(result);
        } catch (error) {
            console.error(`Failed to add item ${JSON.stringify(item)} to queue:`, error);
        }
    }
    return results;
}

export async function addEmailToQueue({ emailList, sub_campaign_id }: I_EmailQueue) {
    return await addItemsToQueue(EmailQueue, emailList, sub_campaign_id);
}

export async function addSMSToQueue({ numberList, sub_campaign_id }: I_SMSQueue) {
    console.log("smslist",numberList)
    return await addItemsToQueue(SMSQueue, numberList, sub_campaign_id);
}

export async function addWhatsappToQueue({ numberList, sub_campaign_id }: I_WhatsappQueue) {
    return await addItemsToQueue(WhatsappQueue, numberList, sub_campaign_id);
}

async function addItemsToQueue_NonCampaign(queue: Queue, item: any, work_type: string) {
   
        try {
            const result = await queue.add(work_type, item);
            return result;
        } catch (error) {
            console.error(`Failed to add item ${JSON.stringify(item)} to queue:`, error);
        }
   
}

export async function addEmailToQueue_NonCampaign({ email, work_type }: I_EmailQueue_NC) {
    return await addItemsToQueue_NonCampaign(EmailQueue, email , work_type);
}
