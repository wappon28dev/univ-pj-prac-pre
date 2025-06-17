// import Ring from "virtual:icons/gg/ring";
// import BoxCutter from "virtual:icons/mdi/box-cutter";
// import TargetArrow from "virtual:icons/tabler/target-arrow";
import imgKatanuki from "@/assets/booths/img/katanuki.jpg";
import imgShateki from "@/assets/booths/img/shateki.jpg";
import imgWanage from "@/assets/booths/img/wanage.jpg";

export type Booth = {
  id: string;
  name: string;
  icon: string;
  image: string;
};

export const booths: Booth[] = [
  {
    id: "shateki",
    name: "射的",
    // icon: TargetArrow,
    icon: "tabler:target-arrow",
    image: imgShateki,
  },
  {
    id: "katanuki",
    name: "型抜き",
    // icon: BoxCutter,
    icon: "mdi:box-cutter",
    image: imgKatanuki,
  },
  {
    id: "wanage",
    name: "輪投げ",
    // icon: Ring,
    icon: "gg:ring",
    image: imgWanage,
  },
];
