// atoms.ts
import { atom } from 'jotai';
import  {CampCardProps}  from '@/app/((main))/campaigns/page';

export const campaignsAtom = atom<CampCardProps[]>([]);
export const isCreateModalOpenAtom = atom(false);
