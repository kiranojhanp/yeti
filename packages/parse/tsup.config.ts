import { defineConfig } from "tsup";
import tsconfig from "./tsconfig.json";

export default defineConfig((options) => ({
  entry: ["src/index.ts"],
  dts: true,
  outDir: "dist",
  format: ["esm", "cjs"],
  name: "@yeti/parse",
  outExtension({ format }) {
    return {
      js: format === "esm" ? ".mjs" : ".cjs",
    };
  },
  noExternal: ["chevrotain"],
  sourcemap: false,
  clean: true,
  target: tsconfig.compilerOptions.target as "ES2016",
  minify: !options.watch,
}));
