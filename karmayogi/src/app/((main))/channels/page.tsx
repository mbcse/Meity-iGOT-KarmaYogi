import React from 'react'
import SideChat from './components/SideChat'
import CommTabs from './components/CommTabs';
import ChatWindow from './components/ChatWindow';
export default function Page() {
    const data = [
        {
          id: 1,
          name: "John Doe",
          message: "Hello World",
          time: "12:00 PM",
          avatar: "https://randomuser.me/api/portraits",
        },
        {
          id: 2,
          name: "Jane Doe",
          message: "Hello World",
          time: "12:00 PM",
          avatar: "https://randomuser.me/api/portraits",
        },
        {
          id: 3,
          name: "John Doe",
          message: "Hello World",
          time: "12:00 PM",
          avatar: "https://randomuser.me/api/portraits",
        },
        {
          id: 4,
          name: "Jane Doe",
          message: "Hello World",
          time: "12:00 PM",
          avatar: "https://randomuser.me/api/portraits",
        },
        {
          id: 5,
          name: "John Doe",
          message: "Hello World jsdsdsjdsdsjjdjdjdi jsidjdsj sdijidsjdsiji",
          time: "12:00 PM",
          avatar: "https://randomuser.me/api/portraits",
        },
        {
          id: 6,
          name: "Jane Doe",
          message: "Hello World",
          time: "12:00 PM",
          avatar: "https://randomuser.me/api/portraits",
        },
        {
          id: 7,
          name: "No Doe",
          message: "Hello World",
          time: "12:00 PM",
          avatar: "https://randomuser.me/api/portraits",
        },
        {
          id: 8,
          name: "Jane Doe",
          message: "Hello World",
          time: "12:00 PM",
          avatar: "https://randomuser.me/api/portraits",
        },
      ];

  return (
    <div className='h-full flex flex-col '>
      <CommTabs />

      <div className='flex gap-3 h-full'>
      <SideChat data={data} />
      <ChatWindow />
      </div>
    </div>
  )
}
