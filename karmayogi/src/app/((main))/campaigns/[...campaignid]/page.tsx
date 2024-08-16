"use client";
import React, { useEffect, useState, useCallback } from 'react';
import CampCard from '@/components/atoms/Campaigns/CampCard/CampCard';
import CampSlider from '@/components/atoms/Campaigns/CampSlider/CampSlider';
import { CampaignData, campCardAtom, campCardChildAtom } from '@/states/campcard.atom';
import { useAtomValue, useSetAtom } from 'jotai';
import { Button } from '@/components/ui/button';
import { useSearchParams, useRouter } from 'next/navigation';
import WhatsappCampaignCreate from '@/forms/Whatsapp/WhatsappCampaignCreate';
import EmailCampaignCreate from '@/forms/Email/EmailCampaignCreate';
import SMSCampaignCreate from '@/forms/SMS/SMSCampaignCreate';

export default function Page({ params }: { params: { slug: string } }) {
  const searchParams = useSearchParams();
  const create = searchParams.get('create');
  const setCampCardChild = useSetAtom(campCardChildAtom);
  const [campCardParentData, setCampCardParentData] = useState<CampaignData | null>(null);
  const [whatsappCampaigns, setWhatsappCampaigns] = useState([]);
  const [emailCampaigns, setEmailCampaigns] = useState([]);
  const [smsCampaigns, setSmsCampaigns] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const storedCampCard = localStorage.getItem('campCardChild');
    if (storedCampCard) {
      const parsedCampCard = JSON.parse(storedCampCard) as CampaignData;
      setCampCardParentData(parsedCampCard);
      setCampCardChild(parsedCampCard); // Set the atom value
    }
  }, [setCampCardChild]);

  useEffect(() => {
    if (campCardParentData) {
      const fetchCampaigns = async () => {
        try {
          const response = await fetch(`http://localhost:3010/campaigns/subcampaigns/${campCardParentData.id}`);
          const data = await response.json();
          const { whatsappCampaign, emailCampaign, smsCampaign } = data;
          setWhatsappCampaigns(whatsappCampaign);
          setEmailCampaigns(emailCampaign);
          setSmsCampaigns(smsCampaign);
        } catch (error) {
          console.error('Error fetching campaigns:', error);
        }
      };

      fetchCampaigns();
    }
  }, [campCardParentData]);

  const closeModal = useCallback(() => {
    const { pathname } = window.location;
    router.push(pathname); // Removes all query parameters
  }, [router]);
  

  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeModal();
      }
    };

    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [closeModal]);

  if (!campCardParentData) {
    return <div>Loading...</div>;
  }

  const renderCreateForm = () => {
    if (create === 'whatsapp') {
      return <WhatsappCampaignCreate campaignId={campCardParentData.id}/>;
    } else if (create === 'email') {
      return <EmailCampaignCreate campaignId={campCardParentData.id} />;
    } else if (create === 'sms') {
      return <SMSCampaignCreate campaignId={campCardParentData.id} />;
    }
    return null;
  };

  return (
    <>
      {create && (
        <div className='absolute z-10 shadow-lg top-[40%] right-[20%] w-3/5'>
          {renderCreateForm()}
        </div>
      )}
      <section className={`${create ? "blur-md" : ""}`}>
        <div>
          <CampCard
            title={campCardParentData.campaignName}
            noOfSMS={campCardParentData.noOfSMS}
            noOfEmail={campCardParentData.noOfEmails}
            noOfWhatsapp={campCardParentData.noOfWhatsApp}
            noOfUsers={campCardParentData.noOfUsers}
            bgImgUrl={campCardParentData.bgImgUrl}
            blurred={true}
            isAPage
          />
          <div className='p-8'>
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
        </div>
      </section>
    </>
  );
}

const CampaignSection = ({ title, campaigns, campaignId,onAddClick }:{
  title:any;
  campaigns:any;
  campaignId:string;
  onAddClick:any;
}) => (
  <>
    <div className='flex items-center gap-4'>
      <h1 className='font-semibold text-3xl px-2 py-4'>{title}</h1>
      <Button className='p-2' onClick={onAddClick}>
        Add +
      </Button>
    </div>
    <CampSlider campaignCards={campaigns} campaignType={title.toUpperCase()} campaignId={campaignId} />
  </>
);
