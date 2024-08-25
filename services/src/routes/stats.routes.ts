import { PrismaClient, Prisma } from '@prisma/client';
import express, { Request, Response } from 'express';

const prisma = new PrismaClient();
const statsRouter = express.Router();

// opened only works for emails
statsRouter.get("/:campaignID/opened", async (req: Request, res: Response) => {
    const { campaignID } = req.params;
    
    try {
        const emailCampaigns = await prisma.emailCampaign.findMany({
            where: { campaignID },
        });

        if (!emailCampaigns) {
            return res.status(404).json({ error: "Campaign not found" });
        }

        let totalOpened = 0;
        emailCampaigns.map((emailCampaigns)=>{
            const noOfOpened = emailCampaigns.opened;
            totalOpened+=noOfOpened;
        })

        res.json({ stat : totalOpened });
    } catch (error) {
        res.status(500).json({ error: "An error occurred while fetching clicks" });
    }
});

// bounces works for all
statsRouter.get("/:campaignID/bounces", async (req: Request, res: Response) => {
    const { campaignID } = req.params;
    
    try {
        const emailCampaigns = await prisma.emailCampaign.findMany({
            where: { campaignID },
        });

        const smsCampaigns = await prisma.sMSCampaign.findMany({
            where: { campaignID },
        });

        const whatsappCampaigns = await prisma.whatsAppCampaign.findMany({
            where: { campaignID },
        })

        if (!emailCampaigns && !smsCampaigns && !whatsappCampaigns) {
            return res.status(404).json({ error: "Campaign not found" });
        }

        let totalOpened = 0;
        emailCampaigns.map((emailCampaigns)=>{
            const noOfOpened = emailCampaigns.bounced;
            totalOpened+=noOfOpened;
        })

        smsCampaigns.map((smsCampaigns)=>{
            const noOfOpened = smsCampaigns.bounced;
            totalOpened+=noOfOpened;
        })

        whatsappCampaigns.map((whatsappCampaigns)=>{
            const noOfOpened = whatsappCampaigns.bounced;
            totalOpened+=noOfOpened;
        })

        res.json({ stat : totalOpened });
    } catch (error) {
        res.status(500).json({ error: "An error occurred while fetching bounces" });
    }
});

statsRouter.get("/:campaignID/devices", async (req: Request, res: Response) => {
    const { campaignID } = req.params;
    
    try {
        const emailCampaigns = await prisma.emailCampaign.findMany({
            where: { campaignID },
        });

        const smsCampaigns = await prisma.sMSCampaign.findMany({
            where: { campaignID },
        });

        const whatsappCampaigns = await prisma.whatsAppCampaign.findMany({
            where: { campaignID },
        })

        if (!emailCampaigns && !smsCampaigns && !whatsappCampaigns) {
            return res.status(404).json({ error: "Campaign not found" });
        }

        let totalMobile = 0;
        let totalDesktop = 0;

        emailCampaigns.map((emailCampaigns)=>{
            const noOfMobile = emailCampaigns.mobile;
            const noOfDesktop = emailCampaigns.desktop;

            totalMobile+=noOfMobile;
            totalDesktop+=noOfDesktop;
        })

        res.json({ stat : {
            mobile:totalMobile,
            desktop:totalDesktop
        } });
    } catch (error) {
        res.status(500).json({ error: "An error occurred while fetching bounces" });
    }
});


statsRouter.get("/:campaignID/regions", async (req: Request, res: Response) => {
    const { campaignID } = req.params;
    
    try {
        const emailCampaigns = await prisma.emailCampaign.findMany({
            where: { campaignID },
        });

        const smsCampaigns = await prisma.sMSCampaign.findMany({
            where: { campaignID },
        });

        const whatsappCampaigns = await prisma.whatsAppCampaign.findMany({
            where: { campaignID },
        });

        if (emailCampaigns.length === 0 && smsCampaigns.length === 0 && whatsappCampaigns.length === 0) {
            return res.status(404).json({ error: "Campaign not found" });
        }

        const aggregateRegionsClicks = (campaigns: any[], totalRegionsClicks: { [key: string]: number }) => {
            campaigns.forEach(campaign => {
                const regionsClicks = campaign.regionsClicks as { [key: string]: number };
                Object.keys(regionsClicks).forEach(region => {
                    if (!totalRegionsClicks[region]) {
                        totalRegionsClicks[region] = 0;
                    }
                    totalRegionsClicks[region] += regionsClicks[region];
                });
            });
        };

        let totalRegionsClicks: { [key: string]: number } = {};

        aggregateRegionsClicks(emailCampaigns, totalRegionsClicks);
        aggregateRegionsClicks(smsCampaigns, totalRegionsClicks);
        aggregateRegionsClicks(whatsappCampaigns, totalRegionsClicks);

        res.json({ regions: totalRegionsClicks });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "An error occurred while fetching regions data" });
    }
});

statsRouter.get("/:campaignID/unsubscribed", async (req: Request, res: Response) => {
    const { campaignID } = req.params;
    
    try {
        const emailCampaigns = await prisma.emailCampaign.findMany({
            where: { campaignID },
        });

        const smsCampaigns = await prisma.sMSCampaign.findMany({
            where: { campaignID },
        });

        const whatsappCampaigns = await prisma.whatsAppCampaign.findMany({
            where: { campaignID },
        });

        if (emailCampaigns.length === 0 && smsCampaigns.length === 0 && whatsappCampaigns.length === 0) {
            return res.status(404).json({ error: "Campaign not found" });
        }

        let totalUnsubscribed = 0;

        emailCampaigns.forEach((emailCampaign) => {
            totalUnsubscribed += emailCampaign.unsubscribed;
        });

        smsCampaigns.forEach((smsCampaign) => {
            totalUnsubscribed += smsCampaign.unsubscribed;
        });

        whatsappCampaigns.forEach((whatsappCampaign) => {
            totalUnsubscribed += whatsappCampaign.unsubscribed;
        });

        res.json({ unsubscribed: totalUnsubscribed });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "An error occurred while fetching unsubscribed data" });
    }
});

const prismaMapCT: { [key: string]: keyof PrismaClient } = {
    email: 'emailCampaign',
    sms: 'sMSCampaign',
    whatsapp: 'whatsAppCampaign'
};

statsRouter.get("/:campaignID/bounces/:campaignType", async (req: Request, res: Response) => {
    const { campaignID, campaignType } = req.params;

    const modelName = prismaMapCT[campaignType];

    if (!modelName) {
        return res.status(400).json({ error: "Invalid campaign type" });
    }

    try {
        // Use type assertion to inform TypeScript about the expected method
        const campaigns = await (prisma[modelName] as any).findMany({
            where: { campaignID }
        });

        if (!campaigns || campaigns.length === 0) {
            return res.status(404).json({ error: "Campaign not found" });
        }

        const totalBounced = campaigns.reduce((total: number, campaign: any) => total + campaign.bounced, 0);

        res.json({ stat: totalBounced });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "An error occurred while fetching bounces" });
    }
});


statsRouter.get('/campaign/:campaignId', async (req, res) => {
    const { campaignId } = req.params;
  
    try {
      // Fetch the campaign with related sub-campaigns
      const campaign = await prisma.campaign.findUnique({
        where: { id: campaignId },
        include: {
          whatsappCampaign: true,
          smsCampaign: true,
          emailCampaign: true,
        },
      });
  
      if (!campaign) {
        return res.status(404).json({ error: 'Campaign not found' });
      }
  
      // Map the campaign data to the required structure
      const result = {
        campaignName: campaign.campaignName,
        subCampaigns: {
          whatsapp: campaign.whatsappCampaign.map((subCampaign) => ({
            subCampaignName: subCampaign.campaignTitle,
            targeted: subCampaign.targeted,
            bounced: subCampaign.bounced,
            opened: subCampaign.targeted - subCampaign.bounced, // assuming opened is targeted minus bounced
            mobile: subCampaign.regionsClicks.filter(region => region === 'mobile').length, // assuming mobile/desktop differentiation
            desktop: subCampaign.regionsClicks.filter(region => region === 'desktop').length,
          })),
          sms: campaign.smsCampaign.map((subCampaign) => ({
            subCampaignName: subCampaign.campaignTitle,
            targeted: subCampaign.targeted,
            bounced: subCampaign.bounced,
            opened: subCampaign.targeted - subCampaign.bounced,
            mobile: subCampaign.regionsClicks.filter(region => region === 'mobile').length,
            desktop: subCampaign.regionsClicks.filter(region => region === 'desktop').length,
          })),
          email: campaign.emailCampaign.map((subCampaign) => ({
            subCampaignName: subCampaign.campaignTitle,
            targeted: subCampaign.targeted,
            bounced: subCampaign.bounced,
            opened: subCampaign.opened,
            mobile: subCampaign.mobile,
            desktop: subCampaign.desktop,
          })),
        },
      };
  
      res.json(result);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'An error occurred while fetching campaign data' });
    }
  });
  
statsRouter.get('/total-stats', async (req, res) => {
    try {
      // Fetch all campaigns with their related sub-campaigns
      const campaigns = await prisma.campaign.findMany({
        include: {
          whatsappCampaign: true,
          smsCampaign: true,
          emailCampaign: true,
        },
      });
  
      // Initialize total stats
      let totalTargeted = 0;
      let totalBounced = 0;
  
      // Aggregate stats from all sub-campaigns
      campaigns.forEach(campaign => {
        campaign.whatsappCampaign.forEach(subCampaign => {
          totalTargeted += subCampaign.targeted;
          totalBounced += subCampaign.bounced;
        });
  
        campaign.smsCampaign.forEach(subCampaign => {
          totalTargeted += subCampaign.targeted;
          totalBounced += subCampaign.bounced;
        });
  
        campaign.emailCampaign.forEach(subCampaign => {
          totalTargeted += subCampaign.targeted;
          totalBounced += subCampaign.bounced;
        });
      });
  
      // Send response with the total stats
      res.json({ totalTargeted, totalBounced });
    } catch (error) {
      console.error('Error calculating stats:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });


export default statsRouter;
