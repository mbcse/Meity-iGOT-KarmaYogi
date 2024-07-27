import type { Preview } from "@storybook/react";
import '../src/app/globals.css';
import { withThemeByClassName } from '@storybook/addon-themes';
import { withThemeByDataAttribute } from '@storybook/addon-themes';




export const decorators = [withThemeByDataAttribute({
  themes: {
    light: 'light',
    dark: 'dark',
  },
  defaultTheme: 'light',
  attributeName: 'data-mode',
}), withThemeByClassName({
    themes: {
        light: '',
        dark: 'dark',
    },
    defaultTheme: 'light',
})];

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
};

export default preview;
