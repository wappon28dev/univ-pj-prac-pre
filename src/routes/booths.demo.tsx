import type { Booth } from "@/lib/booth";
import type { ReactElement } from "react";
import { Button } from "@/components/recipes/atomic/Button";
import { svaFloatingPanel } from "@/components/recipes/slot/floating-panel";
import { FloatingPanel, Portal } from "@ark-ui/react";
import { persistentAtom } from "@nanostores/persistent";
import { useStore } from "@nanostores/react";
import { atom } from "nanostores";
import { css } from "panda/css";
import { Grid, HStack, styled as p, VStack } from "panda/jsx";
import { useEffect } from "react";
import { Link } from "react-router";
import ArrowBack from "virtual:icons/material-symbols/arrow-back";
import BugReport from "virtual:icons/material-symbols/bug-report";
import Maximize from "virtual:icons/material-symbols/chrome-maximize";
import Minimize from "virtual:icons/material-symbols/chrome-minimize";
import Close from "virtual:icons/material-symbols/close";
import CloseFullscreen from "virtual:icons/material-symbols/close-fullscreen";
import NoteStack from "virtual:icons/material-symbols/note-stack";

const $frameSrc = atom("http://127.0.0.1:3000/index.html");
type SharedData = {
  booths: Booth[];
  budget: number;
  souvenirs: Array<{
    id: string;
    name: string;
    imageUrl: string;
  }>;
};

export const $sharedData = persistentAtom<SharedData>("shared-data", {
  booths: [],
  budget: 0,
  souvenirs: [],
}, {
  encode: JSON.stringify,
  decode: JSON.parse,
});

function DebugPanelBody(): ReactElement {
  const frameSrc = useStore($frameSrc);

  return (
    <VStack>
      <HStack>
        <p.p>Embed URL</p.p>
        <input
          className={css({
            w: "full",
            p: "2",
            rounded: "md",
            border: "1px solid",
          })}
          onChange={(e) => {
            $frameSrc.set(e.target.value);
          }}
          placeholder="https://example.com"
          type="text"
          value={frameSrc}
        />
      </HStack>
    </VStack>
  );
}

function DebugPanel(): ReactElement {
  const cls = svaFloatingPanel();

  // ref: https://ark-ui.com/docs/components/floating-panel
  return (
    <FloatingPanel.Root lazyMount>
      <FloatingPanel.Trigger asChild>
        <Button>
          <HStack>
            <BugReport />
            <p.p>
              デバッグ
            </p.p>
          </HStack>
        </Button>
      </FloatingPanel.Trigger>
      <Portal>
        <FloatingPanel.Positioner>
          <FloatingPanel.Content className={cls.content}>
            <FloatingPanel.DragTrigger>
              <FloatingPanel.Header className={cls.header}>
                <FloatingPanel.Title>デバッグ</FloatingPanel.Title>
                <FloatingPanel.Control className={cls.control}>
                  <FloatingPanel.StageTrigger stage="minimized">
                    <Minimize />
                  </FloatingPanel.StageTrigger>
                  <FloatingPanel.StageTrigger stage="maximized">
                    <Maximize />
                  </FloatingPanel.StageTrigger>
                  <FloatingPanel.StageTrigger stage="default">
                    <CloseFullscreen />
                  </FloatingPanel.StageTrigger>
                  <FloatingPanel.CloseTrigger>
                    <Close />
                  </FloatingPanel.CloseTrigger>
                </FloatingPanel.Control>
              </FloatingPanel.Header>
            </FloatingPanel.DragTrigger>
            <FloatingPanel.Body className={cls.body}>
              <DebugPanelBody />
            </FloatingPanel.Body>
            <FloatingPanel.ResizeTrigger axis="n" />
            <FloatingPanel.ResizeTrigger axis="e" />
            <FloatingPanel.ResizeTrigger axis="w" />
            <FloatingPanel.ResizeTrigger axis="s" />
            <FloatingPanel.ResizeTrigger axis="ne" />
            <FloatingPanel.ResizeTrigger axis="se" />
            <FloatingPanel.ResizeTrigger axis="sw" />
            <FloatingPanel.ResizeTrigger axis="nw" />
          </FloatingPanel.Content>
        </FloatingPanel.Positioner>
      </Portal>
    </FloatingPanel.Root>
  );
}

export default function (): ReactElement {
  const frameSrc = useStore($frameSrc);

  useEffect(() => {
    void (async () => {
      let count = 0;
      while (count < 10) {
        window.postMessage({
          type: "SHARED_DATA::sync",
          data: $sharedData.get(),
        }, "*");
        await new Promise((resolve) => setTimeout(resolve, 1000));
        count++;
        console.log("SHARED_DATA::sync", count);
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
        <iframe
          className={css({
            w: "full",
            h: "full",
            roundedBottom: "lg",
          })}
          src={frameSrc}
          title="屋台"
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
            テスト屋台
          </p.p>
        </HStack>
        <DebugPanel />
      </HStack>
    </Grid>
  );
}
