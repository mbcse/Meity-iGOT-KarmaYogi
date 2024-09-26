import { Worker } from 'bullmq';
import nodemailer from 'nodemailer';
import { CampaignStatus, PrismaClient } from '@prisma/client';
import { getEmailInfo } from '../utils/email.utils';
import { IRedisEmailValues } from '../utils/cache.utils';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import {
  smtpHostUri,
  smtpPort,
  emailWorkerEmail,
  emailWorkerPassword,
  redisHost,
  redisPort,
  orcptEmail,
  emailQueueName,
  replyToEmail,
  redisUsername,
  redisPassword
} from '../config'; // Import the variables from the config file

const prisma = new PrismaClient();

const transporterOptions: SMTPTransport.Options = {
  host: smtpHostUri,
  port: parseInt(smtpPort as string),
  secure: true, // Use SSL/TLS
  auth: {
    user: emailWorkerEmail,
    pass: emailWorkerPassword,
  },
  dsn: {
    notify: ['FAILURE', 'DELAY'],
    orcpt: orcptEmail as string
  },
};

console.log("Transporter Options: ", transporterOptions);

let sentEmailCount = 0; // Counter for successful emails

const emailWorker = new Worker(emailQueueName, async (job) => {
  console.log("In email worker");
  console.log(job);

  const { item, template, sender }: { item: string; template: string; sender:string } = job.data;
  const campaign_id = job.name;

  // Update campaign status to "running"
  await prisma.emailCampaign.update({
    where: { id: campaign_id },
    data: { status: CampaignStatus.running },
  });

  const { body, title } = await getEmailInfo(campaign_id, template) as IRedisEmailValues;
  const transporter = nodemailer.createTransport(transporterOptions);

  try {
    console.log({
      from: sender,
      to: item,
      subject: title,
      html: body,     
    });

    await transporter.sendMail({
      from: sender,
      to: item,
      subject: title,
      html: body,
      headers: {
        'Return-Path': orcptEmail, // Set the Return-Path header
        'X-Campaign-id': campaign_id // Set the X-Campaign-id header
      },
      replyTo: replyToEmail
    });

    console.log(`Mail sent to ${item}`);
    sentEmailCount++; // Increment the counter for successful email

  } catch (error) {
    console.error(`Failed to send email to ${item}:`, error);
    throw new Error(`Failed to send emails for campaign ${campaign_id}`);
  }

}, { connection: {
  host: redisHost,
  port: parseInt(redisPort as string),
  username:redisUsername,
  password: redisPassword
}});

// Event listener for when the job fails
emailWorker.on('failed', async (job, err) => {
  console.log("Inside failed event listener");
  console.log(job);
  if (job) {
    console.error(`Job ${job.id} failed with error ${err.message}`);
    // Update the campaign status to 'failed' on job failure
    await prisma.emailCampaign.update({
      where: { id: job.name },
      data: { status: CampaignStatus.failed },
    });
  } else {
    console.error(`Job failed with error ${err.message}`);
  }
});

// Event listener for when the job completes successfully
emailWorker.on('completed', async (job) => {
  console.log("Inside completed event listener");
  console.log(job);
  console.log("Total emails sent: ", sentEmailCount);
  if (job) {
    console.log(`Job ${job.id} completed successfully.`);
    // Update the campaign status to 'completed' and update the targeted email count
    await prisma.emailCampaign.update({
      where: { id: job.name },
      data: {
        status: CampaignStatus.completed, // Set the status to 'completed'
        targeted: sentEmailCount, // Set the count of successfully sent emails
      },
    });
    console.log(`Email processing completed successfully. Total emails sent: ${sentEmailCount}`);
  }
});

// Event listener for when the worker is ready
emailWorker.on('ready', () => {
  console.log("Email worker ready");
});

console.log('Email worker started');
