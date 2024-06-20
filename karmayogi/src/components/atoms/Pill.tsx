import React, { ReactNode } from 'react'

interface Pill{
    icon? : ReactNode;
    label : string;
}

export default function Pill({icon,label}:Pill) {
  return (
    <div className='bg-slate-400 px-3 py-1 m-2 max-w-[120px] rounded-2xl flex align-middle gap-3'>
        {icon && (
            <div className='w-1/4'>
                {icon}
            </div>
        )}

        <div className={icon ? 'w-3/4' : 'w-full'}>
            {label}
        </div>
    </div>
  )
}
