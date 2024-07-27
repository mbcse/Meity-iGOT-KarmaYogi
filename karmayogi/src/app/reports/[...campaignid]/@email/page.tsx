import React from 'react'
import { Devices } from '../components/Devices'
import GenStats from '../components/GenStats'
import { Card } from '@/components/ui/card'
import OverallPie from '../components/OverallPie'
export default function page() {

  const data = [
    {
      name :"20% off",
      stats:{
        delivered: 20,
        failed: 5,
        pending: 10,
        devices : {
          mobile : 20,
          desktop : 5,
        },
        unsubscribed: 5
      }
    }
  ]
  return (
    <div>
      {
        data.map((item, index) => {
          return (
            <Card className='p-4 max-w-[600px]' key={index}>
              <h1 className='text-3xl font-semibold py-4'>{item.name}</h1>
              <div className='flex scrollbar py-4 overflow-x-auto gap-6'>
              <GenStats data={item.stats.failed} name='Failed' color='red' /> 
                <GenStats data={item.stats.pending} name='pending' />
               <GenStats data={item.stats.delivered} name='Delivered' color='green' />
                <GenStats data={item.stats.unsubscribed} name='Unsubscribed' color='red' />
              </div>
              <div className='flex scrollbar py-4 overflow-x-scroll gap-6'>
              <Devices mobile={item.stats.devices.mobile} desktop={item.stats.devices.desktop}/>
              <OverallPie data={item} />
              </div>
            </Card>
          )
        })
      }
    </div>
  )
}
