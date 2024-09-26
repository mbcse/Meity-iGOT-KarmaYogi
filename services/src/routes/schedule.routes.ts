import express, { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const scheduleRouter = express.Router();
const prisma = new PrismaClient();

scheduleRouter.get('/health', (req, res) => {
    res.json('healthy');
});




scheduleRouter.get('/', async (req: Request, res: Response) => {
    const now = new Date();
    
    // Extract current date and time components
    const currentDateISO = now.toISOString().split('T')[0]; // YYYY-MM-DD
    const currentTime = now.toTimeString().split(' ')[0]; // HH:MM:SS

    // Combine current date and time into ISO format
    const currentDateTimeISO = new Date(`${currentDateISO}T${currentTime}Z`);

    // Calculate the end datetime for 24 hours later
    const twentyFourHoursLater = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    const futureDateISO = twentyFourHoursLater.toISOString().split('T')[0]; // YYYY-MM-DD
    const futureTime = twentyFourHoursLater.toTimeString().split(' ')[0]; // HH:MM:SS

    // Combine future date and time into ISO format
    const futureDateTimeISO = new Date(`${futureDateISO}T${futureTime}Z`);

    // Query the database
    const schedule = await prisma.scheduled.findMany({
        where: {
            AND: [
                {
                    scheduled: {
                        gte: currentDateISO, // Start date
                        lte: futureDateISO // End date
                    }
                },
                {
                    // Combine scheduled date with timeToBeSent
                    timeToBeSent: {
                        gte: currentTime, // Ensure the time matches
                        lte: futureTime // Ensure the time matches
                    }
                }
            ]
        }
    });

    res.json(schedule);
});

// Function to combine date and time into ISO string
function getCombinedDateTime(dateISO: string, time: string) {
    const [hours, minutes] = time.split(':').map(Number);
    const dateTime = new Date(dateISO);
    dateTime.setUTCHours(hours);
    dateTime.setUTCMinutes(minutes);
    dateTime.setUTCSeconds(0);
    dateTime.setUTCMilliseconds(0);
    return dateTime.toISOString();
}

scheduleRouter.post('/', (req: Request, res: Response) => {

});

export default scheduleRouter;