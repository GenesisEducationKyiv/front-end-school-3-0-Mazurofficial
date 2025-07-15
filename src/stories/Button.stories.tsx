import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import Button from '@/components/ui/Button/Button';
import type { ComponentProps } from 'react';

type StoryProps = ComponentProps<typeof Button>;

const meta: Meta<StoryProps> = {
   tags: ['autodocs'],
   component: Button,
   args: {
      onClick: fn(),
   },
};

type Story = StoryObj<StoryProps>;

export const Primary: Story = {
   args: {
      variant: 'primary',
   },
   render: (args) => <Button {...args}>Test button</Button>,
};

export const Secondary: Story = {
   args: {
      variant: 'secondary',
   },
   render: (args) => <Button {...args}>Test button</Button>,
};

export const IconButton: Story = {
   args: {
      variant: 'icon-button',
   },
   render: (args) => (
      <Button {...args}>
         <div
            style={{
               width: '18px',
               height: '18px',
               backgroundColor: '#ffffff',
               borderRadius: '50%',
            }}
         ></div>
      </Button>
   ),
};

export default meta;
