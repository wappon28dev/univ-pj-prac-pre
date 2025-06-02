import type { Config } from "@react-router/dev/config";
import { booths } from "./src/lib/booth";

export default {
  ssr: false,
  appDirectory: "src",

  async prerender() {
    return booths.map(({ id }) => `/booths/${id}`);
  },
} satisfies Config;
