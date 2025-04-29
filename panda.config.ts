import type { Preset, Tokens } from "@pandacss/dev";
import { defineConfig } from "@pandacss/dev";
import pandaPreset from "@pandacss/preset-panda";
import pandaAnimate from "pandacss-animate";
import { globalCss } from "src/styles/global";

function getPreset(): Preset {
  const { colors, ...rest } = pandaPreset.theme.tokens;

  return {
    ...pandaPreset,
    theme: {
      ...pandaPreset.theme,
      tokens: rest as Tokens,
    },
  };
}

export default defineConfig({
  // Whether to use css reset
  preflight: true,

  // Where to look for your css declarations
  include: ["./src/**/{**,.client,.server}/**/*.{js,jsx,ts,tsx}"],

  // Files to exclude
  exclude: [],

  // Useful for theme customization
  theme: {
    extend: {
      tokens: {
        colors: {
          midnight: { value: "#102447" },
          storm: { value: "#2F4161" },
          skyblue: { value: "#9BB7E8" },
          red: { value: "#E89B9B" },
          white: { value: "#E5E5E5" },
        },
        fonts: {
          sans: { value: "'Kaisei Decol', sans-serif" },
          mono: { value: "'UDEV Gothic 35JPDOC', monospace" },
        },
        zIndex: {
          header: { value: 10 },
          modal: { value: 100 },
          modalContent: { value: 110 },
        },
      },
      semanticTokens: {
        colors: {
          "bg": { value: "{colors.midnight}" },
          "bg-variant": { value: "{colors.storm}" },
          "text": { value: "{colors.white}" },
          "primary": { value: "{colors.skyblue}" },
          "error": { value: "{colors.red}" },
        },
      },
    },
  },

  globalCss,

  presets: [getPreset(), pandaAnimate],

  // The output directory for your css system
  outdir: "panda",
  jsxFramework: "react",
});
