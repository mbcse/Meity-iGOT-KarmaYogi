import mongoose, { Schema, Document, Model } from 'mongoose';

interface AddressObject {
  address: string;
  name?: string;
}

export interface IEmail extends Document {
  from: AddressObject;
  to: AddressObject[];
  cc?: AddressObject[];
  bcc?: AddressObject[];
  subject: string;
  htmlBody: string;
  textBody?: string;
  messageID: string;
  inReplyTo?: string;
  references?: string[];
  seq: number;
  date: Date;
  threadId: string; 
}


const AddressObjectSchema: Schema = new Schema({
  address: { type: String, required: true },
  name: { type: String },
});

const EmailSchema: Schema<IEmail> = new Schema({
  from: { type: AddressObjectSchema, required: true },
  to: { type: [AddressObjectSchema], required: true },
  cc: { type: [AddressObjectSchema], default: [] },
  bcc: { type: [AddressObjectSchema], default: [] },
  subject: { type: String, required: true },
  htmlBody: { type: String, required: true },
  textBody: { type: String },
  messageID: { type: String, required: true },
  inReplyTo: { type: String },
  references: { type: [String], default: [] },
  seq: { type: Number, required: true },
  date: { type: Date, required: true },
  threadId: { type: String, default: '' },
});

export const generateThreadId = (parsed: any): string => {
  // If it's the first email in the thread, use its messageID as threadID
  if (!parsed.inReplyTo && !parsed.references?.length) {
    return parsed.messageId || '';
  }

  // Otherwise, use the first reference or inReplyTo as threadID
  return parsed.references?.[0] || parsed.inReplyTo || parsed.messageId || '';
};


// Pre-save hook to populate threadId
EmailSchema.pre<IEmail>('save', function (next) {
  if (!this.threadId) {
    this.threadId = generateThreadId(this);
  }
  next();
});

export const Email: Model<IEmail> = mongoose.model<IEmail>('Email', EmailSchema);
