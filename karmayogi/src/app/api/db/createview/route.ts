import { conn } from '@/database/pg-db';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    try {
        const { viewName, sqlQuery } = await req.json(); // Specify the name of the view

        const response = await fetch('http://localhost:3010/buckets/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ viewName,sqlQuery })
        });

        const { newName } = await response.json();

        console.log(newName);
        // Create the view in the database
        await conn.query(`CREATE OR REPLACE VIEW ${newName} AS ${sqlQuery}`);

        // Return a success response
        return NextResponse.json({ message: 'View created successfully' });
    } catch (err) {
        console.log(err);
        return err;
    }
}
