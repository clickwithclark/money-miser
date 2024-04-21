/* eslint-disable no-restricted-globals */
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('./sw.js')
      .then((registration) => console.log(`Service Worker Registered!...😁 \n ${registration.scope}`))
      .catch((error) => console.error(`service worker error:😭${error}`));
  });
}
const cacheName = 'v3';
const assetLog = {};
const failedAssets = {};


async function preCacheServiceWorker() {
  /* It will not cache and also not reject for individual resources that failed to be added in the cache. unlike fillServiceWorkerCache which stops caching as soon as one problem occurs. see http://stackoverflow.com/questions/41388616/what-can-cause-a-promise-rejected-with-invalidstateerror-here */
  const cache = await caches.open(cacheName);

  Promise.all(
    cacheAssets.map((url) =>
      cache.add(url).catch((reason) => {
        failedAssets[`Service Worker: Asset not stored in cache...😭:  ${url}`] = {
          Reason: ` ${String(reason)}`,
        };
        console.table(failedAssets);
      })
    )
  );
}

// Call Install Event
self.addEventListener('install', (event) => {
  console.log('Service Worker: Installed...⚡');
});

self.addEventListener('activate', (e) => {
  console.log('Service Worker: Activated');
  // Remove unwanted caches
  e.waitUntil(
    caches.keys().then((cacheNames) =>
      Promise.all(
        cacheNames.map((cache) => {
          if (cache !== cacheName) {
            console.log('Service Worker: Clearing Old Cache...🧹');
            return caches.delete(cache);
          }
        })
      )
    )
  );
});

self.addEventListener('fetch', (event) => {
  //ignore chrome extension requests
  if (!(event.request.url.indexOf('http') === 0)) return; 

  // keep track of assets
  assetLog[new URL(event.request.url).pathname] = { 'Service Worker': 'Fetching...🦅' };
  event.respondWith(
    (async () => {
      try {
        const cachedResponse = await caches.match(event.request);

       
        // if it does not exists try to get response from network
        const networkResponse = await fetch(event.request);
        // make clone of response
        const clonedResponse = networkResponse.clone();
        const cache = await caches.open(cacheName);
        // add response to cache incase missed by precache
        cache.put(event.request, clonedResponse);
        return networkResponse;
      } catch (error) {
        // load cached page in event of network failure
        const path = new URL(event.request.url).pathname;
        return caches.match(path).then((cachedResponse) => cachedResponse);
      }
    })()
  );
  setTimeout(() => {
    console.table(assetLog);
  }, 5000);
  
});
