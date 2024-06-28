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



campaignRouter.post(':campaignID/create/emailcamp',(req:Request,res:Response)=>{
 // todo
})

campaignRouter.post(':campaignID/create/smscamp',(req:Request,res:Response)=>{
 // todo
 
})

campaignRouter.post(':campaignID/create/whatsappcamp',(req:Request,res:Response)=>{
 // todo

})