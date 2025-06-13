/* eslint-disable ts/no-redeclare */
import { type } from "arktype";
import { atom } from "nanostores";

async function waitMs(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

const Booth = type({
  id: "string",
  name: "string",
  icon: "string",
});
type Booth = typeof Booth.infer;

const Souvenir = type({
  id: "string",
  name: "string",
  imageUrl: "string",
});

const SharedDataSchema = type({
  booths: Booth.array(),
  budget: "number.integer >= 0",
  souvenirs: Souvenir.array(),
});
type SharedDataSchema = typeof SharedDataSchema.infer;

const $sharedData = atom<SharedDataSchema>({
  booths: [],
  budget: 0,
  souvenirs: [],
});

$sharedData.subscribe((data) => {
  // eslint-disable-next-line no-console
  console.log("[SHARED_DATA] 値が更新されました.", data);
});

type Status = "NOT_CONNECTED" | "CONNECTED" | "READY";
const $status = atom<Status>("NOT_CONNECTED");

type SharedDataImpl<T> = {
  getOnce: () => T;
  update?: (data: Partial<T>) => void;
  subscribe: (callback: (data: T) => void) => () => void;
  set: (data: T) => void;
};

export class SharedData implements SharedDataImpl<SharedDataSchema> {
  public static VERSION = 2;
  public constructor() { }

  public get status(): Status {
    return $status.get();
  }

  public async sync(): Promise<void> {
    const $tempData = atom<SharedDataSchema | undefined>(undefined);
    window.addEventListener("message", (event) => {
      // eslint-disable-next-line no-console
      console.log("[SHARED_DATA] 共有データの同期を受信しました。", event.data);
      if (event.data.type === "SHARED_DATA::sync") {
        $tempData.set(event.data.data as SharedDataSchema);
      }
    });
    postMessage({
      type: "SHARED_DATA::sync",
    });

    await waitMs(2000);
    // eslint-disable-next-line no-console
    console.log("[SHARED_DATA]", $tempData.get());
    if ($tempData.get() == null) {
      $status.set("NOT_CONNECTED");
      throw new Error("共有データの同期に失敗しました。");
    }

    $status.set("READY");
  }

  public getOnce(): SharedDataSchema {
    return $sharedData.get();
  }

  public update(data: Partial<SharedDataSchema>): void {
    const currentData = $sharedData.get();
    $sharedData.set({
      ...currentData,
      ...data,
    });
  }

  public subscribe(callback: (data: SharedDataSchema) => void): () => void {
    return $sharedData.subscribe(callback);
  }

  public set(data: SharedDataSchema): void {
    const out = SharedDataSchema(data);

    if (out instanceof type.errors) {
      throw new TypeError(`不正なデータが渡されました: ${out.summary}`);
    }

    $sharedData.set(data);
  }
}

export class SharedBudget implements SharedDataImpl<number> {
  public constructor(
    public sharedData: SharedData,
  ) { }

  public getOnce(): number {
    return this.sharedData.getOnce().budget;
  }

  public subscribe(callback: (data: number) => void): () => void {
    return this.sharedData.subscribe((data) => {
      callback(data.budget);
    });
  }

  public set(data: number): void {
    // TODO: extract
    const out = type("number.integer >= 0")(data);

    if (out instanceof type.errors) {
      throw new TypeError(`不正なデータが渡されました: ${out.summary}`);
    }

    const currentData = this.sharedData.getOnce();
    this.sharedData.set({
      ...currentData,
      budget: out,
    });
  }

  public setDeltaOf(amount: number): void {
    const currentBudget = this.getOnce();
    const newBudget = currentBudget + amount;
    this.set(newBudget);
  }

  public canSetDeltaOf(amount: number): boolean {
    const currentBudget = this.getOnce();
    // TODO: extract
    const out = type("number.integer >= 0")(currentBudget + amount);
    const hasError = out instanceof type.errors;
    return !hasError;
  }
}
