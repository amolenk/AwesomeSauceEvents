import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  sassOptions: {
    silenceDeprecations: ["color-functions", "global-builtin", "import", "legacy-js-api"],
  },
};

export default nextConfig;
