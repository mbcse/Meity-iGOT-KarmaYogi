"use client";
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { X } from "lucide-react"
import React, { useState, KeyboardEvent, ChangeEvent } from 'react'

const TagInput = ({ tags, setTags }: { tags: string[], setTags: React.Dispatch<React.SetStateAction<string[]>> }) => {
  const [inputValue, setInputValue] = useState<string>('')

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      if (inputValue.trim() !== '') {
        setTags([...tags, inputValue.trim()])
        setInputValue('')
      }
    }
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value)
  }

  const handleDelete = (index: number) => {
    setTags(tags.filter((_, i) => i !== index))
  }

  return (
    <div>
      <Input
        value={inputValue}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder="Type and press space or enter to add tags"
      />
      <div className="flex flex-wrap gap-3 my-4">
        {tags.map((tag, index) => (
          <div key={index} className="rounded-2xl bg-primary gap-3 text-white px-4 py-1 flex items-center justify-between">
            {tag}
            <X size={16} className="cursor-pointer" onClick={() => handleDelete(index)} />
          </div>
        ))}
      </div>
    </div>
  )
}

export default function Page() {
  const [emails, setEmails] = useState<string[]>([])
  const [phoneNumbers, setPhoneNumbers] = useState<string[]>([])
  const [whatsappNumbers, setWhatsappNumbers] = useState<string[]>([])

  const handleSave = (type: 'email' | 'phone' | 'whatsapp') => {
    if (type === 'email') {
      console.log('Saved Emails:', emails)
      // Handle saving emails here
    } else if (type === 'phone') {
      console.log('Saved Phone Numbers:', phoneNumbers)
      // Handle saving phone numbers here
    } else if (type === 'whatsapp') {
      console.log('Saved WhatsApp Numbers:', whatsappNumbers)
      // Handle saving WhatsApp numbers here
    }
  }

  return (
    <div className="flex flex-col gap-10">
      <Card>
        <CardHeader>
          <CardTitle>Add Email</CardTitle>
          <CardDescription>Add email addresses that will be used for automated emails.</CardDescription>
        </CardHeader>
        <CardContent>
          <TagInput tags={emails} setTags={setEmails} />
        </CardContent>
        <CardFooter className="border-t px-6 py-4">
          <Button onClick={() => handleSave('email')}>Save Emails</Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Add Phone Number</CardTitle>
          <CardDescription>Add phone numbers that will be used for automated SMS.</CardDescription>
        </CardHeader>
        <CardContent>
          <TagInput tags={phoneNumbers} setTags={setPhoneNumbers} />
        </CardContent>
        <CardFooter className="border-t px-6 py-4">
          <Button onClick={() => handleSave('phone')}>Save Phone Numbers</Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Add WhatsApp Number</CardTitle>
          <CardDescription>Add WhatsApp numbers that will be used for automated WhatsApp messages.</CardDescription>
        </CardHeader>
        <CardContent>
          <TagInput tags={whatsappNumbers} setTags={setWhatsappNumbers} />
        </CardContent>
        <CardFooter className="border-t px-6 py-4">
          <Button onClick={() => handleSave('whatsapp')}>Save WhatsApp Numbers</Button>
        </CardFooter>
      </Card>
    </div>
  )
}
