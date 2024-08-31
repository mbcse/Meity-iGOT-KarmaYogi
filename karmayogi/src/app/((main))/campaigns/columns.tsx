import { ColumnDef } from "@tanstack/react-table";
import { Mails, MessagesSquare } from "lucide-react";
import { format } from "date-fns";  // Import the format function

export type CampCardType = {
  id: string;
  campaignName: string;
  noOfSMS?: number;
  noOfEmails?: number;
  noOfWhatsApp?: number;
  noOfUsers?: number;
  timeCreate: string; 
  status : string;
};

interface SubCampaigns {
  noOfSMS?: number;
  noOfEmails?: number;
  noOfWhatsApp?: number;
}

export const columns: ColumnDef<CampCardType>[] = [
  {
    accessorKey: "id",
    header: "Id",
    // @ts-ignore
    cell: info => <div className="text-center">{info.getValue<string>()}</div>, // Explicitly cast the type
  },
  {
    accessorKey: "campaignName",
    header: "Campaign Name",
    // @ts-ignore
    cell: info => <div className="text-center">{info.getValue<string>()}</div>, // Explicitly cast the type
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
    cell: info => <div className="text-center">{info.getValue<number>()}</div>, // Explicitly cast the type
  },
  {
    accessorKey: "timeCreate",
    header: "Time Created",
    cell: ({ row }) => {
      const timeCreate = row.original.timeCreate;
      const formattedTime = format(new Date(timeCreate), "dd-MM-yy hh:mm a");
      return <div className="text-center">{formattedTime}</div>;
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
