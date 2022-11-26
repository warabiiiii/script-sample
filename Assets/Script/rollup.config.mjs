import typescript from "@rollup/plugin-typescript";

const itemNames = ["clock", "gun"];

/**
 * @type {import('rollup').RollupOptions}
 */
const config = itemNames.map((itemName) => ({
  input: `src/items/${itemName}/main.ts`,
  output: {
    format: "cjs",
    file: `dist/${itemName}.js`,
    //  file: `dist/${itemName}.js`,
  },
  plugins: [typescript()],
}));

export default config;
