// import Ring from "virtual:icons/gg/ring";
// import BoxCutter from "virtual:icons/mdi/box-cutter";
// import TargetArrow from "virtual:icons/tabler/target-arrow";

export type Booth = {
  id: string;
  name: string;
  icon: string;
};

export const booths: Booth[] = [
  {
    id: "shateki",
    name: "射的",
    // icon: TargetArrow,
    icon: "tabler:target-arrow",
  },
  {
    id: "katanuki",
    name: "型抜き",
    // icon: BoxCutter,
    icon: "mdi:box-cutter",
  },
  {
    id: "wanage",
    name: "輪投げ",
    // icon: Ring,
    icon: "gg:ring",
  },
];
