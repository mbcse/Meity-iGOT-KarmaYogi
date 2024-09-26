import { simpleParser, ParsedMail, AddressObject, EmailAddress } from 'mailparser';
import { EmailMessage } from '../models/message.models';

interface EmailData {
  source: Buffer | string;
  internalDate: Date;
  uid: number;
}

function getAddressString(address: AddressObject | AddressObject[] | undefined): string {
  if (!address) return '';
  if (Array.isArray(address)) {
    return address.map(addr => addr.text).join(', ');
  }
  return address.text;
}

function getAddressArray(address: AddressObject | AddressObject[] | undefined): string[] {
  if (!address) return [];
  if (Array.isArray(address)) {
    return address.flatMap(addr => addr.value.map(val => val.address).filter(Boolean) as string[]);
  }
  return address.value.map(val => val.address).filter(Boolean) as string[];
}

function getThreadId(parsed: ParsedMail): string {
  // Check for 'References' header first
  if (parsed.references && parsed.references.length > 0) {
    return parsed.references[0];
  }
  // If no 'References', check for 'In-Reply-To'
  if (parsed.inReplyTo) {
    return parsed.inReplyTo;
  }
  // If neither exists, use the 'Message-ID' as the thread starter
  return parsed.messageId || '';
}

async function parseAndStoreEmails(emails: EmailData[]): Promise<boolean> {
  try {
    for (const email of emails) {
      const parsed: ParsedMail = await simpleParser(email.source);

      const threadId = getThreadId(parsed);

      const emailMessage = new EmailMessage({
        textbody: parsed.text || '',
        htmlBody: parsed.html || undefined,
        channelType: 'EMAIL',
        time: email.internalDate,
        threadID: threadId,
        sender: getAddressString(parsed.from),
        receiver: getAddressString(parsed.to),
        metadata: {
          subjectLine: parsed.subject || '',
          cc: getAddressArray(parsed.cc),
          bcc: getAddressArray(parsed.bcc),
          messageId: parsed.messageId,
          inReplyTo: parsed.inReplyTo,
          references: parsed.references
        }
      });

      await emailMessage.save();
    }
    return true;
  } catch (error) {
    console.error('Error storing emails:', error);
    return false;
  }
}

export { parseAndStoreEmails };