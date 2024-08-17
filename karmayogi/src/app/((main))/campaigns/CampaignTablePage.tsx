"use client";
import React from 'react'
import { CampCardType, columns } from "./columns"
import { DataTable } from "./campaign-table"
import { useAtomValue } from 'jotai'
import { campaignsAtom } from '@/states/campcard.atom'

export default function CampaignTablePage() {
    const campaignData = useAtomValue(campaignsAtom)
  return (
          <div className="container mx-auto py-10">
      <DataTable columns={columns} data={campaignData} />
    </div>
  )
}
