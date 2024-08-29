"use client";
import React, { useEffect, useState } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAtom } from "jotai";
import { selectedChatAtom } from "@/states/chat.atom";
import { SelectedChatAtomProps } from "@/states/chat.atom";

// Define the types for email addresses and thread structure
interface EmailAddress {
  address: string;
  name: string;
  _id: string;
}

interface Thread {
  _id: string; // Thread ID (threadId)
  from: EmailAddress;
  to: EmailAddress[];
  cc: EmailAddress[];
  bcc: EmailAddress[];
  subject: string;
  htmlBody: string;
  textBody: string;
  messageID: string;
  inReplyTo: string;
  references: string[];
  seq: number;
  date: string; // Date in ISO format
  threadId: string; // Thread ID (threadId)
  __v: number; // Version key
}

export default function SideChat() {
  const [_, setSelectedChat] = useAtom(selectedChatAtom);
  const [threads, setThreads] = useState<Thread[]>([]);

  const handleClick = (thread: Thread) => {
    // Set the selected chat with necessary fields
    const selectedChat: SelectedChatAtomProps = {
      _id: thread._id,
      from: thread.from.address,
      fromName: thread.from.name,
      messageID: thread.messageID,
      date: new Date(thread.date),
      subject: thread.subject,
      thread: thread.threadId,
    };

    setSelectedChat(selectedChat);
  };

  useEffect(() => {
    fetchLatestThreads();
  }, []);

  const fetchLatestThreads = async () => {
    try {
      const response = await fetch("http://localhost:7000/chat/info@shecodeshacks.com/messagesList");
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data: Thread[] = await response.json();
      setThreads(data);
    } catch (error) {
      console.error("Error fetching latest threads:", error);
    }
  };

  const extractEmail = (str: string): string | null => {
    const emailMatch = str.match(/<(.+?)>/);
    return emailMatch ? emailMatch[1] : null;
  };

  return (
    <div className="w-full h-full flex-grow overflow-y-auto border rounded-tr-lg">
      {threads.map((thread) => {
        const email = extractEmail(thread.from.address);

        return (
          <div
            key={thread._id}
            onClick={() => handleClick(thread)}
            className="flex gap-4 h-20 items-center p-3 hover:bg-gray-50 cursor-pointer"
          >
            <Avatar>
              <AvatarFallback>{email?.charAt(0)}</AvatarFallback>
            </Avatar>

            <div className="ml-2 overflow-hidden">
              <h1 className="text-sm font-semibold">{email}</h1>
              <p className="text-xs text-gray-500 overflow-hidden whitespace-nowrap text-ellipsis">
                {thread.subject}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
