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

  return (
    <div className="h-full">
    <CampaignsCardPage />    
    <CampaignTablePage />
    </div>
  )
}
