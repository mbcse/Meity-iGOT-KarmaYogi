"use client";
import React, { FormEvent, useState, useEffect } from 'react';
import { useAtomValue } from 'jotai';
import { selectedChatAtom } from '@/states/chat.atom';
import ChatTopbar from './ChatTopbar';
import { useToast } from "@/components/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Button } from '@/components/ui/button';
import { ChevronUp } from 'lucide-react';

const Loader = () => (
  <div className="w-5 h-5 border-4 border-t-4 border-blue-500 border-solid rounded-full animate-spin"></div>
);

interface Message {
  _id: string;
  from: {
    address:string;
  };
  to: string[];
  subject: string;
  htmlBody: string;
  textBody?: string;
  messageID: string;
  references: string[];
  cc: string[];
  bcc: string[];
  inReplyTo: string;
  seq: number;
  date: string;
  __v: number;
  thread: string;
}

export default function ChatWindow() {
    const selectedChat = useAtomValue(selectedChatAtom);
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const { toast } = useToast();
    const emailId = "info@shecodeshacks.com"; // Replace with actual logged-in user's email

    useEffect(() => {
      if (!selectedChat?.thread) return setMessages([]); // Reset messages if no thread selected
      
      const fetchThreadMessages = async (threadId: string) => {
        console.log("Fetching messages for thread:", threadId);
        try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_CHANNELS_BE_HOST}/chat/thread/${emailId}/${threadId}`);
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          const data = await response.json();
          console.log('Fetched messages:', data);
          setMessages(data.sort((a: Message, b: Message) => new Date(a.date).getTime() - new Date(b.date).getTime()));
        } catch (error) {
          console.error('Error fetching thread messages:', error);
          toast({
            title: "Error",
            description: "Failed to fetch messages.",
            variant: "destructive",
          });
        }
      };

      fetchThreadMessages(selectedChat.thread);
    }, [selectedChat]);

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
    
      if (inputValue.trim() === '') {
        return; // Do not submit if input is empty
      }
    
      setIsLoading(true);
    
      const newMessage: Omit<Message, '_id' | 'date'> & { __v: number } = {
        from: { address : emailId},
        to: selectedChat?.from ? [selectedChat.from] : [],
        subject: selectedChat?.subject || '',
        htmlBody: inputValue,
        textBody: inputValue,
        messageID: new Date().toISOString(),
        references: [],
        cc: [],
        bcc: [],
        inReplyTo: selectedChat?.messageID || '',
        seq: 0,
        thread: selectedChat?.thread || '',
        __v: 0,
      };
    
      console.log('New message being sent:', newMessage); // Debugging
    
      setMessages(prevMessages => [...prevMessages, { ...newMessage, _id: newMessage.messageID, date: new Date().toISOString() }]);
      setInputValue('');
    
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_CHANNELS_BE_HOST}/chat/reply`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            from: emailId, 
            to: selectedChat?.from ? [selectedChat.from] : [], 
            subject: selectedChat?.subject, 
            replyText: inputValue, 
            messageID: selectedChat?.messageID, 
            threadID: selectedChat?.thread,
            inReplyTo: messages[messages.length-1]?.inReplyTo,
          }),
        });
    
        if (!response.ok) {
          throw new Error('Failed to send message');
        }
    
        const newMessageFromServer = await response.json();
        console.log('Message sent successfully:', newMessageFromServer); // Debugging
    
        setMessages(prevMessages =>
          prevMessages.map(msg => (msg.messageID === newMessage.messageID ? newMessageFromServer.email : msg))
        );
    
        toast({
          title: "Success",
          description: "Message sent successfully.",
        });
      } catch (error) {
        console.error('Error sending message:', error);
        toast({
          title: "Error",
          description: "Failed to send message.",
          variant: "destructive",
        });
    
        setMessages(prevMessages => prevMessages.filter(msg => msg.messageID !== newMessage.messageID));
        setInputValue(inputValue); // Keep input value if failed
      } finally {
        setIsLoading(false);
      }
    };

    function removeQuotedText(emailBody: string): string {
      const gmailQuoteRegex = /On\s.*\s+at\s.*\s+.*wrote:/g;
      const outlookQuoteRegex = /From:\s.*@.*\..*/g;
      const horizontalLineRegex = /<div class="gmail_quote">.*<\/div>/;

      emailBody = emailBody.replace(gmailQuoteRegex, '');
      emailBody = emailBody.replace(outlookQuoteRegex, '');
      emailBody = emailBody.replace(horizontalLineRegex, '');

      return emailBody.trim();
    }

    const renderMessage = (message: Message) => {
      if (!message || typeof message._id === 'undefined') {
        console.error("Invalid message object:", JSON.stringify(message, null, 2));
        return null;
      }

      console.log(JSON.stringify(message, null, 2));
      const isFromCurrentUser = message.from.address === emailId;
      const alignmentClass = isFromCurrentUser ? 'text-right' : 'text-left';
      const bgColorClass = isFromCurrentUser ? 'bg-blue-100' : 'bg-gray-100';
      const marginClass = isFromCurrentUser ? 'ml-auto' : 'mr-auto';

      console.log('Rendering message:', message);

      const cleanedHtmlBody = removeQuotedText(message.htmlBody || '');
      const cleanedTextBody = removeQuotedText(message.textBody || '');

      return (
        <div key={message._id} className={`mb-4 ${alignmentClass}`}>
          <div className={`inline-block p-2 rounded-lg ${bgColorClass} ${marginClass} max-w-[80%]`}>
            {cleanedHtmlBody ? (
              <div dangerouslySetInnerHTML={{ __html: cleanedHtmlBody }} />
            ) : (
              cleanedTextBody || 'No message content'
            )}
            <small className="text-xs text-gray-500 block mt-1">
              {new Date(message.date).toLocaleString()}
            </small>
          </div>
        </div>
      );
    };

    return (
      <div className="flex flex-col border-[1px] border-gray-200 w-full rounded-tl-lg relative">
        {selectedChat && <ChatTopbar selectedChat={selectedChat} />}

        <div className="flex-grow overflow-y-auto p-4 max-w-full">
          {messages.map((message, index) => (
            <React.Fragment key={index}>
              {renderMessage(message)}
            </React.Fragment>
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
                {isLoading ? <Loader /> : <ChevronUp className="text-[#5456DB]" />}
              </Button>
            </form>
          </div>
        )}

        {!selectedChat && (
          <div className="text-center py-4 text-gray-500">
            <p>Select a chat to start messaging</p>
          </div>
        )}
      </div>
    );
}
