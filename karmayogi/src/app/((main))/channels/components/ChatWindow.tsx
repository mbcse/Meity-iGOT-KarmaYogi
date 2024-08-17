"use client";

import { selectedChatAtom } from '@/states/chat.atom';
import { useAtomValue } from 'jotai';
import React, { FormEvent, useState } from 'react';
import ChatTopbar from './ChatTopbar';
import { useToast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";
import { Button } from '@/components/ui/button';
import { ChevronUp } from 'lucide-react';

export default function ChatWindow() {
    const selectedChat = useAtomValue(selectedChatAtom);
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setIsLoading(true);

        try {
            console.log("API call here");
            // Add your API call logic here
        } catch (err) {
            toast({
                title: "Error",
                description: "An error occurred while processing your request.",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col border-[1px] border-gray-200 w-full rounded-tl-lg relative">
            {selectedChat && <ChatTopbar selectedChat={selectedChat} />}

            {selectedChat?.message && (
                <div className="p-4">
                    {selectedChat.message}
                </div>
            )}

            {selectedChat && (
                <div className="absolute bottom-2 px-8 bg-white w-full">
                    <form onSubmit={handleSubmit} className="relative mt-4">
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

            {
                !selectedChat && (
                    <div className="flex flex-col items-center justify-center h-full text-gray-400">
                        <img src="/Channels.png" alt="Channels placeholder" />
                        <p>Select a chat to start messaging</p>
                    </div>
                )
            }
        </div>
    );
}
