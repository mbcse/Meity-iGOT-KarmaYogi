import { Router } from 'express';
import { 
  getMessagesListController, 
  getThreadController, 
  getMessagesInThreadController,
  syncEmailController,
  syncEmailControllerByDate
} from '../controllers/email.controllers';
import { Request, Response } from 'express';
import { EmailAccount, IEmailAccount } from '../models/EmailAccount';
import { Email, IEmail } from '../models/Email';
import { ImapFlow } from 'imapflow';
import { AddressObject,simpleParser,EmailAddress } from 'mailparser';
import nodemailer from 'nodemailer';



export const chatRouter = Router();

// Route to get the list of messages for a specific email ID
chatRouter.get('/:emailID/messagesList', getMessagesListController);

chatRouter.get('/:emailID/threads', getThreadController);
chatRouter.get('/thread/:emailID/:threadID', getMessagesInThreadController);
// Route to reply to an email

chatRouter.post('/reply', async (req: Request, res: Response) => {
  const { from, to, subject, replyText, messageID, threadID } = req.body;

  try {
    const account = await EmailAccount.findOne({ email: from });
    if (!account) {
      return res.status(404).json({ error: 'Email account not found' });
    }

    const transporter = nodemailer.createTransport({
      host: account.smtpURI,
      port: parseInt(account.smtpPort as string, 10),
      secure: true,
      auth: {
        user: account.email,
        pass: account.password,
      },
    });

    const info = await transporter.sendMail({
      from,
      to,
      subject,
      html: replyText,
      inReplyTo: messageID,
      references: [messageID],
    });

    const newEmail = new Email({
      from: { address: from, name: '' },
      to: Array.isArray(to) ? to.map(address => ({ address, name: '' })) : [{ address: to, name: '' }],
      subject,
      htmlBody: replyText,
      messageID: info.messageId,
      references: [messageID],
      inReplyTo: messageID,
      seq: 0, // This will be updated when syncing
      date: new Date(),
      thread: threadID || '',
    });

    await newEmail.save();

    res.status(200).json({ message: 'Reply sent successfully', email: newEmail });
  } catch (error) {
    console.error('Error in /chat/reply:', error);
    res.status(500).json({ error: 'Failed to send reply' });
  }
});
  

// Route to sync emails for a specific email ID
chatRouter.get('/syncemail/:emailID', syncEmailController);
chatRouter.get('/syncemail/cron/:emailID', syncEmailControllerByDate);
