import { Request, Response } from 'express';
import { EmailAccount, IEmailAccount } from '../models/EmailAccount';
import { Email, IEmail } from '../models/Email';
import { ImapFlow } from 'imapflow';
import { AddressObject,simpleParser } from 'mailparser';
import nodemailer from 'nodemailer';

export const getMessagesListController = async (req: Request, res: Response) => {
  const { emailID } = req.params;
  try {
    const messages = await Email.find({ to: emailID })
      .sort({ date: -1 })
      .limit(10)
      .select('subject from fromName date messageID');
    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch messages list' });
  }
};

export const getThreadController = async (req: Request, res: Response) => {
  const { emailID, threadID } = req.params;
  try {
    const thread = await Email.find({
      $or: [
        { messageID: threadID },
        { references: threadID }
      ]
    }).sort({ date: 1 });
    res.status(200).json(thread);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch thread' });
  }
};

export const replyController = async (req: Request, res: Response) => {
  const { from, to, subject, replyText, messageID } = req.body;
  try {
    const account = await EmailAccount.findOne({ email: from });
    if (!account) {
      return res.status(404).json({ error: 'Email account not found' });
    }

    const transporter = nodemailer.createTransport({
      host: account.smtpURI,
      port: parseInt(account.smtpPort),
      secure: true,
      auth: {
        user: account.email,
        pass: account.password
      }
    });

    const info = await transporter.sendMail({
      from,
      to,
      subject,
      html: replyText,
      inReplyTo:messageID,
      references: messageID
    });

    const newEmail = new Email({
      from,
      to,
      subject,
      replyText,
      messageID: info.messageId,
      references: [messageID],
      inReplyTo: messageID,
      seq: 0, // This will be updated when syncing
      date: new Date()
    });
    await newEmail.save();

    res.status(200).json({ message: 'Reply sent successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to send reply' });
  }
};
export const syncEmailController = async (req: Request, res: Response) => {
  const { emailID } = req.params;
  try {
    const account = await EmailAccount.findOne({ email: emailID });
    if (!account) {
      return res.status(404).json({ error: 'Email account not found' });
    }

    const client = new ImapFlow({
      host: account.imapURI,
      port: parseInt(account.imapPort),
      secure: true,
      auth: {
        user: account.email,
        pass: account.password
      }
    });

    await client.connect();
    let lock = await client.getMailboxLock('INBOX');
    try {
      // Get the highest seq number of the emails already saved
      const highestSeqEmail = await Email.findOne({}).sort('-seq').exec();
      const highestSeq = highestSeqEmail ? highestSeqEmail.seq : 0;

      const messages = client.fetch(
        { seq: `${highestSeq}:*`}, // Fetch emails with seq greater than the highest saved seq
        { source: true }
      );

      for await (let message of messages) {
        const parsed = await simpleParser(message.source);
      
        const toAddresses = Array.isArray(parsed.to) ? parsed.to : [parsed.to];
        const ccAddresses = Array.isArray(parsed.cc) ? parsed.cc : [parsed.cc];
        const bccAddresses = Array.isArray(parsed.bcc) ? parsed.bcc : [parsed.bcc];
  
        const newEmail = new Email({
          from: parsed.from?.value[0]?.address || '',
          fromName: parsed.from?.value[0]?.name || '',
          to: toAddresses.flatMap(to => to?.value.map(addr => addr.address || '')).filter(Boolean),
          toNames: toAddresses.flatMap(to => to?.value.map(addr => addr.name || '')).filter(Boolean),
          subject: parsed.subject || '',
          htmlBody: parsed.html || parsed.textAsHtml || '',
          textBody: parsed.text ,
          messageID: parsed.messageId || '',
          references: parsed.references || [],
          cc: ccAddresses.flatMap(cc => cc?.value.map(addr => addr.address || '')).filter(Boolean),
          bcc: bccAddresses.flatMap(bcc => bcc?.value.map(addr => addr.address || '')).filter(Boolean),
          inReplyTo: parsed.inReplyTo || '',
          seq: message.seq,
          date: parsed.date || new Date()
        });
        
        await newEmail.save();
      }
    } catch (err) {
      console.log('Error:', err);
    } finally {
      lock.release();
    }
    await client.logout();

    // Update the last synced date to the current time
    account.lastSyncedAt = new Date();
    await account.save();

    res.status(200).json({ message: 'Emails synced successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to sync emails' });
  }
};