import express, { Request, Response, Router } from 'express';
import { PrismaClient } from '@prisma/client';
const bucketsRouter: Router = express.Router();

const prisma = new PrismaClient();

bucketsRouter.post('/create', async (req: Request, res: Response) => {
    try {
        console.log('Request body:', req.body);
        const { viewName, sqlQuery } = req.body;

        // Ensure viewName and sqlQuery are provided
        if (!viewName || !sqlQuery) {
            return res.status(400).json({ error: 'viewName and sqlQuery are required' });
        }

        const newName = viewName.toLowerCase().replace(/\s+/g, '_');

        // Check if the bucket name already exists
        const existingBucket = await prisma.buckets.findUnique({
            where: { changedName: viewName },
        });

        if (existingBucket) {
            return res.status(409).json({ error: 'Bucket with this name already exists' });
        }

        const newBucket = await prisma.buckets.create({
            data: {
                name: viewName,
                changedName: newName,
                query: sqlQuery,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
        });

        console.log('New bucket created:', newBucket);
        res.json({ newName });
    } catch (error) {
        console.error('Error creating bucket:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}); 

export default bucketsRouter;
