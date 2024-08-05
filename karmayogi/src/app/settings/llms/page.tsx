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
<div id="llms">
<Card x-chunk="dashboard-04-chunk-4">
  <CardHeader>
    <CardTitle>AI API Key Setup</CardTitle>
    <CardDescription>
      Option to set up AI API key.
    </CardDescription>
  </CardHeader>
  <CardContent>
    <form>
      <Input placeholder="AI API Key" />
    </form>
  </CardContent>
  <CardFooter className="border-t px-6 py-4">
    <Button>Save</Button>
  </CardFooter>
</Card>
</div>
  )
}
