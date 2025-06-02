import type { ReactElement } from "react";
import type { Route } from "./+types/_index";
import { Icon } from "@iconify/react";
import { css } from "panda/css";
import { Flex, Grid, HStack, styled as p, VStack } from "panda/jsx";
import { Link } from "react-router";
// import NoteStack from "virtual:icons/material-symbols/note-stack";
// import PlaySymbols from "virtual:icons/material-symbols/play-shapes";
import { BoothCard } from "@/components/BoothCard";
import { Button } from "@/components/recipes/atomic/Button";
import { Expanded } from "@/components/recipes/atomic/Expanded";
import { booths } from "@/lib/booth";

export function meta(): Route.MetaDescriptors {
  return [{ title: "夏祭り in 予算" }];
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
          <HStack>
            <Button variant="filled">
              <HStack>
                <p.p>はじめから遊ぶ</p.p>
                {/* <PlaySymbols /> */}
                <Icon icon="material-symbols:play-shapes" />
              </HStack>
            </Button>
            <Link to="/booths/demo">
              <Button variant="filled">
                <HStack>
                  <p.p>デモ</p.p>
                  {/* <NoteStack /> */}
                  <Icon icon="material-symbols:note-stack" />
                </HStack>
              </Button>
            </Link>
          </HStack>
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
            gridTemplateColumns="repeat(auto-fit, minmax(250px, 1fr))"
            w="full"
          >
            {booths.map((booth) => (
              <BoothCard booth={booth} key={booth.id} />
            ))}
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
