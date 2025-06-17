import type { Booth } from "@/lib/booth";
import type { ReactElement } from "react";
import { $sharedData } from "@/lib/utils/shared-data";
import { Icon } from "@iconify/react";
import { useStore } from "@nanostores/react";
import { css } from "panda/css";
import { HStack, styled as p, VStack } from "panda/jsx";
import { Link } from "react-router";
import PlaySymbols from "virtual:icons/material-symbols/play-shapes";
import { Button } from "./recipes/atomic/Button";

export function BoothCard({ booth }: { booth: Booth }): ReactElement {
  const sharedData = useStore($sharedData);

  return (
    <VStack bg="bg-variant" p="5" rounded="xl">
      <HStack justifyContent="space-between" w="full">
        <HStack fontSize="xl">
          <Icon icon={booth.icon} />
          <p.p>{booth.name}</p.p>
        </HStack>
        <p.div>
          ¥200
        </p.div>
      </HStack>
      <p.div w="full">
        <p.img
          alt={booth.name}
          aspectRatio="16/9"
          objectFit="cover"
          src={booth.image}
          w="full"
        >
        </p.img>
      </p.div>
      <Link className={css({ w: "full" })} to={`/booths/${booth.id}`} viewTransition>
        <Button
          disabled={sharedData.budget < 200}
          rounded="0"
          roundedBottom="lg"
          title={sharedData.budget < 200 ? "予算が足りません" : undefined}
          variant="filled"
          w="full"
        >
          <HStack justifyContent="center">
            <p.p>遊ぶ</p.p>
            <PlaySymbols />
          </HStack>
        </Button>
      </Link>
    </VStack>
  );
}
