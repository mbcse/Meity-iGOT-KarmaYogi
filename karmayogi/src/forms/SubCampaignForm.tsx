import React, { useState } from "react";
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
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useFetchSubFormData } from "./Formhook";

import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
  } from "@/components/ui/command";


interface CampaignFormProps {
  campaignId: string;
  campaignType: "email" | "sms" | "whatsapp";
  emails: { value: string; label: string }[];
  numbers: { value: string; label: string }[];
}

export default function SubCampaignForm({
  campaignId,
  campaignType,
  emails,
  numbers,
}: CampaignFormProps) {
  const [openNumberOrEmail, setOpenNumberOrEmail] = useState(false);
  const [openBucket, setOpenBucket] = useState(false);
  const [openTemplate, setOpenTemplate] = useState(false);
  const [date, setDate] = useState<string>("");
  const [time, setTime] = useState<string>("");
  const [valueNumberOrEmail, setValueNumberOrEmail] = useState<string>("");
  const [valueBucket, setValueBucket] = useState<string>("");
  const [valueTemplate, setValueTemplate] = useState<string>("");
  const [campaignName, setCampaignName] = useState("");
  const [message, setMessage] = useState("");

  const { templates, buckets } = useFetchSubFormData(campaignType);

  const router = useRouter();

  const handleSubmit = async () => {
    try {
      const payload: Record<string, any> = {
        campaignName,
        template: valueTemplate,
        bucket: valueBucket,
        scheduled: date,
        time,
        message,
      };
  
      // Conditionally add either email or number based on campaignType
      if (campaignType === "email") {
        payload.email = valueNumberOrEmail;
      } else {
        payload.number = valueNumberOrEmail;
      }
  
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_EXPRESS_SERVER_URL}/campaigns/${campaignId}/create/${campaignType}camp`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
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
  
  // Determine options based on campaign type
  const numberOrEmailOptions =
    campaignType === "email" ? emails : numbers;

  return (
    <Card className="max-w-lg mx-auto mt-8 shadow-lg">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-center">
          {campaignType === "email" ? "Email" : campaignType === "sms" ? "SMS" : "WhatsApp"} Campaign
        </CardTitle>
        <CardDescription className="text-center">
          Create a new {campaignType === "email" ? "Email" : campaignType === "sms" ? "SMS" : "WhatsApp"} campaign
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4 p-4">
        {/* Campaign Name Input */}
        <Input
          type="text"
          className="p-3 border rounded-md"
          placeholder="Campaign Name"
          value={campaignName}
          onChange={(e) => setCampaignName(e.target.value)}
        />

        {/* Message Textarea */}
        <Textarea
          maxLength={120}
          className="min-h-[180px] p-3 border rounded-md"
          placeholder="Write your message here..."
          value={message}
          onChange={(e) => {
            setMessage(e.target.value);
            if (e.target.value) setValueTemplate("");
          }}
          disabled={!!valueTemplate}
        />

        <div className="flex items-center justify-center my-2">
          <div className="h-[1px] w-full bg-gray-300"></div>
          <div className="px-3">OR</div>
          <div className="h-[1px] w-full bg-gray-300"></div>
        </div>

        {/* Template Selection */}
        <Popover open={openTemplate} onOpenChange={setOpenTemplate}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={openTemplate}
              className="w-full justify-between border rounded-md"
              disabled={!!message}
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
                      onSelect={(currentValue) => {
                        setValueTemplate(currentValue);
                        setMessage("");
                        setOpenTemplate(false);
                      }}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          valueTemplate === template.name
                            ? "opacity-100"
                            : "opacity-0"
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

        {/* Bucket Selection */}
        <Popover open={openBucket} onOpenChange={setOpenBucket}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={openBucket}
              className="w-full justify-between border rounded-md"
            >
              {valueBucket
                ? buckets.find((bucket) => bucket === valueBucket)
                : "Select Bucket..."}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-full p-0">
            <Command>
              <CommandInput placeholder="Search bucket..." />
              <CommandEmpty>No bucket found.</CommandEmpty>
              <CommandList>
                <CommandGroup>
                  {buckets.map((bucket) => (
                    <CommandItem
                      key={bucket}
                      value={bucket}
                      onSelect={(currentValue) => {
                        setValueBucket(
                          currentValue === valueBucket ? "" : currentValue
                        );
                        setOpenBucket(false);
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

        {/* Number or Email Selection */}
        <Popover open={openNumberOrEmail} onOpenChange={setOpenNumberOrEmail}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={openNumberOrEmail}
              className="w-full justify-between border rounded-md"
            >
              {valueNumberOrEmail
                ? numberOrEmailOptions.find(
                    (option) => option.value === valueNumberOrEmail
                  )?.label
                : `Select ${campaignType === "email" ? "Email" : "Number"}...`}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-full p-0">
            <Command>
              <CommandInput
                placeholder={`Search ${
                  campaignType === "email" ? "email" : "number"
                }...`}
              />
              <CommandEmpty>No options found.</CommandEmpty>
              <CommandList>
                <CommandGroup>
                  {numberOrEmailOptions.map((option) => (
                    <CommandItem
                      key={option.value}
                      value={option.value}
                      onSelect={(currentValue) => {
                        setValueNumberOrEmail(
                          currentValue === valueNumberOrEmail
                            ? ""
                            : currentValue
                        );
                        setOpenNumberOrEmail(false);
                      }}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          valueNumberOrEmail === option.value
                            ? "opacity-100"
                            : "opacity-0"
                        )}
                      />
                      {option.label}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>

        {/* Date & Time Inputs */}
        <Input
          type="date"
          className="p-3 border rounded-md"
          placeholder="Schedule Date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
        <Input
          type="time"
          className="p-3 border rounded-md"
          placeholder="Schedule Time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
        />
      </CardContent>
      <CardFooter className="flex justify-center p-4">
        <Button onClick={handleSubmit} className="px-6 py-2">
          Create Campaign
        </Button>
      </CardFooter>
    </Card>
  );
}
