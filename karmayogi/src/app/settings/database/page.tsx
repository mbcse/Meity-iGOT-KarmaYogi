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
    <div id="db-setup">
<Card x-chunk="dashboard-04-chunk-2">
  <CardHeader>
    <CardTitle>External Database Setup</CardTitle>
    <CardDescription>
      URL to connect to the external database.
    </CardDescription>
  </CardHeader>
  <CardContent>
    <form>
      <Input placeholder="External DB URL" />
      <Input placeholder="Database Info" className="mt-2" />
    </form>
  </CardContent>
  <CardFooter className="border-t px-6 py-4">
    <Button>Save</Button>
  </CardFooter>
</Card>

<Card x-chunk="dashboard-04-chunk-2">
  <CardHeader>
    <CardTitle>Internal Database Setup</CardTitle>
    <CardDescription>
      URL to connect to the internal database.
    </CardDescription>
  </CardHeader>
  <CardContent>
    <form>
      <Input placeholder="Internal DB URL" />
    </form>
  </CardContent>
  <CardFooter className="border-t px-6 py-4">
    <Button>Save</Button>
  </CardFooter>
</Card>
</div>

  )
}

