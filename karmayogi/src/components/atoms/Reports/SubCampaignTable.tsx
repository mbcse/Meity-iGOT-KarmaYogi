import React from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface SubCampaign {
  subCampaignName: string
  targeted: number
  bounced: number
  opened: number
  mobile: number
  desktop: number
  linkConversion: number
}

interface SubCampaignTableProps {
  title: string
  subCampaigns: SubCampaign[]
}

export function SubCampaignTable({ title, subCampaigns }: SubCampaignTableProps) {
    console.log(subCampaigns)
  return (
    <div className="mb-8">
      <h2 className="text-xl font-medium mb-4">{title}</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Sub Campaign Name</TableHead>
            <TableHead>Targeted</TableHead>
            <TableHead>Bounced</TableHead>
            <TableHead>Opened</TableHead>
            <TableHead>Mobile</TableHead>
            <TableHead>Desktop</TableHead>
            <TableHead>Link Conversion</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {subCampaigns.map((subCampaign, index) => (
            <TableRow key={index}>
              <TableCell>{subCampaign.subCampaignName}</TableCell>
              <TableCell>{subCampaign.targeted}</TableCell>
              <TableCell>{subCampaign.bounced}</TableCell>
              <TableCell>{subCampaign.opened}</TableCell>
              <TableCell>{subCampaign.mobile}</TableCell>
              <TableCell>{subCampaign.desktop}</TableCell>
              <TableCell>{subCampaign.linkConversion}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
