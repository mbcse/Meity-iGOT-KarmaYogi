import dotenv from 'dotenv';

dotenv.config({ path: `.env.${process.env.NODE_ENV}` });

export const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',');
export const port = process.env.PORT || 3000;
export const dbUrl = process.env.DB_URL;
export const dbUser = process.env.DB_USER;
export const dbPass = process.env.DB_PASS;
export const dbName = process.env.DB_NAME;
export const replyToEmail = process.env.REPLY_TO_EMAIL;