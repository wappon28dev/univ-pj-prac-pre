import type { ReactElement } from "react";
import type { Route } from "./+types/_index";
import { Button } from "@/components/_panda/cva/Button";
import { cvaExpanded, Expanded } from "@/components/_panda/cva/Expanded";
import { StallCard } from "@/components/StallCard";
import { css } from "panda/css";
import { Flex, Grid, HStack, styled as p, VStack } from "panda/jsx";
import PlaySymbols from "~icons/material-symbols/play-shapes";
import TargetArrow from "~icons/tabler/target-arrow";

export function meta(): Route.MetaDescriptors {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function (): ReactElement {
  return (
    <Expanded>
      <Flex
        alignItems="center"
        flexDir={{
          base: "column",
          lg: "row",
        }}
        h="full"
        w="full"
      >
        <VStack
          color="primary"
          gap="5"
          w="clamp(20rem, 40vw, 40rem)"
        >
          <p.p
            duration="500"
            fontSize="7xl"
            fontWeight="bold"
            textShadow="0 0 10px #000"
          >
            夏祭り
          </p.p>
          <p.p fontSize="2xl" mt="-1rem">in 予算</p.p>
          <Button variant="filled">
            <HStack>
              <p.p>はじめから遊ぶ</p.p>
              <PlaySymbols />
            </HStack>
          </Button>
        </VStack>
        <p.div
          bg="bg"
          flex="1"
          h="calc(100% - 2.5em * 2)"
          my="10"
          p="10"
          roundedBottomLeft="3xl"
          roundedTopLeft="3xl"
        >
          <Grid
            gap="5"
            gridTemplateColumns="repeat(auto-fit, minmax(300px, 1fr))"
            w="full"
          >
            <StallCard />
            <StallCard />
            <StallCard />
            <StallCard />
            <StallCard />
          </Grid>
        </p.div>
      </Flex>

      <p.div
        h="full"
        left="0"
        overflow="hidden"
        position="fixed"
        top="0"
        w="full"
        zIndex="-1"
        // eslint-disable-next-line @pandacss/no-hardcoded-color
        bg="#080305"
      >
        <p.img
          alt=""
          className={css({
            h: "full",
            w: "full",
            objectFit: "cover",
            filter: "blur(6px)",
            duration: "1000ms",
            fadeIn: "0",
            transform: "scale(1.05)",
            overflow: "hidden",
          })}
          src="https://cdn.pixabay.com/photo/2018/05/08/17/18/festival-3383469_1280.jpg"
        />
      </p.div>
    </Expanded>
  );
}
