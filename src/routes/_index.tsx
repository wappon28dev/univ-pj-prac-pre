import type { ReactElement } from "react";
import type { Route } from "./+types/_index";
// import NoteStack from "virtual:icons/material-symbols/note-stack";
// import PlaySymbols from "virtual:icons/material-symbols/play-shapes";
import { BoothCard } from "@/components/BoothCard";
import { Button } from "@/components/recipes/atomic/Button";
import { Expanded } from "@/components/recipes/atomic/Expanded";
import { booths } from "@/lib/booth";
import { $boughtList, $canContinue, $sharedData, storesInfo } from "@/lib/utils/shared-data";
import { toaster } from "@/lib/utils/toaster";
import { Icon } from "@iconify/react";
import { useStore } from "@nanostores/react";
import { computed } from "nanostores";
import { css } from "panda/css";
import { Center, Divider, Flex, Grid, HStack, styled as p, VStack } from "panda/jsx";
import { Link } from "react-router";
import PlaySymbols from "virtual:icons/material-symbols/play-shapes";

export function meta(): Route.MetaDescriptors {
  return [{ title: "夏祭り in 予算" }];
}

function ResultCard(): ReactElement {
  const $sharedBudget = computed($sharedData, ({ budget }) => budget);
  const sharedBudget = useStore($sharedBudget);
  const boughtList = useStore($boughtList);

  return (
    <p.div bg="bg" fadeIn="0" rounded="md">
      <VStack gap="6" maxW="lg" minW={{ base: "80vw", sm: "md" }} p="8" textAlign="center">
        <p.p color="fg.emphasized" fontSize="3xl" fontWeight="bold">
          お疲れ様でした！
        </p.p>
        <VStack alignItems="stretch" gap="3" w="full">
          <HStack justifyContent="space-between">
            <p.p fontSize="lg">最終予算:</p.p>
            <p.p fontSize="lg" fontWeight="bold">
              ¥
              {sharedBudget.toLocaleString()}
            </p.p>
          </HStack>
          <Divider />
          <p.p fontSize="lg" textAlign="left">購入したお土産:</p.p>
          {boughtList.length > 0
            ? (
                <VStack alignItems="start" listStyleType="disc" pl="5" w="full">
                  {boughtList.map((itemName) => {
                    const storeItem = storesInfo.find((s) => s.name === itemName);
                    return <p.li key={itemName} textAlign="left">{storeItem?.name ?? itemName}</p.li>;
                  })}
                </VStack>
              )
            : (
                <p.p color="fg.muted" fontStyle="italic">何も購入しませんでした。</p.p>
              )}
        </VStack>
        <Button
          onClick={() => {
            $sharedData.set({
              booths,
              budget: 1000,
              souvenirs: [],
            });
            $boughtList.set([]);
          }}
          variant="filled"
          w="full"
        >
          <HStack justifyContent="center">
            <p.p>もう一度遊ぶ</p.p>
            <PlaySymbols />
          </HStack>
        </Button>
      </VStack>

    </p.div>
  );
}

function RestBudget(): ReactElement {
  const sharedData = useStore($sharedData);

  return (
    <VStack alignItems="start" color="primary" h="full">
      <HStack>
        <Icon height="1.5rem" icon="material-symbols:money-bag" />
        <p.p fontSize="xl" fontWeight="bold">予算残り</p.p>
      </HStack>

      <Center
        bg="bg-variant"
        h="full"
        px="10"
        py="5"
        rounded="md"
        transform="translateX(-0.2em) translateY(-0.2em)"
        w="17rem"
      >
        <p.span
          color="text"
          fontSize="4xl"
          fontWeight="bold"
        >
          <p.span fontSize="lg" mr="1">¥</p.span>
          {sharedData.budget.toLocaleString()}
        </p.span>
        <p.span
          display="inline-block"
          fontSize="sm"
          transform="translateX(0.5em) translateY(0.5em)"
        >
          /
          <p.span fontSize="smaller" ml="1">¥</p.span>
          {" "}
          1,000
        </p.span>
      </Center>
    </VStack>
  );
}

function Stores(): ReactElement {
  const boughtList = useStore($boughtList);

  return (
    <VStack alignItems="start" color="primary">
      <HStack>
        <Icon height="1.5rem" icon="material-symbols:shopping-basket" />
        <p.p fontSize="xl" fontWeight="bold">商店</p.p>
      </HStack>

      <HStack
        bg="bg-variant"
        gap="5"
        maxW="50vw"
        overflowX="auto"
        px="10"
        py="5"
        rounded="md"
        transform="translateX(-0.2em) translateY(-0.2em)"
        w="full"
      >
        {storesInfo.map((store) => (
          <VStack alignItems="start" gap="2" key={store.name} minW="7rem">
            <p.p>
              {store.name}
            </p.p>
            <p.img
              h="16"
              mx="auto"
              src={store.imgUrl}
              w="auto"
            >
            </p.img>
            <Button
              disabled={
                boughtList.includes(store.name) || $sharedData.get().budget < store.price
              }
              onClick={() => {
                $boughtList.set([...$boughtList.get(), store.name]);
                $sharedData.set({
                  ...$sharedData.get(),
                  budget: $sharedData.get().budget - store.price,
                });
                toaster.create({
                  id: "bought-item",
                  title: "商品を購入しました",
                  description: `「${store.name}」を購入しました`,
                  type: "success",
                });
              }}
              variant="filled"
              w="full"
            >
              ¥
              {store.price}
            </Button>
          </VStack>
        ),
        )}
      </HStack>
    </VStack>
  );
}

export default function (): ReactElement {
  const $sharedBudget = computed($sharedData, ({ budget }) => budget);
  const sharedBudget = useStore($sharedBudget);
  const canContinue = useStore($canContinue);

  return (
    <Expanded>
      {
        !canContinue
        && (
          <Expanded h="full" items="center" position="fixed" w="full" zIndex="100">
            <ResultCard />
          </Expanded>
        )
      }
      <Flex
        alignItems="center"
        flexDir={{
          base: "column",
          lg: "row",
        }}
        h="full"
        overflow="hidden"
        style={{
          opacity: canContinue ? 1 : 0,
        }}
        transition="opacity 0.3s ease-in-out"
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
            <Button
              disabled={sharedBudget === 1000}
              onClick={() => {
                toaster.create({
                  id: "reset-budget",
                  title: "予算をリセット",
                  description: "すべてのゲームが遊べるようになりました",
                  type: "info",
                });
                $sharedData.set({
                  ...$sharedData.get(),
                  budget: 1000,
                });
              }}
              variant="filled"
            >
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
        <VStack
          bg="bg"
          fadeIn="0"
          flex="1"
          h="calc(100% - 2.5em * 2)"
          justifyContent="space-between"
          my="10"
          p="10"
          roundedBottomLeft="3xl"
          roundedTopLeft="3xl"
          slideInX="4"
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
          <VStack alignItems="start" w="full">
            <Divider color="bg-variant" />
            <VStack alignItems="start" w="full">
              <RestBudget />
              <Stores />
            </VStack>
          </VStack>
        </VStack>
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
