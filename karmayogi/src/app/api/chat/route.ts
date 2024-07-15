import { NextRequest, NextResponse } from "next/server";
import { ChatGroq } from "@langchain/groq";
import { PromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import fs from "fs";
import path from "path";
import winston from "winston";

// Setup Winston logger
const logDir = 'logs';
if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir);
}

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
    ),
    transports: [
        new winston.transports.File({ filename: path.join(logDir, 'combined.log') }),
        new winston.transports.File({ filename: path.join(logDir, 'error.log'), level: 'error' }),
    ],
});

export async function GET(res: NextResponse) {
    try {
        return NextResponse.json({ message: "Welcome to the chat API" });
    } catch (error) {
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const { userinput } = await req.json();

        // Log user input
        logger.info({ userinput });

        // Check for blocked phrases
        const blockedPhrases = ["delete the table", "update the table", "change username"];
        const containsBlockedPhrase = blockedPhrases.some(phrase =>
            userinput.toLowerCase().includes(phrase)
        );

        if (containsBlockedPhrase) {
            logger.error({ message: "Blocked phrase detected", userinput });
            return NextResponse.json({ error: "Blocked phrase detected" }, { status: 400 });
        }

        const tableName = "User";
        const tableSchema = `
        CREATE TABLE "${tableName}" (
            id            SERIAL PRIMARY KEY,
            name          TEXT NOT NULL,
            email         TEXT NOT NULL,
            jobTitle      TEXT,
            gender        TEXT,
            number        TEXT,
            officeStartTime    TEXT,
            officeEndTime    TEXT,
            location      TEXT,
            birthday    TIMESTAMP
        );
    `;
const prompt = `Convert {userinput} to a SINGLE LINE raw SQL query, no comments, no text, just pure SQL. Table name is ${tableName}. This is the schema for it: ${tableSchema}. The column names are case sensitive.`;


        const sqlPrompt = PromptTemplate.fromTemplate(prompt);
        const model = new ChatGroq({
            temperature: 0.9,
            apiKey: process.env.GROQ_API_KEY,
            modelName: "mixtral-8x7b-32768",
        });
        const parser = new StringOutputParser();
        const chain = sqlPrompt.pipe(model).pipe(parser);

        const response = await chain.invoke({ userinput });

        // Log the model output
        logger.info({ userinput, response });

        // Check for blocked SQL commands
        const blockedCommands = ["UPDATE", "DROP", "DELETE"];
        const containsBlockedCommand = blockedCommands.some(command =>
            response.toUpperCase().includes(command)
        );

        if (containsBlockedCommand) {
            logger.error({ message: "Blocked SQL command detected", userinput, response });
            return NextResponse.json({ error: "Blocked SQL command detected" }, { status: 400 });
        }

        const data = { sqlQuery: response };

        // Example fetch usage (adjust as per your actual endpoint)
        const tableData = await fetch(`${process.env.DOMAIN}/api/prix`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });

        const tableDataJson = await tableData.json();

        return NextResponse.json(tableDataJson);
    } catch (error) {
        if (error instanceof Error) {
            logger.error({ message: error.message, stack: error.stack });
        } else {
            logger.error({ message: "Unknown error", error });
        }
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
