import { Schema, model, Document } from 'mongoose';

export interface IEmailAccount extends Document {
  email: string;
  password: string;
  smtpURI: string;
  smtpPort: string;
  imapURI: string;
  imapPort: string;
  lastSyncedAt: Date;
  recentSeq?: number;
}

const EmailAccountSchema: Schema<IEmailAccount> = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  smtpURI: { type: String, required: true },
  smtpPort: { type: String, required: true },
  imapURI: { type: String, required: true },
  imapPort: { type: String, required: true },
  lastSyncedAt: { type: Date, default: () => new Date() },
  recentSeq: {
    type: Number,
  },
});

export const EmailAccount = model<IEmailAccount>('EmailAccount', EmailAccountSchema);
