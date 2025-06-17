import type { ReactElement } from "react";
import { Button } from "@/components/recipes/atomic/Button";
import { svaFloatingPanel } from "@/components/recipes/slot/floating-panel";
import { waitMs } from "@/lib/utils";
import { $sharedData } from "@/lib/utils/shared-data";
import { FloatingPanel, Portal } from "@ark-ui/react";
import { useStore } from "@nanostores/react";
import { atom } from "nanostores";
import { css } from "panda/css";
import { Grid, HStack, styled as p, VStack } from "panda/jsx";
import { useEffect, useRef } from "react";
import { Link } from "react-router";
import ArrowBack from "virtual:icons/material-symbols/arrow-back";
import BugReport from "virtual:icons/material-symbols/bug-report";
import Maximize from "virtual:icons/material-symbols/chrome-maximize";
import Minimize from "virtual:icons/material-symbols/chrome-minimize";
import Close from "virtual:icons/material-symbols/close";
import CloseFullscreen from "virtual:icons/material-symbols/close-fullscreen";
import NoteStack from "virtual:icons/material-symbols/note-stack";

const $frameSrc = atom("http://127.0.0.1:3000/index.html");
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
  const embedRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    void (async (): Promise<void> => {
      let count = 0;

      while (count < 20) {
        if (embedRef.current == null) {
          console.error("Embed iframe is not available.");
          return;
        }

        if (embedRef.current.contentWindow == null) {
          console.error("Embed iframe contentWindow is not available.");
          return;
        }

        if (count % 5 === 0) {
          // eslint-disable-next-line no-console
          console.log(`[SHARED_DATA] (${count + 1}/20) 共用データを送信中...`);
        }

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
          <Button
            size="sm"
            variant="text"
          >
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
