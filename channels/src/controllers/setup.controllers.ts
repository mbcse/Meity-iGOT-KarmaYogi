import { Request, Response } from 'express';
import { EmailAccount, IEmailAccount } from '../models/EmailAccount';
import { Email, IEmail } from '../models/Email';
import { ImapFlow } from 'imapflow';
import { simpleParser, AddressObject } from 'mailparser';
import { generateThreadId } from '../models/Email';

// Controller to set up an email account and sync its emails
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

async function fetchLatestEmail(accountData: IEmailAccount): Promise<{ latestSeq: number | null, emails: IEmail[] }> {
  const emailsToInsert: IEmail[] = [];
  let latestSeq: number | null = null;

  const client = new ImapFlow({
    host: accountData.imapURI,
    port: parseInt(accountData.imapPort as string),
    secure: true,
    auth: {
      user: accountData.email,
      pass: accountData.password,
    },
  });

  try {
    await client.connect();
    const lock = await client.getMailboxLock('INBOX');

    try {
      const latestMessages = client.fetch({ seq: '*' }, { source: true });

      for await (let message of latestMessages) {
        console.log('Processing message with SEQ:', message.seq);
        const parsed = await simpleParser(message.source);
        const inReplyTo = parsed.inReplyTo || '';

        // Skip emails that don't match the correct domain format
        if (!/^<fresh-[a-zA-Z0-9]+-\d+@shecodeshacks\.com>$/.test(inReplyTo)) {
          console.log(`Skipping email with Message-ID: ${inReplyTo} (not matching the pattern)`);
          continue;
        }

        const newEmail = new Email({
          from: mapAddress(parsed.from),
          to: mapAddresses(parsed.to),
          cc: mapAddresses(parsed.cc),
          bcc: mapAddresses(parsed.bcc),
          subject: parsed.subject || '',
          htmlBody: parsed.html || parsed.textAsHtml || '',
          textBody: parsed.text || '',
          messageID: parsed.messageId || 'unknown-message-id',
          references: parsed.references || [],
          inReplyTo,
          seq: message.seq,
          date: parsed.date || new Date(),
          threadId: generateThreadId(parsed.inReplyTo),
        });

        emailsToInsert.push(newEmail);
        console.log(`Processed latest email with SEQ: ${message.seq}`);
        latestSeq = message.seq;
        break; // Stop after processing the latest email
      }

      return { latestSeq, emails: emailsToInsert };
    } finally {
      await lock.release();
    }
  } catch (error) {
    console.log('Error fetching latest email:', error);
    return { latestSeq: null, emails: [] };
  } finally {
    await client.logout();
  }
}

async function fetchRemainingEmails(accountData: IEmailAccount, startSeq: number, endSeq: number): Promise<IEmail[]> {
  const emailsToInsert: IEmail[] = [];
  const maxEmails = 30; // Total number of emails to fetch

  const client = new ImapFlow({
    host: accountData.imapURI,
    port: parseInt(accountData.imapPort as string),
    secure: true,
    auth: {
      user: accountData.email,
      pass: accountData.password,
    },
  });

  try {
    await client.connect();
    const lock = await client.getMailboxLock('INBOX');

    try {
      const remainingEmails = client.fetch(
        { seq: `${startSeq}:${endSeq}` },
        { source: true }
      );

      for await (let message of remainingEmails) {
        console.log('Processing remaining message with SEQ:', message.seq);
        const parsed = await simpleParser(message.source);
        const inReplyTo = parsed.inReplyTo || '';

        // Skip emails that don't match the correct domain format
        if (!/^<fresh-[a-zA-Z0-9]+-\d+@shecodeshacks\.com>$/.test(inReplyTo)) {
          console.log(`Skipping email with Message-ID: ${inReplyTo} (not matching the pattern)`);
          continue;
        }

        const newEmail = new Email({
          from: mapAddress(parsed.from),
          to: mapAddresses(parsed.to),
          cc: mapAddresses(parsed.cc),
          bcc: mapAddresses(parsed.bcc),
          subject: parsed.subject || '',
          htmlBody: parsed.html || parsed.textAsHtml || '',
          textBody: parsed.text || '',
          messageID: parsed.messageId || 'unknown-message-id',
          references: parsed.references || [],
          inReplyTo,
          seq: message.seq,
          date: parsed.date || new Date(),
          threadId: generateThreadId(parsed.inReplyTo),
        });

        emailsToInsert.push(newEmail);
        console.log(`Processed email with SEQ: ${message.seq}`);
      }

      return emailsToInsert;
    } finally {
      await lock.release();
    }
  } catch (error) {
    console.log('Error fetching remaining emails:', error);
    return [];
  } finally {
    await client.logout();
  }
}

async function syncEmails(accountData: IEmailAccount) {
  const maxEmails = 30;
  let emailsToInsert: IEmail[] = [];

  // Fetch the latest email
  const { latestSeq, emails } = await fetchLatestEmail(accountData);
  emailsToInsert.push(...emails);

  if (latestSeq === null) {
    console.log('No new emails found.');
    return { success: false, error: 'No new emails found' };
  }

  // Fetch remaining emails if needed
  if (emailsToInsert.length < maxEmails) {
    const remainingEmails = await fetchRemainingEmails(
      accountData,
      Math.max(1, latestSeq - maxEmails + 1),
      latestSeq - 1
    );
    emailsToInsert.push(...remainingEmails);
  }

  if (emailsToInsert.length > 0) {
    await Email.insertMany(emailsToInsert);
  }

  return { success: true, emails: emailsToInsert };
}



// Function to map a single address object
function mapAddress(address: AddressObject | undefined): { address: string; name: string } {
  if (!address || !address.value[0]) return { address: '', name: '' };
  return { address: address.value[0].address || '', name: address.value[0].name || '' };
}

// Function to map multiple addresses (to, cc, bcc)
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
