"use client";

import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAtom } from "jotai";
import { selectedChatAtom,selectedChatAtomProps } from "@/states/chat.atom";

interface SideChatProps {
  data: selectedChatAtomProps[];
}

export default function SideChat({ data }: SideChatProps) {
  const [_, setSelectedChat] = useAtom(selectedChatAtom);

  const getDisplayName = (item: selectedChatAtomProps): string => {
    return item.name || item.email || item.phone || "Unknown";
  };

  return (
    <div className="max-w-48 h-full flex-grow overflow-y-auto border-[1px] rounded-tr-lg">
      {data.map((item) => (
        <div
          key={item.id}
          onClick={() => setSelectedChat(item)}
          className="flex gap-4 h-20 items-center p-3 hover:bg-gray-50 cursor-pointer"
        >
          <Avatar>
            <AvatarImage src={item.avatar} />
            <AvatarFallback>{getDisplayName(item).charAt(0)}</AvatarFallback>
          </Avatar>

          <div className="ml-2 overflow-hidden">
            <h1 className="text-sm font-semibold">{getDisplayName(item)}</h1>
            <p className="text-xs text-gray-500 overflow-hidden whitespace-nowrap text-ellipsis">
              {item.message}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
