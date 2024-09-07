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
} from '../config';

const prisma = new PrismaClient();

// Configure the email transporter options
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
    orcpt: orcptEmail as string,
  },
};

console.log("Transporter Options: ", transporterOptions);

let emailNo = 1; // Counter for email number in the campaign

const emailWorker = new Worker(
  emailQueueName,
  async (job) => {
    let sentEmailCount = 0; // Counter for each job
    const { item, template, sender }: { item: string; template: string; sender: string } = job.data;
    const campaign_id = job.name;
    const msgNo = 0; // Since this is the first message in the thread

    try {
      // Update the campaign status to 'running'
      await prisma.emailCampaign.update({
        where: { id: campaign_id },
        data: { status: CampaignStatus.running },
      });

      const { body, title } = (await getEmailInfo(campaign_id, template)) as IRedisEmailValues;

      const transporter = nodemailer.createTransport(transporterOptions);

      // Generate pixel tracking URL
      const trackingPixelUrl = `https://services.shivamja.in/pixels/email/${campaign_id}`;
      const pixelImageTag = `<img src="${trackingPixelUrl}" alt="" width="1" height="1" style="display:none;">`;

      // More robust pixel injection (in case body structure changes)
      const emailBodyWithPixel = body.includes('</body>')
        ? body.replace('</body>', `${pixelImageTag}</body>`)
        : `${body}${pixelImageTag}`;

      // Generate custom Message-ID
      const customMessageID = `<${campaign_id}.${emailNo}.${msgNo}@shecodeshacks.com>`;

      // Send email with custom X-Thread-ID and Message-ID headers
      await transporter.sendMail({
        from: sender,
        to: item,
        subject: title,
        html: emailBodyWithPixel,
        headers: {
          'Return-Path': orcptEmail,
          'X-Campaign-id': campaign_id,
          'X-Thread-ID': `${campaign_id}-${emailNo}-${msgNo}`, // Custom header
          'Message-ID': customMessageID, // Custom Message-ID
        },
        replyTo: replyToEmail,
      });

      sentEmailCount++;
      emailNo++; // Increment the email number for the next email

      console.log(`Email successfully sent to ${item}`);
    } catch (error) {
      console.error(`Failed to send email to ${item}:`, error);
      // Update campaign status to 'failed' and rethrow the error to BullMQ
      await prisma.emailCampaign.update({
        where: { id: campaign_id },
        data: { status: CampaignStatus.failed },
      });
      throw new Error(`Failed to send email for campaign ${campaign_id}: ${error}`);
    }

    return sentEmailCount; // Return count to be used by job completion event
  },
  {
    connection: {
      host: redisHost,
      port: parseInt(redisPort as string),
      username: redisUsername,
      password: redisPassword,
    },
  }
);

// Event listener for when the job fails
emailWorker.on('failed', async (job, err) => {
  if (job) {
    console.error(`Job ${job.id} failed with error: ${err.message}`);
    // Update campaign status to 'failed'
    await prisma.emailCampaign.update({
      where: { id: job.name },
      data: { status: CampaignStatus.failed },
    });
  } else {
    console.error(`Job failed with error: ${err.message}`);
  }
});

// Event listener for when the job completes successfully
emailWorker.on('completed', async (job, result) => {
  const sentEmailCount = result || 0; // Use the count returned by the job

  if (job) {
    console.log(`Job ${job.id} completed successfully.`);
    // Update campaign status and targeted count
    await prisma.emailCampaign.update({
      where: { id: job.name },
      data: {
        status: CampaignStatus.completed,
        targeted: sentEmailCount,
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
