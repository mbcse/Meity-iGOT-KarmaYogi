import { PrismaClient, Prisma } from '@prisma/client';
import express, { Request, Response } from 'express';

const prisma = new PrismaClient();
const campaignRouter = express.Router();


campaignRouter.post('/create',(req:Request,res:Response)=>{
    try {
        const {campaignName} = req.body;

        const newCampaign = prisma.campaign.create({
            data:{
                campaignName:campaignName
            }
        });

        return res.json({"event":newCampaign})
    } catch (error) {
        console.log(error)
    }
})

campaignRouter.patch(':campaignID/update/name', async (req, res) => {
    try {
        const { campaignID } = req.params;
        const { campaignName } = req.body; // Extract campaignName from the request body

        const updatedCampaign = await prisma.campaign.update({
            where: { id: campaignID },
            data: { campaignName: campaignName },
        });

        return res.json({
            message: "Successfully updated",
            campaign: updatedCampaign, // Optionally return the updated campaign
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "An error occurred while updating the campaign name" });
    }
});



// Create Email Campaign
campaignRouter.post('/:campaignID/create/emailcamp', async (req: Request, res: Response) => {
    const { campaignID } = req.params;
    const { subject, fromMail, mailbody, scheduled } = req.body;
  
    try {
      const emailCampaign = await prisma.emailCampaign.create({
        data: {
          campaignID,
          subject,
          fromMail,
          mailbody,
          scheduled: new Date(scheduled),
          status: 'PENDING',
          targeted: 0,
          bounced: 0,
          opened: 0,
          mobile: 0,
          desktop: 0,
          unsubscribed: 0,
          spamReports: 0,
          regionsClicks: {},
        },
      });
  
      res.status(201).json(emailCampaign);
    } catch (error) {
      res.status(500).json({ error: 'Failed to create email campaign' });
    }
  });
  
  // Create SMS Campaign
  campaignRouter.post('/:campaignID/create/smscamp', async (req: Request, res: Response) => {
    const { campaignID } = req.params;
    const { fromNumber, SMSBody, scheduled } = req.body;
  
    try {
      const smsCampaign = await prisma.sMSCampaign.create({
        data: {
          campaignID,
          fromNumber,
          SMSBody,
          scheduled: new Date(scheduled),
          status: 'PENDING',
          targeted: 0,
          bounced: 0,
          unsubscribed: 0,
          regionsClicks: {},
        },
      });
  
      res.status(201).json(smsCampaign);
    } catch (error) {
      res.status(500).json({ error: 'Failed to create SMS campaign' });
    }
  });
  
  // Create WhatsApp Campaign
  campaignRouter.post('/:campaignID/create/whatsappcamp', async (req: Request, res: Response) => {
    const { campaignID } = req.params;
    const { fromNumber, mailbody, scheduled } = req.body;
  
    try {
      const whatsappCampaign = await prisma.whatsAppCampaign.create({
        data: {
          campaignID,
          fromNumber,
          mailbody,
          scheduled: new Date(scheduled),
          status: 'PENDING',
          targeted: 0,
          bounced: 0,
          unsubscribed: 0,
          regionsClicks: {},
        },
      });
  
      res.status(201).json(whatsappCampaign);
    } catch (error) {
      res.status(500).json({ error: 'Failed to create WhatsApp campaign' });
    }
  });
  

