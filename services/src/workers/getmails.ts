import { ImapFlow, FetchMessageObject } from 'imapflow';
import { PrismaClient } from '@prisma/client';
import { simpleParser, AddressObject } from 'mailparser';
import {
    imapPort,
    imapURI,
    emailWorkerEmail,
    emailWorkerPassword,
} from '../config';

const prisma = new PrismaClient();

interface MailListenerOptions {
    username: string;
    password: string;
    host: string;
    port: number;
    tls: boolean;
    connTimeout: number;
    authTimeout: number;
    debug: (msg: any) => void;
    tlsOptions: { rejectUnauthorized: boolean };
    mailbox: string;
    searchFilter: string[];
    markSeen: boolean;
    fetchUnreadOnStart: boolean;
    mailParserOptions: { streamAttachments: boolean };
    attachments: boolean;
    attachmentOptions: { directory: string };
}

async function monitorEmails(options: MailListenerOptions) {
    const client = new ImapFlow({
        host: options.host,
        port: options.port,
        secure: options.tls,
        auth: {
            user: options.username,
            pass: options.password,
        },
    });

    client.on('error', (err) => {
        console.error('IMAP error:', err);
    });

    await client.connect();
    console.log('Connected to IMAP server');

    client.on('mail', async () => {
        const message = await client.fetchOne('*', { envelope: true, source: true });
        await processMail(message);
    });

    setInterval(async () => {
        await client.noop();
    }, options.connTimeout);

    async function processMail(message: FetchMessageObject) {
        try {
            const parsed = await simpleParser(message.source);

            let recipientEmails: string[] = [];

            if (parsed.to) {
                if (Array.isArray(parsed.to)) {
                    parsed.to.forEach((addressObj: AddressObject) => {
                        if (addressObj?.value) {
                            recipientEmails.push(
                                ...addressObj.value.map((address) => address.address!).filter(Boolean)
                            );
                        }
                    });
                } else if (parsed.to.value) {
                    recipientEmails = parsed.to.value.map((address) => address.address!).filter(Boolean);
                }
            }

            console.log('Recipient Emails:', recipientEmails);

            if (recipientEmails.includes('info@shecodeshacks.com')) {
                if (parsed.from?.value[0]?.address === 'bounced@shecodeshacks.com') {
                    console.log(`Bounce detected from: ${parsed.from.value[0].address}`);
                    await prisma.emailCampaign.update({
                        where: { id: 'your-campaign-id' },
                        data: { bounced: { increment: 1 } },
                    });
                } else if (parsed.from?.value[0]?.address === 'channels@shecodeshacks.com') {
                    console.log(`Reply-to email received from: ${parsed.from.value[0].address}`);
                    // await prisma.replyToEmails.create({
                    //     data: {
                    //         subject: parsed.subject || '',
                    //         from: parsed.from.value[0].address || '',
                    //         body: parsed.html || parsed.text || '',
                    //         receivedAt: new Date(),
                    //     },
                    // });

                    console.log('Reply-to email processed');
                }
            }

            if (options.attachments && parsed.attachments) {
                for (const attachment of parsed.attachments) {
                    console.log(`Attachment saved to: ${options.attachmentOptions.directory}/${attachment.filename}`);
                    // Save or process attachments as needed
                }
            }
        } catch (error) {
            console.error('Error processing mail:', error);
        }
    }
}

const mailListenerOptions: MailListenerOptions = {
    username: emailWorkerEmail as string,
    password: emailWorkerPassword as string,
    host: imapURI as string,
    port: parseInt(imapPort as string),
    tls: true,
    connTimeout: 10000,
    authTimeout: 5000,
    debug: console.log,
    tlsOptions: { rejectUnauthorized: false },
    mailbox: 'INBOX',
    searchFilter: ['UNSEEN', 'FLAGGED'],
    markSeen: true,
    fetchUnreadOnStart: true,
    mailParserOptions: { streamAttachments: true },
    attachments: true,
    attachmentOptions: { directory: 'attachments/' },
};

monitorEmails(mailListenerOptions).catch(console.error);
