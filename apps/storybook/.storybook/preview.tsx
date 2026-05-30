import React from "react";
import type { Preview } from "@storybook/react";
import "@knadh/oat/oat.min.css";
import "@knadh/oat/oat.min.js";
import "../../web/src/index.css";

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    backgrounds: {
      default: "dark",
      values: [
        {
          name: "dark",
          value: "#0a0a0f",
        },
        {
          name: "light",
          value: "#ffffff",
        },
      ],
    },
  },
};

export default preview;
