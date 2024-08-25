
type SubCampaign = {
    subCampaignName: string;
    targeted: number;
    bounced: number;
    opened: number;
    mobile: number;
    desktop: number;
    linkConversion: number;
  };
  
  
  type CampaignData = {
    campaignName: string;
    subCampaigns: {
      whatsapp: SubCampaign[];
      sms: SubCampaign[];
      email: SubCampaign[];
    };
  };
  
  export function AggFields(campaignData: CampaignData, field: keyof SubCampaign) {
    const result = {
      email: 0,
      sms: 0,
      whatsapp: 0,
    };
  
    for (const channel of ['email', 'sms', 'whatsapp'] as const) {
      result[channel] = campaignData.subCampaigns[channel].reduce((acc, subCampaign) => {
        const value = subCampaign[field];
        return acc + (typeof value === 'number' ? value : 0);
      }, 0);
    }
  
    return result;
  }
  
  