import { conn } from '@/database/pg-db';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
    try {
        // Fetch all the views in the database
        const result = await conn.query(`SELECT table_name FROM information_schema.views WHERE table_schema = 'public'`);

        // Extract the view names from the result
        const viewNames = result.rows.map(row => row.table_name);

        // Return the view names as a JSON response
        return NextResponse.json(viewNames);
    } catch (err) {
        console.log(err);
        return err;
    }
}
