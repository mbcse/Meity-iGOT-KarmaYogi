"use client";

import React from 'react';
import CampCard from './CampCard';
import { CampCardProps } from '@/app/((main))/campaigns/page';

export default function CampCardList({ campaigns }:{
    campaigns: CampCardProps[]
}) {
  // Filter campaigns to include only those with status "draft"


  return (
    <div className='flex overflow-x-auto px-8 scrollbar'>
      {campaigns.length > 0 ? (
        campaigns.map((campCard, index) => (
          <div className='m-2' key={index}>
            <CampCard {...campCard} />
          </div>
        ))
      ) : (
        <p className='text-center w-full'>No draft campaigns available.</p>
      )}
    </div>
  );
}
