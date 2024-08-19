"use client";
import React, { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAtom } from "jotai";
import { selectedChatAtom, SelectedChatAtomProps } from "@/states/chat.atom";

interface SideChatProps {
  initialData: SelectedChatAtomProps[];
}

export default function SideChat() {
  const [_, setSelectedChat] = useAtom(selectedChatAtom);

const handleClick = (item: SelectedChatAtomProps) => {
    console.log("Clicked chat item:", item);
    setSelectedChat(item);
};

  const [chatData, setChatData] = useState<SelectedChatAtomProps[]>([]);

  useEffect(() => {
    fetchLatestMessages();
  }, []);

  const fetchLatestMessages = async () => {
    try {
      const response = await fetch('http://localhost:7000/chat/info@shecodeshacks.com/messagesList');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      console.log(data);
      setChatData(data);
    } catch (error) {
      console.error('Error fetching latest messages:', error);
    }
  };

  const extractEmail = (str: string): string | null => {
    const emailMatch = str.match(/<(.+?)>/);
    return emailMatch ? emailMatch[1] : null;
  };

  return (
    <div className="max-w-64 w-full h-full flex-grow overflow-y-auto border-[1px] rounded-tr-lg">
      {chatData.map((item) => (
        <div
          key={item._id} // Use _id for unique key
          onClick={() => handleClick(item)}
          className="flex gap-4 h-20 items-center p-3 hover:bg-gray-50 cursor-pointer"
        >
          <Avatar>
            <AvatarFallback>{extractEmail(item.from)?.charAt(0)}</AvatarFallback>
          </Avatar>

          <div className="ml-2 overflow-hidden">
            <h1 className="text-sm font-semibold">{extractEmail(item.from)}</h1>
            <p className="text-xs text-gray-500 overflow-hidden whitespace-nowrap text-ellipsis">
              {item.subject}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
