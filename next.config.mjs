/** @type {import('next').NextConfig} */
const nextConfig = {
  // Static export so the site can be served from GitHub Pages (inokilabs.github.io).
  output: "export",
  // Emit /section/index.html style routes for clean static hosting.
  trailingSlash: true,
  images: {
    // GitHub Pages has no image optimization server.
    unoptimized: true,
  },
  reactStrictMode: true,
};

export default nextConfig;
