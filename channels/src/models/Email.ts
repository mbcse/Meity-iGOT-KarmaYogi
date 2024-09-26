import { Schema, model, Document } from 'mongoose';

export interface IEmail extends Document {
  from: string;
  fromName?: string;
  to: string[];
  toName?: string;
  subject: string;
  htmlBody: string;
  textBody: string;
  messageID: string;
  references: string[];
  cc: string[];
  bcc: string[];
  inReplyTo?: string;
  seq: number;
  date: Date;
}

const EmailSchema: Schema<IEmail> = new Schema({
  from: { type: String, required: true },
  fromName: { type: String },
  to: [{ type: String, required: true }],
  toName: { type: String },
  subject: { type: String, required: true },
  htmlBody: { type: String, required: true },
  textBody: { type: String },
  messageID: { type: String, required: true, index: true },
  references: [{ type: String }],
  cc: [{ type: String }],
  bcc: [{ type: String }],
  inReplyTo: { type: String },
  seq: { type: Number, required: true },
  date: { type: Date, required: true }
});

export const Email = model<IEmail>('Email', EmailSchema);