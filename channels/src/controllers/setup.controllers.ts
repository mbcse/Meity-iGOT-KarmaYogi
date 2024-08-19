import { Request, Response } from 'express';
import { EmailAccount, IEmailAccount } from '../models/EmailAccount';
import { Email, IEmail } from '../models/Email';
import { ImapFlow } from 'imapflow';
import { AddressObject, simpleParser } from 'mailparser';
import nodemailer from 'nodemailer';

export const setupAccountController = async (req: Request, res: Response) => {
    try {
      const accountData: IEmailAccount = req.body;
      const newAccount = new EmailAccount(accountData);
      await newAccount.save();
      res.status(201).json({ message: 'Email account setup successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to setup email account' });
    }
  };
  
  export const fetchInitController = async (req: Request, res: Response) => {
    const { email } = req.body;

    try {
      const account = await EmailAccount.findOne({ email: email });
      
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
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        const messages = client.fetch({ since: thirtyDaysAgo }, { source: true });
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
      } finally {
        lock.release();
      }
      await client.logout();
  
      res.status(200).json({ message: 'Initial emails fetched successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to fetch initial emails' });
    }
  };
  