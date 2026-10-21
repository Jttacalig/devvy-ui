/** Deploy this independent app under /ui; the Dev Station production app is untouched. */
export default {
  reactStrictMode: true,
  poweredByHeader: false,
  transpilePackages: ['@devvy-ui/react', '@devvy-ui/core'],
};
