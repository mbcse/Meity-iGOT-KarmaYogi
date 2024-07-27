import React from 'react'
import {TotalVisitorPie} from '@/components/charts/TotalVisitorPie'
import { Devices } from './components/Devices'
import {CampaignWiseDevices} from '@/components/charts/CampaignWiseDevices'
import { I_GlobalChart_EmailTitleComparision, EmailTitleComparision } from './components/EmailTitleComparision'
export default function page({params}:{params:{campaign:string}}) {
// Example dynamic data
const campaignData:  I_GlobalChart_EmailTitleComparision[] = [
  {
    campaignName: "Campaign 1",
    targeted: 1000,
    bounced: 100,
    opened: 800,
    mobile: 400,
    desktop: 500,
    linkConversion: 700,
  },
  {
    campaignName: "Campaign 2",
    targeted: 2000,
    bounced: 200,
    opened: 1600,
    mobile: 800,
    desktop: 1000,
    linkConversion: 1400,
  },
  {
    campaignName: "Campaign 3",
    targeted: 3000,
    bounced: 300,
    opened: 2400,
    mobile: 1200,
    desktop: 1500,
    linkConversion: 2100,
  }
  // Additional campaigns can be added here
]
  
  return (
    <div className='flex flex-col px-8 py-4'>
      <div>
        <h1 className='text-3xl p-4 font-medium'>
        {params.campaign}
        </h1>
      </div>

      <div className='flex  gap-6 scroll-smooth select-none scrollbar  overflow-y-auto p-6'>
        <CampaignWiseDevices />
        <TotalVisitorPie />
        <EmailTitleComparision data={campaignData} />

      </div>
    </div>
  )
}
