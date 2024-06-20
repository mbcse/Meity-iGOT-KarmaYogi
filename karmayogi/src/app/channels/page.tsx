import React from 'react'
import ChatBubble from '@/components/atoms/ChatBubble'
import Pill from '@/components/atoms/Pill'
import { Button } from '@/components/ui/button'
export default function page() {
  return (
    <>
    <Pill  label='Whatsapp' />
    <ChatBubble message='hello world' pfplink='https://images.pexels.com/photos/21050507/pexels-photo-21050507/free-photo-of-a-woman-with-an-umbrella-and-a-black-bag.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1' />
    </>
  )
}
