"use client";
import React, { useEffect, useState } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAtom, useAtomValue } from "jotai";
import { selectedChatAtom, selectedAccountAtom } from "@/states/chat.atom";
import { SelectedChatAtomProps } from "@/states/chat.atom";
import { Button } from "@/components/ui/button";
import { RefreshCcw } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { chatCommTypeAtom } from "@/states/chat.atom";

// Define the types for email addresses and thread structure
interface EmailAddress {
  address: string;
  name: string;
  _id: string;
}

interface Thread {
  _id: string;
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

// Define the type for account object
interface Account {
  _id: string;
  email: string;
}

export default function SideChat() {
  const [_, setSelectedChat] = useAtom(selectedChatAtom);
  const [threads, setThreads] = useState<Thread[]>([]);
  const chatCommType = useAtomValue(chatCommTypeAtom);
  const [selectedAccount, setSelectedAccount] = useAtom<string>(selectedAccountAtom);

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

    console.log("selectedChat:", selectedChat);
    setSelectedChat(selectedChat);
  };

  useEffect(() => {
    fetchLatestThreads();
  }, [selectedAccount]); // Fetch latest threads whenever the selected account changes

  const fetchLatestThreads = async () => {
    if (!selectedAccount) return;

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_CHANNELS_BE_HOST}/chat/${selectedAccount}/messagesList`
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data: Thread[] = await response.json();
      console.log("THREADS:", data);
      setThreads(data);
    } catch (error) {
      console.error("Error fetching latest threads:", error);
    }
  };

  const [accounts, setAccounts] = useState<Account[]>([]);

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_CHANNELS_BE_HOST}/accounts/${chatCommType}`
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data: Account[] = await response.json();
        setAccounts(data);
      } catch (error) {
        console.error("Error fetching accounts:", error);
      }
    };

    if (chatCommType) {
      fetchAccounts();
    }
  }, [chatCommType]); // Add chatCommType as dependency

  const syncEmails = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_CHANNELS_BE_HOST}/chat/syncemail/${selectedAccount}`
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      fetchLatestThreads();
    } catch (error) {
      console.error("Error syncing emails:", error);
    }
  };

  const extractEmail = (str: string): string | null => {
    const emailMatch = str.match(/<(.+?)>/);
    return emailMatch ? emailMatch[1] : null;
  };

  return (
    <div className="w-full h-full flex-grow overflow-y-auto border rounded-tr-lg">
      <div className="p-4 flex justify-between border-b-[1px] border-gray-200 ">
        <Select
          onValueChange={(email) => setSelectedAccount(email)} // Update selectedAccount with account.email
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select Account" />
          </SelectTrigger>
          <SelectContent>
            {accounts.map((account) => (
              <SelectItem key={account._id} value={account.email}>
                {account.email}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button variant={"ghost"} size={"sm"} onClick={syncEmails}>
          <RefreshCcw />
        </Button>
      </div>

      <div>
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
    </div>
  );
}
