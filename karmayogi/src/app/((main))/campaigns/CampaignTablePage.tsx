"use client";
import React,{useEffect} from 'react'
import { CampCardType, columns } from "./columns"
import { DataTable } from "./campaign-table"
import { useAtom } from 'jotai'
import { campaignsAtom } from '@/states/campcard.atom'
import CreateCampaignModal from '@/components/atoms/Campaigns/CreateCampaignModal';
import { Button } from '@/components/ui/button';
import { isCreateModalOpenAtom } from '@/states/campcard.atom';

export default function CampaignTablePage() {
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
      <h1 className="text-4xl font-black"> Campaigns</h1>
      <Button onClick={handleCreateClick}>Create +</Button>
    </div>

          <div className="container mx-auto py-10">
      <DataTable columns={columns} data={campaigns} />
    </div>
    <CreateCampaignModal />
    </div>
  )
}
