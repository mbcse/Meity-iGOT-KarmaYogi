import cron from 'node-cron';
import { EmailAccount } from '../models/EmailAccount';
import { syncEmailController } from '../controllers';

export const startCronJob = () => {
  cron.schedule('*/30 * * * * *', async () => {
    const accounts = await EmailAccount.find();
    for (const account of accounts) {
      await syncEmailController({ params: { emailID: account.email } } as any, {} as any);
    }
  });
};