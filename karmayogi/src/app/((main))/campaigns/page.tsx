import CampaignsCardPage from "./CampaignsCardPage"
import CampaignTablePage from "./CampaignTablePage";

export interface CampCardProps {
    id: string;
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

export default async function Page() {
  const data = await fetch("http://localhost:3010/campaigns", { cache: "no-store" }).then((res) => res.json())

  return (
    <>
    <CampaignsCardPage />    
    <CampaignTablePage />
    </>
  )
}
