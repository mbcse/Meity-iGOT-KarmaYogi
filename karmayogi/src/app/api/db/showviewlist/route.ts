import { conn } from '@/database/pg-db';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest): Promise<NextResponse> {
    try {
        console.log('Fetching views from the database...');
        const result = await conn.query(`SELECT table_name FROM information_schema.views WHERE table_schema = 'public'`);
        console.log("fetched :",result)
        const viewNames = result.rows.map(({ table_name }) => table_name);

        console.log('Views fetched:', viewNames);

        return NextResponse.json(viewNames);
    } catch (err) {
        console.error('Error fetching views:', err);
        return NextResponse.json({ message: 'An error occurred while fetching views', error: err }, { status: 500 });
    }
}
