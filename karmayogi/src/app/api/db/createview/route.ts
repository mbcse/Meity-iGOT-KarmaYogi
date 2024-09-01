import { conn } from '@/database/pg-db';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest): Promise<NextResponse> {
    try {
        const { viewName, sqlQuery } = await req.json(); // Specify the name of the view
        console.log(viewName, sqlQuery);
       
        const response = await fetch(`${process.env.NEXT_PUBLIC_SERVICES_BE_HOST}/buckets/create`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ viewName, sqlQuery })
        });
        console.log("SQL :", sqlQuery);
        const { newName } = await response.json();

        // Create the view in the database
        await conn.query(`CREATE OR REPLACE VIEW ${newName} AS ${sqlQuery}`);
       
        // Return a success response
        return NextResponse.json({ message: 'View created successfully' });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ message: 'An error occurred', error: err }, { status: 500 });
    }
}
