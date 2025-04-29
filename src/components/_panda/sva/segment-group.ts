import { segmentGroupAnatomy } from "@ark-ui/react";
import { sva } from "panda/css";

export const svaSegmentGroup = sva({
  className: "segment-group",
  slots: segmentGroupAnatomy.keys(),
  base: {
    root: {
      w: "100%",
      display: "flex",
      justifyContent: "space-between",
      flexDir: {
        base: "column",
        md: "row",
      },
      gap: "2",
    },
    item: {
      w: "100%",
      borderLeft: "2px solid",
      borderBottom: "none",
      borderColor: "background",
      cursor: "pointer",

      md: {
        borderLeft: "none",
        borderBottom: "2px solid",
        borderColor: "onBackground",
      },

      _checked: {
        "color": "bkp25-blue",
        "borderColor": "bkp25-blue",
        "fontWeight": "bold",
        "& svg": {
          color: "bkp25-blue",
        },
      },
    },
  },
});
