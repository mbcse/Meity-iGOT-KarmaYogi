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
<div id="backend-setup">
<Card x-chunk="dashboard-04-chunk-3">
  <CardHeader>
    <CardTitle>Backend Setup</CardTitle>
    <CardDescription>
      Option to give express URL.
    </CardDescription>
  </CardHeader>
  <CardContent>
    <form>
      <Input placeholder="Express URL" />
    </form>
  </CardContent>
  <CardFooter className="border-t px-6 py-4">
    <Button>Save</Button>
  </CardFooter>
</Card>
</div>

  )
}



