"use client";

import React from 'react';
import { Mails, MessagesSquare, Users } from "lucide-react";
import { CampCardProps } from '@/app/((main))/campaigns/page';
import { CampaignBadge } from '@/app/((main))/campaigns/columns';
// Apply the interface to the component
export default function CampCard({
  campaignName,
  noOfSMS,
  noOfEmails,
  noOfWhatsApp,
  noOfUsers,
  status
}: CampCardProps) {
  return (
    <div className='relative w-[500px]  flex flex-col gap-3 shadow-md border-[1px] border-gray-200 p-16 overflow-hidden rounded-md'>
      {/* Background image */}
      <div
        className="absolute inset-0 w-full h-full"
      ></div>


      {/* Content on top of the background */}
      <div className="relative z-10 ">
        <h3 className='text-4xl font-bold'>{campaignName}</h3>

        <div className='flex flex-col gap-2 mt-4'>
          
          <div className='flex items-center gap-3'>
          <div className="flex items-center gap-2 p-2">
            <Users />
            {noOfUsers}
          </div>

          <div>
            <CampaignBadge status={status} />
          </div>
          </div>

          <div className="flex gap-2">
            <div className="flex items-center gap-2 p-2">
              <Mails />
              {noOfEmails}
            </div>
            <div className="flex items-center gap-2 p-2">
              <MessagesSquare />
              {noOfSMS}
            </div>
            <div className="flex items-center gap-2 p-2">
              <MessagesSquare />
              {noOfWhatsApp}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
