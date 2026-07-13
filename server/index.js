export default {
  async fetch(request, env) {
    if (env.ASSETS?.fetch) {
      const assetUrl = new URL(request.url);
      if (assetUrl.pathname === '/') {
        assetUrl.pathname = '/index.html';
      }
      return env.ASSETS.fetch(new Request(assetUrl, request));
    }

    return new Response('Static assets are unavailable.', { status: 500 });
  },
};
