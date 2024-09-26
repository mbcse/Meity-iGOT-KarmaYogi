import React from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function layout({children,sms,whatsapp,email}:{
  children : React.ReactNode,
  sms : React.ReactNode,
  whatsapp : React.ReactNode,
  email : React.ReactNode
}) {
  return (
    <section className='flex flex-col gap-2 p-8 sm:p-2 '>

        {children}

    <div className='p-4'>

        <Tabs defaultValue="sms" >
  <TabsList>
    <TabsTrigger value="sms">sms</TabsTrigger>
    <TabsTrigger value="whatsapp">whatsapp</TabsTrigger>
    <TabsTrigger value="email">email</TabsTrigger>

  </TabsList>
  <TabsContent value="sms" >{sms}</TabsContent>
  <TabsContent value="whatsapp" >{whatsapp}</TabsContent>
  <TabsContent value="email" >{email}</TabsContent>

</Tabs>
    </div>


    </section>
  )
}
