import { Request, Response } from 'express';
import { EmailAccount, IEmailAccount } from '../models/EmailAccount';
import { Email, IEmail } from '../models/Email';
import { ImapFlow } from 'imapflow';
import { simpleParser, AddressObject, EmailAddress } from 'mailparser';
import nodemailer from 'nodemailer';
import { generateThreadId } from '../models/Email';

export const setupAccountController = async (req: Request, res: Response) => {
  try {
    const accountData: IEmailAccount = req.body;
    const newAccount = new EmailAccount(accountData);

    // Attempt to connect and sync emails
    const syncResult = await syncEmails(accountData);

    if (syncResult.success) {
      newAccount.lastSyncedAt = new Date();
      await newAccount.save();
      res.status(201).json({ message: 'Email account setup successfully', emails: syncResult.emails });
    } else {
      res.status(400).json({ error: syncResult.error });
    }
  } catch (error) {
    res.status(500).json({ error: 'An unexpected error occurred' });
  }
};

async function syncEmails(accountData: IEmailAccount) {
  const emailsToInsert: IEmail[] = [];
  
  try {
    const client = new ImapFlow({
      host: accountData.imapURI,
      port: parseInt(accountData.imapPort as string),
      secure: true,
      auth: {
        user: accountData.email,
        pass: accountData.password,
      },
    });

    await client.connect();
    let lock = await client.getMailboxLock('INBOX');

    try {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      const messages = client.fetch({ since: thirtyDaysAgo }, { source: true });
      
      const emailThreadIds = new Set<string>();

      for await (let message of messages) {
        const parsed = await simpleParser(message.source);
        const threadId = generateThreadId(parsed);
        emailThreadIds.add(threadId);

        const newEmail = new Email({
          from: parsed.from?.value[0]
            ? {
                address: parsed.from.value[0].address,
                name: parsed.from.value[0].name,
              }
            : { address: '', name: '' },
          to: mapAddresses(parsed.to),
          cc: mapAddresses(parsed.cc),
          bcc: mapAddresses(parsed.bcc),
          subject: parsed.subject || '',
          htmlBody: parsed.html || parsed.textAsHtml || '',
          textBody: parsed.text || '',
          messageID: parsed.messageId || 'unknown-message-id', // Provide default if missing
          references: parsed.references || [],
          inReplyTo: parsed.inReplyTo || '',
          seq: message.seq,
          date: parsed.date || new Date(),
          threadId,
        });

        emailsToInsert.push(newEmail);
      }

      if (emailsToInsert.length > 0) {
        await Email.insertMany(emailsToInsert);
      }

      return { success: true, emails: emailsToInsert };
    } finally {
      lock.release();
      await client.logout();
    }
  } catch (error) {
    console.log('Error syncing emails:', error);
    if (error instanceof Error) {
      if (error.message.includes('Invalid credentials')) {
        return { success: false, error: 'Invalid email or password' };
      } else if (error.message.includes('Connection timed out')) {
        return { success: false, error: 'Connection timed out. Please check your IMAP settings' };
      }
    }

    return { success: false, error: 'Failed to connect to the email server' };
  }
}


function mapAddresses(addresses: AddressObject | AddressObject[] | undefined): { address: string; name: string }[] {
  if (!addresses) return [];
  const extractedAddresses = Array.isArray(addresses) ? addresses.flatMap(address => address.value) : addresses.value;
  return extractedAddresses
    .map(addr => ({ address: addr.address || '', name: addr.name || '' }))
    .filter(addr => addr.address !== '');
}

export const getAllAccountsController = async (req: Request, res: Response) => {
  try {
    const accounts = await EmailAccount.find().select('-password'); // Exclude the password field
    res.status(200).json(accounts);
  } catch (error) {
    res.status(500).json({ error: error });
  }
};
