"use client";
import { selectedChatAtom } from '@/states/chat.atom';
import { useAtomValue } from 'jotai';
import React, { FormEvent, useState, useEffect } from 'react';
import ChatTopbar from './ChatTopbar';
import { useToast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";
import { Button } from '@/components/ui/button';
import { ChevronUp } from 'lucide-react';

interface Message {
  id: string;
  sender: string;
  receiver: string;
  textBody: string;
  time: string;
  threadID: string;
}

export default function ChatWindow() {
    const selectedChat = useAtomValue(selectedChatAtom);
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const { toast } = useToast();
    const emailId = "info@shecodeshacks.com"; // Current user's email

    useEffect(() => {
        console.log("useEffect triggered by selectedChat:", selectedChat);

        if (selectedChat?.messageID) {
            fetchThreadMessages(selectedChat.messageID);
        } else {
            console.warn("No messageID found in selectedChat");
        }
    }, [selectedChat]);

    const fetchThreadMessages = async (messageID: string) => {
        console.log("Fetching messages for messageID:", messageID);
        try {
            const response = await fetch(`http://localhost:7000/chat/threads/${emailId}/${messageID}`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            console.log("Fetched messages:", data);
            setMessages(data);
        } catch (error) {
            console.error('Error fetching thread messages:', error);
            toast({
                title: "Error",
                description: "Failed to fetch messages.",
                variant: "destructive",
            });
        }
    };
    
    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setIsLoading(true);

        try {
            const response = await fetch('http://localhost:7000/chat/reply', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    from : emailId,
                    to : selectedChat?.from,
                    subject : selectedChat?.subject,
                    messageID: selectedChat?.messageID,
                    replyText: inputValue,
                }),
            });
            


            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            
            console.log("Reply response:", data);
            
            setMessages(prevMessages => [...prevMessages, data.sentEmail]);
            setInputValue('');
            toast({
                title: "Success",
                description: "Message sent successfully.",
            });
        } catch (err) {
            console.error('Error sending reply:', err);
            toast({
                title: "Error",
                description: "An error occurred while sending your message.",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col border-[1px] border-gray-200 w-full rounded-tl-lg relative">
            {selectedChat && <ChatTopbar selectedChat={selectedChat} />}

            <div className="flex-grow overflow-y-auto p-4 max-w-full">
                {messages.map((message) => (
                    <div key={message.id} className={`mb-4 ${message.sender === emailId ? 'text-right' : 'text-left'}`}>
                        <div className={`inline-block p-2 rounded-lg ${message.sender === emailId ? 'bg-blue-100' : 'bg-gray-100'}`}>
                            {message.textBody}
                            <small className="text-xs text-gray-500">{message.time}</small>
                        </div>
                    </div>
                ))}
            </div>

            {selectedChat && (
                <div className="px-8 py-4 bg-white w-full">
                    <form onSubmit={handleSubmit} className="relative">
                        <Input
                            type="text"
                            placeholder="Write your message here..."
                            className="pr-12 py-6 text-lg"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                        />
                        <Button
                            variant="default"
                            size="icon"
                            className="absolute right-2 top-1/2 transform -translate-y-1/2"
                            type="submit"
                            disabled={isLoading}
                        >
                            <ChevronUp className="text-[#5456DB]" />
                        </Button>
                    </form>
                </div>
            )}

            {!selectedChat && (
                <div className="flex flex-col items-center justify-center h-full text-gray-400">
                    <img src="/Channels.png" alt="Channels placeholder" />
                    <p>Select a chat to start messaging</p>
                </div>
            )}
        </div>
    );
}
