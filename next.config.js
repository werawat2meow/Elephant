/** @type {import('next').NextConfig} */
module.exports = {
  images: { formats: ['image/avif', 'image/webp'] },
  experimental: {
    optimizeCss: false,            // ปิด lightningcss (กัน error binary)
  },
  eslint: {
    ignoreDuringBuilds: true,      // ข้าม ESLint ตอน build บน Vercel
  },
};
