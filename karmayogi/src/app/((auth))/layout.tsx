import React, { ReactNode } from 'react'

export default function Layout({children}:{
  children:ReactNode
}) {
  return (
    <section className='flex h-screen  px-16 py-4'>
      <div className='bg-[#5456DB] rounded-l-lg p-8 min-w-[40%] relative'>
        <img src="/Karmayogi.svg" alt="Karmayogi logo" />
        <img src="/redfort.png" alt="Karmayogi logo" className='absolute bottom-0 -left-4' />
      </div>

        {children}
    </section>
  )
}
