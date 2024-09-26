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
    emailList: I_Email[];
    campaign_id: string;
}

export interface I_EmailQueue_NC {
    email: I_Email[];
    work_type: string;
}


export interface I_SMSQueue {
    phoneNumberList: I_SMS[];
    campaign_id: string;
}

export interface I_WhatsappQueue {
    phoneNumberList: I_Whatsapp[];
    campaign_id: string;
}

async function addItemsToQueue(queue: Queue, items: any[], campaign_id: string) {
    const results = [];
    for (const item of items) {
        try {
            const result = await queue.add(campaign_id, item);
            results.push(result);
        } catch (error) {
            console.error(`Failed to add item ${JSON.stringify(item)} to queue:`, error);
        }
    }
    return results;
}

export async function addEmailToQueue({ emailList, campaign_id }: I_EmailQueue) {
    return await addItemsToQueue(EmailQueue, emailList.map(email => ({ email })), campaign_id);
}

export async function addSMSToQueue({ phoneNumberList, campaign_id }: I_SMSQueue) {
    console.log(phoneNumberList)
    return await addItemsToQueue(SMSQueue, phoneNumberList.map(phoneNumber => ({ phoneNumber })), campaign_id);
}

export async function addWhatsappToQueue({ phoneNumberList, campaign_id }: I_WhatsappQueue) {
    return await addItemsToQueue(WhatsappQueue, phoneNumberList.map(phoneNumber => ({ phoneNumber })), campaign_id);
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
