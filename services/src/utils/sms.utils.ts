import { getSmsCache, setSmsCache } from "./cache.utils";
import { ISmsCacheValues } from "./cache.utils";
import * as fs from 'fs';
import * as path from 'path';

// Simple logging function using fs.appendFile to write logs to a file
function logToFile(message: string) {
  const logMessage = `${new Date().toISOString()} - ${message}\n`;
  console.log(__dirname);
  fs.appendFile(path.join(__dirname, 'smsInfo.log'), logMessage, (err) => {
    if (err) {
      console.error('Logging failed', err);
    }
  });
}

export async function getSmsInfo(campaign_id: string): Promise<ISmsCacheValues | null> {
  logToFile(`Entering getSmsInfo with campaign_id: ${campaign_id}`);
  try {
    const cacheKey = `c-smsBody:${campaign_id}`;
    logToFile(`Attempting to retrieve cache for key: ${cacheKey}`);
    const cachedData = await getSmsCache(cacheKey);

    if (cachedData == null) {
      logToFile(`Cache miss for key: ${cacheKey}, pulling new data`);
      const pulledData = { body: "SMS content has been pulled" }; // Assuming basic SMS content
      await setSmsCache(campaign_id, pulledData); // Cache the retrieved data
      logToFile(`Data pulled and cached for key: ${cacheKey}`);
      return pulledData;
    }

    logToFile(`Cache hit for key: ${cacheKey}, returning cached data`);
    const { body } = cachedData;
    return { body };
  } catch (error) {
    logToFile(`Error in getSmsInfo for campaign_id: ${campaign_id}, Error: ${error}`);
    console.error(error);
    return null;
  }
}