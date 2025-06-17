import type { Booth } from "@/lib/booth";
import type { SharedData } from "@/lib/utils/shared-data";
import type { ReactElement } from "react";
import type { Route } from "./+types/booths.$id";
import { Button } from "@/components/recipes/atomic/Button";
import { booths } from "@/lib/booth";
import { waitMs } from "@/lib/utils";
import { $sharedData } from "@/lib/utils/shared-data";
import { useStore } from "@nanostores/react";
import { computed } from "nanostores";
import { css } from "panda/css";
import { Grid, HStack, styled as p } from "panda/jsx";
import { useEffect, useRef } from "react";
import { data, Link } from "react-router";
import ArrowBack from "~icons/material-symbols/arrow-back";
import MoneyBag from "~icons/material-symbols/money-bag";
import NoteStack from "~icons/material-symbols/note-stack";

export function meta({ params }: Route.MetaArgs): Route.MetaDescriptors {
  const id = params.id;
  const booth = booths.find((b) => b.id === id);
  if (booth == null) {
    return [];
  }

  return [{ title: `${booth.name} | 夏祭り in 予算` }];
}

export async function clientLoader({ params }: Route.ClientLoaderArgs): Promise<Booth> {
  const id = params.id;
  const booth = booths.find((b) => b.id === id);

  if (booth == null) {
    throw data("屋台が見つかりません", { status: 404 });
  }

  return booth;
}

export default function ({ loaderData }: Route.ComponentProps): ReactElement {
  const booth = loaderData;
  const embedRef = useRef<HTMLIFrameElement>(null);
  const $sharedBudget = computed($sharedData, ({ budget }) => budget);
  const sharedBudget = useStore($sharedBudget);

  useEffect(() => {
    const handler = (event: MessageEvent): void => {
      if (event.data.type === "SHARED_DATA::set") {
        // eslint-disable-next-line no-console
        console.log("[SHARED_DATA] 共用データを受信しました", event.data.data);
        $sharedData.set(event.data.data as SharedData);
      }
    };

    window.addEventListener("message", handler);

    return (): void => {
      window.removeEventListener("message", handler);
    };
  }, []);

  useEffect(() => {
    void (async (): Promise<void> => {
      let count = 0;

      while (count < 5) {
        if (embedRef.current == null) {
          console.error("Embed iframe is not available.");
          return;
        }

        if (embedRef.current.contentWindow == null) {
          console.error("Embed iframe contentWindow is not available.");
          return;
        }

        // eslint-disable-next-line no-console
        console.log(`[SHARED_DATA] (${count + 1}/5) 共用データを送信中...`);
        embedRef.current.contentWindow.postMessage({
          type: "SHARED_DATA::sync-response",
          data: $sharedData.get(),
        }, "*");

        await waitMs(1000);
        count++;
      }
    })();
  }, []);

  return (
    <Grid
      gap="0"
      gridTemplateRows="1fr auto"
      h="full"
      w="full"
    >
      <p.div
        bg="bg-variant"
        w="full"
      >
        {/* eslint-disable-next-line react-dom/no-missing-iframe-sandbox */}
        <iframe
          className={css({
            w: "full",
            h: "full",
            roundedBottom: "lg",
          })}
          ref={embedRef}
          src={`/booths/embed/${booth.id}/index.html`}
          title={booth.name}
        >
        </iframe>
      </p.div>
      <HStack
        justifyContent="space-between"
        p="3"
        w="full"
      >
        <Link to="/" viewTransition>
          <Button size="sm" variant="text">
            <HStack>
              <ArrowBack />
              <p.p>祭り広場</p.p>
            </HStack>
          </Button>
        </Link>
        <HStack>
          <NoteStack />
          <p.p fontSize="lg" fontWeight="bold">
            {booth.name}
          </p.p>
        </HStack>
        <p.div>
          <HStack>
            <MoneyBag />
            <p.p>
              ¥
              {sharedBudget.toLocaleString()}
            </p.p>
          </HStack>
        </p.div>
      </HStack>
    </Grid>
  );
}
