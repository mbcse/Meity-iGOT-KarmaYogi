// atoms.ts
import { atom } from 'jotai';
import { CampCardType } from '@/app/((main))/campaigns/columns';

export const campaignsAtom = atom<CampCardType[]>([]);
export const isCreateModalOpenAtom = atom(false);
