import { Request, Response } from 'express';
import { EmailAccount, IEmailAccount } from '../models/EmailAccount';
import { Email, IEmail } from '../models/Email';
import { ImapFlow } from 'imapflow';
import { simpleParser,AddressObject,EmailAddress } from 'mailparser';
import nodemailer from 'nodemailer';
import { generateThreadId } from '../models/Email';

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
      port: parseInt(account.imapPort as string),
      secure: true,
      auth: {
        user: account.email,
        pass: account.password,
      },
    });

    await client.connect();
    let lock = await client.getMailboxLock('INBOX');
    try {
      // Define the date 30 days ago
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      // Fetch messages from the last 30 days
      const messages = client.fetch({ since: thirtyDaysAgo }, { source: true });
      
      const emailThreadIds = new Set<string>();

      for await (let message of messages) {
        const parsed = await simpleParser(message.source);

        // Extract addresses function
        const extractAddresses = (addresses: AddressObject | AddressObject[] | undefined): EmailAddress[] => {
          if (!addresses) return [];
          if (Array.isArray(addresses)) {
            return addresses.flatMap(address => address.value);
          }
          return addresses.value;
        };

        // Map addresses function
        const mapAddresses = (addresses: AddressObject | AddressObject[] | undefined): { address: string; name: string }[] => {
          return extractAddresses(addresses).map(addr => ({
            address: addr.address || '',
            name: addr.name || ''
          })).filter(addr => addr.address !== ''); // Ensure no empty addresses are included
        };

        // Determine the thread ID
        const threadId = generateThreadId(parsed);
        emailThreadIds.add(threadId);

        const newEmail = new Email({
          from: parsed.from?.value[0] ? {
            address: parsed.from.value[0].address,
            name: parsed.from.value[0].name
          } : { address: '', name: '' },
          to: mapAddresses(parsed.to),
          cc: mapAddresses(parsed.cc),
          bcc: mapAddresses(parsed.bcc),
          subject: parsed.subject || '',
          htmlBody: parsed.html || parsed.textAsHtml || '',
          textBody: parsed.text || '',
          messageID: parsed.messageId || '',
          references: parsed.references || [],
          inReplyTo: parsed.inReplyTo || '',
          seq: message.seq,
          date: parsed.date || new Date(),
          threadId,
        });

        // Save email
        await newEmail.save();
      }

      // Fetch all emails in the identified threads
      const threadsEmails = await Email.find({ threadId: { $in: Array.from(emailThreadIds) } }).sort({ date: 1 });

      res.status(200).json({ message: 'Initial emails fetched successfully', emails: threadsEmails });
    } finally {
      lock.release();
    }
    await client.logout();

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch initial emails' });
  }
};  