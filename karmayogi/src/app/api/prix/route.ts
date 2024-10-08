import { NextRequest, NextResponse } from "next/server";
import prisma from "@/database/db";

const expectedColumns = [
  'name', 'email', 'jobtitle', 'gender', 'number',
  'officestarttime', 'officeendtime', 'location', 'birthday'
];

function quoteColumnNames(sql:string) {
  expectedColumns.forEach(column => {
    const regex = new RegExp(`\\b${column}\\b`, 'g');
    sql = sql.replace(regex, `"${column}"`);
  });
  return sql;
}

export async function POST(req: NextRequest) {
  try {
    const { sqlQuery } = await req.json();
    console.log("Original SQL Query:", sqlQuery);

    const quotedSqlQuery = quoteColumnNames(sqlQuery);
    console.log("Quoted SQL Query:", quotedSqlQuery);

    const result = await prisma.$queryRawUnsafe(quotedSqlQuery);
    console.log(result)
    return NextResponse.json({ result });
  } catch (error) {
    console.error(error);
    return NextResponse.error();
  }
}
