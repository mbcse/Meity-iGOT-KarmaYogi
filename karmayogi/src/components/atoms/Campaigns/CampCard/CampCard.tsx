"use client";
import React, { useEffect, useState } from "react";
import { Mails, MessagesSquare, Users } from "lucide-react";
import { X, Ellipsis } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ICampCard {
  title: string;
  noOfSMS: number;
  noOfEmail: number;
  noOfWhatsapp: number;
  noOfUsers: number;
  bgImgUrl: string;
  blurred: boolean;
  isAPage: boolean;
}

export default function CampCard({
  title,
  noOfSMS,
  noOfEmail,
  noOfWhatsapp,
  noOfUsers,
  bgImgUrl,
  blurred,
  isAPage,
}: ICampCard) {
  const [fontColor, setFontColor] = useState<string>("black");

  useEffect(() => {
    const img = new Image();
    img.src = bgImgUrl;
    img.crossOrigin = "Anonymous";

    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (ctx) {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0, img.width, img.height);

        const imageData = ctx.getImageData(0, 0, img.width, img.height);
        const data = imageData.data;

        let r = 0,
          g = 0,
          b = 0,
          count = 0;

        for (let i = 0; i < data.length; i += 4) {
          r += data[i];
          g += data[i + 1];
          b += data[i + 2];
          count++;
        }

        r = Math.floor(r / count);
        g = Math.floor(g / count);
        b = Math.floor(b / count);

        const luminance =
          0.2126 * (r / 255) + 0.7152 * (g / 255) + 0.0722 * (b / 255);
        setFontColor(luminance > 0.5 ? "black" : "white");
      }
    };
  }, [bgImgUrl]);

  return (
    <div
      className={`relative  flex flex-col gap-3 shadow-md p-16 overflow-hidden ${isAPage? "" : "rounded-md"}`}
      style={{ color: fontColor }}
    >
      <div
        className="absolute inset-0 w-screen"
        style={{
          background: `url(${bgImgUrl})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          filter: blurred ? "blur(2px)" : "none",
        }}
      ></div>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black"></div>
      <div className="relative z-10 flex justify-between">
        <div>
          <h3
            className={`${isAPage ? "text-7xl font-black" : "text-4xl font-bold"} `}
          >
            {title}
          </h3>
          <div className="flex gap-2">
            <div className="flex gap-1 p-2">
              <Mails />
              {noOfEmail}
            </div>
            <div className="flex gap-1 p-2">
              <MessagesSquare />
              {noOfSMS}
            </div>
            <div className="flex gap-1 p-2">
              <MessagesSquare />
              {noOfWhatsapp}
            </div>
          </div>
          <div className="flex gap-2 p-2">
            <Users />
            {noOfUsers}
          </div>
        </div>

        {
          isAPage && (

        <div>
          <DropdownMenu>
            <DropdownMenuTrigger className="rounded-[1000px] bg-white p-4">
          
              <Ellipsis className="text-black" />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>Settings</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Update Name</DropdownMenuItem>
              <DropdownMenuItem>Change Banner</DropdownMenuItem>
              <DropdownMenuItem>Delete</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
          )
        }
      </div>
    </div>
  );
}
