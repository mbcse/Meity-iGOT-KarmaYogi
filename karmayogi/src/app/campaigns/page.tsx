
import React from 'react'
import Link from 'next/link'
export default function Page() {
  return (
    <div>
      <h1>Campaigns</h1>
      <button><Link href={"/"}>Create +</Link></button>
    </div>
  )
}