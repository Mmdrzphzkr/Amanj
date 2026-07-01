// next.config.mjs
/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'standalone',
    images: {
        domains: ['api.amanjcoffee.com'],
         remotePatterns: [
            {
                protocol: 'https',
                hostname: 'api.amanjcoffee.com',
                port: '',
                pathname: '/uploads/**',
            },
            // اگه لوکال هم داری
            {
                protocol: 'http',
                hostname: 'localhost',
                port: '1337',
                pathname: '/uploads/**',
            },
        ],
    },
    async rewrites() {
        return [
            {
                source: '/api/:path*',
                destination: 'https://api.amanjcoffee.com/api/:path*',
            },
        ];
    },
};

export default nextConfig; // <-- استفاده از export default به جای module.exports