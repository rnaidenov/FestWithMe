importScripts('workbox-sw.prod.v2.1.3.js');

/**
 * DO NOT EDIT THE FILE MANIFEST ENTRY
 *
 * The method precache() does the following:
 * 1. Cache URLs in the manifest to a local cache.
 * 2. When a network request is made for any of these URLs the response
 *    will ALWAYS comes from the cache, NEVER the network.
 * 3. When the service worker changes ONLY assets with a revision change are
 *    updated, old cache entries are left as is.
 *
 * By changing the file manifest manually, your users may end up not receiving
 * new versions of files because the revision hasn't changed.
 *
 * Please use workbox-build or some other tool / approach to generate the file
 * manifest which accounts for changes to local files and update the revision
 * accordingly.
 */
const fileManifest = [
  {
    "url": "/bundle.js",
    "revision": "a2b14e860425d31d9536fef9abf0615c"
  },
  {
    "url": "bundle.js.gz",
    "revision": "04daafe1676dbb28151a80f0454e4476"
  },
  {
    "url": "index.dev.html",
    "revision": "6268e600f843b566169f30d13cdea7cf"
  },
  {
    "url": "index.html",
    "revision": "3a40280d0a31e954b2f919dcecd63bd6"
  },
  {
    "url": "manifest.json",
    "revision": "123f229254716bd501bb7009f50729f5"
  },
  {
    "url": "public/airplane.svg",
    "revision": "49decab0620ea08502070fc70789fde6"
  },
  {
    "url": "public/cross.svg",
    "revision": "8550712c703906e76e7286e8f54b29f9"
  },
  {
    "url": "public/entireHome.svg",
    "revision": "6f2a6f9fe16279a5cbc864fd58497fdf"
  },
  {
    "url": "public/european-union.svg",
    "revision": "730331a68d658e0b062c63ffbb49d92f"
  },
  {
    "url": "public/inactiveTicket.svg",
    "revision": "91ea97f5e2b6365cfa8c787194051c4e"
  },
  {
    "url": "public/info.svg",
    "revision": "a0fb31efd4b2c794adc655bcc959b427"
  },
  {
    "url": "public/manifest/android-chrome-192x192.png",
    "revision": "38fb72de7d5177bd89aa73b9bf0dae80"
  },
  {
    "url": "public/manifest/apple-touch-icon.png",
    "revision": "2dd6133809cefc8c33a43572527eb371"
  },
  {
    "url": "public/manifest/browserconfig.xml",
    "revision": "389eabe3c9a90736f426109c84458455"
  },
  {
    "url": "public/manifest/favicon-16x16.png",
    "revision": "ae8564a0fc709d02ce4d9391866a5f70"
  },
  {
    "url": "public/manifest/favicon-32x32.png",
    "revision": "6509488c2491fe19fcdf3e7e10f8f3a4"
  },
  {
    "url": "public/manifest/favicon.ico",
    "revision": "5c4326bfdca3834cc82376cc8e93cf1f"
  },
  {
    "url": "public/manifest/mstile-150x150.png",
    "revision": "8fdb445f5d6ec4a57c6b0d813f7f887f"
  },
  {
    "url": "public/manifest/safari-pinned-tab.svg",
    "revision": "3df5bab3a38c28178673a96eb504819c"
  },
  {
    "url": "public/manifest/splashscreen-512x512.png",
    "revision": "2e730ae8d2296de2e15337974a236adc"
  },
  {
    "url": "public/privateRoom.svg",
    "revision": "6f1b2da41129dd469b6e10ab329fc5b0"
  },
  {
    "url": "public/sad.svg",
    "revision": "cbc105d34d1c02a54bd537ed81785052"
  },
  {
    "url": "public/sharedRoom.svg",
    "revision": "01eda498d3d9c25caa51bdb7106ae82a"
  },
  {
    "url": "public/success.svg",
    "revision": "37c6455fd06185db8ea46a4289c6ca91"
  },
  {
    "url": "public/ticket.svg",
    "revision": "06ccabb244c91e1216c16f48d3ddf869"
  },
  {
    "url": "public/united-kingdom.svg",
    "revision": "0c8987c58a3de9565d6a98823b442cc9"
  },
  {
    "url": "public/united-states.svg",
    "revision": "b19143707825c64ab7164dc1296b6c07"
  },
  {
    "url": "service-worker-registration.js",
    "revision": "0eb47e4212d5681eb1b84cadda58c59f"
  },
  {
    "url": "styles/currencyConverter.css",
    "revision": "6d92a6d21b555d5454be316b97901ca4"
  },
  {
    "url": "styles/results.css",
    "revision": "b156e6686416ca1cabf30c0ffa52cf0f"
  },
  {
    "url": "styles/search.css",
    "revision": "03c6ff78da95a48b052bc54410bf3cc6"
  }
];

const workboxSW = new self.WorkboxSW({
  "skipWaiting": true,
  "clientsClaim": true
});
workboxSW.precache(fileManifest);
workboxSW.router.registerRoute(/.*.(webp|js|woff2).*/, workboxSW.strategies.networkFirst({}), 'GET');
workboxSW.router.registerRoute(/.*fonts.*/, workboxSW.strategies.networkFirst({}), 'GET');
workboxSW.router.registerRoute(/.*cloudinary.*/, workboxSW.strategies.networkFirst({}), 'GET');
