import { Worker } from 'bullmq';
import nodemailer from 'nodemailer';
import { getEmailInfo } from '../utils/email.utils';
import { IRedisEmailValues } from '../utils/cache.utils';
import dotenv from 'dotenv';

dotenv.config({
    path:'../../.env'
});
import 'dotenv/config';
import SMTPTransport from 'nodemailer/lib/smtp-transport';

const redisConnection = { host: 'localhost', port: 4003 };

// Initialize Worker
const emailWorker = new Worker('email-qu', async job => {
    const { email } = job.data;
    const campaign_id = job.name; 

    
    const {title,body} = await getEmailInfo(campaign_id) as IRedisEmailValues;
    const transporterOptions:SMTPTransport.Options = {
        host: process.env.SMTP_HOST_URI,
        port: parseInt(process.env.SMTP_PORT as string),
        secure: true,
        // Use SSL/TLS
        auth: {
          user: process.env.EMAIL_WORKER_EMAIL,
          pass: process.env.EMAIL_WORKER_PASSWORD
        }
      }

      console.log(transporterOptions)
    var transporter = nodemailer.createTransport(transporterOptions);
    
    try {
        await transporter.sendMail({
            from: 'info@shecodeshacks.com',
            to: email,
            subject: title,
            html: body
        });
        console.log(`Email sent to ${email}`);
    } catch (error) {
        console.error(`Failed to send email to ${email}:`, error);
        throw error;
    }

    console.log("email sent")
}, { connection: redisConnection });



emailWorker.on('failed', (job, err) => {
    // Ensure job is defined before accessing its properties
    if (job) {
        console.error(`Job ${job.id} failed with error ${err.message}`);
    } else {
        console.error(`Job failed with error ${err.message}`);
    }
});

emailWorker.on('ready',()=>{
    console.log("ready")
})


console.log('Email worker started');
