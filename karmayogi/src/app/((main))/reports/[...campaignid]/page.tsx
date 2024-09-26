import { NumberOfXCommWise } from '@/components/charts/NumberOfXCommWise';
import { EmailTitleComparision } from './components/EmailTitleComparision';
import { AggFields } from '../utils/AggFields';
import { SubCampaignTable } from '@/components/atoms/Reports/SubCampaignTable';

export default async function Page({ params }: { params: { campaignid: string } }) {
    const response = await fetch(`${process.env.NEXT_PUBLIC_EXPRESS_SERVER_URL}/stats/campaign/${params.campaignid}`, {
        cache: 'no-store', // Ensures fresh data on every request
    });

    if (!response.ok) {
        return <div>Failed to load data</div>;
    }

    const campaignNameandData = await response.json();

    const aggregatedData_Targetted = AggFields(campaignNameandData, 'targeted');
    const aggregatedData_Bounced = AggFields(campaignNameandData, 'bounced');
    const aggregatedData_LinkConversion = AggFields(campaignNameandData, 'linkConversion');

    return (
        <div className='flex flex-col px-8 py-4'>
            <div>
                <h1 className='text-3xl p-4 font-medium'>
                    {campaignNameandData.campaignName} Report
                </h1>
            </div>

            <div className='flex flex-col gap-2 scroll-smooth select-none scrollbar overflow-y-auto p-6'>
                <div className='flex gap-2'>
                    <NumberOfXCommWise X={"Targetted"} data={aggregatedData_Targetted} />
                    <NumberOfXCommWise X={"Bounced"} data={aggregatedData_Bounced} />
                </div>
                <div>
                    <EmailTitleComparision data={campaignNameandData.subCampaigns.email} />
                </div>
                <div className='pt-4'>
                    <div className='flex flex-col'>
                        <SubCampaignTable title="Email Campaigns" subCampaigns={campaignNameandData.subCampaigns.email} />
                    </div>
                    <div>
                        <SubCampaignTable title="SMS Campaigns" subCampaigns={campaignNameandData.subCampaigns.sms} />
                    </div>
                    <div>
                        <SubCampaignTable title="Whatsapp Campaigns" subCampaigns={campaignNameandData.subCampaigns.whatsapp} />
                    </div>
                </div>
            </div>
        </div>
    );
}
