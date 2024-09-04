import dotenv from 'dotenv';

dotenv.config({ path: `.env.${process.env.NODE_ENV}` });

export const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',');
export const port = process.env.PORT || 3000;
export const dbUrl = process.env.DB_URL;