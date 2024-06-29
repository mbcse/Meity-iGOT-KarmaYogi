import React from 'react'
import {User,RectangleEllipsis} from 'lucide-react'

export default function AuthField() {
  return (
    <div className='flex flex-col max-w-md'>
      <div className='flex gap-2 items-center bg-[#565656] rounded-t-lg p-3'>
      <User className='text-white' />
        <input type="text" className='bg-[#565656] border-none outline-none flex-grow text-white' placeholder='Username' />
      </div>
      <div className='flex gap-2 items-center bg-[#565656] rounded-b-lg p-3 border-t-[0.1px] border-white'>
      <RectangleEllipsis className='text-white' />
        <input type="password" className='bg-[#565656] border-none outline-none flex-grow text-white' placeholder='Password' />
      </div>
    </div>
  )
}
