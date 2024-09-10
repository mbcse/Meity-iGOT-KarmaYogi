import dotenv from 'dotenv';

// Use NODE_ENV directly
const nodeEnv = process.env.NODE_ENV || 'dev'; // Default to 'dev' if NODE_ENV is not set

// Load environment-specific configuration based on NODE_ENV
dotenv.config({ path: `.env.${nodeEnv}` });

export const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',');
export const port = process.env.PORT || 3000;
export const dbUrl = process.env.DB_URL;
export const dbUser = process.env.DB_USER;
export const dbPass = process.env.DB_PASS;
export const dbName = process.env.DB_NAME;
export const replyToEmail = process.env.REPLY_TO_EMAIL;