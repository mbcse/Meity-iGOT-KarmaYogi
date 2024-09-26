import { Pool } from "pg";


  export const  conn = new Pool({
    user: process.env.PGSQL_USER,
    password: process.env.PGSQL_PASSWORD,
    host: process.env.PGSQL_HOST,
    port: parseInt(process.env.PGSQL_PORT as string),
    database: process.env.PGSQL_DATABASE,
    log: console.log,
  });
