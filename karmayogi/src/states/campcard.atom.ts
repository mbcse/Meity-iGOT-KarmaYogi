import { atom } from 'jotai';

export interface CampaignData {
    id:string;
  campaignName: string;
  noOfSMS: number;
  noOfEmails: number;
  noOfWhatsApp: number;
  noOfUsers: number;
  bgImgUrl: string;
}

export const campCardAtom = atom<CampaignData[]>([]);

export const campCardChildAtom = atom<null | CampaignData>(
  null
);
