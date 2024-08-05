import { conn } from '@/database/pg-db';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest,res:NextResponse) {
    try {
        const request = await req.json();
        console.log(request)
        const bucketName = request.bucketName;

        // Fetch the data from the view
        const result = await conn.query(`SELECT email FROM "${bucketName}"`);
        // Return the data as a JSON response
        return NextResponse.json(result.rows);
    } catch (err) {
        console.log(err);
        return err;
    }
}