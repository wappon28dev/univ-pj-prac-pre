import { floatingPanelAnatomy } from "@ark-ui/react";
import { sva } from "panda/css";

export const svaFloatingPanel = sva({
  className: "sva_floating-panel",
  slots: floatingPanelAnatomy.keys(),
  base: {
    content: {
      "bg": "bg",
      "rounded": "lg",
      "border": "1px solid",
      "borderColor": "text",
      "& [data-state='open']": {
        fadeIn: "0",
      },
      "& [data-state='closed']": {
        fadeOut: "0",
      },
    },
    header: {
      bg: "bg-variant",
      w: "full",
      display: "flex",
      justifyContent: "space-between",
      p: "2",
      roundedTop: "lg",
    },
    control: {
      "& > *": {
        cursor: "pointer",
      },
    },
    body: {
      m: "4",
    },
   
  },
});
