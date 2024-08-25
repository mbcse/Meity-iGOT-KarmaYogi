import React from 'react';
import ReportCard, { ReportCardProps } from './ReportCard';
import { CommType } from '@/states/chat.atom';

// Function to fetch stats data from the API
async function fetchStats(): Promise<ReportCardProps[]> {
  try {
    const response = await fetch('http://localhost:3010/stats/total-stats');
    const data = await response.json();

    // Map the API response to ReportCardProps format
    const mappedData: ReportCardProps[] = [
      {
        stat: data.totalTargeted,
        commType: [CommType.Mail, CommType.SMS, CommType.Whatsapp], // Assuming all comm types are included
        title: 'Targeted',
      },
      {
        stat: data.totalBounced,
        commType: [CommType.Mail, CommType.SMS, CommType.Whatsapp], // Assuming all comm types are included
        title: 'Bounced',
      }
    ];

    return mappedData;
  } catch (error) {
    console.error('Failed to fetch stats data:', error);
    return []; // Return an empty array in case of error
  }
}

export default async function OverallBar() {
  // Fetch data on the server
  const overallStatsData = await fetchStats();

  return (
    <div className='p-4 flex gap-4 overflow-x-auto'>
      {overallStatsData.map((data: ReportCardProps, index) => (
        <ReportCard key={index} stat={data.stat} commType={data.commType} title={data.title} />
      ))}
    </div>
  );
}