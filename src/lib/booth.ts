// import Ring from "virtual:icons/gg/ring";
// import BoxCutter from "virtual:icons/mdi/box-cutter";
// import TargetArrow from "virtual:icons/tabler/target-arrow";

export type Booth = {
  id: string;
  name: string;
  icon: string;
  src: string;
};

export const booths: Booth[] = [
  {
    id: "shateki",
    name: "射的",
    // icon: TargetArrow,
    icon: "tabler:target-arrow",
    src: "https://gist.githubusercontent.com/kuwabatakenonaka/a34872e626e395ade853b0d40b6481cd/raw/index.html",
  },
  {
    id: "katanuki",
    name: "型抜き",
    // icon: BoxCutter,
    icon: "mdi:box-cutter",
    src: "https://gist.githubusercontent.com/kurageee/742717baf3729f763ee7b10e30ce8e22/raw/index.html",
  },
  {
    id: "wanage",
    name: "輪投げ",
    // icon: Ring,
    icon: "gg:ring",
    src: "https://gist.githubusercontent.com/Haruhisa222/7ae43a105e7c46eea3edc83c8a7eb31e/raw/index.html",
  },
];
