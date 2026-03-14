/** @type {import('next').NextConfig} */
const nextConfig = {
  // Ensure server-side execution for OpenAI
  experimental: {
    serverComponentsExternalPackages: ["openai"],
  },

  // Webpack configuration for proper server/client separation
  webpack: (config, { isServer, dev }) => {
    // Server-side configuration
    if (isServer) {
      // Allow OpenAI on server side
      config.externals = config.externals || []
      // Don't externalize openai for server bundle
    } else {
      // Client-side configuration - completely exclude server packages
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        crypto: false,
        stream: false,
        url: false,
        zlib: false,
        http: false,
        https: false,
        assert: false,
        os: false,
        path: false,
        child_process: false,
        worker_threads: false,
      }

      // Completely exclude OpenAI from client bundle
      config.externals = config.externals || []
      config.externals.push({
        openai: "commonjs openai",
      })
    }

    // Additional configuration for development
    if (dev) {
      config.watchOptions = {
        ...config.watchOptions,
        ignored: ["**/node_modules/**", "**/.next/**"],
      }
    }

    return config
  },

  // Security headers for API routes
  async headers() {
    return [
      {
        source: "/api/:path*",
        headers: [
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
          {
            key: "Cache-Control",
            value: "no-store, no-cache, must-revalidate",
          },
        ],
      },
    ]
  },

  // Environment variables configuration
  env: {
    // Explicitly mark as server-side only
    CUSTOM_KEY: "server-only",
  },

  eslint: {
    ignoreDuringBuilds: true,
  },

  typescript: {
    ignoreBuildErrors: true,
  },

  images: {
    unoptimized: true,
  },
}

module.exports = nextConfig
