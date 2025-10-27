import config from 'frontend-loket/config/environment';

export function remapWebsiteUrl(website) {
  if (!shouldRemapUrls()) {
    return;
  }
  try {
    const urlMap = JSON.parse(config.urlMap);
    website.url = remapUrl(website.url, urlMap);
  } catch {
    console.warn(
      "Parsing config.urlMap as JSON failed, double check that it's valid",
    );
  }
}

function shouldRemapUrls() {
  return typeof config.urlMap === 'string' && !config.urlMap.startsWith('{{');
}

export function remapUrl(url, urlMap) {
  for (const [mapUrl, remappedUrl] of Object.entries(urlMap)) {
    // We do a simple startsWith check and assume the protocol is part of the mapping config.
    if (url.startsWith(mapUrl)) {
      const newUrl = url.replace(mapUrl, remappedUrl);

      // We fall back to '/' if the resulting url is empty to support our local development setup without having to hardcode the port
      return newUrl !== '' ? newUrl : '/';
    }
  }

  return url;
}
