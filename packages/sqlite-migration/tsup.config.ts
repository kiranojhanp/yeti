import { defineConfig } from "tsup";
import tsconfig from "./tsconfig.json";

export default defineConfig((options) => ({
  entry: ["src/index.ts"],
  dts: true,
  outDir: "dist",
  format: ["esm"],
  name: "@yeti/sqlite-migration",
  outExtension({ format }) {
    return {
      js: `.${format}.js`,
    };
  },
  sourcemap: false,
  clean: true,
  target: tsconfig.compilerOptions.target as "ES2016",
  minify: !options.watch,
}));
