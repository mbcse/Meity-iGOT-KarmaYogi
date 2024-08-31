import { getEmailCache, setEmailCache } from "./cache.utils";
import { downloadFile } from "./s3.utils"; // Assuming your S3 utility functions are in a file named "s3.utils"

export async function getEmailInfo(campaign_id: string,template:string) {
    try {
        const cacheKey = `c-emailBody:${campaign_id}`;
        let cachedData = await getEmailCache(cacheKey);
        console.log("Cached Data : ",cachedData);
        if (cachedData == null) {
            // Define your S3 bucket name and file name
            const bucketName = process.env.AWS_BUCKET as string; // Replace with your actual bucket name
            const fileName = `${template}.html`; // Assuming the file is stored as JSON with the campaign ID as the filename
            console.log("\nBucket Name : ",bucketName);
            console.log("\nFile Name : ",fileName);

            console.log("Cache miss, pulling data from S3...");
            
            // Pull data from S3
            const pulledData = await downloadFile(bucketName,template,false);
            console.log("Pulled Data : ",pulledData);
            // Store the pulled data in the cache
            if (pulledData) {
                cachedData = {
                    body: pulledData , // Default value if the field is missing
                    title: template, // Default value if the field is missing
                };
                await setEmailCache(campaign_id, cachedData);
            } else {
                // Handle case when no data is found in S3
                console.log("No data found in S3.");
                cachedData = { body: '', title: '' };
            }
        }

        return cachedData;
    } catch (error) {
        console.error("Error in getEmailInfo:", error);
        return null;
    }
}
