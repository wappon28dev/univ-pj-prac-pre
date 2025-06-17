import type { Booth } from "@/lib/booth";
import type { ArrayElem } from "@/types/utils";
import { booths } from "@/lib/booth";
import { persistentAtom } from "@nanostores/persistent";
import { computed } from "nanostores";

export type SharedData = {
  booths: Booth[];
  budget: number;
  souvenirs: Array<{
    id: string;
    name: string;
    imageUrl: string;
  }>;
};

export const storesInfo = [
  {
    name: "ラムネ",
    price: 100,
    imgUrl: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhoifNo-ndo1rKL_9JR8J8GleeNyw5NOBBLZza-yx-IlA5_xS83phgpRyw_qMcWsaMX0Nz6RicW4lisWKJvh4JmGtnaLrRdspkbPhA14fdEsZliYCTUuJ7zWidwpfcmVpHWml0baa0zNO1s/s400/sweets_ramune.png",
  },
  {
    name: "わたあめ",
    price: 150,
    imgUrl: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEj5fgB2FlgR_9GjVepk8dgAtyYRZ1DGtnv5kU1BpYm6ywNoZx-4sWE4P16TQ78Nn87lmYJdVC9uoYvOABhrxL9PuuVG_S2n_ojNsc7lqbETPI3t0h40Vo-kyWb_uaEC8seldgcw4-QUC497/s400/sweets_wataame.png",
  },
  {
    name: "チョコバナナ",
    price: 150,
    imgUrl: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjDPfXHp0N0XLXM7oG0mOWiBKHMW5o__84NZSt4fqE6VUqDm5W1cAW0VU_jfM3oI-Gl6DTp7qDVCD54mUbjAr5Sp0HlJgL2yYv5jTUIM9bGexvydTNVAVW6WLHOxWLQh-JbVJwH-yQ6KvGF/s400/omatsuri_chocobanana.png",
  },
  {
    name: "くじ引き",
    price: 100,
    imgUrl: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEg99vzenWTz9onO3sHQEhyCSY8tNmBJPEAGm78JjMoXpF1H5M8d7hsZ91fjKjhyphenhyphen0hvPi7ij_Xko8REg32LNM0mCbDVvPUKvEpiW7r50OHiLsmNmGNQPQRWWfLR1rGaNtjztFwDQ56EhUKiz/s400/kujibiki_box.png",
  },
  {
    name: "せんべい",
    price: 50,
    imgUrl: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjX3PZTU41HHOCB7wKvTHl6jOXnijq0jRGecRIrAp3kBzRQYHEzzW-_xtqKI4vDTnvoeanFNdQMmF64aVnqd2TOYOSKtF77zcZx4peooQVIrV2TG1Lo2oiwz2n7fnqxMVf2Iw30BwasWQzx/s180-c/sweets_press_senbei.png",
  },
  {
    name: "お面",
    price: 150,
    imgUrl: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjwTIbnjl7l0lEi5BcGVMO94erqCLX_kXignL82v51rPuHdrZ1W3P5EPUah5tL2GdQMBdTM6UzLCy_pjWuXceQm9jRboJLlPE14P_rEwuIsDoMBYVj9b_lxfTsDtCkdonv75r-gIWeXu9ts/s400/omatsuri_yatai_omen.png",
  },
] as const satisfies Array<{ name: string; price: number; imgUrl: string }>;

export const $boughtList = persistentAtom<Array<ArrayElem<(typeof storesInfo)>["name"]>>("bought-list", [], {
  encode: JSON.stringify,
  decode: JSON.parse,
});
export const $sharedData = persistentAtom<SharedData>("shared-data", {
  booths,
  budget: 1000,
  souvenirs: [],
}, {
  encode: JSON.stringify,
  decode: JSON.parse,
});
export const $sharedBudget = computed($sharedData, ({ budget }) => budget);

// NOTE: ゲームが継続できるかどうか
// 予算が足りている状態で, まだ買っていないお店の商品が存在する or ブースで遊べるだけの予算があるか？
export const $canContinue = computed([$sharedBudget, $boughtList], (budget, boughtList) => {
  const remainingStores = storesInfo.filter((store) => !boughtList.includes(store.name));
  const canBuySomething = remainingStores.some((store) => store.price <= budget);
  const canPlayBooth = budget >= 200;

  return canBuySomething || canPlayBooth;
});
