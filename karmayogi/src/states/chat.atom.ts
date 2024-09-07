import { atom } from 'jotai';

export enum CommType {
    Mail = 'Mail',
    SMS = 'SMS',
    Whatsapp = 'Whatsapp',
}

export interface SelectedChatAtomProps {
    _id: string;
    from: string;
    fromName?: string;
    messageID: string;
    date: Date;
    subject: string;
    thread?: string;  // Add this line
}


export const chatCommTypeAtom = atom<CommType>(CommType.Mail);
export const selectedChatAtom = atom<SelectedChatAtomProps|null>(null);
export const ChatRenderAtom = atom<boolean|null>(true);
export const selectedAccountAtom = atom<string>('');