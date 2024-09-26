import { conn } from '@/database/pg-db';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
    try {
        const searchParams = req.nextUrl.searchParams;
        const viewName = searchParams.get('viewName');
        // Fetch the data from the view
        const result = await conn.query(`SELECT * FROM "${viewName}"`);
        // Return the data as a JSON response
        return NextResponse.json(result.rows);
    } catch (err) {
        console.log(err);
        return err;
    }
}