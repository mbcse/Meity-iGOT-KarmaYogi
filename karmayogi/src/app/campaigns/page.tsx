"use client";
import React, { useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import CampCard from '@/components/atoms/Campaigns/CampCard/CampCard';
import { campCardAtom, CampaignData, campCardChildAtom } from '@/states/campcard.atom';
import { useAtom } from 'jotai';
import { useRouter, useSearchParams } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Card, CardTitle, CardContent } from '@/components/ui/card';
import { X } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

export default function Page() {
  const searchParams = useSearchParams();
  const [campCardArr, setCampCardArr] = useAtom<CampaignData[]>(campCardAtom);
  const [, setCampCardChild] = useAtom(campCardChildAtom);
  const [campaignName, setCampaignName] = React.useState<string>('');

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

  const handleClose = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete('create');
    router.replace(`?${params.toString()}`);
  };

  const handleCreateCampaign = async () => {
    try {
      if (campaignName === '' || campaignName.length < 5) {
        toast({
          title: "Campaign Name is empty",
          description: "Campaign name cannot be empty and shouldn't be less than 5 characters",
        });

        return;
      }
      const response = await fetch('http://localhost:3010/campaigns/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          campaignName: campaignName,
        }),
      });
      const data = await response.json();
      
      if(data.error){
        toast({
          title: "Error",
          description: data.error,
        });

        return;
      }
      setCampCardArr([...campCardArr, data.event]);
      setCampaignName('');
      handleClose();
    } catch (error) {
      console.error('Error creating campaign:', error);
    }
  };

  const {toast} = useToast();

  return (
    <>
      {searchParams.get('create') === 'true' && (
        <div className='z-10 absolute inset-0 flex items-center justify-center'>
          <Card className='p-8 w-[480px] min-h-[150px] shadow-sm'>
            <CardTitle className='flex justify-between items-center'>
              <h1 className='text-2xl font-bold'>Create Campaign</h1>
              <Button variant={'ghost'} onClick={handleClose}>
                <X />
              </Button>
            </CardTitle>

            <CardContent className='flex mt-2 flex-col w-full p-4 gap-2 justify-evenly items-center'>
              <Input
                value={campaignName}
                onChange={(e) => setCampaignName(e.target.value)}
                placeholder={'Enter Campaign Name ...'}
              />
              <Button className='w-full' onClick={handleCreateCampaign}>
                Create
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
      <div className={`${searchParams.get('create') === 'true' ? "blur-md" : ""}`}>
        <div className='flex justify-between items-center p-4'>
          <h1 className="text-4xl font-black">Campaigns</h1>
          <Button>
            <Link href="?create=true">Create +</Link>
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
      </div>
    </>
  );
}


