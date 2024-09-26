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
    </section>
  )
}
