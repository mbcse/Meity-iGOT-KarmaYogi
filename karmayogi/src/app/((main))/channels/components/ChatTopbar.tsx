"use client";

import React from 'react';
import { Box, MessagesSquare } from 'lucide-react';
import { useAtom } from 'jotai';
import { ChatRenderAtom, selectedChatAtomProps } from '@/states/chat.atom';

export default function ChatTopbar({ selectedChat }: { selectedChat: selectedChatAtomProps }) {
  const [isChatSelected, setIsChatSelected] = useAtom(ChatRenderAtom);

  const getDisplayText = (): string => {
    return selectedChat.name || selectedChat.email || selectedChat.phone || "No contact information";
  };

  return (
    <div className='flex items-center justify-between h-20 p-8 border-[1px] border-gray-100'>
      <span>{getDisplayText()}</span>

      <div className='flex gap-2'>
        <div onClick={() => setIsChatSelected(false)}>
          <Box className={`${isChatSelected ? "text-gray-500" : "text-black"}`} />
        </div>

        <div onClick={() => setIsChatSelected(true)}>
          <MessagesSquare className={`${isChatSelected ? "text-black" : "text-gray-500"}`} />
        </div>
      </div>
    </div>
  );
}
