/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // ปิด lightningcss
    optimizeCss: false,
  },
  eslint: {
    // ให้ข้าม ESLint ตอน build (กัน deploy ล้ม)
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
