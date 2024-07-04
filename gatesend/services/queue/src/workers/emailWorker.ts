import { Worker } from 'bullmq';
import nodemailer from 'nodemailer';

const redisConnection = { host: 'localhost', port: 4003 };

// Initialize Worker
const emailWorker = new Worker('email-qu', async job => {
    const { email } = job.data;
   
    try {
        console.log(`Email sent to ${email.email}`);
    } catch (error) {
        console.error(`Failed to send email to ${email.email}:`, error);
        throw error;
    }
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
