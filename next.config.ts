import type { NextConfig } from "next";
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  trailingSlash: false,
};

export default nextConfig;

initOpenNextCloudflareForDev();
