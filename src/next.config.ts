import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  sassOptions: {
    loadPaths: [path.join(process.cwd(), "node_modules")],
    silenceDeprecations: ["color-functions", "global-builtin", "import", "legacy-js-api"],
  },
};

export default nextConfig;
