import { PrismaClient, Prisma } from '@prisma/client';
import express, { Request, Response } from 'express';
import cors from 'cors';
import { uploadFile,downloadFile } from '../utils/s3.utils';
import 'dotenv/config';
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


templateRouter.post('/upload/nocode'
  ,async (req: Request, res: Response) => {
  try {
    const {plainJSON,templateName} = req.body;
    const templateName_final = `${templateName}.json`;
    const savedTemplate = await prisma.template.create({
        data:{
            name: templateName,
            type: {
                set: ["EMAIL"]
            },
            noCode: true,
            body:"This is nocode email template",
            createdAt: new Date(),
            updatedAt: new Date()
        }
    });

    const result = await uploadFile(Buffer.from(plainJSON), templateName_final, process.env.AWS_TEMP_BUCKET as string);
    return res.json({result:result});
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while uploading template' });
  }
})

templateRouter.get('/download/nocode/:templateName', async (req: Request, res: Response) => {
  try {
    const {templateName} = req.params;
    const template = await downloadFile(process.env.AWS_TEMP_BUCKET as string, templateName);
    return res.json(template);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while downloading template' });
  }
});

templateRouter.get('/list/nocode', async (req: Request, res: Response) => {
  try {
    const templates = await prisma.template.findMany({
        where:{
           type:{
             has:"EMAIL"
           },
           noCode: true
        }
    });

    return res.json(templates);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while fetching templates' });
  }
});

export default templateRouter;
