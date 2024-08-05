import React, { useEffect, useState } from "react";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";

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

import { Button } from "@/components/ui/button";
import { Calendar as CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { useRouter } from "next/navigation";

interface Template {
  id: string;
  name: string;
  body: string;
  type: string;
  createdAt: string;
  updatedAt: string;
}

const numbers = [
  {
    value: "9554848382",
    label: "9554848382",
  },
  {
    value: "4535355532",
    label: "4535355532",
  },
];

export default function SMSCreateCampaign({
  campaignId,
}: {
  campaignId: string;
}) {
  const [openNumber, setOpenNumber] = useState(false);
  const [openBucket, setOpenBucket] = useState(false);
  const [openTemplate, setOpenTemplate] = useState(false);
  const [date, setDate] = React.useState<Date>();
  const [time, setTime] = useState("");
  const [valueNumber, setValueNumber] = useState();
  const [valueBucket, setValueBucket] = useState("");
  const [valueTemplate, setValueTemplate] = useState("");
  const [campaignName, setCampaignName] = useState("");
  const [message, setMessage] = useState("");

  const [templates, setTemplates] = useState<Template[]>([]);
  const [buckets, setBuckets] = useState<string[]>([]);

  const router = useRouter();

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const response = await fetch(
          `http://localhost:3010/templates/list/sms`,
        );
        const data = await response.json();
        console.log(data);

        setTemplates(data);
      } catch (error) {
        console.error("Error fetching templates:", error);
      }
    };

    const fetchBuckets = async () => {
      try {
        const response = await fetch(`/api/db/showviewlist`);
        const data = await response.json();
        console.log(data);

        setBuckets(data);
      } catch (error) {
        console.error("Error fetching buckets:", error);
      }
    };

    fetchBuckets();
    fetchTemplates();
  }, []);

  const handleSubmit = async () => {
    try {
      const response = await fetch(
        `http://localhost:3010/campaigns/${campaignId}/create/smscamp`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            campaignName,
            template: valueTemplate,
            bucket: valueBucket,
            number: valueNumber,
            scheduled: date,
            time: time, // Include time in the submission
          }),
        },
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const result = await response.json();

      if (result) {
        const { pathname } = window.location;
        router.push(pathname);
      }
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
        <CardTitle>SMS Campaign</CardTitle>
        <CardDescription>Create a new SMS campaign</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4 overflow-auto max-h-[400px] p-4">
        <Input
          type="text"
          className="p-3"
          placeholder="Campaign Name"
          value={campaignName}
          onChange={(e) => setCampaignName(e.target.value)}
        />
        <Textarea
          maxLength={120}
          className="min-h-[180px] p-3 text-gray-500 font-medium text-xl"
          placeholder="Write your message here..."
          value={message}
          onChange={handleMessageChange}
          disabled={!!valueTemplate} // Disable message textarea if a template is selected
        />

        <div className="flex items-center gap-2">
          <div className="h-[1px] min-w-[100px] bg-gray-300"></div>
          <div>OR</div>
          <div className="h-[1px] bg-gray-300 min-w-[100px]"></div>
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
                ? templates.find((template) => template.name === valueTemplate)
                    ?.name
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
                          valueTemplate === template.name
                            ? "opacity-100"
                            : "opacity-0",
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
                        setValueBucket(
                          currentValue === valueBucket ? "" : currentValue,
                        );
                        setOpenBucket(false);
                      }}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          valueBucket === bucket ? "opacity-100" : "opacity-0",
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
              {valueNumber
                ? numbers.find((number) => number.value === valueNumber)?.label
                : "Select Number..."}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-full p-0">
            <Command>
              <CommandInput placeholder="Search Number..." />
              <CommandEmpty>No Number found.</CommandEmpty>
              <CommandList>
                <CommandGroup>
                  {numbers.map((number) => (
                    <CommandItem
                      key={number.value}
                      value={number.value}
                      onSelect={(currentValue: any) => {
                        setValueNumber(
                          currentValue === valueNumber ? "" : currentValue,
                        );
                        setOpenNumber(false);
                      }}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          valueNumber === number.value
                            ? "opacity-100"
                            : "opacity-0",
                        )}
                      />
                      {number.label}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>

        <Input
          type="date"
          className="p-3"
          placeholder="Date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />

        <Input
          type="time"
          className="p-3"
          placeholder="Time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
        />
      </CardContent>
      <CardFooter>
        <Button
          className="bg-green-600 text-white p-2 rounded-md"
          onClick={handleSubmit}
        >
          Submit
        </Button>
      </CardFooter>
    </Card>
  );
}
