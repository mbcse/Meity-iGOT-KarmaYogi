import { Worker } from 'bullmq';
import nodemailer from 'nodemailer';
import { getEmailInfo } from '../utils/email.utils';
import { IRedisEmailValues } from '../utils/cache.utils';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import {
  smtpHostUri,
  smtpPort,
  emailWorkerEmail,
  emailWorkerPassword,
} from './config'; // Import the variables from the config file

const redisConnection = { host: 'localhost', port: 4003 };

const transporterOptions: SMTPTransport.Options = {
    host: smtpHostUri,
    port: parseInt(smtpPort as string),
    secure: true, // Use SSL/TLS
    auth: {
      user: emailWorkerEmail,
      pass: emailWorkerPassword,
    },
  };

  console.log("Transporter Options: ", transporterOptions);
// Initialize Worker
const emailWorker = new Worker('email-qu', async (job) => {
  console.log("In email worker");
  console.log(job);

  const { item, template }: { item: string; template: string } = job.data;
  console.log(`Processing email job for ${item}`);
  const campaign_id = job.name;
  console.log(`Campaign ID: ${campaign_id}`);

  const { title, body } = await getEmailInfo(campaign_id, template) as IRedisEmailValues;
  console.log(`Email title: ${title}`);
  console.log(`Email body: ${body}`);


  const transporter = nodemailer.createTransport(transporterOptions);

  try {
    console.log({
      from: 'info@shecodeshacks.com',
      to: item,
      subject: title,
      html: body,
    });

    // Uncomment to actually send the email
    await transporter.sendMail({
      from: 'info@shecodeshacks.com',
      to: item,
      subject: title,
      html: body,
    });

    console.log(`Email sent to ${item}`);
  } catch (error) {
    console.error(`Failed to send email to ${item}:`, error);
    throw error;
  }

  console.log("email sent");
}, { connection: redisConnection });

emailWorker.on('failed', (job, err) => {
  if (job) {
    console.error(`Job ${job.id} failed with error ${err.message}`);
  } else {
    console.error(`Job failed with error ${err.message}`);
  }
});

emailWorker.on('ready', () => {
  console.log("ready");
});

console.log('Email worker started');
