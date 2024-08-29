import { Request, Response } from 'express';
import { EmailAccount, IEmailAccount } from '../models/EmailAccount';
import { Email, IEmail } from '../models/Email';
import { ImapFlow } from 'imapflow';
import { AddressObject,simpleParser,EmailAddress } from 'mailparser';
import nodemailer from 'nodemailer';


export const syncEmailController = async (req: Request, res: Response) => {
  const { emailID } = req.params;
  try {
    const account = await EmailAccount.findOne({ email: emailID });
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
      const highestSeqEmail = await Email.findOne({}).sort('-seq').exec();
      const highestSeq = highestSeqEmail ? highestSeqEmail.seq : 0;

      const messages = client.fetch(
        { seq: `${highestSeq + 1}:*` },
        { source: true }
      );

      for await (let message of messages) {
        const parsed = await simpleParser(message.source);

        // Function to extract email addresses from AddressObject or AddressObject[]
        const extractAddresses = (addresses: AddressObject | AddressObject[] | undefined): EmailAddress[] => {
          if (!addresses) return [];
          if (Array.isArray(addresses)) {
            return addresses.flatMap(address => address.value);
          }
          return addresses.value;
        };

        const newEmail = new Email({
          from: parsed.from?.value[0] ? {
            address: parsed.from.value[0].address,
            name: parsed.from.value[0].name
          } : { address: '', name: '' },
          to: extractAddresses(parsed.to).map(to => ({
            address: to.address,
            name: to.name,
          })),
          cc: extractAddresses(parsed.cc).map(cc => ({
            address: cc.address,
            name: cc.name,
          })),
          bcc: extractAddresses(parsed.bcc).map(bcc => ({
            address: bcc.address,
            name: bcc.name,
          })),
          subject: parsed.subject || '',
          htmlBody: parsed.html || parsed.textAsHtml || '',
          textBody: parsed.text || '',
          messageID: parsed.messageId || '',
          references: parsed.references || [],
          inReplyTo: parsed.inReplyTo || '',
          seq: message.seq,
          date: parsed.date || new Date(),
        });

        await newEmail.save();
      }
    } finally {
      lock.release();
    }
    await client.logout();

    account.lastSyncedAt = new Date();
    await account.save();

    res.status(200).json({ message: 'Emails synced successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to sync emails' });
  }
};




export const getMessagesListController = async (req: Request, res: Response) => {
  const { emailID } = req.params;
  console.log(emailID);
  
  try {
    const messages = await Email.aggregate([
      {
        $match: {
          'to.address': emailID.toLowerCase(),
          inReplyTo: ""
        }
      },
      {
        $sort: { date: 1 }
      }
    ]);

    console.log(messages);
    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch messages list' });
  }
};

export const getThreadController = async (req: Request, res: Response) => {
  const { threadID } = req.params;

  try {
    const messages = await Email.find({ threadId: threadID }).sort({ date: 1 });

    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch messages in thread' });
  }
};


export const getMessagesInThreadController = async (req: Request, res: Response) => {
  const { emailID, threadID } = req.params;

  try {
    const messages = await Email.find({ threadId: threadID })
      .sort({ date: 1 });

    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch messages in thread' });
  }
};
