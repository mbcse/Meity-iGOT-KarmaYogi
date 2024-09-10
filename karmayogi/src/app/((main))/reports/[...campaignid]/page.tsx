"use client";
import { useState, useEffect } from 'react';
import { NumberOfXCommWise } from '@/components/charts/NumberOfXCommWise';
import { EmailTitleComparision } from './components/EmailTitleComparision';
import { AggFields } from '../utils/AggFields';
import { SubCampaignTable } from '@/components/atoms/Reports/SubCampaignTable';

interface CampaignData {
  campaignName: string;
  subCampaigns: {
    email: any[];
    sms: any[];
    whatsapp: any[];
  };
  [key: string]: any; // Adjust based on your actual data structure
}

interface PageProps {
  params: {
    campaignid: string;
  };
}

const Page: React.FC<PageProps> = ({ params }) => {
  const [campaignData, setCampaignData] = useState<CampaignData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCampaignData = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_SERVICES_BE_HOST}/stats/campaign/${params.campaignid}`, {
          method: 'GET',
          credentials: 'include',
          cache: 'no-store', // Ensures fresh data on every request
        });

        if (!response.ok) {
          throw new Error('Failed to load data');
        }

        const data = await response.json();
        setCampaignData(data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching campaign data:', err);
        setError(err.message || 'An error occurred');
        setLoading(false);
      }
    };

    fetchCampaignData();
  }, [params.campaignid]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!campaignData) {
    return <div>No data available</div>;
  }

  const aggregatedData_Targetted = AggFields(campaignData, 'targeted');
  const aggregatedData_Bounced = AggFields(campaignData, 'bounced');
  const aggregatedData_LinkConversion = AggFields(campaignData, 'linkConversion');

  return (
    <div className='flex flex-col px-8 py-4'>
      <div>
        <h1 className='text-3xl p-4 font-medium'>
          {campaignData.campaignName} Report
        </h1>
      </div>

      <div className='flex flex-col gap-2 scroll-smooth select-none scrollbar overflow-y-auto p-6'>
        <div className='flex gap-2'>
          <NumberOfXCommWise X={"Targetted"} data={aggregatedData_Targetted} />
          <NumberOfXCommWise X={"Bounced"} data={aggregatedData_Bounced} />
        </div>
        <div>
          <EmailTitleComparision data={campaignData.subCampaigns.email} />
        </div>
        <div className='pt-4'>
          <div className='flex flex-col'>
            <SubCampaignTable title="Email Campaigns" subCampaigns={campaignData.subCampaigns.email} />
          </div>
          <div>
            <SubCampaignTable title="SMS Campaigns" subCampaigns={campaignData.subCampaigns.sms} />
          </div>
          <div>
            <SubCampaignTable title="Whatsapp Campaigns" subCampaigns={campaignData.subCampaigns.whatsapp} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
