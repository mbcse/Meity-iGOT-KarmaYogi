import { PrismaClient, Prisma } from '@prisma/client';
import express, { Request, Response } from 'express';

const prisma = new PrismaClient();
const campaignRouter = express.Router();

const deleteAssociatedCampaigns = async (campaignID: string) => {
  await prisma.emailCampaign.deleteMany({ where: { campaignID } });
  await prisma.sMSCampaign.deleteMany({ where: { campaignID } });
  await prisma.whatsAppCampaign.deleteMany({ where: { campaignID } });
};

// Fetch all campaigns with associated details
campaignRouter.get('/', async (req: Request, res: Response) => {
  try {
    const campaigns = await prisma.campaign.findMany();

    return res.json(campaigns);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while fetching campaigns' });
  }
});


campaignRouter.get('/subcampaigns/:campaignID', async (req: Request, res: Response) => {
  try {
    const { campaignID } = req.params;
    console.log(campaignID)
    const campaign = await prisma.campaign.findUnique({
      where: {
        id: campaignID,
      },
      select:{
        emailCampaign: true,
        smsCampaign: true,
        whatsappCampaign: true,
      },
      
    });

    if (!campaign) {
      return res.status(404).json({ error: 'Campaign not found' });
    }

    return res.json(campaign);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while fetching the campaign' });
  }
});

// Create a new campaign
campaignRouter.post('/create', async (req: Request, res: Response) => {
  try {
    const { campaignName } = req.body;

    const newCampaign = await prisma.campaign.create({
      data: {
        campaignName,
        timeCreate: new Date(),
        campaignType: [],
      },
    });

    return res.json({ event: newCampaign });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while creating the campaign' });
  }
});

// Delete a campaign and associated campaigns
campaignRouter.delete('/:campaignID', async (req: Request, res: Response) => {
  try {
    const { campaignID } = req.params;

    await deleteAssociatedCampaigns(campaignID);

    await prisma.campaign.delete({
      where: {
        id: campaignID,
      },
    });

    return res.json({ message: 'Campaign and associated campaigns deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while deleting the campaign' });
  }
});

// Delete associated email campaigns
campaignRouter.delete('/emails/:campaignID', async (req: Request, res: Response) => {
  try {
    const { campaignID } = req.params;

    await prisma.emailCampaign.deleteMany({ where: { campaignID } });

    return res.json({ message: 'Email campaigns deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while deleting the email campaigns' });
  }
});

// Delete associated SMS campaigns
campaignRouter.delete('/sms/:campaignID', async (req: Request, res: Response) => {
  try {
    const { campaignID } = req.params;

    await prisma.sMSCampaign.deleteMany({ where: { campaignID } });

    return res.json({ message: 'SMS campaigns deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while deleting the SMS campaigns' });
  }
});

// Delete associated WhatsApp campaigns
campaignRouter.delete('/whatsapp/:campaignID', async (req: Request, res: Response) => {
  try {
    const { campaignID } = req.params;

    await prisma.whatsAppCampaign.deleteMany({ where: { campaignID } });

    return res.json({ message: 'WhatsApp campaigns deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while deleting the WhatsApp campaigns' });
  }
});

// Delete a specific email campaign
campaignRouter.delete('/email/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await prisma.emailCampaign.delete({ where: { id } });

    return res.json({ message: 'Email campaign deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while deleting the email campaign' });
  }
});

// Delete a specific SMS campaign
campaignRouter.delete('/sms/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await prisma.sMSCampaign.delete({ where: { id } });

    return res.json({ message: 'SMS campaign deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while deleting the SMS campaign' });
  }
});

// Delete a specific WhatsApp campaign
campaignRouter.delete('/whatsapp/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await prisma.whatsAppCampaign.delete({ where: { id } });

    return res.json({ message: 'WhatsApp campaign deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while deleting the WhatsApp campaign' });
  }
});

// Update campaign name
campaignRouter.patch('/:campaignID/update/name', async (req: Request, res: Response) => {
  try {
    const { campaignID } = req.params;
    const { campaignName } = req.body;

    const updatedCampaign = await prisma.campaign.update({
      where: { id: campaignID },
      data: { campaignName },
    });

    return res.json({ message: 'Successfully updated', campaign: updatedCampaign });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while updating the campaign name' });
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
        regionsClicks: [],
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
  const { Number, SMSBody, scheduled } = req.body;

  try {
    const smsCampaign = await prisma.sMSCampaign.create({
      data: {
        campaignID,
        Number:Number,
        SMSBody,
        scheduled: new Date(scheduled),
        status: 'PENDING',
        regionsClicks: [],
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
  const { Number, textbody, scheduled } = req.body;

  try {
    const whatsappCampaign = await prisma.whatsAppCampaign.create({
      data: {
        campaignID,
        Number:Number,
        textbody,
        scheduled: new Date(scheduled),
        status: 'PENDING',
        regionsClicks: [],
      },
    });

    res.status(201).json(whatsappCampaign);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create WhatsApp campaign' });
  }
});  


export default campaignRouter;
