import React, { useReducer,useState } from "react";
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

// Define the form state and action types for useReducer
interface State {
  campaignName: string;
  message: string;
  valueNumberOrEmail: string;
  valueBucket: string;
  valueTemplate: string;
  date: string;
  time: string;
}

type Action =
  | { type: "SET_CAMPAIGN_NAME"; payload: string }
  | { type: "SET_MESSAGE"; payload: string }
  | { type: "SET_VALUE_NUMBER_OR_EMAIL"; payload: string }
  | { type: "SET_VALUE_BUCKET"; payload: string }
  | { type: "SET_VALUE_TEMPLATE"; payload: string }
  | { type: "SET_DATE"; payload: string }
  | { type: "SET_TIME"; payload: string };

const initialState: State = {
  campaignName: "",
  message: "",
  valueNumberOrEmail: "",
  valueBucket: "",
  valueTemplate: "",
  date: "",
  time: "",
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "SET_CAMPAIGN_NAME":
      return { ...state, campaignName: action.payload };
    case "SET_MESSAGE":
      return { ...state, message: action.payload };
    case "SET_VALUE_NUMBER_OR_EMAIL":
      return { ...state, valueNumberOrEmail: action.payload };
    case "SET_VALUE_BUCKET":
      return { ...state, valueBucket: action.payload };
    case "SET_VALUE_TEMPLATE":
      return { ...state, valueTemplate: action.payload };
    case "SET_DATE":
      return { ...state, date: action.payload };
    case "SET_TIME":
      return { ...state, time: action.payload };
    default:
      return state;
  }
}

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

  const { templates, buckets } = useFetchSubFormData(campaignType);

  const router = useRouter();
  
  // Use useReducer instead of multiple useState calls
  const [state, dispatch] = useReducer(reducer, initialState);

  const handleSubmit = async () => {
    try {
      const payload: Record<string, any> = {
        campaignName: state.campaignName,
        template: state.valueTemplate,
        bucket: state.valueBucket,
        scheduled: state.date,
        time: state.time,
        message: state.message,
      };

      // Conditionally add either email or number based on campaignType
      if (campaignType === "email") {
        payload.email = state.valueNumberOrEmail;
      } else {
        payload.number = state.valueNumberOrEmail;
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVICES_BE_HOST}/campaigns/${campaignId}/create/${campaignType}camp`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
          credentials: "include", // This ensures that cookies are included in the request
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
          value={state.campaignName}
          onChange={(e) =>
            dispatch({ type: "SET_CAMPAIGN_NAME", payload: e.target.value })
          }
        />

        {/* Message Textarea */}
        <Textarea
          maxLength={120}
          className="min-h-[180px] p-3 border rounded-md"
          placeholder="Write your message here..."
          value={state.message}
          onChange={(e) => {
            dispatch({ type: "SET_MESSAGE", payload: e.target.value });
            if (e.target.value) {
              dispatch({ type: "SET_VALUE_TEMPLATE", payload: "" });
            }
          }}
          disabled={!!state.valueTemplate}
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
              disabled={!!state.message}
            >
              {state.valueTemplate
                ? templates.find((template) => template.name === state.valueTemplate)?.name
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
                        dispatch({ type: "SET_VALUE_TEMPLATE", payload: currentValue });
                        dispatch({ type: "SET_MESSAGE", payload: "" });
                        setOpenTemplate(false);
                      }}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          state.valueTemplate === template.name ? "opacity-100" : "opacity-0"
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
              {state.valueBucket
                ? buckets.find((bucket) => bucket === state.valueBucket)
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
                        dispatch({ type: "SET_VALUE_BUCKET", payload: currentValue });
                        setOpenBucket(false);
                      }}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          state.valueBucket === bucket ? "opacity-100" : "opacity-0"
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

        {/* Email/Phone Number Selection */}
        <Popover open={openNumberOrEmail} onOpenChange={setOpenNumberOrEmail}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={openNumberOrEmail}
              className="w-full justify-between border rounded-md"
            >
              {state.valueNumberOrEmail
                ? numberOrEmailOptions.find(
                    (option) => option.value === state.valueNumberOrEmail
                  )?.label
                : `Select ${campaignType === "email" ? "Email" : "Phone Number"}...`}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-full p-0">
            <Command>
              <CommandInput placeholder={`Search ${campaignType === "email" ? "email" : "number"}...`} />
              <CommandEmpty>No {campaignType === "email" ? "email" : "number"} found.</CommandEmpty>
              <CommandList>
                <CommandGroup>
                  {numberOrEmailOptions.map((option) => (
                    <CommandItem
                      key={option.value}
                      value={option.value}
                      onSelect={(currentValue) => {
                        dispatch({ type: "SET_VALUE_NUMBER_OR_EMAIL", payload: currentValue });
                        setOpenNumberOrEmail(false);
                      }}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          state.valueNumberOrEmail === option.value ? "opacity-100" : "opacity-0"
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

        {/* Date and Time Inputs */}
        <Input
          type="date"
          className="p-3 border rounded-md"
          value={state.date}
          onChange={(e) => dispatch({ type: "SET_DATE", payload: e.target.value })}
        />
        <Input
          type="time"
          className="p-3 border rounded-md"
          value={state.time}
          onChange={(e) => dispatch({ type: "SET_TIME", payload: e.target.value })}
        />
      </CardContent>
      <CardFooter>
        <Button onClick={handleSubmit} className="w-full">
          Submit
        </Button>
      </CardFooter>
    </Card>
  );
}
