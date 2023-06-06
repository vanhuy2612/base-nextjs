/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    experimental: {
        appDir: true,
    },
    useFileSystemPublicRoutes: false,
}

module.exports = nextConfig
