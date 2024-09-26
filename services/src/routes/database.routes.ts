import express, { Request, Response } from "express";

const dbRouter = express.Router();

dbRouter.post("/", async (req: Request, res: Response) => {
    try {
        console.log(req.body);
        const { sqlQuery } = req.body;
        const result = await prisma.$queryRawUnsafe(sqlQuery);
        res.json({ result });
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
});

export default dbRouter;