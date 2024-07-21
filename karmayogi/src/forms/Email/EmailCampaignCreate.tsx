import React from 'react'
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Textarea } from "@/components/ui/textarea"
import { Input } from '@/components/ui/input';

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

const templates = [
  {
    value: "Diwali",
    label: "Diwali",
  }
]

const buckets = [
  {
    value: "NorthIndianIPS",
    label: "North Indian IPS",
  }
]

const numbers = [
  {
    value: "Number1",
    label: "Number 1",
  },
  {
    value: "Number2",
    label: "Number 2",
  }
]

import { Check, ChevronsUpDown } from "lucide-react"

import { cn } from "@/lib/utils"

import { DatePicker } from '@/components/ui/date-picker';
import { Button } from '@/components/ui/button';

export default function EmailCampaignCreate() {
  const [openEmail, setopenEmail] = React.useState(false)
  const [openBucket, setOpenBucket] = React.useState(false)
  const [openTemplate, setOpenTemplate] = React.useState(false)

  const [valueNumber, setValueNumber] = React.useState("")
  const [valueBucket, setValueBucket] = React.useState("")
  const [valueTemplate, setValueTemplate] = React.useState("")
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Whatsapp Campaign</CardTitle>
        <CardDescription>Create a new whatsapp campaign</CardDescription>
      </CardHeader>
      <CardContent className='flex flex-col gap-2 overflow-auto max-h-[320px]'>
        <Input 
          type="text" 
          className='text-center  p-3 text-gray-500 font-bold text-xl ' 
          placeholder='Campaign Name'
        />
        <Textarea 
          maxLength={120} 
          className='min-h-[180px] text-center  p-3 text-gray-500 font-medium text-xl ' 
          placeholder='Write your message here...'
        />

        <div className='flex items-center gap-2'>
          <div className='h-[1px] min-w-[100px] bg-gray-300'></div>
          <div>OR</div>
          <div className='h-[1px] bg-gray-300 min-w-[100px]'></div>
        </div>

        <Card className='rounded-md'>
            Upload your code here
        </Card>
        <div className='flex flex-col'>
          <Popover open={openBucket} onOpenChange={setOpenBucket}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={openBucket}
                className="w-[200px] justify-between"
              >
                {valueBucket
                  ? buckets.find((bucket) => bucket.value === valueBucket)?.label
                  : "Select Bucket..."}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0">
              <Command>
                <CommandInput placeholder="Search Bucket..." />
                <CommandEmpty>No Bucket found.</CommandEmpty>
                <CommandList>
                  <CommandGroup>
                    {buckets.map((bucket) => (
                      <CommandItem
                        key={bucket.value}
                        value={bucket.value}
                        onSelect={(currentValue:any) => {
                          setValueBucket(currentValue === valueBucket ? "" : currentValue)
                          setOpenBucket(false)
                        }}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            valueBucket === bucket.value ? "opacity-100" : "opacity-0"
                          )}
                        />
                        {bucket.label}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>

          <Popover open={openEmail} onOpenChange={setopenEmail}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={openEmail}
                className="w-[200px] justify-between"
              >
                {valueNumber
                  ? numbers.find((number) => number.value === valueNumber)?.label
                  : "Select Number..."}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0">
              <Command>
                <CommandInput placeholder="Search Number..." />
                <CommandEmpty>No Number found.</CommandEmpty>
                <CommandList>
                  <CommandGroup>
                    {numbers.map((number) => (
                      <CommandItem
                        key={number.value}
                        value={number.value}
                        onSelect={(currentValue:any) => {
                          setValueNumber(currentValue === valueNumber ? "" : currentValue)
                          setopenEmail(false)
                        }}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            valueNumber === number.value ? "opacity-100" : "opacity-0"
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

          <DatePicker />
        </div>

        <Button>Submit</Button>
      </CardContent>
    </Card>
  )
}
