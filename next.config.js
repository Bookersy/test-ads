/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**' },
      { protocol: 'http', hostname: '**' },
    ],
  },
  serverExternalPackages: ["@prisma/client", ".prisma/client"],
};

// Cloudflare OpenNext - enables bindings (D1, etc.) during local dev
try {
  const { initOpenNextCloudflareForDev } = require("@opennextjs/cloudflare");
  initOpenNextCloudflareForDev();
} catch (_) {
  // @opennextjs/cloudflare not installed (e.g. before npm install)
}

module.exports = nextConfig;
