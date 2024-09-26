import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, Users } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

interface ICampSliderProps {
  campaignType: "WA" | "EMAIL" | "SMS";
  campaignCards: any[];
  campaignId: string;
}

export default function CampSlider({
  campaignId,
  campaignCards,
}: ICampSliderProps) {
  console.log(campaignCards[0]);
  const title = {
    WA: "Whatsapp Campaigns",
    EMAIL: "Email Campaigns",
    SMS: "SMS Campaigns",
  };

  const getBadgeColor = (status: string) => {
    if (status === "PENDING") {
      return "bg-yellow-300 text-yellow-800 hover:bg-yellow-300/70";
    } else if (status === "ACTIVE") {
      return "bg-green-300 text-green-800 hover:bg-green-300/70";
    } else if (status === "COMPLETED") {
      return "bg-blue-300 text-blue-800 hover:bg-blue-300/70";
    } else if (status === "FAILED") {
      return "bg-red-200 text-red-800";
    }
  };

  const newDate = (date: string): string => {
    const dateObj = new Date(date);
    const day = String(dateObj.getDate()).padStart(2, "0");
    const month = String(dateObj.getMonth() + 1).padStart(2, "0"); // Months are zero-based
    const year = String(dateObj.getFullYear()).slice(-2);

    return `${day}/${month}/${year}`;
  };

  return (
    <div className="p-8 overflow-auto scrollbar">
      <div className="flex gap-3">
        {campaignCards.length > 0 ? (
          campaignCards.map((campaignCard, index) => (
            <div
              key={index}
              className="bg-white text-black min-w-[320px] w-[320px] rounded-md shadow-lg p-8 flex flex-col border-[0.1px] border-gray-200 space-y-4 justify-between gap-4"
            >
              <div className="flex justify-between px-2">
                <h4
                  className="text-2xl font-medium truncate"
                  title={campaignCard.campaignTitle}
                >
                  {campaignCard.campaignTitle}
                </h4>

                <Badge
                  className={`rounded-3xl gap-2 flex items-center justify-between ml-2 py-1 px-4 ${getBadgeColor(
                    campaignCard.status,
                  )}`}
                >
                  {campaignCard.status}
                </Badge>
              </div>
              <div className="flex justify-between items-center p-2 rounded-md">
                <div className="flex items-center justify-between w-full">
                  <div>
                    <div className="flex gap-2">
                      <Users />
                      {campaignCard.targeted}
                    </div>
                    <div className="flex gap-2">
                      <span>{newDate(campaignCard.scheduled)}</span>
                      <span>{campaignCard.timeToBeSent}</span>
                    </div>
                  </div>
                  <div>
                    <Link href={`/reports/${campaignId}`}>
                      <Button className="rounded-full p-2">
                        <ArrowUpRight size={16} />
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <h1 className="text-2xl font-medium text-gray-400 italic">
            Add a campaign to get started
          </h1>
        )}
      </div>
    </div>
  );
}
