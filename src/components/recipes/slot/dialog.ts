import { dialogAnatomy } from "@ark-ui/react";
import { sva } from "panda/css";

export const svaDialog = sva({
  className: "sva_dialog",
  slots: dialogAnatomy.keys(),
  base: {
    content: {
      position: "fixed",
      inset: "0",
      bg: "background",
      zIndex: "modal",
    },
  },
});
