import express, { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";


const initDbRouter = express.Router();
const prisma = new PrismaClient();


initDbRouter.post("/saveselected", async (req: Request, res: Response) => {
    try {
        const { dblink, selectedTables }: { dblink: string; selectedTables: { [tableName: string]: string[] } } = req.body;


        // Start transaction
        const savedDatabase = await prisma.$transaction(async (tx) => {
            const savedDatabase = await tx.database.create({
                data: {
                    url: dblink,
                },
            });

            for (const [tableName, columns] of Object.entries(selectedTables)) {
                const savedTable = await tx.table.create({
                    data: {
                        name: tableName,
                        databaseId: savedDatabase.id,
                    },
                });

                await tx.column.createMany({
                    data: columns.map((columnName) => ({
                        name: columnName,
                        type: 'String', // Modify this if you want the actual column type
                        tableId: savedTable.id,
                    })),
                });
            }

            return savedDatabase;
        });

        res.json(savedDatabase);
    } catch (err) {
        console.error(err);
        res.status(500).send("Internal Server Error");
    }
});

const FILE_PATH = path.join(process.cwd(), "databases.txt"); // Adjust the path as needed

initDbRouter.post("/finish", async (req: Request, res: Response) => {
    try {
        // Fetch all databases with their tables and columns
        const databases = await prisma.database.findMany({
            include: {
                tables: {
                    include: {
                        columns: true,
                    },
                },
            },
        });

        let fileContent = '';

        databases.forEach((db) => {
            fileContent += `DB Name: ${db.url}\n`;
            fileContent += `Tables:\n`;

            db.tables.forEach((table) => {
                fileContent += `  ${table.name} : [ ${table.columns.map((col) => col.name).join(', ')} ]\n`;
            });

            fileContent += '\n'; // Separate databases with a newline
        });

        // Append to file
        fs.appendFileSync(FILE_PATH, fileContent, 'utf8');

        res.json({ message: 'File updated successfully' });
    } catch (err) {
        console.log('Error occurred:', err);
        res.status(500).send("Internal Server Error");
    }
});

export default initDbRouter;