// config.ts
import dotenv from 'dotenv';


dotenv.config({
    path:'../../.env'
});


export const smtpHostUri = process.env.SMTP_HOST_URI;
export const smtpPort = process.env.SMTP_PORT;
export const emailWorkerEmail = process.env.EMAIL_WORKER_EMAIL;
export const emailWorkerPassword = process.env.EMAIL_WORKER_PASSWORD;
export const AWSAccessKey = process.env.AWS_ACCESS_KEY;
export const AWSSecretKey = process.env.AWS_SECRET;
export const s3Region = process.env.AWS_S3_REGION;
export const s3Bucket = process.env.AWS_TEMP_BUCKET;
