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
    async headers() {
        return [
            {
                source: '/(.*)',
                headers: [
                    {
                        key: 'X-DNS-Prefetch-Control',
                        value: 'on',
                    },
                    {
                        key: 'Strict-Transport-Security',
                        value: 'max-age=63072000; includeSubDomains; preload',
                    },
                    {
                        key: 'X-XSS-Protection',
                        value: '1; mode=block',
                    },
                    {
                        key: 'X-Frame-Options',
                        value: 'DENY',
                    },
                    {
                        key: 'X-Content-Type-Options',
                        value: 'nosniff',
                    },
                    {
                        key: 'Referrer-Policy',
                        value: 'strict-origin-when-cross-origin',
                    },
                    {
                        key: 'Permissions-Policy',
                        value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
                    },
                    {
                        key: 'Content-Security-Policy',
                        value: [
                            "default-src 'self'",
                            "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://trusted-cdn.com",
                            "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
                            "img-src 'self' data: https: http:",
                            "font-src 'self' https://fonts.gstatic.com",
                            "connect-src 'self' https://api.amanjcoffee.com http://localhost:1337",
                            "frame-ancestors 'none'",
                            "form-action 'self'",
                            "base-uri 'self'",
                        ].join('; '),
                    },
                ],
            },
        ];
    },
};

export default nextConfig; // <-- استفاده از export default به جای module.exports