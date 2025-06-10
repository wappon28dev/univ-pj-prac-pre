import type { Booth } from "@/lib/booth";
import type { ReactElement } from "react";
import { Icon } from "@iconify/react";
import { css } from "panda/css";
import { HStack, styled as p, VStack } from "panda/jsx";
import { Link } from "react-router";
import PlaySymbols from "virtual:icons/material-symbols/play-shapes";
import { Button } from "./recipes/atomic/Button";

export function BoothCard({ booth }: { booth: Booth }): ReactElement {
  return (
    <VStack bg="bg-variant" p="5" rounded="xl">
      <HStack justifyContent="space-between" w="full">
        <HStack fontSize="xl">
          <Icon icon={booth.icon} />
          <p.p>{booth.name}</p.p>
        </HStack>
        <p.div>
          ねだん
        </p.div>
      </HStack>
      <p.div bg="red" h="125px" w="full" />
      <Link className={css({ w: "full" })} to={`/booths/${booth.id}`} viewTransition>
        <Button rounded="0" roundedBottom="lg" variant="filled" w="full">
          <HStack justifyContent="center">
            <p.p>遊ぶ</p.p>
            <PlaySymbols />
          </HStack>
        </Button>
      </Link>
    </VStack>
  );
}
