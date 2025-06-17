/* eslint-disable ts/no-redeclare */
import { type } from "arktype";
import { atom } from "nanostores";

async function waitMs(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

const NAME = "SHARED_DATA_PLUGIN";

function log(...args: unknown[]): void {
  // eslint-disable-next-line no-console
  console.log(`[${NAME}]`, ...args);
}

const ERROR = {
  NOT_READY: (): Error => new Error(`[${NAME}] 共用データはまだ同期されていません。 \`SharedData#sync\` を呼び出して同期してから、再度取得してください。`),
  NO_DATA: (): Error => new Error(`[${NAME}] 共用データがまだ設定されていません。 \`SharedData#sync\` を呼び出してデータを設定してください。`),
  FAIL_SYNC: (): Error => new Error(`[${NAME}] 共用データの同期に失敗しました。親ウィンドウが存在しないか、メッセージの受信に失敗しました。`),
  INVALID_SYNC_RESPONSE: (summary: string): TypeError => new TypeError(`[${NAME}] 共用データの同期に失敗しました。受信したデータが不正です: ${summary}`),
  INVALID_DATA: (summary: string): TypeError => new TypeError(`[${NAME}] 不正なデータが渡されました: ${summary}`),
};

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

const $sharedData = atom<SharedDataSchema | undefined>();

$sharedData.subscribe((data) => {
  if (data == null) {
    return;
  }

  log("共用データの値が更新されました", data);
});

type Status = "NOT_CONNECTED" | "SYNCING" | "CONNECTED" | "READY";
const $status = atom<Status>("NOT_CONNECTED");

type SharedDataImpl<T> = {
  getOnce: () => T;
  update?: (data: Partial<T>) => void;
  subscribe: (callback: (data: T | undefined) => void) => () => void;
  set: (data: T) => void;
};

export class SharedData implements SharedDataImpl<SharedDataSchema> {
  public static VERSION = 3;
  public constructor() { }

  public get status(): Status {
    return $status.get();
  }

  public async sync(): Promise<void> {
    let data: SharedDataSchema | null = null;

    const handler = (event: MessageEvent): void => {
      if (event.data.type === "SHARED_DATA::sync-response") {
        $status.set("CONNECTED");

        const res = SharedDataSchema(event.data.data);
        if (res instanceof type.errors) {
          throw ERROR.INVALID_SYNC_RESPONSE(res.summary);
        }

        data = res;
      }
    };

    window.addEventListener("message", handler);
    $status.set("SYNCING");
    log("共用データの同期中...");
    await waitMs(2000);
    window.removeEventListener("message", handler);

    if (data == null) {
      $status.set("NOT_CONNECTED");
      throw ERROR.FAIL_SYNC();
    }

    $sharedData.set(data);

    log("共用データの同期が完了しました。");
    $status.set("READY");
  }

  public getOnce(): SharedDataSchema {
    if ($status.get() !== "READY") {
      throw ERROR.NOT_READY();
    }

    const data = $sharedData.get();
    if (data == null) {
      throw ERROR.NO_DATA();
    }

    return data;
  }

  public update(data: Partial<SharedDataSchema>): void {
    const currentData = $sharedData.get();

    if (currentData == null) {
      throw ERROR.NO_DATA();
    }

    this.set({
      ...currentData,
      ...data,
    });
  }

  public subscribe(callback: (data: SharedDataSchema | undefined) => void): () => void {
    return $sharedData.subscribe(callback);
  }

  public set(data: SharedDataSchema): void {
    const out = SharedDataSchema(data);

    if (out instanceof type.errors) {
      throw ERROR.INVALID_DATA(out.summary);
    }

    $sharedData.set(data);
    window.parent.postMessage({
      type: "SHARED_DATA::set",
      data: out,
    }, "*");
  }
}

export class SharedBudget implements SharedDataImpl<number> {
  public constructor(
    public sharedData: SharedData,
  ) { }

  public getOnce(): number {
    return this.sharedData.getOnce().budget;
  }

  public subscribe(callback: (data: number | undefined) => void): () => void {
    return this.sharedData.subscribe((data) => {
      callback(data?.budget);
    });
  }

  public set(data: number): void {
    // TODO: extract
    const out = type("number.integer >= 0")(data);

    if (out instanceof type.errors) {
      throw ERROR.INVALID_DATA(out.summary);
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
