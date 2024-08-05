import express, { Request, Response, Router } from 'express';
import { PrismaClient } from '@prisma/client';
const bucketsRouter: Router = express.Router();

const prisma = new PrismaClient();

bucketsRouter.post('/create', async (req: Request, res: Response) => {
    try {
        console.log(req.body);
        const { viewName, sqlQuery } = req.body;
        const newName = viewName.toLowerCase().replace(/\s+/g, '_');

        const newBucket = await prisma.buckets.create({
            data: {
                name: viewName,
                changedName: newName,
                query: sqlQuery,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
        });

        console.log(newBucket);
        res.json({ newName: newName });
    } catch (error) {
        console.error('Error creating bucket:', error);
        res.status(500).json({ error: 'Error creating bucket' });
    }
}); 

export default bucketsRouter;
