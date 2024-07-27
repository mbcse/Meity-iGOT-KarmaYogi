import { PrismaClient, Prisma } from '@prisma/client';
import express, { Request, Response } from 'express';

const prisma = new PrismaClient();
const templateRouter = express.Router();

// Fetch all templates

templateRouter.get('/list/whatsapp', async (req: Request, res: Response) => {
  try {
    const templates = await prisma.template.findMany({
        where:{
            type: {
                has:"WHATSAPP"
            }
        }
    });

    console.log(templates);
    return res.json(templates);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while fetching templates' });
  }
});

templateRouter.get('/list/email', async (req: Request, res: Response) => {
  try {
    const templates = await prisma.template.findMany({
        where:{
            type: {
                has:"EMAIL"
            }
        }
    });

    return res.json(templates);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while fetching templates' });
  }
});

templateRouter.get('/list/sms', async (req: Request, res: Response) => {
    try {
        const templates = await prisma.template.findMany({
            where:{
                type: {
                    has:"SMS"
                }
            }
        });
    
        return res.json(templates);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while fetching templates' });
    }
});


export default templateRouter;
