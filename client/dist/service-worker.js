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
    "url": "/bundle.js.gz",
    "revision": "f4934a034c3accc124b6f41576fafab7"
  },
  {
    "url": "index.html",
    "revision": "10753adb18308c0e6f7d71c8dfe823f6"
  },
  {
    "url": "manifest.json",
    "revision": "d4b8b4208853a1cda654c39ea0021ac3"
  },
  {
    "url": "public/airplane.svg",
    "revision": "ad354d7e014e4ba557e5f8af6e658c3f"
  },
  {
    "url": "public/cross.svg",
    "revision": "6524033ebdce1bb335673a37b7f209d8"
  },
  {
    "url": "public/entireHome.svg",
    "revision": "9fc9c6386e9c553281167b484ff8f8c4"
  },
  {
    "url": "public/european-union.svg",
    "revision": "5a49424c31d979183f2b001ff6112731"
  },
  {
    "url": "public/inactiveTicket.svg",
    "revision": "f091ad4383fb6f516fef2e0c8071e1e2"
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
    "url": "public/party_background_mobile.jpg",
    "revision": "d6e8ed3d6aaab93b6e45dee942544ada"
  },
  {
    "url": "public/party_background_tablet.jpg",
    "revision": "d5194ca08091c3d01aadc8cef2b8aad8"
  },
  {
    "url": "public/party_background.jpg",
    "revision": "c762917fac4c8b22298ea1c373aa97c4"
  },
  {
    "url": "public/privateRoom.svg",
    "revision": "2c7a509ec38bd9d392664726eb1c9da7"
  },
  {
    "url": "public/sad.svg",
    "revision": "c35d372fc6c33e1ca5197d6db55d8db6"
  },
  {
    "url": "public/sharedRoom.svg",
    "revision": "c00da922a677cac31d60adecc690f776"
  },
  {
    "url": "public/success.svg",
    "revision": "d29f1779664178a55ed87236fd97c302"
  },
  {
    "url": "public/ticket.svg",
    "revision": "3deb14d6e5cd26b2ab6489f37d94b86c"
  },
  {
    "url": "public/united-kingdom.svg",
    "revision": "dbb2d233dc0dcb8f8dc8b2ac996f282d"
  },
  {
    "url": "public/united-states.svg",
    "revision": "4a90ee18671e922d4eb77cd821ed821b"
  },
  {
    "url": "styles/currencyConverter.css",
    "revision": "9c9f4dc312f6073a462f7771c762d9bc"
  },
  {
    "url": "styles/results.css",
    "revision": "afdfbbdca98ccf6f95d9ab1f5bc9d117"
  },
  {
    "url": "styles/search.css",
    "revision": "01a2439f15a1368c816a809918d7725a"
  }
];

const workboxSW = new self.WorkboxSW({
  "skipWaiting": true,
  "clientsClaim": true
});
workboxSW.precache(fileManifest);
workboxSW.router.registerRoute(/\/.*\/(bundle.js)\//, workboxSW.strategies.networkFirst({}), 'GET');
