import React from "react";
import ChatBubble from "@/components/atoms/ChatBubble";
import Pill from "@/components/atoms/Pill";
import AccountListCard from "@/components/atoms/AccountListCard";
export default function page() {
  const acc = {
    pfplink:
      "https://images.pexels.com/photos/25748613/pexels-photo-25748613/free-photo-of-a-man-in-black-shirt-and-sunglasses-standing-against-a-wall.jpeg?auto=compress&cs=tinysrgb&w=600&lazy=load",
    accountInfo: {
      email: "info@shivamja.in",
      name: "Shivam Jain",
    },
  };
  return (
    <>
      <Pill label="Whatsapp" />
    
    <div className="px-4 pt-4 h-full shadow-lg">
      <div className="flex shadow-2xl rounded-t-xl bg-slate-600 h-full">
        <div className=" border-r-[0.5px] border-s-zinc-300">
          <AccountListCard acc={acc} />
        </div>

        <div>
          <ChatBubble
            message="hello world"
            pfplink="https://images.pexels.com/photos/21050507/pexels-photo-21050507/free-photo-of-a-woman-with-an-umbrella-and-a-black-bag.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
          />
        </div>
      </div>
    </div>
    </>
  );
}
