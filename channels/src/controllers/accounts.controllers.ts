import { Request, Response } from 'express';
import { EmailAccount } from "../models/EmailAccount";

export const getAccountsController = async (req: Request, res: Response) => {
    const { chatCommType } = req.params;

    try {
        if (!chatCommType) {
            return res.status(400).json({ error: "chatCommType is required" });
        }

        let accounts = [];

        switch (chatCommType) {
            case "Mail":
                accounts = await EmailAccount.find().select('-password');
                break;
        
            default:
                return res.status(400).json({ error: "Invalid chatCommType" });
        }

        return res.status(200).json(accounts);
    } catch (error) {   
        return res.status(500).json({ error: error });
    }
};


