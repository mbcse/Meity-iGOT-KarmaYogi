"use client";
import React, { useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import CampCard from '@/components/atoms/Campaigns/CampCard/CampCard';
import { campCardAtom, CampaignData, campCardChildAtom } from '@/states/campcard.atom';
import { useAtom } from 'jotai';
import { useRouter } from 'next/navigation';

export default function Page() {
  const [campCardArr, setCampCardArr] = useAtom<CampaignData[]>(campCardAtom);
  const [, setCampCardChild] = useAtom(campCardChildAtom);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:3010/campaigns');
        const data: CampaignData[] = await response.json();
        setCampCardArr(data);
      } catch (error) {
        console.error('Error fetching campaign data:', error);
      }
    };

    fetchData();
  }, [setCampCardArr]);

  const router = useRouter();

  const handleCampaignClick = (campCard: CampaignData) => {
    setCampCardChild(campCard);
    localStorage.setItem('campCardChild', JSON.stringify(campCard)); // Save to local storage
    router.push(`/campaigns/${campCard.campaignName}`);
  };

  return (
    <>
      <div className='flex justify-between items-center p-4'>
        <h1 className="text-4xl font-black">Campaigns</h1>
        <Button>
          <Link href="/">Create +</Link>
        </Button>
      </div>

      <div className='p-8'>
        {campCardArr.map((campCard, index) => (
          <div className='m-2' key={index} onClick={() => handleCampaignClick(campCard)}>
            <CampCard
              title={campCard.campaignName}
              noOfSMS={campCard.noOfSMS}
              noOfEmail={campCard.noOfEmails}
              noOfWhatsapp={campCard.noOfWhatsApp}
              noOfUsers={campCard.noOfUsers}
              bgImgUrl={campCard.bgImgUrl}
              blurred={true}
              isAPage={false}
            />
          </div>
        ))}
      </div>
    </>
  );
}
