/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: "/guide",
        destination: "/offer1",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
