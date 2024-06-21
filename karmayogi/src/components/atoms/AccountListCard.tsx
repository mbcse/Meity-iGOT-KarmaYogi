"use client";

import React, { useState } from 'react';
import { ChevronsUpDown } from 'lucide-react';

import AccountSelector, { iAccountSelection } from './AccountSelector';

export default function AccountListCard({ acc }: { acc: iAccountSelection }) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState(acc);

  const otherAccountArr = [
    {
      pfplink: "https://images.pexels.com/photos/25748613/pexels-photo-25748613/free-photo-of-a-man-in-black-shirt-and-sunglasses-standing-against-a-wall.jpeg?auto=compress&cs=tinysrgb&w=600&lazy=load",
      accountInfo: {
        email: "info1@shivamja.in",
        name: "Shivam1 Jain"
      }
    },
    {
      pfplink: "https://images.pexels.com/photos/25748613/pexels-photo-25748613/free-photo-of-a-man-in-black-shirt-and-sunglasses-standing-against-a-wall.jpeg?auto=compress&cs=tinysrgb&w=600&lazy=load",
      accountInfo: {
        email: "info2@shivamja.in",
        name: "Shivam12 Jain"
      }
    }
  ];

  const handleSelect = (account: iAccountSelection) => {
    setSelectedAccount(account);
    setIsOpen(false);
  };

  return (
    <>
      <div
        className={`flex items-center justify-between gap-3 p-3 ${isOpen ? "rounded-t-lg" : "rounded-lg"} bg-slate-300 w-[300px] cursor-pointer shadow-md transition-all duration-300`}
        onClick={() => {
          setIsOpen(!isOpen);
        }}
      >
        <div className='my-2 w-[60px] h-[60px]'>
          <img src={selectedAccount.pfplink} alt="User profile picture" className='rounded-full w-[60px] h-[60px] aspect-square' />
        </div>

        <div className='flex flex-col'>
          <span>{selectedAccount.accountInfo.email}</span>
          <span>{selectedAccount.accountInfo.name}</span>
        </div>

        <div>
          <ChevronsUpDown />
        </div>
      </div>

      {isOpen && (
        <div className="border-t border-gray-300 bg-slate-300 rounded-b-lg shadow-md transition-all duration-300 animate-slide-down">
          {otherAccountArr.map((account, index) => (
            <AccountSelector
              key={index}
              pfplink={account.pfplink}
              accountInfo={account.accountInfo}
              onSelect={() => handleSelect(account)}
            />
          ))}
        </div>
      )}
    </>
  );
}
