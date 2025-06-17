import { createToaster } from "@ark-ui/react";

export const toaster = createToaster({
  placement: "bottom-end",
  overlap: true,
  gap: 24,
  max: 3,
});
