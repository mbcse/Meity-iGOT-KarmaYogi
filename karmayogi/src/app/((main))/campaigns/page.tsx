import CampaignsCardPage from "./CampaignsCardPage"
import CampaignTablePage from "./CampaignTablePage";

export interface CampCardProps {
    id: string;
    campaignName: string;
    noOfSMS?: number;
    noOfEmails?: number;
    noOfWhatsApp?: number;
    noOfUsers?: number;
   
  };

export default async function Page() {

  return (
    <div className="h-full">
    <CampaignTablePage />
    </div>
  )
}
