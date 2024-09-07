"use client";

import { useAtom } from 'jotai';
import { campaignsAtom, isCreateModalOpenAtom } from '@/states/campcard.atom';
import { useToast } from '@/components/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { X } from 'lucide-react';
import { useState } from 'react';

export default function CreateCampaignModal() {
  const [campaignName, setCampaignName] = useState<string>('');
  const [campaigns, setCampaigns] = useAtom(campaignsAtom);
  const [isCreateModalOpen, setIsCreateModalOpen] = useAtom(isCreateModalOpenAtom);
  const { toast } = useToast();

  const handleClose = () => {
    setIsCreateModalOpen(false);
  };

  const handleCreateCampaign = async () => {
    if (campaignName === '' || campaignName.length < 5) {
      toast({
        title: "Campaign Name is empty",
        description: "Campaign name cannot be empty and shouldn't be less than 5 characters",
      });
      return;
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_SERVICES_BE_HOST}/campaigns/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ campaignName }),
    });

    if (!response.ok) {
      console.error("Error creating campaign:", await response.text());
      toast({
        title: "Error",
        description: "Failed to create campaign. Please try again.",
      });
      return;
    }

    const result = await response.json();
    console.log("API Response:", result);

    if (result && result.campaignName) {
      setCampaigns([...campaigns, result]);
      setCampaignName('');
      handleClose();
    } else {
      toast({
        title: "Error",
        description: "Invalid campaign data received.",
      });
    }
  };

  if (!isCreateModalOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="fixed inset-0 bg-gray-800 opacity-50" />
      <div className="relative bg-white p-8 rounded-lg shadow-lg w-[480px] min-h-[150px]">
        <Button
          variant="ghost"
          onClick={handleClose}
          className="absolute top-2 right-2"
        >
          <X />
        </Button>
        <CardTitle className="text-2xl font-bold mb-4">Create Campaign</CardTitle>
        <CardContent className="flex flex-col gap-4">
          <Input
            value={campaignName}
            onChange={(e) => setCampaignName(e.target.value)}
            placeholder="Enter Campaign Name ..."
          />
          <Button onClick={handleCreateCampaign} className="w-full">
            Create
          </Button>
        </CardContent>
      </div>
    </div>
  );
}
