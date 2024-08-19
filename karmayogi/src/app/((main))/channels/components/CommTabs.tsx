"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import { useAtom } from 'jotai';
import { chatCommTypeAtom, CommType } from '@/states/chat.atom';

export default function CommTabs() {
    const comms: CommType[] = [CommType.Mail, CommType.SMS, CommType.Whatsapp];
    const [selectedComm, setSelectedComm] = useAtom(chatCommTypeAtom);

    return (
        <div className='p-4'>
            {
                comms.map((comm) => (
                    <Button 
                        key={comm} 
                        onClick={() => setSelectedComm(comm)} 
                        className={`mr-4 rounded-xl ${selectedComm === comm ? 'bg-[#4F45E0] text-white' : ''}`}>
                        {comm}
                    </Button>
                ))
            }
        </div>
    );
}
