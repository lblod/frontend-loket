import config from 'frontend-loket/config/environment';

export function remapWebsiteUrl(website) {
  if (!shouldRemapUrls()) {
    return;
  }
  try {
    const urlMap = csvUrlMapToObject(config.urlMap);
    website.url = remapUrl(website.url, urlMap);
  } catch {
    console.warn(
      'The URL map doesn\'t seem valid, be sure it\'s csv in the "url,mapped-url,url,mapped-url" format',
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
      let newUrl = url.replace(mapUrl, remappedUrl);

      if (newUrl === '') {
        // We fall back to '/' if the resulting url is empty to support our local development setup without having to hardcode the port
        newUrl = '/';
      }

      console.info(`Mapping "${url}" to "${newUrl}"`);

      return newUrl;
    }
  }

  return url;
}

// This util assumes csvUrlMap is a , separated string without newlines
export function csvUrlMapToObject(csvUrlMap) {
  const urls = csvUrlMap.split(',');

  if (urls.length % 2 !== 0) {
    throw new Error('invalid csv mapping');
  }

  const urlMappings = {};

  // Loop through the array, stepping by 2:
  // [source1, target1, source2, target2, ...]
  for (let i = 0; i < urls.length; i += 2) {
    const source = urls[i].trim();
    const target = urls[i + 1].trim();
    urlMappings[source] = target;
  }

  return urlMappings;
}
