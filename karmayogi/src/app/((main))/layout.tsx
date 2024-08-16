import React from 'react'
import Navbar from '@/components/atoms/Navbar/Navbar'
export default function layout({children}:{
    children:React.ReactNode
    }) 
{
  return (
    <section className="h-screen">
        <Navbar />
        {children}
    </section>
  )
}
