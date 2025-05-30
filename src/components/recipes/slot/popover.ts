import { popoverAnatomy } from "@ark-ui/react";
import { sva } from "panda/css";

export const svaPopover = sva({
  className: "sva_popover",
  slots: popoverAnatomy.keys(),
  base: {
    content: {
      p: "2",
      bg: "background",
      color: "onBackground",
      border: "1px solid",
      rounded: "md",
      shadow: "md",
      duration: "200ms",
      _open: {
        // https://github.com/mverissimo/pandacss-animate
        slideInY: "1",
        fadeIn: "0",
      },
      _closed: {
        slideOutY: "1",
        fadeOut: "0",
      },
    },
    title: {
      fontSize: "lg",
      fontWeight: "bold",
    },
    closeTrigger: {
      cursor: "pointer",
      rounded: "md",
      p: "2",
      _hover: {
        bg: "colorPalette/50",
      },
    },
    // https://zagjs.com/components/popover#arrow
    arrow: {
      "--arrow-background": "var(--colors-background)",
      "--arrow-size": "16px",
      "--arrow-shadow-color": "gray",
    },
    arrowTip: {
      borderTop: "1px solid",
      borderLeft: "1px solid",
    },
  },
});
