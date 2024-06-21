import React from 'react'
import Navbar from '@/components/atoms/Navbar'
export default function layout({children}:{
    children : React.ReactNode
}) {
  return (
    <>
        <Navbar />
        <section className='h-screen px-2'>
        {children}
        </section>
    </>
  )
}
