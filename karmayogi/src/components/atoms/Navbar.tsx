import React from 'react'
import Link from 'next/link';
interface navbarItem{
    name:string;
    link:string;
}

const navbarArr:navbarItem[] = [
    {
        name:"home",
        link:'/'
    },
    {
        name:"channels",
        link:'/channels'
    },
    {
        name:"buckets",
        link:'/buckets'
    },
    {
        name:"templates",
        link:'/templates'
    },
]

export default function Navbar() {
  return (
    <nav className='flex py-4 px-6 items-center justify-between'>
        <div className='text-2xl'>
            Karmayogi
        </div>

        <div className='flex gap-4'>
            {
                navbarArr.map((nav)=>(
                    <div className='text-xl font-bold hover:underline'>
                        <Link href={nav.link}>
                            {nav.name}
                        </Link>
                    </div>
                ))
            }
        </div>
    </nav>
  )
}
