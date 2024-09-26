import { Card } from '@/components/ui/card';
import { CommType } from '@/states/chat.atom';
import React from 'react';
import { Mail, MessageCircle, MessageSquare } from 'lucide-react';

export interface ReportCardProps {
  stat: number;
  title: string;
  commType: CommType[]; // Allow for single or multiple communication types
}

export default function ReportCard({ stat, title, commType }: ReportCardProps) {
  // Define types for styling
  const negativeStats = ['Unsubscribed', 'Bounced', 'Spam', 'Blocked'];
  const positiveStats = ['Opened', 'Clicked', 'Delivered', 'Sent', 'Doubts','Targeted'];

  // Get color based on the title of the stat
  const getColor = (title: string) => {
    if (negativeStats.includes(title)) return "#DD5D5F";
    if (positiveStats.includes(title)) return "#71D951"; // Green for positive stats
    return "#000000"; // Default color for other cases
  };

  // Icons mapping for communication types
  const commTypeIcons = {
    Mail: <Mail />,
    SMS: <MessageCircle />,
    Whatsapp: <MessageSquare />,
  };

  // Convert stat to a string with appropriate units
  const convertStatToString = (stat: number) => {
    if (stat >= 1000000) return `${Math.floor(stat / 1000000)}M+`;
    if (stat >= 1000) return `${Math.floor(stat / 1000)}K+`;
    return stat.toString();
  };

  return (
    <Card className='flex flex-col min-w-[320px] scrollbar p-6 bg-white border rounded-lg shadow-sm'>
      <div 
        className='font-black text-5xl' 
        style={{ fontFamily: 'Raleway', color: getColor(title) }}
      >
        {convertStatToString(stat)}
      </div>

            <div className='font-semibold text-2xl'>{title}</div>
      <div className='flex gap-2 mt-2 justify-end '>
        {commType.map((type) => (
          <div className='text-gray-400' key={type}>
            {commTypeIcons[type]}
          </div>
        ))}
      </div>
    </Card>
  );
}