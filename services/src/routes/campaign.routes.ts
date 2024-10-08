import { PrismaClient, Prisma, CampaignStatus } from "@prisma/client";
import express, { Request, Response } from "express";
import { differenceInDays, isBefore } from 'date-fns';
import axios from "axios";
import { handleQueueRequest } from "./producer.routes";
import { addEmailToQueue, addSMSToQueue, addWhatsappToQueue, addEmailToQueue_NonCampaign } from '../utils/producers';


const prisma = new PrismaClient();
const campaignRouter = express.Router();

const deleteAssociatedCampaigns = async (campaignID: string) => {
  await prisma.emailCampaign.deleteMany({ where: { campaignID } });
  await prisma.sMSCampaign.deleteMany({ where: { campaignID } });
  await prisma.whatsAppCampaign.deleteMany({ where: { campaignID } });
};

// Fetch all campaigns with associated details
campaignRouter.get("/", async (req: Request, res: Response) => {
  try {
    const campaigns = await prisma.campaign.findMany();

    return res.json(campaigns);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching campaigns" });
  }
});


campaignRouter.get('/:campaignID', async (req, res) => {
  const { campaignID } = req.params;

  try {
    const campaign = await prisma.campaign.findUnique({
      where: {
        id: campaignID,
      },
      select: {
        id: true,
        campaignName: true,
        timeCreate: true,
        noOfEmails: true,
        noOfSMS: true,
        noOfWhatsApp: true,
        noOfUsers: true,
        status: true,
        campaignType: true,
        emailCampaign: {
          select: {
            id: true,
            campaignTitle: true,
            bucketID: true,
            mailbody: true,
            fromMail: true,
            status: true,
            scheduled: true,
            timeToBeSent: true,
            targeted: true,
            opened: true,
            bounced: true,
            unsubscribed: true,
            spamReports: true,
            desktop: true,
            mobile: true,
            regionsClicks: true,
            bucket: {
              select: {
                name: true,
                changedName: true,
              },
            },
          },
        },
        smsCampaign: {
          select: {
            id: true,
            campaignTitle: true,
            bucketID: true,
            Number: true,
            SMSBody: true,
            status: true,
            scheduled: true,
            timeToBeSent: true,
            targeted: true,
            bounced: true,
            unsubscribed: true,
            regionsClicks: true,
            bucket: {
              select: {
                name: true,
                changedName: true,
              },
            },
          },
        },
        whatsappCampaign: {
          select: {
            id: true,
            campaignTitle: true,
            bucketID: true,
            Number: true,
            textbody: true,
            status: true,
            scheduled: true,
            timeToBeSent: true,
            targeted: true,
            bounced: true,
            unsubscribed: true,
            regionsClicks: true,
            bucket: {
              select: {
                name: true,
                changedName: true,
              },
            },
          },
        },
      },
    });
  
    if (!campaign) {
      return res.status(404).json({ error: 'Campaign not found' });
    }
  
    return res.json(campaign);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'An error occurred while fetching the campaign' });
  }
  
});

campaignRouter.get(
  "/subcampaigns/:campaignID",
  async (req: Request, res: Response) => {
    try {
      const { campaignID } = req.params;
      console.log(campaignID);
      const campaign = await prisma.campaign.findUnique({
        where: {
          id: campaignID,
        },
        select: {
          emailCampaign: true,
          smsCampaign: true,
          whatsappCampaign: true,
        },
      });

      if (!campaign) {
        return res.status(404).json({ error: "Campaign not found" });
      }

      return res.json(campaign);
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ error: "An error occurred while fetching the campaign" });
    }
  },
);

// Create a new campaign
// Create a new campaign
campaignRouter.post("/create", async (req: Request, res: Response) => {
  try {
    const { campaignName } = req.body;
    if (campaignName == null || campaignName == "") {
      return res.status(400).json({ error: "Campaign name cannot be empty" });
    }

    const existingCampaign = await prisma.campaign.findFirst({
      where: {
        campaignName: campaignName,
      },
    });

    if (existingCampaign) {
      return res.status(400).json({ error: "Campaign name already exists" });
    }

    const newCampaign = await prisma.campaign.create({
      data: {
        campaignName,
        timeCreate: new Date(),
        campaignType: [],
      },
    });

    return res.json(newCampaign); // Return the campaign directly
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while creating the campaign" });
  }
});


// Delete a campaign and associated campaigns
campaignRouter.delete("/:campaignID", async (req: Request, res: Response) => {
  try {
    const { campaignID } = req.params;

    await deleteAssociatedCampaigns(campaignID);

    await prisma.campaign.delete({
      where: {
        id: campaignID,
      },
    });

    return res.json({
      message: "Campaign and associated campaigns deleted successfully",
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while deleting the campaign" });
  }
});

campaignRouter.delete(
  "/:campaignType/:campaignID",
  async (req: Request, res: Response) => {
    try {
      const { campaignType, campaignID } = req.params;

      let deleteResult;

      switch (campaignType) {
        case "emails":
          deleteResult = await prisma.emailCampaign.deleteMany({ where: { campaignID } });
          break;
        case "sms":
          deleteResult = await prisma.sMSCampaign.deleteMany({ where: { campaignID } });
          break;
        case "whatsapp":
          deleteResult = await prisma.whatsAppCampaign.deleteMany({ where: { campaignID } });
          break;
        default:
          return res.status(400).json({ error: "Invalid campaign type" });
      }

      if (deleteResult.count === 0) {
        return res.status(404).json({ message: "No campaigns found to delete" });
      }

      return res.json({ message: `${campaignType} campaigns deleted successfully` });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        error: `An error occurred while deleting the ${req.params.campaignType} campaigns`,
      });
    }
  },
);


campaignRouter.delete(
  "/:campaignType/:id",
  async (req: Request, res: Response) => {
    try {
      const { campaignType, id } = req.params;

      let deleteResult;

      switch (campaignType) {
        case "email":
          deleteResult = await prisma.emailCampaign.delete({ where: { id } });
          break;
        case "sms":
          deleteResult = await prisma.sMSCampaign.delete({ where: { id } });
          break;
        case "whatsapp":
          deleteResult = await prisma.whatsAppCampaign.delete({ where: { id } });
          break;
        default:
          return res.status(400).json({ error: "Invalid campaign type" });
      }

      return res.json({ message: `${campaignType} campaign deleted successfully` });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        error: `An error occurred while deleting the ${req.params.campaignType} campaign`,
      });
    }
  },
);


// Update campaign name
campaignRouter.patch(
  "/:campaignID/update/name",
  async (req: Request, res: Response) => {
    try {
      const { campaignID } = req.params;
      const { campaignName } = req.body;

      const updatedCampaign = await prisma.campaign.update({
        where: { id: campaignID },
        data: { campaignName },
      });

      return res.json({
        message: "Successfully updated",
        campaign: updatedCampaign,
      });
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ error: "An error occurred while updating the campaign name" });
    }
  },
);

campaignRouter.post(
  "/:campaignID/create/:campaignType",
  async (req: Request, res: Response) => {
    const { campaignID, campaignType } = req.params;
    console.log(req.params);
    const { email, number, template, scheduled, campaignName, bucket, time, message } = req.body;
    console.log(req.body);

    // Validate common fields
    if ((!template && !message) || !scheduled || !campaignName || !bucket || !time) {
      return res.status(400).json({ error: "All fields are required" });
    }

    if (campaignType === "emailcamp" && !email) {
      return res.status(400).json({ error: "Email field is required" });
    }

    const dateTimeString = `${scheduled}T${time}:00Z`;

    const validDate = new Date(dateTimeString);
    console.log("Valid date:", validDate);

    if (isNaN(validDate.getTime())) {
      return res.status(400).json({ message: "Invalid date or time" });
    }

    try {
      const bucketChangedName = bucket;
      console.log("Bucket changed name:", bucketChangedName);

      const currentTime = new Date();
      const scheduledTime = new Date(scheduled);

      let campaignData;

      switch (campaignType) {
        case "emailcamp":
          campaignData = await prisma.emailCampaign.create({
            data: {
              campaign: { connect: { id: campaignID } },
              campaignTitle: campaignName,
              fromMail: email,
              mailbody: template,
              scheduled: scheduledTime.toISOString(),
              status: "scheduled",
              regionsClicks: [],
              timeToBeSent: time,
              bucket: { connect: { changedName: bucketChangedName } },
            },
          });
          await prisma.campaign.update({
            where: { id: campaignID },
            data: { noOfEmails: { increment: 1 } },
          });
          req.body.work_type = "email";
          req.body.sub_campaign_id = campaignData.id;
          req.body.validDate = validDate;
          req.body.subjectLine = campaignName;
          if (differenceInDays(scheduledTime, currentTime) < 1) {
            if(await handleQueueRequest(req, res, addEmailToQueue, 'Email added to queue', "emaillist")) {
              await prisma.emailCampaign.update({
                where: { id: campaignData.id },
                data: { status: CampaignStatus.queued },
              });
            }
          }
          break;

        case "smscamp":
          campaignData = await prisma.sMSCampaign.create({
            data: {
              campaign: { connect: { id: campaignID } },
              campaignTitle: campaignName,
              Number: number,
              SMSBody: template,
              scheduled: scheduledTime.toISOString(),
              timeToBeSent: time,
              status: "scheduled",
              regionsClicks: [],
              bucket: { connect: { changedName: bucketChangedName } },
            },
          });
          await prisma.campaign.update({
            where: { id: campaignID },
            data: { noOfSMS: { increment: 1 } },
          });
          req.body.work_type = "SMS";
          req.body.sub_campaign_id = campaignData.id;

          if (differenceInDays(scheduledTime, currentTime) < 1) {
            await handleQueueRequest(req, res, addSMSToQueue, 'SMS added to queue', "smslist");
          }
          break;

        case "whatsappcamp":
          campaignData = await prisma.whatsAppCampaign.create({
            data: {
              campaign: { connect: { id: campaignID } },
              campaignTitle: campaignName,
              Number: number,
              textbody: template,
              scheduled: scheduledTime.toISOString(),
              status: "scheduled",
              regionsClicks: [],
              timeToBeSent: time,
              bucket: { connect: { changedName: bucketChangedName } },
            },
          });
          await prisma.campaign.update({
            where: { id: campaignID },
            data: { noOfWhatsApp: { increment: 1 } },
          });
          req.body.work_type = "whatsapp";
          req.body.sub_campaign_id = campaignData.id;

          if (differenceInDays(scheduledTime, currentTime) < 1) {
            await handleQueueRequest(req, res, addWhatsappToQueue, 'WhatsApp added to queue', "whatsapplist");
          }
          break;

        default:
          return res.status(400).json({ error: "Invalid campaign type" });
      }

      if (!res.headersSent) {
        console.log(`${campaignType} campaign created:`, campaignData);
        return res.status(200).json(campaignData);
      }
    } catch (error) {
      console.error(`Failed to create ${campaignType} campaign:`, error);
      if (!res.headersSent) {
        return res.status(500).json({ error: `Failed to create ${campaignType} campaign` });
      }
    }
  }
);




export default campaignRouter;

