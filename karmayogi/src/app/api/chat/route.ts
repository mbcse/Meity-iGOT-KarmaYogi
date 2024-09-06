import { NextRequest, NextResponse } from "next/server";
import { ChatGroq } from "@langchain/groq";
import { PromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import fs from "fs";
import path from "path";
import winston from "winston";


export async function GET(req:NextRequest,res: NextResponse) {
    try {
        return NextResponse.json({ message: "Welcome to the chat API" });
    } catch (error) {
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const { userinput } = await req.json();


        // Check for blocked phrases
        const blockedPhrases = ["delete the table", "update the table", "change username"];
        const containsBlockedPhrase = blockedPhrases.some(phrase =>
            userinput.toLowerCase().includes(phrase)
        );

        if (containsBlockedPhrase) {
            return NextResponse.json({ error: "Blocked phrase detected" }, { status: 400 });
        }

        const tableName = "User";
        const tableSchema = `
        CREATE TABLE "${tableName}" (
            id            SERIAL PRIMARY KEY,
            name          TEXT NOT NULL,
            email         TEXT NOT NULL,
            jobtitle      TEXT,
            gender        TEXT,
            number        TEXT,
            officestarttime    TEXT,
            officeendtime    TEXT,
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


        // Check for blocked SQL commands
        const blockedCommands = ["UPDATE", "DROP", "DELETE"];
        const containsBlockedCommand = blockedCommands.some(command =>
            response.toUpperCase().includes(command)
        );

        if (containsBlockedCommand) {
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
        return NextResponse.json({tableData:tableDataJson,sqlQuery:data.sqlQuery});
    } catch (error) {
        return NextResponse.json({ error: error }, { status: 500 });
    }
}
