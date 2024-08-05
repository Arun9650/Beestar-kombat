/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                hostname: 'example.com',

            },
            {
                hostname: 'raw.githubusercontent.com',
            }
        ]
    }
};

export default nextConfig;
