"use client"

import React, { useEffect } from 'react'
import { Badge } from "@/components/ui/badge"
import {
Card,
CardContent,
CardDescription,
CardHeader,
CardTitle,
} from "@/components/ui/card"
import {
Table,
TableBody,
TableCell,
TableHead,
TableHeader,
TableRow,
} from "@/components/ui/table"
import { useRouter } from 'next/navigation'

interface Campaign{
    id:string;
    campaignName: string;
    timeCreate: string;
}

export default function page() {
    const [campaigns, setCampaigns] = React.useState([]);

    const router = useRouter();

    useEffect(() => {
        const fetchCampaigns = async () => {
            try {
                const response = await fetch(`http://localhost:3010/campaigns`);
                const data = await response.json();
                console.log(data)
                setCampaigns(data);
            } catch (error) {
                console.error('Error fetching campaigns:', error);
            }
        };

        fetchCampaigns();
    },[]);
  return (
    <Card className='m-8'>
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
          <TableBody>
            { campaigns.map((campaign:Campaign)=>(
            <TableRow className='shadow-inner'
            key={campaign.id}
            onClick={()=>{
                router.push(`/reports/${campaign.id}`)
            }} >
              <TableCell>
                <div className="font-medium">{campaign.campaignName}</div>
              </TableCell>
              <TableCell className="hidden sm:table-cell">{campaign.timeCreate.toString()}</TableCell>
            </TableRow>
            ))
            }
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
