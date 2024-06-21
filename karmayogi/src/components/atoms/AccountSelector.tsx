"use client";

import React from 'react';

interface iAccountInfo {
    mobile?: number;
    email?: string;
    name: string;
}

export interface iAccountSelection {
    pfplink: string;
    accountInfo: iAccountInfo;
}

interface AccountSelectorProps {
    pfplink: string;
    accountInfo: iAccountInfo;
    onSelect: () => void;
}

export default function AccountSelector({ pfplink, accountInfo, onSelect }: AccountSelectorProps) {
    return (
        <div
            className="flex items-center justify-between gap-3 p-3 bg-slate-300 w-[300px] cursor-pointer hover:bg-slate-400 shadow-md transition-all duration-300"
            onClick={onSelect}
        >
            <div className='my-2 w-[60px] h-[60px]'>
                <img src={pfplink} alt="User profile picture" className='rounded-full w-[60px] h-[60px] aspect-square' />
            </div>

            <div className='flex flex-col'>
                <span>{accountInfo.email}</span>
                <span>{accountInfo.name}</span>
            </div>
        </div>
    );
}
