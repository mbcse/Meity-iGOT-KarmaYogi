"use client";
import React, { useEffect, useState } from 'react';
import ReportCard, { ReportCardProps } from './ReportCard';
import { CommType } from '@/states/chat.atom';

// Function to fetch stats data from the API
async function fetchStats(): Promise<ReportCardProps[]> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_SERVICES_BE_HOST}/stats/total-stats`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // Include credentials (cookies) in the request
    });
    
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    
    const data = await response.json();
    console.log(data);
    
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

    console.log(mappedData);
    return mappedData;
  } catch (error) {
    console.error('Failed to fetch stats data:', error);
    return []; // Return an empty array in case of error
  }
}

export default function OverallBar() {
  const [overallStatsData, setOverallStatsData] = useState<ReportCardProps[]>([]);

  useEffect(() => {
    async function fetchData() {
      const data = await fetchStats();
      setOverallStatsData(data);
    }

    fetchData();
  }, []); // The empty dependency array means this runs once on mount

  return (
    <div className='p-4 flex gap-4 overflow-x-auto'>
      {overallStatsData.map((data: ReportCardProps, index) => (
        <ReportCard key={index} stat={data.stat} commType={data.commType} title={data.title} />
      ))}
    </div>
  );
}
