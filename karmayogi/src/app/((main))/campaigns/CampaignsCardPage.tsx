"use client";
import { useAtom } from 'jotai';
import { useEffect } from 'react';
import { campaignsAtom, isCreateModalOpenAtom } from '@/states/campcard.atom';
import CampCardList from '@/components/atoms/Campaigns/CampCard/CampCardList';
import CreateCampaignModal from '@/components/atoms/Campaigns/CreateCampaignModal';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function CampaignsCardPage() {
  const [campaigns, setCampaigns] = useAtom(campaignsAtom);
  const [isCreateModalOpen, setIsCreateModalOpen] = useAtom(isCreateModalOpenAtom);

const handleCreateClick = () => {
  setIsCreateModalOpen(true); 
};


  useEffect(() => {
    const fetchCampaigns = async () => {
      const response = await fetch('http://localhost:3010/campaigns', { cache: 'no-store' });
      const data = await response.json();
      setCampaigns(data);
    };

    fetchCampaigns();
  }, [setCampaigns]);

  return (
    <div>
      <div className='flex justify-between items-center p-4'>
        <h1 className="text-4xl font-black">Draft Campaigns</h1>
        <Button onClick={handleCreateClick}>Create +</Button>
      </div>

      <CampCardList campaigns={campaigns} />
      <CreateCampaignModal />
    </div>
  );
}
