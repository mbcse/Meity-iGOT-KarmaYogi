import { ImapFlow,MailboxLockObject } from 'imapflow';
import { IEmailAccount } from '../models/EmailAccount';

interface ImapConfig {
    host: string;
    port: number;
    secure: boolean;
    auth: {
        user: string;
        pass: string;
    };
}

function convertToImapConfig(emailAccount: IEmailAccount): ImapConfig {
    return {
        host: emailAccount.imapURI,
        port: parseInt(emailAccount.imapPort as string, 10),
        secure: true, // Assuming secure connection, modify if needed
        auth: {
            user: emailAccount.email,
            pass: emailAccount.password
        }
    };
}

   
async function connectImap(emailAccount: IEmailAccount): Promise<{ imapClient: ImapFlow, lock: MailboxLockObject }> {
    const imapConfig = convertToImapConfig(emailAccount);
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