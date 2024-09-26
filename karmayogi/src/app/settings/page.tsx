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


import React from 'react'

export default function page() {
  return (
    <div id="add">
    <Card x-chunk="dashboard-04-chunk-1">
      <CardHeader>
        <CardTitle>Add Email</CardTitle>
        <CardDescription>
          Add email that will be used for automated emails.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form>
          <Input placeholder="Email" />
        </form>
      </CardContent>
      <CardFooter className="border-t px-6 py-4">
        <Button>Save</Button>
      </CardFooter>
    </Card>
    
    <Card x-chunk="dashboard-04-chunk-1">
      <CardHeader>
        <CardTitle>Add Phone Number</CardTitle>
        <CardDescription>
          Add phone that will be used for automated sms.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form>
          <Input placeholder="Phone Number" />
        </form>
      </CardContent>
      <CardFooter className="border-t px-6 py-4">
        <Button>Save</Button>
      </CardFooter>
    </Card>
    
    <Card x-chunk="dashboard-04-chunk-1">
      <CardHeader>
        <CardTitle>Add Whatsapp Number</CardTitle>
        <CardDescription>
          Add whatsapp number that will be used for automated whatsapp messages.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form>
          <Input placeholder="Whatsapp Number" />
        </form>
      </CardContent>
      <CardFooter className="border-t px-6 py-4">
        <Button>Save</Button>
      </CardFooter>
    </Card>
    </div>
  )
}

