import type { Meta, StoryObj } from '@storybook/react';
import InputFields from './InputFields';


const meta: Meta<typeof InputFields> = {
    title: 'Atoms/Input Field',
    component: InputFields,
  };
      
  export default meta;


type Story = StoryObj<typeof InputFields>;

export const SingleField:Story = {}