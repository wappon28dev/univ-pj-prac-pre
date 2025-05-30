import type { ReactElement } from "react";
import type { Booth } from "@/lib/booth";
import { HStack, styled as p, VStack } from "panda/jsx";
import PlaySymbols from "~icons/material-symbols/play-shapes";
import { Button } from "./recipes/atomic/Button";

export function BoothCard({ booth }: { booth: Booth }): ReactElement {
  return (
    <VStack bg="bg-variant" p="5" rounded="xl">
      <HStack justifyContent="space-between" w="full">
        <HStack fontSize="xl">
          <booth.icon />
          <p.p>{booth.name}</p.p>
        </HStack>
        <p.div>
          ねだん
        </p.div>
      </HStack>
      <p.div bg="red" h="125px" w="full" />
      <Button rounded="0" roundedBottom="lg" variant="filled" w="full">
        <HStack justifyContent="center">
          <p.p>遊ぶ</p.p>
          <PlaySymbols />
        </HStack>
      </Button>
    </VStack>
  );
}
