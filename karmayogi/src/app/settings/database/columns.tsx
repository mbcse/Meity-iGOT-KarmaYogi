"use client"

import { ColumnDef } from "@tanstack/react-table"

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type TableColumns = {
  column_name: string
}

export const columns: ColumnDef<TableColumns>[] = [
  {
    accessorKey: "column_name",
    header: "Column Name",
  }
]
