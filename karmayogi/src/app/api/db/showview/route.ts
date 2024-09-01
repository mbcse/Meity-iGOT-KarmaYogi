import { conn } from '@/database/pg-db';
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest): Promise<NextResponse> {
    try {
        const searchParams = req.nextUrl.searchParams;
        const viewName = searchParams.get('viewName');

        if (!viewName) {
            return NextResponse.json({ message: 'Missing viewName parameter' }, { status: 400 });
        }

        // Fetch the data from the view
        const result = await conn.query(`SELECT * FROM "${viewName}"`);

        // Return the data as a JSON response
        return NextResponse.json(result.rows);
    } catch (err) {
        console.error(err);
        // Return an error response with status 500
        return NextResponse.json({ message: 'An error occurred', error: err }, { status: 500 });
    }
}
