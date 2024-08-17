"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Mails, MessagesSquare } from "lucide-react";

export type CampCardType = {
  id: number;
  campaignName: string;
  noOfSMS?: number;
  noOfEmails?: number;
  noOfWhatsApp?: number;
  noOfUsers?: number;
  status:
    | "scheduled"
    | "running"
    | "completed"
    | "cancelled"
    | "draft"
    | "failed";
};

interface SubCampaigns {
  noOfSMS?: number;
  noOfEmails?: number;
  noOfWhatsApp?: number;
}

const statusStyles = {
  scheduled: "bg-yellow-200 text-yellow-700",
  running: "bg-green-300 text-green-700",
  completed: "bg-blue-300 text-blue-700",
  cancelled: "bg-red-300 text-red-700",
  draft: "bg-gray-300 text-gray-700",
  failed: "bg-red-300 text-red-700",
};

export const CampaignBadge = ({ status }: { status: string }) => {
  const statusClass = statusStyles[status as keyof typeof statusStyles] || "";

  return (
    <span className={`px-2 py-1 rounded-full text-xs ${statusClass}`}>
      {status}
    </span>
  );
};

export const columns: ColumnDef<CampCardType>[] = [
  {
    accessorKey: "id",
    header: "Id",
    cell: info => <div className="text-center">{info.getValue()}</div>,
  },
  {
    accessorKey: "campaignName",
    header: "Campaign Name",
    cell: info => <div className="text-center">{info.getValue()}</div>,
  },
  {
    accessorKey: "subCampaigns",
    header: "Sub Campaigns",
    cell: ({ row }) => {
      const subCampaigns: SubCampaigns = {
        noOfSMS: row.original.noOfSMS,
        noOfEmails: row.original.noOfEmails,
        noOfWhatsApp: row.original.noOfWhatsApp,
      };
      return (
        <div className="flex justify-center gap-4 text-[#454545]">
          <div className="flex items-center gap-2">
            <MessagesSquare />
            <span>{subCampaigns.noOfSMS || 0}</span>
          </div>
          <div className="flex items-center gap-2">
            <Mails />
            <span>{subCampaigns.noOfEmails || 0}</span>
          </div>
          <div className="flex items-center gap-2">
            <MessagesSquare />
            <span>{subCampaigns.noOfWhatsApp || 0}</span>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "noOfUsers",
    header: "Users Targeted",
    cell: info => <div className="text-center">{info.getValue()}</div>,
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status;
      return (
        <div className="flex justify-center">
          <CampaignBadge status={status} />
        </div>
      );
    },
  },
];

// Preprocess data function to combine fields into subCampaigns
export function preprocessCampaignData(
  campaigns: CampCardType[]
): CampCardType[] {
  return campaigns.map((campaign) => ({
    ...campaign,
    subCampaigns: {
      noOfSMS: campaign.noOfSMS,
      noOfEmails: campaign.noOfEmails,
      noOfWhatsApp: campaign.noOfWhatsApp,
    },
  }));
}
