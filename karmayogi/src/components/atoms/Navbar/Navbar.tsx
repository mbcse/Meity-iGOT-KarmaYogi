"use client";
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import React from 'react'
import { useRouter } from 'next/navigation'

export default function Navbar() {
  const router = useRouter()

  const sections = [
    { name: 'Home', link: '/' },
    { name: 'Buckets', link: '/buckets' },
    { name: 'Campaigns', link: '/campaigns' },
    { name: 'Reports', link: '/reports' }
  ]

  return (
    <div className='flex bg-black text-white p-4 shadow-sm justify-between items-center'>
      <div>Karmayogi</div>

      <div className='flex gap-2'>
        {sections.map((section, index) => (
          <Link key={index} href={`${section.link}`}>
            <Button className='text-white' variant='link'>
              {section.name}
            </Button>
          </Link>
        ))}
      </div>
    </div>
  )
}
