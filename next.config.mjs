/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                hostname: '**',

            },
            {
                hostname: 'raw.githubusercontent.com',
            }
        ]
    }
};

export default nextConfig;
