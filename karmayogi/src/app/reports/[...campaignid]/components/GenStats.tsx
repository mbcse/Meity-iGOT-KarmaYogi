import React from 'react';
import { Card } from '../../../../components/ui/card';

type Color = 'red' | 'green';

export default function GenStats({
  data,
  name,
  color,
}: {
  data: any;
  name: string;
  color?: Color;
}) {
  // Define a color map to conditionally apply styles
  const colorMap = {
    red: 'text-red-500',
    green: 'text-green-500',
  };

  return (
    <Card className='rounded-md w-[100px] p-2'>
      <p className='text-sm text-gray-500 truncate'>{name}</p>
      <h1 className={`font-bold text-2xl ${color && colorMap[color]}`}>
        {data}
      </h1>
    </Card>
  );
}
