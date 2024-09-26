import { PrismaClient, Prisma } from '@prisma/client';
import express, { Request, Response } from 'express';

const prisma = new PrismaClient();
const pixelRouter = express.Router();

pixelRouter.get("/email/:id", async (req: Request, res: Response) => {
  try {
    // Set response headers for a transparent 1x1 pixel
    const { id } = req.params;
    res.set({
      'Content-Type': 'image/gif',
      'Cache-Control': 'no-store, no-cache, must-revalidate, private',
      'Pragma': 'no-cache',
      'Expires': '0'
    });

    // Extract device type from request query or headers
    const deviceType = req.query.deviceType?.toString() || 'desktop';

    // Increment counters based on device type
    let updateData: Prisma.EmailCampaignUpdateInput = {
      opened: {
        increment: 1
      }
    };
    if (deviceType === "mobile") {
      updateData = {
        ...updateData,
        mobile: {
          increment: 1
        }
      };
    } else {
      updateData = {
        ...updateData,
        desktop: {
          increment: 1
        }
      };
    }

    // Assuming currLocation is extracted from request headers or IP location middleware
    const currLocation = (req.headers['x-forwarded-for'] as string) || (req.connection.remoteAddress as string);

    // Fetch the current regionsClicks value
    const emailCampaign = await prisma.emailCampaign.findUnique({
      where: {
        id: id
      },
      select: {
        regionsClicks: true
      }
    });

    if (emailCampaign && emailCampaign.regionsClicks) {
      // Convert the regionsClicks array to an object
      const regionsClicksArray = emailCampaign.regionsClicks as string[];
      const regionsClicks = regionsClicksArray.reduce((acc: { [key: string]: number }, curr: string) => {
        acc[curr] = (acc[curr] || 0) + 1;
        return acc;
      }, {});

      // Update the regionsClicks object
      if (regionsClicks[currLocation]) {
        regionsClicks[currLocation] += 1;
      } else {
        regionsClicks[currLocation] = 1;
      }

      // Convert the updated regionsClicks object back to an array
      const updatedRegionsClicks = Object.entries(regionsClicks).map(([region, count]) => `${region}:${count}`);

      // Update email campaign statistics using Prisma
      await prisma.emailCampaign.update({
        where: {
          id: id
        },
        data: {
          ...updateData,
          regionsClicks: updatedRegionsClicks
        }
      });

      // Send the 1x1 pixel data
      const pixel = Buffer.from('R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7', 'base64');
      res.send(pixel);
    } else {
      res.status(404).send("Campaign not found");
    }
  } catch (error) {
    console.error("Error processing pixel request:", error);
    res.status(500).send("Internal Server Error");
  }
});

export default pixelRouter;
