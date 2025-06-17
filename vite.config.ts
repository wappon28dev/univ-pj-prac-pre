import pandacss from "@pandacss/dev/postcss";
import { reactRouter } from "@react-router/dev/vite";
import autoprefixer from "autoprefixer";
import Icons from "unplugin-icons/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  css: {
    postcss: {
      plugins: [
        pandacss,
        autoprefixer,
      ],
    },
  },
  plugins: [
    reactRouter(),
    tsconfigPaths(),
    Icons({ autoInstall: true, compiler: "jsx", jsx: "react" }),
  ],
  server: {
    cors: true,
  },
});
