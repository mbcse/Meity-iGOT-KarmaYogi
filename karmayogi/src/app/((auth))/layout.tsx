import React, { ReactNode } from 'react'

export default function Layout({children}:{
  children:ReactNode
}) {
  return (
    <section className='flex min-h-screen bg-black text-white'>
      <div className='bg-[#414141] p-8 min-w-[40%]'>
        <img src="/Karmayogi.svg" alt="Karmayogi logo" />
      </div>

        {children}
    </section>
  )
}
