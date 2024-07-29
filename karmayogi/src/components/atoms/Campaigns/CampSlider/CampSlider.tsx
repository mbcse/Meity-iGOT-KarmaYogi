import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowUpRight, Users } from 'lucide-react';
import Link from 'next/link';

interface ICampSliderProps {
    campaignType: 'WA' | 'EMAIL' | 'SMS';
    campaignCards: any[];
    campaignId : string;
}

export default function CampSlider({ campaignId, campaignCards }: ICampSliderProps) {
    console.log(campaignCards);
    const title = {
        WA: "Whatsapp Campaigns",
        EMAIL: "Email Campaigns",
        SMS: "SMS Campaigns"
    };

    return (
        <div className='p-8'>
          

            <div className='flex gap-3'>
                { campaignCards.length > 0 ?
                    campaignCards.map((campaignCard, index) => (
                      
                        <div 
                            key={index} 
                            className='bg-white text-black rounded-md shadow-lg w-full max-w-xs py-4 px-8 flex flex-col border-[0.1px] border-gray-200 space-y-4'
                        >
                            <h4 className='text-2xl font-medium truncate' title={campaignCard.campaignTitle}>
                                {campaignCard.campaignTitle}
                            </h4>
                            <div className='flex justify-between items-center p-2 rounded-md'>
                                <div className='flex items-center gap-2'>
                                    <Users />
                                    {campaignCard.targeted}
                                </div>
                                    <Link href={`/reports/${campaignId}`}>
                                <Button className='rounded-full p-2' >
                                    <ArrowUpRight size={16} />                                    
                                </Button>
                                    </Link>
                            </div>
                        </div>
                    ))

                    : 

                    <h1 className='text-2xl font-medium text-gray-400 italic'>Add a campaign to get started</h1>
                }
            </div>
        </div>
    );
}
