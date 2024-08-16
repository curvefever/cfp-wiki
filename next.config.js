/** @type {import('next').NextConfig} */
const nextConfig = {
    transpilePackages: ['@mdxeditor/editor'],
    reactStrictMode: true,
    experimental: {
        instrumentationHook: true 
    },
    images: {
        remotePatterns: [
            {
                hostname: 'i.imgur.com',
                protocol: 'https'
            }
        ]
    },
    webpack: (config) => {
        config.experiments = { ...config.experiments, topLevelAwait: true }
        return config
    }
}

module.exports = nextConfig
