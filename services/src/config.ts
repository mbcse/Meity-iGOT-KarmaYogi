import dotenv from 'dotenv';

dotenv.config({ path: `.env.${process.env.NODE_ENV}` });

export const smtpHostUri = process.env.SMTP_HOST_URI;
export const smtpPort = process.env.SMTP_PORT;

export const emailWorkerEmail = process.env.EMAIL_WORKER_EMAIL;
export const emailWorkerPassword = process.env.EMAIL_WORKER_PASSWORD;
export const orcptEmail = process.env.ORCPT_EMAIL as string;
export const replyToEmail = process.env.REPLY_TO_EMAIL as string;

export const AWSAccessKey = process.env.AWS_ACCESS_KEY;
export const AWSSecretKey = process.env.AWS_SECRET;
export const s3Region = process.env.AWS_S3_REGION;
export const s3Bucket = process.env.AWS_BUCKET as string;

export const imapURI = process.env.IMAP_HOST;
export const imapPort = process.env.IMAP_PORT;

export const jwtSecret = process.env.JWT_SECRET;

export const cookieDomain = process.env.COOKIE_DOMAIN;
export const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',');

export const DB_API_BASE_URL = process.env.DB_API_BASE_URL;
export const databaseUrl = process.env.DATABASE_URL;

export const redisUrl = process.env.REDIS_URL as string;
export const redisHost = process.env.REDIS_HOST as string;
export const redisPort = process.env.REDIS_PORT as string;

export const redisUsername = process.env.REDIS_USERNAME as string;
export const redisPassword = process.env.REDIS_PASSWORD as string;

export const port = process.env.PORT || 3000;

export const emailQueueName = process.env.EMAIL_QUEUE_NAME as string;
