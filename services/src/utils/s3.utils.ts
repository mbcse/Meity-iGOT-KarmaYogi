import { PutObjectCommand,GetObjectCommand, GetObjectCommandOutput, S3Client } from '@aws-sdk/client-s3';
import { Readable } from 'stream';
import 'dotenv/config';

const s3Client = new S3Client({
    region: process.env.AWS_S3_REGION,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY as string,
      secretAccessKey: process.env.AWS_SECRET as string,
    },
});

export const uploadFile = async (buffer:Buffer,fileName:string ,bucket: string) => {
    const params = {
        Bucket: bucket,
        Key: "templates/json/"+fileName,
        Body: buffer,
        ContentType: 'text/json',
    };

    console.log("Uploading file to S3",params);

    try {
        const data = await s3Client.send(new PutObjectCommand(params));
        return data;
    } catch (error) {
        console.error('Error uploading file:', error);
        return error;
    }
};

export const downloadFile = async (bucket: string, fileName: string): Promise<any> => {
    const params = {
        Bucket: bucket,
        Key: `templates/json/${fileName}`,
    };

    try {
        const data: GetObjectCommandOutput = await s3Client.send(new GetObjectCommand(params));

        if (!data.Body || !(data.Body instanceof Readable)) {
            throw new Error('Invalid response from S3');
        }

        const getReadableData = (readable: Readable): Promise<string> => {
            return new Promise((resolve, reject) => {
                const chunks: Buffer[] = [];
                readable.once('error', (err: Error) => reject(err));
                readable.on('data', (chunk: Buffer) => chunks.push(chunk));
                readable.once('end', () => resolve(Buffer.concat(chunks).toString('utf-8')));
            });
        };

        const value = await getReadableData(data.Body);
        const decodedJson = JSON.parse(value);
        console.log(decodedJson);

        return decodedJson;
    } catch (error) {
        console.error('Error downloading file:', error);
        return error;
    }
}