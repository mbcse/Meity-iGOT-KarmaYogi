import { PutObjectCommand, GetObjectCommand, GetObjectCommandOutput, S3Client } from '@aws-sdk/client-s3';
import { Readable } from 'stream';
import { AWSAccessKey, AWSSecretKey, s3Region } from '../workers/config'; // Import config

// Initialize the S3 client using config values
const s3Client = new S3Client({
    region: s3Region,
    credentials: {
      accessKeyId: AWSAccessKey as string,
      secretAccessKey: AWSSecretKey as string,
    },
});

console.log("S3 Client: ", {
    region: s3Region,
    credentials: {
      accessKeyId: AWSAccessKey,
      secretAccessKey: AWSSecretKey,
    }
});

export const uploadFile = async (buffer: Buffer, fileName: string, bucket: string, isJSON : boolean) => {
    const params = {
        Bucket: bucket,
        Key: isJSON?`templates/json/${fileName}`:`templates/html/${fileName}`,
        Body: buffer,
        ContentType: isJSON?'application/json':'text/html',
    };

    console.log("Uploading file to S3", params);

    try {
        const data = await s3Client.send(new PutObjectCommand(params));
        return data;
    } catch (error) {
        console.error('Error uploading file:', error);
        throw error;
    }
};

export const downloadFile = async (bucket: string, fileName: string,isJSON:boolean): Promise<any> => {
    const params = {
        Bucket: bucket,
        Key: isJSON?`templates/json/${fileName}.json`:`templates/html/${fileName}.html`,
    };

    console.log("Downloading file from S3", params);
    try {
        const data: GetObjectCommandOutput = await s3Client.send(new GetObjectCommand(params));
        console.log("ObjData: ",data);
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
        console.log("ReadableData: ",value);
        
        if(isJSON){
        const decodedJson = JSON.parse(value);
        console.log("\n\nDECODED JSON: ", decodedJson);

        return decodedJson;
        }

        console.log("HTML: ",value);
        return value;
    } catch (error) {
        console.error('Error downloading file:', error);
        throw error;
    }
};
