import React from 'react';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent 
} from '@/components/ui/card';
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
import { DatePicker } from '@/components/ui/date-picker';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { useRouter } from 'next/navigation';


const templates = [
  { value: "Diwali", label: "Diwali" }
];

const buckets = [
  { value: "NorthIndianIPS", label: "North Indian IPS" }
];

const numbers = [
  { value: "Number1", label: "Number 1" },
  { value: "Number2", label: "Number 2" }
];

const SelectorPopover = ({ open, setOpen, value, setValue, items, placeholder }) => (
  <Popover open={open} onOpenChange={setOpen}>
    <PopoverTrigger asChild>
      <Button variant="outline" role="combobox" aria-expanded={open} className="w-[200px] justify-between">
        {value ? items.find(item => item.value === value)?.label : placeholder}
        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
      </Button>
    </PopoverTrigger>
    <PopoverContent className="w-[200px] p-0">
      <Command>
        <CommandInput placeholder={`Search ${placeholder.toLowerCase()}...`} />
        <CommandEmpty>No {placeholder.toLowerCase()} found.</CommandEmpty>
        <CommandList>
          <CommandGroup>
            {items.map(item => (
              <CommandItem
                key={item.value}
                value={item.value}
                onSelect={currentValue => {
                  setValue(currentValue === value ? "" : currentValue);
                  setOpen(false);
                }}
              >
                <Check className={cn("mr-2 h-4 w-4", value === item.value ? "opacity-100" : "opacity-0")} />
                {item.label}
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </Command>
    </PopoverContent>
  </Popover>
);

export default function WhatsappCampaignCreate() {
  const [openNumber, setOpenNumber] = React.useState(false);
  const [openBucket, setOpenBucket] = React.useState(false);
  const [openTemplate, setOpenTemplate] = React.useState(false);
  const [valueNumber, setValueNumber] = React.useState("");
  const [valueBucket, setValueBucket] = React.useState("");
  const [valueTemplate, setValueTemplate] = React.useState("");
  const router = useRouter();
  const closeModal = (() => {
    const { pathname } = window.location;
    router.push(pathname); // Removes all query parameters
});

  return (
    <Card>
      <CardHeader>
        <div className='flex justify-between items-center'>
        <CardTitle>Whatsapp Campaign</CardTitle>

        <Button variant={"default"} size={"icon"} onClick={()=>{
          closeModal();
        }}>
        <X />
        </Button>
        </div>
        <CardDescription>Create a new WhatsApp campaign</CardDescription>
      </CardHeader>
      <CardContent className='flex flex-col gap-2 overflow-auto max-h-[320px]'>
        <Input type="text" className='text-center p-3 text-gray-500 font-bold text-xl' placeholder='Campaign Name' />
        <Textarea maxLength={120} className='min-h-[180px] text-center p-3 text-gray-500 font-medium text-xl' placeholder='Write your message here...' />

        <div className='flex items-center gap-2'>
          <div className='h-[1px] min-w-[100px] bg-gray-300'></div>
          <div>OR</div>
          <div className='h-[1px] bg-gray-300 min-w-[100px]'></div>
        </div>

        <SelectorPopover 
          open={openTemplate} 
          setOpen={setOpenTemplate} 
          value={valueTemplate} 
          setValue={setValueTemplate} 
          items={templates} 
          placeholder="Select Template..."
        />

        <SelectorPopover 
          open={openBucket} 
          setOpen={setOpenBucket} 
          value={valueBucket} 
          setValue={setValueBucket} 
          items={buckets} 
          placeholder="Select Bucket..."
        />

        <SelectorPopover 
          open={openNumber} 
          setOpen={setOpenNumber} 
          value={valueNumber} 
          setValue={setValueNumber} 
          items={numbers} 
          placeholder="Select Number..."
        />

        <DatePicker />

        <Button>Submit</Button>
      </CardContent>
    </Card>
  );
}
