import mongoose, { Schema, Document, Model } from 'mongoose';

interface IMessage extends Document {
  textbody: string;
  channelType: 'EMAIL' | 'SMS' | 'WHATSAPP';
  time: Date;
  email?: string;
  number?: string;
  threadID: string;
  sender: string;
  receiver: string;
  metadata?: {
    subjectLine?: string;
    cc?: string[];
    bcc?: string[];
  };
}

const baseOptions = { discriminatorKey: 'channelType', collection: 'messages' };

const BaseMessageSchema: Schema<IMessage> = new Schema({
  textbody: { type: String, required: true },
  time: { type: Date, required: true },
  threadID: { type: String, required: true, index: true }, // Indexing threadID
  sender: { type: String, required: true },
  receiver: { type: String, required: true }
}, baseOptions);

const BaseMessage: Model<IMessage> = mongoose.model<IMessage>('Message', BaseMessageSchema);

// Define the EmailMessage model with its specific schema
const EmailMessage = BaseMessage.discriminator('EMAIL', new Schema({
  email: { type: String, index: true }, // Indexing email
  metadata: {
    subjectLine: { type: String },
    cc: [{ type: String }],
    bcc: [{ type: String }]
  }
}));

// Define the SMSMessage model with its specific schema
const SMSMessage = BaseMessage.discriminator('SMS', new Schema({
  number: { type: String, index: true } // Indexing number
}));

// Define the WhatsAppMessage model with its specific schema
const WhatsAppMessage = BaseMessage.discriminator('WHATSAPP', new Schema({
  number: { type: String, index: true } // Indexing number
}));

export { BaseMessage, EmailMessage, SMSMessage, WhatsAppMessage };
