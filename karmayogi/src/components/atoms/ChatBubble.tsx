import React from 'react'

interface ChatBubble{
    message : string;
    pfplink : string;
}

export default function ChatBubble({message,pfplink}:ChatBubble) {
  return (
    <div className='flex gap-3 p-3'>
        <div className='my-2 w-[60px] h-[60px]'>
            <img src={pfplink} alt="User profile picture" className='rounded-[1000px] w-[60px] h-[60px] aspect-square' />
        </div>

        <div className='rounded-lg bg-slate-300 w-[300px] p-2'>
            {message}
        </div>
    </div>
  )
}
