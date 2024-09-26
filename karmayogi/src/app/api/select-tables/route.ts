import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';

export async function POST(req: NextRequest) {
    try {
        // Get the request body
        const request = await req.json();
        const dblink = request.dblink;

        // Parse the DB link into connection configuration
        const url = new URL(dblink);
        const config = {
          user: url.username,
          password: url.password,
          host: url.hostname,
          port: parseInt(url.port, 10), // Parsing the port as an integer
          database: url.pathname.split('/')[1],
        };

        console.log("config : ", config);
        
        // TODO: Create a single connection , and not a pool
        // Create a new connection pool
        const tempconn = new Pool(config);

        // Fetch all the tables in the database
        const result = await tempconn.query(
            `SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public';`
        );
        
        const tables = result.rows.map((row) => row.table_name);
        
        const tableStructures: { [key: string]: any[] } = {};

        for (const tableName of tables) {
          const structureResult = await tempconn.query(
            `SELECT column_name
            FROM information_schema.columns 
            WHERE table_name = $1;`
          , [tableName]);
      
          tableStructures[tableName] = structureResult.rows.map((row) => ({
            column_name: row.column_name,
          }));
        }

        // Release the pool connection
        await tempconn.end();

        // Return the table structures as a JSON response
        return NextResponse.json(tableStructures);

    } catch (err) {
        console.error("Error: ", err);
        // Return an error response with status code 500
        return NextResponse.json({ error: 'Internal Server Error', details: err }, { status: 500 });
    }
}