// บังคับปิด lightningcss ทั้งด้วย env และ config (กันเหนียว)
process.env.NEXT_DISABLE_LIGHTNINGCSS = '1';

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    optimizeCss: false, // <= ปิด lightningcss
  },
};

module.exports = nextConfig;
