import type { Meta, StoryObj } from '@storybook/react';
import CampCard from './CampCard';

const meta: Meta<typeof CampCard> = {
title: 'Atoms/CampCard',
component: CampCard,
// ...
};
  
export default meta;

type Story = StoryObj<typeof CampCard>;

export const CampCardPrimary: Story = {
    args:{
        title:"Diwali offer 2025",
        noOfEmail:3,
        noOfSMS:2,
        noOfUsers:34030,
        noOfWhatsapp:1,
        bgImgUrl:"https://images.pexels.com/photos/1571442/pexels-photo-1571442.jpeg"
    }
}

export const CampCardPage: Story = {
    args:{
        title:"Diwali offer 2025",
        noOfEmail:3,
        noOfSMS:2,
        noOfUsers:34030,
        noOfWhatsapp:1,
        bgImgUrl:"https://images.pexels.com/photos/1571442/pexels-photo-1571442.jpeg",
        blurred:true
    }
}