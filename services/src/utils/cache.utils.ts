import { createClient } from "redis";

// Interface for Email content structure
export interface IRedisEmailValues {
  title: string;
  body: string;
}

// Function to retrieve email content from cache
export async function getEmailCache(cacheKey: string): Promise<IRedisEmailValues | null> {


  const client = createClient({
    socket: {
      host: 'localhost',
      port: 4003
    }    
  });

  await client.connect();

  client.on("connect", () => {
    console.log("connected to Redis");
  });

  try {
    const resultTitle = await client.get(cacheKey) as string;
    const resultBody = await client.get(cacheKey) as string;


    const result = {
      title: resultTitle,
      body: resultBody,
    };

    if (result.body && result.title) {
      return result;
    } else {
      return null;
    }
  } catch (error) {
    console.error(error);
    return null;
  } finally {
    await client.disconnect();
  }
}

// Function to set email content in cache
export async function setEmailCache(campaign_id: string, value: IRedisEmailValues) {
 
  const client = createClient({
    socket: {
      host: 'localhost',
      port: 4003
    }    
  });

  await client.connect();

  client.on("connect", () => {
    console.log("connected to Redis");
  });

  try {
    const cacheBodyKey = `c-emailBody:${campaign_id}`;
    const resultBody = await client.set(cacheBodyKey, value.body);

    const cacheTitleKey = `c-emailTitle:${campaign_id}`;
    const resultTitle = await client.set(cacheTitleKey, value.title);

    if (!resultBody || !resultTitle) {
      throw new Error("Something went wrong while caching email body or title");
    }

    return true;
  } catch (error) {
    console.error(error);
    return false;
  } finally {
    await client.disconnect();
  }
}

export interface ISmsCacheValues {
  body: string;
  messageType?: string; // Optional property for SMS type
}

export async function getSmsCache(cacheKey: string): Promise<ISmsCacheValues | null> {
  const client = createClient({
    socket: {
      host: 'localhost',
      port: 4003
    }    
  });

  await client.connect();

  client.on("connect", () => {
    console.log("connected to Redis");
  });

  try {
    const cachedData = await client.get(cacheKey) as string;
    console.assert(cachedData);

    if (cachedData==null) {
      return null;
    }

    return {body:cachedData}; // Parse JSON string back to object

  } catch (error) {
    console.error(error);
    return null;
  } finally {
    await client.disconnect();
  }
}

export async function setSmsCache(campaign_id: string, value: ISmsCacheValues) {
    
  const client = createClient({
    socket: {
      host: 'localhost',
      port: 4003
    }    
  });

  await client.connect();

  client.on("connect", () => {
    console.log("connected to Redis");
  });

  try {
    const cacheKey = `c-smsBody:${campaign_id}`;
    const result = await client.set(cacheKey, JSON.stringify(value));
    console.error(result);
    
    if (!result) {
      throw new Error("Something went wrong while caching SMS content");
    }

    return true;
  } catch (error) {
    console.error(error);
    return false;
  } finally {
    await client.disconnect();
  }
}



export interface IWhatsappMessage {
  body: string;
  mediaUrl?: string; // Optional for image or video content
}

export async function getWhatsappCache(cacheKey: string): Promise<IWhatsappMessage | null> {
  const client = createClient({
    url: process.env.REDIS_URL,
  });

  client.on("connect", () => {
    console.log("connected to Redis");
  });

  try {
    const cachedData = await client.get(cacheKey) as string;

    if (cachedData) {
      return JSON.parse(cachedData); // Parse JSON string back to object
    }

    return null;
  } catch (error) {
    console.error(error);
    return null;
  } finally {
    await client.disconnect();
  }
}

export async function setWhatsappCache(campaign_id: string, value: IWhatsappMessage) {
  const client = createClient({
    url: process.env.REDIS_URL,
  });

  client.on("connect", () => {
    console.log("connected to Redis");
  });

  try {
    const cacheKey = `c-whatsappBody:${campaign_id}`;
    const result = await client.set(cacheKey, JSON.stringify(value));

    if (!result) {
      throw new Error("Something went wrong while caching WhatsApp content");
    }

    return true;
  } catch (error) {
    console.error(error);
    return false;
  } finally {
    await client.disconnect();
  }
}