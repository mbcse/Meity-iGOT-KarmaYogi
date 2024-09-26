import { PrismaClient, Prisma } from '@prisma/client';
import express, { Request, Response } from 'express';

const prisma = new PrismaClient();
const pixelRouter = express.Router();

pixelRouter.get("/email/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Set response headers for a transparent 1x1 pixel
    res.set({
      'Content-Type': 'image/gif',
      'Cache-Control': 'no-store, no-cache, must-revalidate, private',
      'Pragma': 'no-cache',
      'Expires': '0'
    });

    console.log(req);
    // Get symbols from the request object
    const symbols = Object.getOwnPropertySymbols(req);

    // Find the symbol that represents 'kHeaders'
    const kHeadersSymbol = symbols.find(symbol => symbol.toString() === 'Symbol(kHeaders)');

    let deviceType = 'desktop'; // default to desktop

    if (kHeadersSymbol) {
      // Use type assertion to bypass TypeScript error
      const kHeaders = (req as any)[kHeadersSymbol] as any;

      // Check for the 'sec-ch-ua-mobile' header
      if (kHeaders && kHeaders['sec-ch-ua-mobile']) {
        const isMobile = kHeaders['sec-ch-ua-mobile'] === '?1'; // mobile if '?1', otherwise desktop
        deviceType = isMobile ? 'mobile' : 'desktop';
      }
    }

    // Increment counters based on the detected device type
    let updateData: Prisma.EmailCampaignUpdateInput = {
      opened: { increment: 1 },
    };

    if (deviceType === 'mobile') {
      updateData.mobile = { increment: 1 };
    } else {
      updateData.desktop = { increment: 1 };
    }

    // Get the IP address from the request headers (x-forwarded-for for proxies)
    const ip = (req.headers['x-forwarded-for'] as string) || req.connection.remoteAddress;

    // Fetch the current regionsClicks value from the database
    const emailCampaign = await prisma.emailCampaign.findUnique({
      where: { id: id },
      select: { regionsClicks: true },
    });

    if (emailCampaign && emailCampaign.regionsClicks) {
      // Convert the regionsClicks array to an object
      const regionsClicksArray = emailCampaign.regionsClicks as string[];
      const regionsClicks = regionsClicksArray.reduce((acc: { [key: string]: number }, curr: string) => {
        acc[curr] = (acc[curr] || 0) + 1;
        return acc;
      }, {});

      // Update the regionsClicks object based on IP address
      if (ip && regionsClicks[ip]) {
        regionsClicks[ip] += 1;
      } else if (ip) {
        regionsClicks[ip] = 1;
      }

      // Convert the updated regionsClicks object back to an array
      const updatedRegionsClicks = Object.entries(regionsClicks).map(([ip, count]) => `${ip}:${count}`);

      // Update email campaign statistics using Prisma
      await prisma.emailCampaign.update({
        where: { id: id },
        data: {
          ...updateData,
          regionsClicks: updatedRegionsClicks // Update regionsClicks with new data
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
