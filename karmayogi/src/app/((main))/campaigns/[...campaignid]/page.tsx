"use client";

import React, { useEffect, useState, useCallback } from 'react';
import CampSlider from '@/components/atoms/Campaigns/CampSlider/CampSlider';
import { Button } from '@/components/ui/button';
import { useSearchParams, useRouter, useParams } from 'next/navigation';
import SubCampaignForm from '@/forms/SubCampaignForm';

export default function Page() {
  const searchParams = useSearchParams();
  const params = useParams();
  const [campCardParentData, setCampCardParentData] = useState<any | null>(null);
  const [whatsappCampaigns, setWhatsappCampaigns] = useState([]);
  const [emailCampaigns, setEmailCampaigns] = useState([]);
  const [smsCampaigns, setSmsCampaigns] = useState([]);
  const create = searchParams.get("create");
  const router = useRouter();

  const numbers = [
    {
      value: "9554848382",
      label: "9554848382",
    },
    {
      value: "4535355532",
      label: "4535355532",
    },
  ];

  const emails = [
    {
      value: "somemail@ok.com",
      label: "somemail@ok.com",
    },
    {
      value: "info@shecodeshacks.com",
      label: "info@shecodeshacks.com",
    },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_EXPRESS_SERVER_URL}/campaigns/${params.campaignid}`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        console.log('Fetched campCardParentData:', data);
        setCampCardParentData(data);
        setWhatsappCampaigns(data.whatsappCampaign);
        setEmailCampaigns(data.emailCampaign);
        setSmsCampaigns(data.smsCampaign);
      } catch (error) {
        console.error('Error fetching campCardParentData:', error);
      }
    };

    fetchData();
  }, [params.campaignid]);

  const closeModal = useCallback(() => {
    const { pathname } = window.location;
    router.push(pathname); // Removes all query parameters
  }, [router]);

  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeModal();
    };

    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [closeModal]);

  if (!campCardParentData) return <div>Loading...</div>;

  const renderCreateForm = () => {
    switch (create) {
      case 'whatsapp':
        return <SubCampaignForm emails={emails} numbers={numbers} campaignType='whatsapp' campaignId={campCardParentData.id} />;
      case 'email':
        return <SubCampaignForm emails={emails} numbers={numbers} campaignType='email' campaignId={campCardParentData.id} />;
      case 'sms':
        return <SubCampaignForm emails={emails} numbers={numbers} campaignType='sms' campaignId={campCardParentData.id} />;
      default:
        return null;
    }
  };

  return (
    <>
      {create && (
        <div className='absolute z-10 shadow-lg top-[40%] right-[20%] w-3/5'>
          {renderCreateForm()}
        </div>
      )}
      <section className={`${create ? "blur-md" : ""} p-8`}>
        <div className='flex justify-between items-center'>
          <div className='flex-grow'>
            <h1 className='text-4xl font-bold'>{campCardParentData.campaignName}</h1>
            <div className='flex gap-4 mt-4'>
              <div className='flex flex-col'>
                <div className='flex items-center gap-2'>
                  <span className='text-gray-500'>Created:</span>
                  <span>{new Date(campCardParentData.timeCreate).toLocaleDateString()}</span>
                </div>
                <div className='flex items-center gap-2'>
                  <span className='text-gray-500'>Users:</span>
                  <span>{campCardParentData.noOfUsers}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className='mt-8'>
          <CampaignSection 
            title='Whatsapp' 
            campaigns={whatsappCampaigns} 
            campaignId={campCardParentData.id}
            onAddClick={() => router.push(`?create=whatsapp`)} 
          />
          <CampaignSection 
            title='Email' 
            campaigns={emailCampaigns} 
            campaignId={campCardParentData.id}
            onAddClick={() => router.push(`?create=email`)} 
          />
          <CampaignSection 
            title='SMS' 
            campaigns={smsCampaigns} 
            campaignId={campCardParentData.id}
            onAddClick={() => router.push(`?create=sms`)} 
          />
        </div>
      </section>
    </>
  );
}

const CampaignSection = ({ title, campaigns, campaignId, onAddClick }: {
  title: string;
  campaigns: any[];
  campaignId: string;
  onAddClick: () => void;
}) => (
  <div className='mb-8'>
    <div className='flex items-center justify-between'>
      <h2 className='font-semibold text-2xl'>{title}</h2>
      <Button className='p-2' onClick={onAddClick}>
        Add +
      </Button>
    </div>
    {campaigns.length > 0 ? (
      <CampSlider campaignCards={campaigns} campaignType={title.toUpperCase() as "WA" | "EMAIL" | "SMS"} campaignId={campaignId} />
    ) : (
      <p className='text-gray-500'>No {title.toLowerCase()} campaigns available.</p>
    )}
  </div>
);
