"use client";
import React, { useEffect, useState } from 'react';
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
    const response = await fetch(`${process.env.NEXT_PUBLIC_SERVICES_BE_HOST}/campaigns`, {
      method: 'GET',
      credentials: 'include', // Optional: Include credentials (cookies) in the request
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

export default function ReportTable() {
  const [campaigns, setCampaigns] = useState<ReportTableProps[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadCampaigns = async () => {
      try {
        const data = await fetchCampaigns();
        setCampaigns(data);
      } catch (error) {
        setError('Failed to load campaigns');
      } finally {
        setLoading(false);
      }
    };

    loadCampaigns();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <Card className="m-8 max-h-screen overflow-y-auto">
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
