import { ImapFlow,MailboxLockObject } from 'imapflow';
import dotenv from 'dotenv';

dotenv.config();

const imapConfig = {
    host: process.env.IMAP_HOST || '',
    port: parseInt(process.env.IMAP_PORT || '993', 10),
    secure: process.env.IMAP_SECURE === 'true',
    auth: {
        user: process.env.IMAP_USER || '',
        pass: process.env.IMAP_PASS || ''
    }
};
   
// Function to connect to the IMAP server, lock the INBOX, and return the client and lock instance
async function connectImap(): Promise<{ imapClient: ImapFlow, lock: MailboxLockObject }> {
    const imapClient = new ImapFlow(imapConfig);
    await imapClient.connect();
    const lock = await imapClient.getMailboxLock('INBOX');
    return { imapClient, lock };
}
async function releaseLockAndLogout(imapClient: ImapFlow, lock: MailboxLockObject): Promise<void> {
    lock.release();
    await imapClient.logout();
}

export { connectImap, releaseLockAndLogout };