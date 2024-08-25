import React from 'react'
import OverallBar from '@/components/atoms/Reports/OverallBar'
import ReportTable from '@/components/atoms/Reports/ReportTable'
export default function Page() {
  return (
    <div className='px-4'>
        
        <h1 className='text-lg font-bold'>Overall Stats</h1>
        <OverallBar />

        <ReportTable />
    </div>
  )
}
