import { conn } from '@/database/pg-db';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest): Promise<NextResponse> {
    try {
        const request = await req.json();
        console.log(request);
        const bucketName = request.bucketName;

        // Fetch the data from the view
        const result = await conn.query(`SELECT email FROM "${bucketName}"`);
        
        // Return the data as a JSON response
        return NextResponse.json(result.rows);
    } catch (err) {
        console.error(err);
        // Return an error response with status 500
        return NextResponse.json({ message: 'An error occurred', error: err }, { status: 500 });
    }
}
