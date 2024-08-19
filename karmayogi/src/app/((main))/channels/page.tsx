import React, { useEffect, useState } from 'react';
import SideChat from './components/SideChat';
import CommTabs from './components/CommTabs';
import ChatWindow from './components/ChatWindow';

export default function Page() {


  return (
    <div className='h-full flex flex-col'>
      <CommTabs />

      <div className='flex gap-3 h-full'>
        <SideChat />
        <ChatWindow />
      </div>
    </div>
  );
}
