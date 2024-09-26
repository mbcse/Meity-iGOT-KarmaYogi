import React, { useEffect, useState } from 'react';

import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Textarea } from "@/components/ui/textarea";
import { Input } from '@/components/ui/input';

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";

import { Button } from '@/components/ui/button';
import { Calendar as CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";

interface Template {
  id: string;
  name: string;
  body: string;
  type: string;
  createdAt: string;
  updatedAt: string;
}

const emails = [
  {
    value: "somemail@ok.com",
    label: "somemail@ok.com",
  },
  {
    value: "nice@jio.do",
    label: "nice@jio.do",
  }
];

export default function EmailCampaignCreate({ campaignId }: { campaignId: string }) {
  const [openNumber, setOpenNumber] = useState(false);
  const [openBucket, setOpenBucket] = useState(false);
  const [openTemplate, setOpenTemplate] = useState(false);
  const [date, setDate] = React.useState<Date>();
  const [valueEmail, setvalueEmail] = useState("");
  const [valueBucket, setValueBucket] = useState("");
  const [valueTemplate, setValueTemplate] = useState("");
  const [campaignName, setCampaignName] = useState("");
  const [message, setMessage] = useState("");

  const [templates, setTemplates] = useState<Template[]>([]);
  const [buckets, setBuckets] = useState<string[]>([]);

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const response = await fetch(`http://localhost:3010/templates/list/email`);
        const data = await response.json();
        console.log(data);

        setTemplates(data);
      } catch (error) {
        console.error('Error fetching templates:', error);
      }
    };

    const fetchBuckets = async () => {
      try {
        const response = await fetch(`/api/db/showviewlist`);
        const data = await response.json();
        console.log(data);

        setBuckets(data);
      } catch (error) {
        console.error('Error fetching buckets:', error);
      }
    };

    fetchBuckets();
    fetchTemplates();
  }, []);

  const handleSubmit = async () => {
    try {
      const response = await fetch(`http://localhost:3010/campaigns/${campaignId}/create/emailcamp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          campaignName,
          template: valueTemplate,
          bucket: valueBucket,
          email: valueEmail,
          scheduled: date?.toISOString(),
        })
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const result = await response.json();
      console.log(result);
    } catch (error) {
      console.log(error);
    }
  };

  const handleTemplateSelect = (currentValue: any) => {
    setValueTemplate(currentValue === valueTemplate ? "" : currentValue);
    setOpenTemplate(false);
    if (currentValue !== valueTemplate) {
      setMessage(""); // Clear the message if a template is selected
    }
  };

  const handleMessageChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
    if (e.target.value) {
      setValueTemplate(""); // Clear the template if a message is being typed
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Email Campaign</CardTitle>
        <CardDescription>Create a new Email campaign</CardDescription>
      </CardHeader>
      <CardContent className='flex flex-col gap-4 overflow-auto max-h-[400px] p-4'>
        <Input 
          type="text" 
          className='p-3' 
          placeholder='Campaign Name'
          value={campaignName}
          onChange={(e) => setCampaignName(e.target.value)}
        />
        <Textarea 
          maxLength={120} 
          className='min-h-[180px] p-3 text-gray-500 font-medium text-xl' 
          placeholder='Write your message here...'
          value={message}
          onChange={handleMessageChange}
          disabled={!!valueTemplate} // Disable message textarea if a template is selected
        />

        <div className='flex items-center gap-2'>
          <div className='h-[1px] min-w-[100px] bg-gray-300'></div>
          <div>OR</div>
          <div className='h-[1px] bg-gray-300 min-w-[100px]'></div>
        </div>

        <Popover open={openTemplate} onOpenChange={setOpenTemplate}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={openTemplate}
              className="w-full justify-between"
              disabled={!!message} // Disable template selection if a message is being typed
            >
              {valueTemplate
                ? templates.find((template) => template.name === valueTemplate)?.name
                : "Select Template..."}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-full p-0">
            <Command>
              <CommandInput placeholder="Search template..." />
              <CommandEmpty>No template found.</CommandEmpty>
              <CommandList>
                <CommandGroup>
                  {templates.map((template) => (
                    <CommandItem
                      key={template.name}
                      value={template.name}
                      onSelect={handleTemplateSelect}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          valueTemplate === template.name ? "opacity-100" : "opacity-0"
                        )}
                      />
                      {template.name}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>

        <Popover open={openBucket} onOpenChange={setOpenBucket}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={openBucket}
              className="w-full justify-between"
            >
              {valueBucket
                ? buckets.find((bucket) => bucket === valueBucket)?.toString()
                : "Select Bucket..."}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-full p-0">
            <Command>
              <CommandInput placeholder="Search Bucket..." />
              <CommandEmpty>No Bucket found.</CommandEmpty>
              <CommandList>
                <CommandGroup>
                  {buckets.map((bucket) => (
                    <CommandItem
                      key={bucket}
                      value={bucket}
                      onSelect={(currentValue: any) => {
                        setValueBucket(currentValue === valueBucket ? "" : currentValue)
                        setOpenBucket(false)
                      }}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          valueBucket === bucket ? "opacity-100" : "opacity-0"
                        )}
                      />
                      {bucket}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>

        <Popover open={openNumber} onOpenChange={setOpenNumber}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={openNumber}
              className="w-full justify-between"
            >
              {emails
                ? emails.find((email) => email.value === valueEmail)?.label
                : "Select Email..."}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-full p-0">
            <Command>
              <CommandInput placeholder="Search Number..." />
              <CommandEmpty>No Email found.</CommandEmpty>
              <CommandList>
                <CommandGroup>
                  {emails.map((email) => (
                    <CommandItem
                      key={email.value}
                      value={email.value}
                      onSelect={(currentValue: any) => {
                        setvalueEmail(currentValue === valueEmail ? "" : currentValue)
                        setOpenNumber(false)
                      }}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          valueEmail === email.value ? "opacity-100" : "opacity-0"
                        )}
                      />
                      {email.label}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>

        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn(
                "w-full justify-start text-left font-normal",
                !date && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date ? format(date, "PPP") : <span>Pick a date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
            />
          </PopoverContent>
        </Popover>
      </CardContent>
      <CardFooter>
        <Button className='bg-green-600 text-white p-2 rounded-md' onClick={handleSubmit}>Submit</Button>
      </CardFooter>
    </Card>
  );
}
