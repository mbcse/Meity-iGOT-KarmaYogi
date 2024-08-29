import mongoose, { Schema, Document } from 'mongoose';

export interface IEmailAccount extends Document {
  email: string;
  password: string;
  smtpPort: string | number;
  smtpURI: string;
  imapPort: string | number;
  imapURI: string;
  lastSyncedAt?: Date;
  lastSeenUID?: number;
}

const EmailAccountSchema: Schema = new Schema({
  email: { type: String, required: true },
  password: { type: String, required: true },
  smtpPort: { type: String, required: true },
  smtpURI: { type: String, required: true },
  imapPort: { type: String, required: true },
  imapURI: { type: String, required: true },
  lastSyncedAt: { type: Date },
  lastSeenUID: { type: Number },
});

export const EmailAccount = mongoose.model<IEmailAccount>('EmailAccount', EmailAccountSchema);