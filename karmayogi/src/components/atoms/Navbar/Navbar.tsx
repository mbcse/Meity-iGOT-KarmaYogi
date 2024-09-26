"use client";
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import Link from 'next/link'
import React from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { LogOut } from 'lucide-react'

const LINKS = {
  TEMPLATES: 'http://localhost:5173/email-builder-js/'
};

export default function Navbar() {
  const pathname = usePathname()
  const router = useRouter()

  const sections = [
    { name: 'Home', link: '/' },
    { name: 'Buckets', link: '/buckets' },
    { name: 'Templates', link: LINKS.TEMPLATES },
    { name: 'Campaigns', link: '/campaigns' },
    { name: 'Reports', link: '/reports' },
    { name: 'Channels', link: '/channels' }
  
  ]

  const handleLogout = async () => {
    // Clear cookies
    document.cookie.split(";").forEach((c) => {
      document.cookie = c
        .replace(/^ +/, "")
        .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
    });

    router.push('/login');
  }

  return (
    <div className='py-2 px-4 '>
      <div className='flex bg-[#5456DB] px-4 py-2 rounded-md text-white justify-between items-center'>
        <img src="/Karmayogi.svg" className='w-24' alt="Karmayogi logo" />

        <div className='flex gap-2 items-center'>
          {sections.map((section, index) => (
            <Link key={index} href={section.link} target={section.name === 'Templates' ? '_blank' : '_self'}>
              <Button 
                className={`text-white ${pathname === section.link ? 'font-bold' : ''}`} 
                variant='link'
              >
                {section.name}
              </Button>
            </Link>
          ))}

          <DropdownMenu>
            <DropdownMenuTrigger>
              <Avatar>
                <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  )
}
