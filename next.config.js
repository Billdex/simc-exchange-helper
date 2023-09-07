/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'export',
    // basePath: '/simc-exchange-helper',
    images: {
        loader: 'custom',
        domains: [
            'd1fxy698ilbz6u.cloudfront.net'
        ]
    }
}

module.exports = nextConfig
