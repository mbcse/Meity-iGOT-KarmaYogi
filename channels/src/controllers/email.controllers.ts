import { Request, Response } from 'express';
import { EmailAccount } from '../models/EmailAccount';
import { Email, IEmail, generateThreadId } from '../models/Email';
import { ImapFlow } from 'imapflow';
import { simpleParser, AddressObject } from 'mailparser';
import nodemailer from 'nodemailer';
import {replyToEmail} from '../config';

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
      
      const messages = client.fetch({ seq: `${highestSeq + 1}:*` }, { source: true });

      for await (let message of messages) {
        const parsed = await simpleParser(message.source);
        console.log(parsed);
        let threadId;
        const inReplyTo = parsed.inReplyTo || '';
        
        // Try to connect by inReplyTo
        if (inReplyTo.startsWith('<fresh-')) {
          // Generate a new threadId for fresh emails
          threadId = generateThreadId(inReplyTo);
        } else if (inReplyTo.startsWith('<reply-')) {
          const threadIdToFind = inReplyTo.replace('<reply-', '<thread-');
          const existingEmail = await Email.findOne({ threadId: threadIdToFind }).exec();
          threadId = existingEmail ? existingEmail.threadId : generateThreadId(inReplyTo);
        } else {
          // Fallback to matching by subject line and sender email if inReplyTo doesn't work
          const similarSubjectEmails = await Email.find({
            subject: parsed.subject,
            'from.address': parsed.from?.value?.[0]?.address,
          }).sort('-date').exec();

          if (similarSubjectEmails && similarSubjectEmails.length > 0) {
            // Connect to the latest thread with a similar subject and sender
            threadId = similarSubjectEmails[0].threadId;
          } else {
            // If no match is found, generate a new threadId
            threadId = generateThreadId(inReplyTo);
          }
        }

        // Save the email with the found or generated threadId
        const newEmail = new Email({
          from: mapAddress(parsed.from),
          to: mapAddresses(parsed.to),
          subject: parsed.subject || '',
          htmlBody: parsed.html || parsed.textAsHtml || '',
          textBody: parsed.text || '',
          messageID: parsed.messageId || '',
          references: parsed.references || [],
          inReplyTo,
          seq: message.seq,
          date: parsed.date || new Date(),
          threadId,
        });

        await newEmail.save();
        await Email.updateMany({ threadId }, { $inc: { threadCount: 1 } });
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


export const replyToEmailController = async (req: Request, res: Response) => {
  const { from, to, subject, replyText, messageID, threadID, inReplyTo } = req.body;

  try {
    // Find the email account of the sender
    const account = await EmailAccount.findOne({ email: from });
    if (!account) {
      return res.status(404).json({ error: 'Email account not found' });
    }

    // Create the transporter for sending emails
    const transporter = nodemailer.createTransport({
      host: account.smtpURI,
      port: parseInt(account.smtpPort as string, 10),
      secure: true,
      auth: {
        user: account.email,
        pass: account.password,
      },
    });

    let newMessageID = inReplyTo;
    let finalThreadID = threadID || '';

    // Check if the current message is being sent by you (i.e., from you to someone else)
    if (from === account.email) {
      // Find the latest message in the thread that is NOT sent by you
      const latestMessageNotByMe = await Email.findOne({
        threadId: threadID,
        'from.address': { $ne: from }  // Compare only the 'address' field
      }).sort({ date: -1 });

      // If a message exists, process the 'inReplyTo'
      if (latestMessageNotByMe) {
        const latestInReplyTo = latestMessageNotByMe.inReplyTo;
      
        if (latestInReplyTo?.startsWith('<reply-')) {
          const campaignId = latestInReplyTo.split('-')[1];
          const msgNo = parseInt(latestInReplyTo.split('-')[2]);
          const newMsgNo = msgNo + 1;
          newMessageID = `<reply-${campaignId}-${newMsgNo}@...>`;
        } else if (latestInReplyTo?.startsWith('<fresh-')) {
          const campaignId = latestInReplyTo.split('-')[1];
          newMessageID = `<reply-${campaignId}-${latestMessageNotByMe.threadCount}@...>`; // First reply to fresh message
        }
      } else {
        // Fallback logic: Check subject and from fields for matching a previous thread
        const fallbackThread = await Email.findOne({
          subject,
          'from.address': { $ne: from },
        }).sort({ date: -1 });

        if (fallbackThread) {
          newMessageID = fallbackThread.messageID;
          finalThreadID = fallbackThread.threadId;
        } else {
          // Generate a new Message ID if no thread match is found
          newMessageID = `<fresh-${new Date().getTime()}@...>`;
          finalThreadID = generateThreadId(newMessageID);
        }
      }
    }

    // Send email
    await transporter.sendMail({
      from,
      to,
      subject,
      html: replyText,
      headers: {
        'Message-ID': newMessageID,
        'In-Reply-To': inReplyTo || newMessageID,
        References: [messageID, inReplyTo].filter(Boolean).join(' '),
      },
    });

    // Generate thread ID if not already provided
    if (!threadID) {
      finalThreadID = finalThreadID || generateThreadId(inReplyTo);
    }

    // Create new email record and save it to the database
    const newEmail = new Email({
      from: { address: from, name: '' },
      to: Array.isArray(to) ? to.map(address => ({ address, name: '' })) : [{ address: to, name: '' }],
      subject,
      htmlBody: replyText,
      messageID: newMessageID,
      references: [messageID, inReplyTo].filter(Boolean),
      inReplyTo,
      seq: 0, // Will be updated on next sync
      date: new Date(),
      threadId: finalThreadID,
    });

    try {
      await newEmail.save();
    } catch (err: any) {
      if (err.code === 11000 && err.keyPattern && err.keyPattern.messageID) {
        // Handle duplicate messageID error by generating a new messageID
        console.log('Duplicate messageID detected, regenerating messageID...');
        newEmail.messageID = `<reply-${new Date().getTime()}@...>`;
        await newEmail.save(); // Retry saving the email with the new messageID
      } else {
        throw err; // If it's a different error, rethrow it
      }
    }

    // Update thread count in all emails with the same threadId
    await Email.updateMany({ threadId: finalThreadID }, { $inc: { threadCount: 1 } });

    console.log(`Reply sent successfully to ${to} and ${newEmail}`);
    res.status(200).json({ message: 'Reply sent successfully', email: newEmail });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error });
  }
};



function mapAddress(address: AddressObject | undefined): { address: string; name: string } {
  if (!address || !address.value[0]) return { address: '', name: '' };
  return { address: address.value[0].address || '', name: address.value[0].name || '' };
}

function mapAddresses(addresses: AddressObject | AddressObject[] | undefined): { address: string; name: string }[] {
  if (!addresses) return [];
  const extractedAddresses = Array.isArray(addresses) ? addresses.flatMap(address => address.value) : addresses.value;
  return extractedAddresses
    .map(addr => ({ address: addr.address || '', name: addr.name || '' }))
    .filter(addr => addr.address !== '');
}

export const getMessagesListController = async (req: Request, res: Response) => {
  try {
    const messages = await Email.aggregate([
      // Group by threadId and get the document with the least seq in each group
      {
        $group: {
          _id: "$threadId",   // Group by threadId
          doc: { $first: "$$ROOT" },  // Get the first document (sorted by seq)
          leastSeq: { $min: "$seq" }, // Find the minimum seq in each thread
        },
      },
      // Sort by the least seq in each thread
      {
        $sort: { leastSeq: 1 },
      },
      // Unwind the doc to return the entire document
      {
        $replaceRoot: { newRoot: "$doc" }, // Replace root to return the original document
      },
    ]);

    res.status(200).json(messages);
  } catch (error) {
    console.error('Error in getMessagesByThreadId:', error);
    res.status(500).json({ error: 'Failed to retrieve messages' });
  }
};

export const getThreadController = async (req: Request, res: Response) => {
  const { threadID } = req.params;
  try {
    const messages = await Email.find({ references: { $in: ['s1'] } }).sort('seq');
    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch messages in thread' });
  }
};

export const getMessagesInThreadController = async (req: Request, res: Response) => {
  const { emailID, threadID } = req.params;

  try {
    const messages = await Email.find({ threadId: threadID }).sort({ date: 1 });

    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch messages in thread' });
  }
};


