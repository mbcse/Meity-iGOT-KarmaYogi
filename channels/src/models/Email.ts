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
  threadCount: number; // Number of emails in this thread
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
  messageID: { type: String, required: true, unique: true }, // Unique identifier for the message
  inReplyTo: { type: String }, // References the parent message
  references: { type: [String], default: [] },
  seq: { type: Number, required: true },
  date: { type: Date, required: true },
  threadId: { type: String, required: true, index: true }, // Index for efficient querying of threads
  threadCount: { type: Number, default: 0 }, // Number of emails in this thread
});

// Pre-save hook to generate threadId if not present
EmailSchema.pre<IEmail>('save', function (next) {
  if (!this.threadId) {
    this.threadId = generateThreadId(this.inReplyTo);
  }
  next();
});

// Thread ID generator function
export const generateThreadId = (inReplyTo: string | undefined): string => {
  if (!inReplyTo) return `<thread-${new Date().getTime()}>`; // Fallback unique thread ID
  return inReplyTo.replace('<fresh-', '<thread-');
};

export const Email: Model<IEmail> = mongoose.model<IEmail>('Email', EmailSchema);
