"use client";
import React from 'react'
import { ProgressCircle } from '@/components/charts/ProgressiveCircle'
import { BarList } from '@/components/charts/BarList'
import { MapContainer, TileLayer, Circle,Tooltip } from 'react-leaflet'
import 'leaflet/dist/leaflet.css';
import { map } from 'leaflet';

const position = [51.505, -0.09];
const mapdata = [
  { latitude: 51.505, longitude: -0.09, radius: 20000, value: 100 },
  { latitude: 48.8566, longitude: 2.3522, radius: 20000, value: 150 },
  // Add more data points as needed
];
const data = [
  { name: "mobile", value: 843 },
  { name: "desktop", value: 46 },
]

export default function Page() {
  return (
    <section className='flex flex-col p-8'>
        <h1 className='text-3xl font-bold'>Diwali Campaign</h1>
  
    <div className='flex mt-8 items-center gap-8'>

    <div className='font-medium'>
        20% off on selected course
    </div>
    
<div className="flex items-center justify-center gap-x-5">
<ProgressCircle value={75}>
<span className="text-sm font-medium text-gray-900 dark:text-gray-50">
75%
</span>
</ProgressCircle>
<div>
<p className="text-sm font-medium text-gray-900 dark:text-gray-50">
340/450
</p>
<p className="text-sm text-gray-500 dark:text-gray-500">
Opened
</p>
</div>

</div>


<div className="flex items-center justify-center gap-x-5">
<ProgressCircle value={3}>
<span className="text-sm font-medium text-gray-900 dark:text-gray-50">
3%
</span>
</ProgressCircle>
<div>
<p className="text-sm font-medium text-gray-900 dark:text-gray-50">
14/450
</p>
<p className="text-sm text-gray-500 dark:text-gray-500">
Bounced
</p>
</div>



</div>



</div>

<div>

<div>
 <BarList data={data} />
</div>

<div>
<MapContainer  zoom={10} style={{ height: "100vh", width: "100%" }}     maxBoundsViscosity={1}>
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png"
        attribution=''
      />
      {mapdata.map((item, index) => (
        <Circle
          key={index}
          center={[item.latitude, item.longitude]}
          radius={item.radius}
          fillColor="blue"
          color="blue"
        >
          <Tooltip>
            <span>{item.value}</span>
          </Tooltip>
        </Circle>
      ))}
    </MapContainer>
      </div>
</div>
    </section>

  )
}
