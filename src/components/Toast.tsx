import type { ReactElement } from "react";
import { toaster } from "@/lib/utils/toaster";
import { Toast, Toaster } from "@ark-ui/react";
import { useStore } from "@nanostores/react";
import { atom } from "nanostores";
import { HStack, styled as p, VStack } from "panda/jsx";
import Close from "~icons/material-symbols/close";
import MoneyBag from "~icons/material-symbols/money-bag";
import { svaToast } from "./recipes/slot/toast";

export const $toastIdToExclude = atom<string | undefined>(undefined);

export function StyledToast(): ReactElement {
  const toastIdToExclude = useStore($toastIdToExclude);
  const cls = svaToast();

  return (
    <Toaster toaster={toaster}>
      {(toast) => {
        if (toast.id == null || toastIdToExclude === toast.id) {
          return null;
        }

        return (
          <Toast.Root
            className={cls.root}
            key={toast.id}
          >
            <VStack alignItems="start">
              <HStack justifyContent="space-between" w="100%">
                <Toast.Title className={cls.title}>
                  <HStack gap="1">
                    <MoneyBag />
                    <p.p>{toast.title}</p.p>
                  </HStack>
                </Toast.Title>
                <Toast.CloseTrigger className={cls.closeTrigger}>
                  <Close />
                </Toast.CloseTrigger>
              </HStack>
              <Toast.Description className={cls.description}>
                {toast.description}
              </Toast.Description>
            </VStack>
          </Toast.Root>
        );
      }}
    </Toaster>
  );
}
