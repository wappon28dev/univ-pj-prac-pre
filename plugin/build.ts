import { dts } from "bun-plugin-dtsx";

await Bun.build({
  entrypoints: ["./src/shared-data.ts"],
  outdir: "./out",
  target: "browser",
  minify: {
    whitespace: true,
    identifiers: true,
    syntax: true,
  },
  plugins: [
    dts({
      root: "./src",
      outdir: "./out",
      tsconfigPath: "./tsconfig.json",
    }),
  ],
});
