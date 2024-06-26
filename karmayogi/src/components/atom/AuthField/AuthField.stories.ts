import type { Meta, StoryObj } from '@storybook/react';
import AuthField from './AuthField';

const meta: Meta<typeof AuthField> = {
title: 'Atoms/AuthField',
component: AuthField,
// ...
};
  
export default meta;

type Story = StoryObj<typeof AuthField>;

export const EmailPass: Story = {}