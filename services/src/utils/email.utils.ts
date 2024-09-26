import { getEmailCache,setEmailCache } from "./cache.utils";

export async function  getEmailInfo(campaign_id:string){
    try {
        const cacheKey = `c-emailBody:${campaign_id}`;
        var cachedData = await getEmailCache(cacheKey)
        
        if(cachedData==null){
                const pulledData = {body:'data has been pulled',title:'this is a nice title'}
                cachedData = pulledData;
                setEmailCache(campaign_id,pulledData);
        }
        
        
        return cachedData;
    } catch (error) {
        console.log(error)
    }
}
