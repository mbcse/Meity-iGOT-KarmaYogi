import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Link from 'next/link';

export interface ReportTableProps {
  id: string;
  campaignName: string;
  timeCreate: string;
}

async function fetchCampaigns() {
  try {
    const response = await fetch(`http://localhost:3010/campaigns`, {
      next: { revalidate: 60 }, // Optional: Revalidate data every 60 seconds
    });
    if (!response.ok) {
      throw new Error('Failed to fetch campaigns');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching campaigns:', error);
    return [];
  }
}

export default async function ReportTable() {
  const campaigns: ReportTableProps[] = await fetchCampaigns();

  return (
    <Card className="m-8 max-h-screen">
      <CardHeader className="px-7">
        <CardTitle>Reports</CardTitle>
        <CardDescription>View your reports.</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Reports</TableHead>
              <TableHead className="hidden md:table-cell">Date</TableHead>
              <TableHead className="hidden md:table-cell">Sub Campaigns</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="max-h-[70%] overflow-y-auto">
            {campaigns.map((campaign) => (
              <TableRow
                className="shadow-inner"
                key={campaign.id}
              >
                <TableCell>
                  <div className="font-medium">
                    <Link href={`/reports/${campaign.id}`}>
                      {campaign.campaignName}
                    </Link>
                  </div>
                </TableCell>
                <TableCell className="hidden sm:table-cell">
                  {campaign.timeCreate.toString()}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
