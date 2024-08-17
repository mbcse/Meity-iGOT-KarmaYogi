import { atom } from 'jotai';

export enum CommType {
    Mail = 'Mail',
    SMS = 'SMS',
    Whatsapp = 'Whatsapp',
}

export interface selectedChatAtomProps {
    id: number;
    avatar?: string;
    name?: string;
    email?: string;
    phone?: string;
    message: string;
}

export const chatCommTypeAtom = atom<CommType>(CommType.Mail);
export const selectedChatAtom = atom<selectedChatAtomProps|null>(null);
export const ChatRenderAtom = atom<boolean|null>(true);