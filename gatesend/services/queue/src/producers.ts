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

export interface I_SMSQueue {
    phoneNumberList: I_SMS[];
    campaign_id: string;
}

export interface I_WhatsappQueue {
    phoneNumberList: I_Whatsapp[];
    campaign_id: string;
}

export function addEmailToQueue({ emailList, campaign_id }: I_EmailQueue) {
    emailList.forEach(async (email: I_Email) => {
        try {
            const res = await EmailQueue.add(campaign_id, { email: email });
            console.log(res.data)
        } catch (error) {
            console.error(`Failed to add email ${email.email} to queue:`, error);
        }
    });
}

export function addSMSToQueue({ phoneNumberList, campaign_id }: I_SMSQueue) {
    phoneNumberList.forEach(async (phoneNumber: I_SMS) => {
        try {
            await SMSQueue.add(campaign_id, { phoneNumber: phoneNumber });
        } catch (error) {
            console.error(`Failed to add SMS ${phoneNumber} to queue:`, error);
        }
    });
}

export function addWhatsappToQueue({ phoneNumberList, campaign_id }: I_WhatsappQueue) {
    phoneNumberList.forEach(async (phoneNumber: I_Whatsapp) => {
        try {
            await WhatsappQueue.add(campaign_id, { phoneNumber: phoneNumber });
        } catch (error) {
            console.error(`Failed to add WhatsApp ${phoneNumber} to queue:`, error);
        }
    });
}
